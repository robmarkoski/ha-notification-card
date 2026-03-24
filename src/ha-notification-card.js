/**
 * ha-notification-card
 * Entity-driven notification center for Home Assistant dashboards.
 *
 * Features:
 *  - Entity-driven notifications with configurable triggers
 *  - Swipe/tap dismiss, long-press detail expand
 *  - Severity levels with HA theme colour mapping
 *  - Template messages with variable interpolation
 *  - Auto-expiry per notification or global
 *  - Persistent storage via localStorage
 *  - Collapsible with configurable visible count
 *  - Full visual card editor
 *  - Respects HA CSS theme variables
 *  - Notification grouping/stacking for repeated entity triggers
 *  - Mute/snooze per entity
 *  - Sound/vibration option on new notifications
 */

import { LitElement, html, css, nothing } from "lit";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CARD_VERSION = "1.1.0";
const STORAGE_KEY = "ha-notification-card";
const DEFAULT_VISIBLE = 4;
const DEFAULT_EXPIRY_MINUTES = 0; // 0 = no auto-expiry
const SWIPE_THRESHOLD = 80; // px
const LONG_PRESS_MS = 500;
const SEVERITY_ORDER = ["critical", "error", "warning", "info", "success"];

const TRIGGER_TYPES = [
  { value: "state", label: "Specific state" },
  { value: "on", label: "Turns on" },
  { value: "off", label: "Turns off" },
  { value: "any", label: "Any change" },
  { value: "above", label: "Above threshold" },
  { value: "below", label: "Below threshold" },
  { value: "unavailable", label: "Unavailable / Unknown" },
];

const SEVERITY_LEVELS = [
  { value: "info", label: "Info" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "error", label: "Error" },
  { value: "critical", label: "Critical" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function interpolate(template, vars) {
  if (!template) return "";
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined ? vars[k] : `{${k}}`
  );
}

function friendlyTimestamp(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function severityIcon(severity) {
  switch (severity) {
    case "critical":
      return "mdi:alert-octagon";
    case "error":
      return "mdi:alert-circle";
    case "warning":
      return "mdi:alert";
    case "success":
      return "mdi:check-circle";
    default:
      return "mdi:information";
  }
}

function severityCSSVar(severity) {
  switch (severity) {
    case "critical":
      return "var(--error-color, #db4437)";
    case "error":
      return "var(--error-color, #db4437)";
    case "warning":
      return "var(--warning-color, #ffa726)";
    case "success":
      return "var(--success-color, #43a047)";
    default:
      return "var(--info-color, #039be5)";
  }
}

/* ------------------------------------------------------------------ */
/*  Storage                                                            */
/* ------------------------------------------------------------------ */

class NotificationStore {
  constructor(cardId) {
    this._key = `${STORAGE_KEY}-${cardId}`;
  }

  load() {
    try {
      const raw = localStorage.getItem(this._key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  save(notifications) {
    try {
      localStorage.setItem(this._key, JSON.stringify(notifications));
    } catch {
      // quota exceeded — drop oldest
      const trimmed = notifications.slice(-50);
      localStorage.setItem(this._key, JSON.stringify(trimmed));
    }
  }

  loadDismissed() {
    try {
      const raw = localStorage.getItem(this._key + "-dismissed");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  saveDismissed(dismissed) {
    try {
      localStorage.setItem(this._key + "-dismissed", JSON.stringify(dismissed));
    } catch {}
  }

  loadMuted() {
    try {
      const raw = localStorage.getItem(this._key + "-muted");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  saveMuted(muted) {
    try {
      localStorage.setItem(this._key + "-muted", JSON.stringify(muted));
    } catch {}
  }
}

/* ------------------------------------------------------------------ */
/*  Main Card                                                          */
/* ------------------------------------------------------------------ */

class HaNotificationCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object, state: true },
      _notifications: { type: Array, state: true },
      _expanded: { type: Boolean, state: true },
      _expandedId: { type: String, state: true },
      _previousStates: { type: Object, state: true },
      _dismissed: { type: Object, state: true },
      _muted: { type: Object, state: true },
      _swipeState: { type: Object, state: true },
    };
  }

  constructor() {
    super();
    this._notifications = [];
    this._expanded = false;
    this._expandedId = null;
    this._previousStates = {};
    this._dismissed = {};
    this._muted = {};
    this._swipeState = {};
    this._store = null;
    this._expiryTimer = null;
    this._longPressTimer = null;
    this._initialized = false;
  }

  /* ----- Config ----- */

  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error("You need to define entities");
    }
    this._config = {
      title: config.title || "Notifications",
      card_id: config.card_id || "default",
      visible_count: config.visible_count ?? DEFAULT_VISIBLE,
      expiry_minutes: config.expiry_minutes ?? DEFAULT_EXPIRY_MINUTES,
      hide_when_empty: config.hide_when_empty ?? false,
      show_empty: config.show_empty ?? true,
      empty_text: config.empty_text || "No notifications",
      show_header: config.show_header ?? true,
      show_badge: config.show_badge ?? true,
      show_clear_all: config.show_clear_all ?? true,
      show_timestamp: config.show_timestamp ?? true,
      sort_by: config.sort_by || "newest", // newest | oldest | severity
      group_repeated: config.group_repeated ?? true,
      vibrate: config.vibrate ?? false,
      max_stored: config.max_stored ?? 100,
      entities: config.entities.map((e) => ({
        entity: e.entity,
        name: e.name || null,
        trigger: e.trigger || "any",
        state: e.state || null,
        threshold: e.threshold != null ? Number(e.threshold) : null,
        severity: e.severity || "info",
        message: e.message || null,
        icon: e.icon || null,
        expiry_minutes: e.expiry_minutes ?? null,
        enabled: e.enabled ?? true,
      })),
    };
    this._store = new NotificationStore(this._config.card_id);
    this._notifications = this._store.load();
    this._dismissed = this._store.loadDismissed();
    this._muted = this._store.loadMuted();
  }

  getCardSize() {
    const active = this._activeNotifications().length;
    const count = Math.min(
      active,
      this._config?.visible_count ?? DEFAULT_VISIBLE
    );
    return Math.max(1, count + 1);
  }

  static getConfigElement() {
    return document.createElement("notification-card-editor");
  }

  static getStubConfig() {
    return {
      title: "Notifications",
      visible_count: 4,
      expiry_minutes: 0,
      entities: [
        {
          entity: "",
          trigger: "any",
          severity: "info",
          message: "{name} changed to {state}",
        },
      ],
    };
  }

  /* ----- Lifecycle ----- */

  connectedCallback() {
    super.connectedCallback();
    this._startExpiryTimer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopExpiryTimer();
  }

  updated(changedProps) {
    if (changedProps.has("hass") && this.hass && this._config) {
      this._evaluateEntities();
    }
  }

  /* ----- Entity evaluation ----- */

  _evaluateEntities() {
    if (!this.hass || !this._config) return;
    const newNotifications = [];

    for (const entCfg of this._config.entities) {
      if (!entCfg.enabled) continue;
      if (this._muted[entCfg.entity]) {
        const muteUntil = this._muted[entCfg.entity];
        if (muteUntil > Date.now()) continue;
        delete this._muted[entCfg.entity];
        this._store.saveMuted(this._muted);
      }

      const stateObj = this.hass.states[entCfg.entity];
      if (!stateObj) continue;

      const currentState = stateObj.state;
      const prevState = this._previousStates[entCfg.entity];
      this._previousStates[entCfg.entity] = currentState;

      // Skip first evaluation (no previous state to compare)
      if (!this._initialized) continue;
      if (prevState === undefined) continue;
      if (prevState === currentState) continue;

      const triggered = this._checkTrigger(entCfg, currentState, prevState);
      if (!triggered) continue;

      const friendlyName =
        entCfg.name ||
        stateObj.attributes.friendly_name ||
        entCfg.entity;

      const message = entCfg.message
        ? interpolate(entCfg.message, {
            name: friendlyName,
            state: currentState,
            previous: prevState,
            entity: entCfg.entity,
          })
        : `${friendlyName}: ${currentState}`;

      const notification = {
        id: uid(),
        entity: entCfg.entity,
        severity: entCfg.severity,
        message,
        state: currentState,
        previous: prevState,
        timestamp: Date.now(),
        icon: entCfg.icon || stateObj.attributes.icon || null,
        expiry_minutes:
          entCfg.expiry_minutes ?? this._config.expiry_minutes,
        count: 1,
      };

      newNotifications.push(notification);
    }

    if (!this._initialized) {
      this._initialized = true;
      this._checkInitialStates();
      return;
    }

    if (newNotifications.length > 0) {
      let merged = [...this._notifications];
      for (const n of newNotifications) {
        if (this._config.group_repeated) {
          const existing = merged.find(
            (m) =>
              m.entity === n.entity &&
              m.severity === n.severity &&
              !this._dismissed[m.id]
          );
          if (existing) {
            existing.message = n.message;
            existing.state = n.state;
            existing.previous = n.previous;
            existing.timestamp = n.timestamp;
            existing.count = (existing.count || 1) + 1;
            continue;
          }
        }
        merged.push(n);
      }
      // Trim to max
      if (merged.length > this._config.max_stored) {
        merged = merged.slice(-this._config.max_stored);
      }
      this._notifications = merged;
      this._store.save(this._notifications);

      if (this._config.vibrate && navigator.vibrate) {
        navigator.vibrate(100);
      }

      this.requestUpdate();
    }
  }

  _checkInitialStates() {
    if (!this.hass || !this._config) return;
    const newNotifications = [];

    for (const entCfg of this._config.entities) {
      if (!entCfg.enabled) continue;

      const stateObj = this.hass.states[entCfg.entity];
      if (!stateObj) continue;

      const currentState = stateObj.state;
      let triggered = false;

      switch (entCfg.trigger) {
        case "on":
          triggered = currentState === "on";
          break;
        case "off":
          triggered = currentState === "off";
          break;
        case "state":
          triggered = currentState === entCfg.state;
          break;
        case "above":
          triggered =
            entCfg.threshold != null &&
            !isNaN(Number(currentState)) &&
            Number(currentState) > entCfg.threshold;
          break;
        case "below":
          triggered =
            entCfg.threshold != null &&
            !isNaN(Number(currentState)) &&
            Number(currentState) < entCfg.threshold;
          break;
        case "unavailable":
          triggered =
            currentState === "unavailable" || currentState === "unknown";
          break;
        default:
          triggered = false;
      }

      if (!triggered) continue;

      const friendlyName =
        entCfg.name ||
        stateObj.attributes.friendly_name ||
        entCfg.entity;

      const message = entCfg.message
        ? interpolate(entCfg.message, {
            name: friendlyName,
            state: currentState,
            previous: "unknown",
            entity: entCfg.entity,
          })
        : `${friendlyName}: ${currentState}`;

      const notification = {
        id: uid(),
        entity: entCfg.entity,
        severity: entCfg.severity,
        message,
        state: currentState,
        previous: "unknown",
        timestamp: Date.now(),
        icon: entCfg.icon || stateObj.attributes.icon || null,
        expiry_minutes:
          entCfg.expiry_minutes ?? this._config.expiry_minutes,
        count: 1,
      };

      // Skip if already grouped
      if (this._config.group_repeated) {
        const existing = this._notifications.find(
          (m) =>
            m.entity === notification.entity &&
            m.severity === notification.severity &&
            !this._dismissed[m.id]
        );
        if (existing) continue;
      }

      // Skip if entity already has an active notification
      const activeForEntity = this._notifications.find(
        (n) => n.entity === notification.entity && !this._dismissed[n.id]
      );
      if (activeForEntity) continue;

      newNotifications.push(notification);
    }

    if (newNotifications.length > 0) {
      this._notifications = [...this._notifications, ...newNotifications];
      this._store.save(this._notifications);
      this.requestUpdate();
    }
  }

  _checkTrigger(cfg, current, prev) {
    switch (cfg.trigger) {
      case "any":
        return true;
      case "state":
        return current === cfg.state && prev !== cfg.state;
      case "on":
        return current === "on" && prev !== "on";
      case "off":
        return current === "off" && prev !== "off";
      case "unavailable":
        return (
          (current === "unavailable" || current === "unknown") &&
          prev !== "unavailable" &&
          prev !== "unknown"
        );
      case "above":
        return (
          cfg.threshold != null &&
          !isNaN(Number(current)) &&
          Number(current) > cfg.threshold &&
          (isNaN(Number(prev)) || Number(prev) <= cfg.threshold)
        );
      case "below":
        return (
          cfg.threshold != null &&
          !isNaN(Number(current)) &&
          Number(current) < cfg.threshold &&
          (isNaN(Number(prev)) || Number(prev) >= cfg.threshold)
        );
      default:
        return false;
    }
  }

  /* ----- Expiry ----- */

  _startExpiryTimer() {
    this._expiryTimer = setInterval(() => this._purgeExpired(), 30000);
  }

  _stopExpiryTimer() {
    if (this._expiryTimer) clearInterval(this._expiryTimer);
  }

  _purgeExpired() {
    const now = Date.now();
    let changed = false;

    for (const n of this._notifications) {
      if (this._dismissed[n.id]) continue;
      const expiry = n.expiry_minutes || 0;
      if (expiry > 0 && now - n.timestamp > expiry * 60000) {
        this._dismissed[n.id] = true;
        changed = true;
      }
    }

    if (changed) {
      this._store.saveDismissed(this._dismissed);
      this.requestUpdate();
    }
  }

  /* ----- Active notifications ----- */

  _activeNotifications() {
    let active = this._notifications.filter((n) => !this._dismissed[n.id]);

    switch (this._config?.sort_by) {
      case "oldest":
        active.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case "severity":
        active.sort(
          (a, b) =>
            SEVERITY_ORDER.indexOf(a.severity) -
            SEVERITY_ORDER.indexOf(b.severity)
        );
        break;
      default:
        active.sort((a, b) => b.timestamp - a.timestamp);
    }
    return active;
  }

  /* ----- Actions ----- */

  _dismiss(id) {
    this._dismissed[id] = true;
    this._store.saveDismissed(this._dismissed);
    this.requestUpdate();
  }

  _dismissAll() {
    for (const n of this._notifications) {
      this._dismissed[n.id] = true;
    }
    this._store.saveDismissed(this._dismissed);
    this._expanded = false;
    this.requestUpdate();
  }

  _muteEntity(entity, minutes = 60) {
    this._muted[entity] = Date.now() + minutes * 60000;
    this._store.saveMuted(this._muted);
    this.requestUpdate();
  }

  _toggleExpand() {
    this._expanded = !this._expanded;
    this.requestUpdate();
  }

  _toggleDetail(id) {
    this._expandedId = this._expandedId === id ? null : id;
    this.requestUpdate();
  }

  /* ----- Swipe handling ----- */

  _onTouchStart(e, id) {
    const touch = e.touches[0];
    this._swipeState = {
      id,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: 0,
      swiping: false,
    };

    this._longPressTimer = setTimeout(() => {
      this._toggleDetail(id);
      this._swipeState = {};
    }, LONG_PRESS_MS);
  }

  _onTouchMove(e, id) {
    if (!this._swipeState.id || this._swipeState.id !== id) return;
    const touch = e.touches[0];
    const dx = touch.clientX - this._swipeState.startX;
    const dy = touch.clientY - this._swipeState.startY;

    if (Math.abs(dx) > 10) {
      clearTimeout(this._longPressTimer);
      this._swipeState.swiping = true;
    }

    if (this._swipeState.swiping) {
      e.preventDefault();
      this._swipeState.currentX = dx;
      const el = this.shadowRoot.querySelector(`[data-id="${id}"]`);
      if (el) {
        const opacity = Math.max(0, 1 - Math.abs(dx) / 200);
        el.style.transform = `translateX(${dx}px)`;
        el.style.opacity = opacity;
      }
    }
  }

  _onTouchEnd(e, id) {
    clearTimeout(this._longPressTimer);
    if (!this._swipeState.id || this._swipeState.id !== id) return;

    const el = this.shadowRoot.querySelector(`[data-id="${id}"]`);

    if (Math.abs(this._swipeState.currentX) > SWIPE_THRESHOLD) {
      if (el) {
        const dir = this._swipeState.currentX > 0 ? 1 : -1;
        el.style.transform = `translateX(${dir * 400}px)`;
        el.style.opacity = "0";
        el.style.transition = "transform 0.2s ease, opacity 0.2s ease";
        setTimeout(() => this._dismiss(id), 200);
      }
    } else {
      if (el) {
        el.style.transform = "";
        el.style.opacity = "";
        el.style.transition = "transform 0.2s ease, opacity 0.2s ease";
        setTimeout(() => {
          if (el) el.style.transition = "";
        }, 200);
      }
    }

    this._swipeState = {};
  }

  /* ----- Visibility ----- */

  _setHidden(hidden) {
    if (hidden) {
      this.hidden = true;
      this.style.setProperty("display", "none", "important");
      this.style.setProperty("margin", "0", "important");
      this.style.setProperty("padding", "0", "important");
      // Only hide the direct parent wrapper if it has no other visible card children
      const parent = this.parentElement;
      if (parent) {
        const siblings = [...parent.children].filter(
          (c) => c !== this && !c.hidden
        );
        if (siblings.length === 0) {
          parent.style.setProperty("display", "none", "important");
          parent.dataset.hiddenByNotifCard = "1";
        }
      }
    } else {
      this.hidden = false;
      this.style.removeProperty("display");
      this.style.removeProperty("margin");
      this.style.removeProperty("padding");
      const parent = this.parentElement;
      if (parent?.dataset.hiddenByNotifCard) {
        parent.style.removeProperty("display");
        delete parent.dataset.hiddenByNotifCard;
      }
    }
  }

  /* ----- Render ----- */

  render() {
    if (!this._config) return html``;

    const active = this._activeNotifications();

    // Hide entire card when no active notifications
    if (active.length === 0 && this._config.hide_when_empty) {
      this._setHidden(true);
      return html``;
    }
    this._setHidden(false);

    const visible = this._expanded
      ? active
      : active.slice(0, this._config.visible_count);
    const hasMore = active.length > this._config.visible_count;
    const remaining = active.length - this._config.visible_count;

    return html`
      <ha-card>
        ${this._config.show_header
          ? html`
              <div class="card-header">
                <div class="header-left">
                  <span class="title">${this._config.title}</span>
                  ${this._config.show_badge && active.length > 0
                    ? html`<span class="badge">${active.length}</span>`
                    : nothing}
                </div>
                <div class="header-right">
                  ${this._config.show_clear_all && active.length > 0
                    ? html`
                        <button
                          class="clear-all"
                          @click=${this._dismissAll}
                          title="Clear all"
                        >
                          Clear all
                        </button>
                      `
                    : nothing}
                </div>
              </div>
            `
          : nothing}

        <div class="card-content">
          ${active.length === 0 && this._config.show_empty
            ? html`
                <div class="empty">
                  <ha-icon icon="mdi:bell-check-outline"></ha-icon>
                  <span>${this._config.empty_text}</span>
                </div>
              `
            : nothing}
          ${visible.map((n) => this._renderNotification(n))}
          ${hasMore && !this._expanded
            ? html`
                <button class="show-more" @click=${this._toggleExpand}>
                  Show ${remaining} more
                </button>
              `
            : nothing}
          ${this._expanded && hasMore
            ? html`
                <button class="show-more" @click=${this._toggleExpand}>
                  Show less
                </button>
              `
            : nothing}
        </div>
      </ha-card>
    `;
  }

  _renderNotification(n) {
    const isExpanded = this._expandedId === n.id;
    const icon = n.icon || severityIcon(n.severity);
    const color = severityCSSVar(n.severity);
    const stateObj = this.hass?.states[n.entity];

    return html`
      <div
        class="notification severity-${n.severity}${isExpanded
          ? " expanded"
          : ""}"
        data-id="${n.id}"
        @touchstart=${(e) => this._onTouchStart(e, n.id)}
        @touchmove=${(e) => this._onTouchMove(e, n.id)}
        @touchend=${(e) => this._onTouchEnd(e, n.id)}
      >
        <div class="notif-main">
          <div class="notif-icon" style="color: ${color}">
            <ha-icon icon="${icon}"></ha-icon>
          </div>
          <div class="notif-body">
            <div class="notif-message">${n.message}</div>
            <div class="notif-meta">
              ${this._config.show_timestamp
                ? html`<span class="notif-time"
                    >${friendlyTimestamp(n.timestamp)}</span
                  >`
                : nothing}
              ${n.count > 1
                ? html`<span class="notif-count">×${n.count}</span>`
                : nothing}
            </div>
          </div>
          <button
            class="notif-dismiss"
            @click=${(e) => {
              e.stopPropagation();
              this._dismiss(n.id);
            }}
            title="Dismiss"
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>

        ${isExpanded
          ? html`
              <div class="notif-detail">
                <div class="detail-row">
                  <span class="detail-label">Entity</span>
                  <span class="detail-value">${n.entity}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">State</span>
                  <span class="detail-value">${n.state}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Previous</span>
                  <span class="detail-value">${n.previous}</span>
                </div>
                ${stateObj
                  ? html`
                      <div class="detail-row">
                        <span class="detail-label">Current live</span>
                        <span class="detail-value">${stateObj.state}</span>
                      </div>
                      ${Object.entries(stateObj.attributes)
                        .filter(
                          ([k]) =>
                            !["friendly_name", "icon", "entity_picture"].includes(k)
                        )
                        .slice(0, 8)
                        .map(
                          ([k, v]) => html`
                            <div class="detail-row">
                              <span class="detail-label">${k}</span>
                              <span class="detail-value"
                                >${typeof v === "object"
                                  ? JSON.stringify(v)
                                  : v}</span
                              >
                            </div>
                          `
                        )}
                    `
                  : nothing}
                <div class="detail-row">
                  <span class="detail-label">Triggered</span>
                  <span class="detail-value"
                    >${new Date(n.timestamp).toLocaleString()}</span
                  >
                </div>
                <div class="detail-actions">
                  <button
                    class="detail-btn"
                    @click=${() => this._muteEntity(n.entity, 60)}
                  >
                    Mute 1h
                  </button>
                  <button
                    class="detail-btn"
                    @click=${() => this._muteEntity(n.entity, 1440)}
                  >
                    Mute 24h
                  </button>
                </div>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  /* ----- Styles ----- */

  static get styles() {
    return css`
      :host {
        display: block;
      }

      ha-card {
        background: var(--ha-card-background, var(--card-background-color));
        border-radius: var(--ha-card-border-radius, 12px);
        overflow: hidden;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 16px 8px 16px;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .title {
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .badge {
        background: var(--primary-color, #03a9f4);
        color: #fff;
        font-size: 11px;
        font-weight: 600;
        min-width: 20px;
        height: 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 6px;
      }

      .header-right {
        display: flex;
        align-items: center;
      }

      .clear-all {
        background: none;
        border: none;
        color: var(--primary-color, #03a9f4);
        font-size: 13px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        transition: background 0.15s;
      }

      .clear-all:hover {
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
      }

      .card-content {
        padding: 0 16px 16px 16px;
      }

      .empty {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 24px 0;
        color: var(--secondary-text-color);
        font-size: 14px;
      }

      .empty ha-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }

      /* --- Notification row --- */

      .notification {
        position: relative;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        padding: 12px 0;
        touch-action: pan-y;
        user-select: none;
        will-change: transform, opacity;
      }

      .notification:last-child {
        border-bottom: none;
      }

      .notif-main {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .notif-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.05);
      }

      .notif-icon ha-icon {
        --mdc-icon-size: 20px;
      }

      /* Severity backgrounds */
      .severity-critical .notif-icon {
        background: rgba(var(--rgb-red, 219, 68, 55), 0.12);
      }
      .severity-error .notif-icon {
        background: rgba(var(--rgb-red, 219, 68, 55), 0.12);
      }
      .severity-warning .notif-icon {
        background: rgba(var(--rgb-orange, 255, 167, 38), 0.12);
      }
      .severity-success .notif-icon {
        background: rgba(var(--rgb-green, 67, 160, 71), 0.12);
      }
      .severity-info .notif-icon {
        background: rgba(var(--rgb-blue, 3, 155, 229), 0.12);
      }

      /* Critical pulsing border */
      .severity-critical {
        border-left: 3px solid var(--error-color, #db4437);
        padding-left: 8px;
        animation: pulse-critical 2s ease-in-out infinite;
      }

      @keyframes pulse-critical {
        0%,
        100% {
          border-left-color: var(--error-color, #db4437);
        }
        50% {
          border-left-color: transparent;
        }
      }

      .notif-body {
        flex: 1;
        min-width: 0;
      }

      .notif-message {
        font-size: 14px;
        color: var(--primary-text-color);
        line-height: 1.4;
        word-break: break-word;
      }

      .notif-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 2px;
      }

      .notif-time {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .notif-count {
        font-size: 11px;
        font-weight: 600;
        color: var(--secondary-text-color);
        background: rgba(0, 0, 0, 0.06);
        padding: 1px 6px;
        border-radius: 8px;
      }

      .notif-dismiss {
        flex-shrink: 0;
        background: none;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.15s, background 0.15s;
        --mdc-icon-size: 18px;
      }

      .notification:hover .notif-dismiss {
        opacity: 1;
      }

      /* Always visible on touch */
      @media (hover: none) {
        .notif-dismiss {
          opacity: 0.6;
        }
      }

      .notif-dismiss:hover {
        background: rgba(0, 0, 0, 0.08);
      }

      /* --- Detail expand --- */

      .notif-detail {
        margin-top: 8px;
        padding: 8px 0 0 48px;
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 3px 0;
        font-size: 12px;
      }

      .detail-label {
        color: var(--secondary-text-color);
        flex-shrink: 0;
        margin-right: 12px;
      }

      .detail-value {
        color: var(--primary-text-color);
        text-align: right;
        word-break: break-all;
      }

      .detail-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
        padding-bottom: 4px;
      }

      .detail-btn {
        background: none;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        color: var(--primary-text-color);
        font-size: 12px;
        padding: 4px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.15s;
      }

      .detail-btn:hover {
        background: rgba(0, 0, 0, 0.05);
      }

      /* --- Show more --- */

      .show-more {
        display: block;
        width: 100%;
        background: none;
        border: none;
        color: var(--primary-color, #03a9f4);
        font-size: 13px;
        padding: 10px 0 2px 0;
        cursor: pointer;
        text-align: center;
      }

      .show-more:hover {
        text-decoration: underline;
      }
    `;
  }
}

/* ------------------------------------------------------------------ */
/*  Visual Editor                                                      */
/* ------------------------------------------------------------------ */

class HaNotificationCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object, state: true },
    };
  }

  setConfig(config) {
    this._config = { ...config };
  }

  _dispatch() {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }

  _updateField(field, value) {
    this._config = { ...this._config, [field]: value };
    this._dispatch();
  }

  _updateEntity(index, field, value) {
    const entities = [...(this._config.entities || [])];
    entities[index] = { ...entities[index], [field]: value };
    this._config = { ...this._config, entities };
    this._dispatch();
  }

  _addEntity() {
    const entities = [
      ...(this._config.entities || []),
      {
        entity: "",
        trigger: "any",
        severity: "info",
        message: "{name} changed to {state}",
      },
    ];
    this._config = { ...this._config, entities };
    this._dispatch();
  }

  _removeEntity(index) {
    const entities = [...(this._config.entities || [])];
    entities.splice(index, 1);
    this._config = { ...this._config, entities };
    this._dispatch();
  }

  render() {
    if (!this._config) return html``;

    return html`
      <div class="editor">
        <div class="field">
          <label>Title</label>
          <input
            type="text"
            .value=${this._config.title || ""}
            @input=${(e) => this._updateField("title", e.target.value)}
          />
        </div>

        <div class="field">
          <label>Card ID (for storage isolation)</label>
          <input
            type="text"
            .value=${this._config.card_id || "default"}
            @input=${(e) => this._updateField("card_id", e.target.value)}
          />
        </div>

        <div class="row">
          <div class="field half">
            <label>Visible count</label>
            <input
              type="number"
              min="1"
              max="50"
              .value=${this._config.visible_count ?? 4}
              @input=${(e) =>
                this._updateField("visible_count", Number(e.target.value))}
            />
          </div>
          <div class="field half">
            <label>Auto-expiry (min, 0=off)</label>
            <input
              type="number"
              min="0"
              .value=${this._config.expiry_minutes ?? 0}
              @input=${(e) =>
                this._updateField("expiry_minutes", Number(e.target.value))}
            />
          </div>
        </div>

        <div class="row">
          <div class="field half">
            <label>Sort by</label>
            <select
              .value=${this._config.sort_by || "newest"}
              @change=${(e) => this._updateField("sort_by", e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="severity">Severity</option>
            </select>
          </div>
          <div class="field half">
            <label>Max stored</label>
            <input
              type="number"
              min="10"
              max="500"
              .value=${this._config.max_stored ?? 100}
              @input=${(e) =>
                this._updateField("max_stored", Number(e.target.value))}
            />
          </div>
        </div>

        <div class="toggles">
          ${[
            ["hide_when_empty", "Hide card when empty", false],
            ["show_header", "Show header", true],
            ["show_badge", "Show badge", true],
            ["show_clear_all", "Show clear all", true],
            ["show_timestamp", "Show timestamps", true],
            ["show_empty", "Show empty state", true],
            ["group_repeated", "Group repeated", true],
            ["vibrate", "Vibrate on new", false],
          ].map(
            ([field, label, defaultVal]) => html`
              <label class="toggle">
                <input
                  type="checkbox"
                  .checked=${this._config[field] ?? defaultVal}
                  @change=${(e) => this._updateField(field, e.target.checked)}
                />
                ${label}
              </label>
            `
          )}
        </div>

        <div class="section-title">Entities</div>

        ${(this._config.entities || []).map(
          (ent, i) => html`
            <div class="entity-card">
              <div class="entity-header">
                <span class="entity-num">#${i + 1}</span>
                <button
                  class="remove-btn"
                  @click=${() => this._removeEntity(i)}
                >
                  ✕
                </button>
              </div>

              <div class="field">
                <label>Entity</label>
                <input
                  type="text"
                  .value=${ent.entity || ""}
                  @input=${(e) =>
                    this._updateEntity(i, "entity", e.target.value)}
                  placeholder="sensor.temperature"
                />
              </div>

              <div class="row">
                <div class="field half">
                  <label>Trigger</label>
                  <select
                    .value=${ent.trigger || "any"}
                    @change=${(e) =>
                      this._updateEntity(i, "trigger", e.target.value)}
                  >
                    ${TRIGGER_TYPES.map(
                      (t) =>
                        html`<option value="${t.value}">${t.label}</option>`
                    )}
                  </select>
                </div>
                <div class="field half">
                  <label>Severity</label>
                  <select
                    .value=${ent.severity || "info"}
                    @change=${(e) =>
                      this._updateEntity(i, "severity", e.target.value)}
                  >
                    ${SEVERITY_LEVELS.map(
                      (s) =>
                        html`<option value="${s.value}">${s.label}</option>`
                    )}
                  </select>
                </div>
              </div>

              ${ent.trigger === "state"
                ? html`
                    <div class="field">
                      <label>Target state</label>
                      <input
                        type="text"
                        .value=${ent.state || ""}
                        @input=${(e) =>
                          this._updateEntity(i, "state", e.target.value)}
                      />
                    </div>
                  `
                : nothing}
              ${ent.trigger === "above" || ent.trigger === "below"
                ? html`
                    <div class="field">
                      <label>Threshold</label>
                      <input
                        type="number"
                        .value=${ent.threshold ?? ""}
                        @input=${(e) =>
                          this._updateEntity(
                            i,
                            "threshold",
                            e.target.value ? Number(e.target.value) : null
                          )}
                      />
                    </div>
                  `
                : nothing}

              <div class="field">
                <label
                  >Message template
                  <small>({name} {state} {previous} {entity})</small></label
                >
                <input
                  type="text"
                  .value=${ent.message || ""}
                  @input=${(e) =>
                    this._updateEntity(i, "message", e.target.value)}
                  placeholder="{name} changed to {state}"
                />
              </div>

              <div class="row">
                <div class="field half">
                  <label>Icon (optional)</label>
                  <input
                    type="text"
                    .value=${ent.icon || ""}
                    @input=${(e) =>
                      this._updateEntity(i, "icon", e.target.value)}
                    placeholder="mdi:thermometer"
                  />
                </div>
                <div class="field half">
                  <label>Expiry min (0=global)</label>
                  <input
                    type="number"
                    min="0"
                    .value=${ent.expiry_minutes ?? ""}
                    @input=${(e) =>
                      this._updateEntity(
                        i,
                        "expiry_minutes",
                        e.target.value ? Number(e.target.value) : null
                      )}
                  />
                </div>
              </div>

              <div class="field">
                <label>Custom name (optional)</label>
                <input
                  type="text"
                  .value=${ent.name || ""}
                  @input=${(e) =>
                    this._updateEntity(i, "name", e.target.value)}
                  placeholder="Override friendly name"
                />
              </div>
            </div>
          `
        )}

        <button class="add-btn" @click=${this._addEntity}>
          + Add entity
        </button>
      </div>
    `;
  }

  static get styles() {
    return css`
      .editor {
        padding: 16px;
      }

      .field {
        margin-bottom: 12px;
      }

      .field label {
        display: block;
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
      }

      .field label small {
        font-weight: 400;
        opacity: 0.7;
      }

      .field input,
      .field select {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--divider-color, #ccc);
        border-radius: 6px;
        font-size: 14px;
        background: var(--ha-card-background, #fff);
        color: var(--primary-text-color);
        box-sizing: border-box;
      }

      .row {
        display: flex;
        gap: 12px;
      }

      .half {
        flex: 1;
      }

      .toggles {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 16px;
      }

      .toggle {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: var(--primary-text-color);
        cursor: pointer;
      }

      .section-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin: 16px 0 12px 0;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--divider-color, #eee);
      }

      .entity-card {
        border: 1px solid var(--divider-color, #ddd);
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
        background: rgba(0, 0, 0, 0.02);
      }

      .entity-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .entity-num {
        font-size: 12px;
        font-weight: 600;
        color: var(--secondary-text-color);
      }

      .remove-btn {
        background: none;
        border: none;
        color: var(--error-color, #db4437);
        font-size: 16px;
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 4px;
      }

      .remove-btn:hover {
        background: rgba(var(--rgb-red, 219, 68, 55), 0.1);
      }

      .add-btn {
        display: block;
        width: 100%;
        padding: 10px;
        border: 2px dashed var(--divider-color, #ccc);
        border-radius: 8px;
        background: none;
        color: var(--primary-color, #03a9f4);
        font-size: 14px;
        cursor: pointer;
        transition: background 0.15s;
      }

      .add-btn:hover {
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
      }
    `;
  }
}

/* ------------------------------------------------------------------ */
/*  Registration                                                       */
/* ------------------------------------------------------------------ */

customElements.define("notification-card", HaNotificationCard);
customElements.define("notification-card-editor", HaNotificationCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "notification-card",
  name: "Notification Card",
  description:
    "Entity-driven notification center with swipe dismiss, severity levels, auto-expiry, and grouped alerts.",
  preview: true,
  documentationURL:
    "https://github.com/robmarkoski/ha-notification-card",
});

console.info(
  `%c NOTIFICATION-CARD %c v${CARD_VERSION} `,
  "color: white; background: #03a9f4; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;",
  "color: #03a9f4; background: white; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0; border: 1px solid #03a9f4;"
);

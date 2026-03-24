# Notification Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub release](https://img.shields.io/github/v/release/robmarkoski/ha-notification-card)](https://github.com/robmarkoski/ha-notification-card/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A custom Lovelace card that turns entity state changes into a live notification feed on your Home Assistant dashboard. Think of it as a notification shade — like your phone — but for your house.

Watch your configured entities, trigger notifications on state changes, swipe to dismiss, auto-expire stale alerts, and keep everything styled to match your HA theme.

---

## ⚠️ Breaking Change in v2.0.0

The custom element has been **renamed** from `ha-notification-card` to `notification-card`.

**You must update your dashboard YAML:**

```yaml
# OLD (v1.x) — no longer works
type: custom:ha-notification-card

# NEW (v2.0+)
type: custom:notification-card
```

If you use the visual editor, remove the old card and re-add **"Notification Card"** from the card picker — it will use the new element name automatically.

**No other configuration changes are required.** All entity options, triggers, and card settings remain the same.

---

## What's New in v2.0.0

- **Element renamed** to `notification-card` (see breaking change above)
- **Initial state check** — on first load, the card now checks all configured entities and immediately creates notifications for any already in a triggered state. Previously, notifications only appeared on state *transitions*; now the card catches up on load.
- **Improved `getCardSize()`** — removed the `hide_when_empty` guard so the card always reports an accurate size to the Lovelace layout engine.

---

## Features

| Feature | Description |
|---|---|
| **Entity-driven** | Watches configured entities and generates notifications on state changes — no automations or scripts required |
| **Initial state check** | On first load, checks all configured entities and creates notifications for any already in a triggered state — not just on transitions |
| **Configurable triggers** | Fire on any change, specific states, on/off transitions, numeric thresholds (above/below), or unavailability |
| **Swipe to dismiss** | Swipe left or right on mobile/touch to clear notifications |
| **Tap ✕ to dismiss** | Hover to reveal the dismiss button on desktop, tap to clear |
| **Long-press for details** | Hold a notification to expand full entity details — current state, attributes, timestamps |
| **Severity levels** | `info`, `success`, `warning`, `error`, `critical` — each with distinct color coding and icons |
| **Critical pulse** | Critical-severity notifications get a pulsing left border to catch your eye |
| **Custom messages** | Template messages with `{name}`, `{state}`, `{previous}`, `{entity}` variable substitution |
| **Notification grouping** | Repeated triggers from the same entity stack with a counter instead of flooding the feed |
| **Auto-expiry** | Notifications auto-clear after a configurable time — set globally or per entity |
| **Mute / snooze** | Long-press a notification to mute that entity for 1 hour or 24 hours |
| **Hide when empty** | Optionally hide the entire card (collapse the space) when no notifications are active |
| **Persistent storage** | Notifications survive page refreshes via `localStorage` |
| **Visual card editor** | Full GUI configuration in the Lovelace editor — no YAML required |
| **HA theme support** | Uses standard CSS variables from your active theme — adapts automatically |
| **Collapsible** | Shows a configurable number of notifications with a "Show more" button for the rest |
| **Haptic feedback** | Optional vibration on mobile when new notifications arrive |
| **Storage isolation** | Use different `card_id` values to run multiple independent notification cards |
| **Sort options** | Sort by newest, oldest, or severity |

---

## Installation

### HACS (Recommended)

1. Open **HACS** → **Frontend**
2. Click the **⋮** menu (top right) → **Custom repositories**
3. Add the repository URL:
   ```
   https://github.com/robmarkoski/ha-notification-card
   ```
4. Set the category to **Lovelace** and click **Add**
5. Search for **"Notification Card"** in the HACS Frontend store
6. Click **Download**
7. **Restart Home Assistant** (Settings → System → Restart)
8. Hard-refresh your browser (`Ctrl+Shift+R` / `Cmd+Shift+R`)

HACS will automatically register the resource for you.

### Manual Installation

1. Download `ha-notification-card.js` from the [latest release](https://github.com/robmarkoski/ha-notification-card/releases)
2. Copy it to your Home Assistant config directory:
   ```
   /config/www/ha-notification-card.js
   ```
3. Register the resource:
   - Go to **Settings → Dashboards → Resources** (top right: ⋮ → Resources)
   - Click **Add Resource**
   - URL: `/local/ha-notification-card.js`
   - Resource type: **JavaScript Module**
4. **Restart Home Assistant**
5. Hard-refresh your browser

---

## Quick Start

### Using the Visual Editor

1. Edit any dashboard
2. Click **+ Add Card**
3. Search for **"Notification Card"**
4. Configure your entities and triggers in the GUI
5. Save

### Using YAML

Add a card to any dashboard view:

```yaml
type: custom:notification-card
title: "🔔 Notifications"
visible_count: 4
expiry_minutes: 1440
entities:
  - entity: binary_sensor.front_door
    trigger: "on"
    severity: warning
    message: "🚪 {name} opened"
```

That's it. When `binary_sensor.front_door` changes to `on`, a warning notification appears in the card.

---

## Configuration Reference

### Card Options

| Option | Type | Default | Description |
|---|---|---|---|
| `title` | string | `Notifications` | Card title displayed in the header |
| `card_id` | string | `default` | Storage isolation key. Use different IDs for multiple independent cards on the same or different dashboards |
| `visible_count` | number | `4` | Number of notifications visible before the "Show more" button appears |
| `expiry_minutes` | number | `0` | Global auto-expiry in minutes. `0` = notifications persist until manually dismissed |
| `sort_by` | string | `newest` | Sort order: `newest`, `oldest`, or `severity` |
| `group_repeated` | boolean | `true` | When the same entity triggers again, update the existing notification and increment the counter instead of creating a new one |
| `hide_when_empty` | boolean | `false` | Completely hide the card (collapse the space it occupies) when there are no active notifications |
| `show_header` | boolean | `true` | Show the card header with title, badge, and clear-all button |
| `show_badge` | boolean | `true` | Show the notification count badge next to the title |
| `show_clear_all` | boolean | `true` | Show the "Clear all" button in the header |
| `show_timestamp` | boolean | `true` | Show relative timestamps (e.g., "5m ago", "2h ago") on each notification |
| `show_empty` | boolean | `true` | Show an empty-state message when no notifications are active. Ignored when `hide_when_empty` is `true` |
| `empty_text` | string | `No notifications` | Text displayed in the empty state |
| `vibrate` | boolean | `false` | Trigger a short vibration on mobile devices when a new notification arrives |
| `max_stored` | number | `100` | Maximum number of notifications kept in localStorage. Oldest are trimmed when exceeded |

### Entity Options

Each entry in the `entities` list configures a watcher for one entity:

| Option | Type | Default | Description |
|---|---|---|---|
| `entity` | string | **required** | Entity ID to watch (e.g., `binary_sensor.front_door`) |
| `trigger` | string | `any` | When to fire — see [Trigger Types](#trigger-types) below |
| `state` | string | — | Target state value. Only used with `trigger: state` |
| `threshold` | number | — | Numeric threshold. Only used with `trigger: above` or `trigger: below` |
| `severity` | string | `info` | Notification severity: `info`, `success`, `warning`, `error`, or `critical` |
| `message` | string | `{name}: {state}` | Message template. See [Message Variables](#message-variables) |
| `icon` | string | *(auto)* | Override the notification icon (e.g., `mdi:fire`). Defaults to the entity's icon or a severity-appropriate icon |
| `name` | string | *(friendly name)* | Override the entity's friendly name in message templates |
| `expiry_minutes` | number | *(global)* | Per-entity auto-expiry in minutes. Overrides the card-level `expiry_minutes`. `0` = no expiry |
| `enabled` | boolean | `true` | Set to `false` to temporarily disable this watcher without removing it |

### Trigger Types

| Trigger | Fires when… |
|---|---|
| `any` | The entity state changes to anything different from its previous state |
| `state` | The entity state matches the configured `state` value (and it wasn't that value before) |
| `on` | The entity state changes to `on` (e.g., a door opens, motion detected) |
| `off` | The entity state changes to `off` |
| `above` | A numeric entity state crosses **above** the configured `threshold` (only fires on the crossing, not while it stays above) |
| `below` | A numeric entity state crosses **below** the configured `threshold` |
| `unavailable` | The entity state becomes `unavailable` or `unknown` — useful for monitoring device connectivity |

### Message Variables

Use these placeholders in the `message` field:

| Variable | Replaced with |
|---|---|
| `{name}` | Entity friendly name (or the `name` override) |
| `{state}` | Current state value |
| `{previous}` | Previous state value (before the change) |
| `{entity}` | Full entity ID |

---

## Theming

The card uses standard Home Assistant CSS variables and adapts to any theme automatically:

| Variable | Used for |
|---|---|
| `--primary-text-color` | Notification message text |
| `--secondary-text-color` | Timestamps, metadata, dismiss button |
| `--divider-color` | Borders between notifications |
| `--ha-card-background` | Card background |
| `--ha-card-border-radius` | Card corner rounding |
| `--primary-color` | Badge, "Clear all" button, "Show more" link |
| `--info-color` | Info severity icon background |
| `--success-color` | Success severity icon background |
| `--warning-color` | Warning severity icon background |
| `--error-color` | Error and critical severity icon background, critical pulse border |

No custom CSS or card-mod required — it just works with whatever theme you're using.

---

## Examples

### Basic Door & Motion Monitoring

```yaml
type: custom:notification-card
title: "🏠 House Activity"
visible_count: 5
expiry_minutes: 60
entities:
  - entity: binary_sensor.front_door
    trigger: "on"
    severity: info
    message: "🚪 {name} opened"

  - entity: binary_sensor.garage_door
    trigger: "on"
    severity: warning
    message: "⚠️ {name} opened"
    icon: mdi:garage-alert

  - entity: binary_sensor.back_door
    trigger: "on"
    severity: info
    message: "🚪 {name} opened"

  - entity: binary_sensor.entrance_motion
    trigger: "on"
    severity: info
    message: "👤 Motion at the entrance"
    expiry_minutes: 15
```

### Climate & Temperature Alerts

```yaml
type: custom:notification-card
title: "🌡️ Climate"
visible_count: 3
hide_when_empty: true
sort_by: severity
entities:
  - entity: sensor.outdoor_temperature
    trigger: above
    threshold: 38
    severity: warning
    message: "🌡️ Outside temp is {state}°C — getting hot"
    icon: mdi:thermometer-alert

  - entity: sensor.outdoor_temperature
    trigger: above
    threshold: 42
    severity: critical
    message: "🔥 EXTREME HEAT: {state}°C"
    icon: mdi:fire-alert

  - entity: sensor.indoor_humidity
    trigger: above
    threshold: 70
    severity: warning
    message: "💧 Indoor humidity at {state}% — check ventilation"

  - entity: climate.living_room
    trigger: state
    state: "off"
    severity: info
    message: "❄️ {name} turned off"
```

### Security Dashboard

```yaml
type: custom:notification-card
title: "🛡️ Security"
card_id: security
visible_count: 6
expiry_minutes: 0
sort_by: severity
entities:
  - entity: binary_sensor.smoke_detector
    trigger: "on"
    severity: critical
    message: "🚨 SMOKE DETECTED — {name}"
    icon: mdi:smoke-detector-alert

  - entity: alarm_control_panel.home_alarm
    trigger: state
    state: triggered
    severity: critical
    message: "🚨 ALARM TRIGGERED"

  - entity: binary_sensor.front_door
    trigger: "on"
    severity: warning
    message: "🚪 {name} opened"
    expiry_minutes: 120

  - entity: binary_sensor.garage_door
    trigger: "on"
    severity: warning
    message: "🔓 Garage door opened"
    expiry_minutes: 120

  - entity: lock.front_door
    trigger: state
    state: unlocked
    severity: warning
    message: "🔓 {name} unlocked"
```

### Device Health Monitoring

```yaml
type: custom:notification-card
title: "📡 Device Health"
card_id: device-health
visible_count: 4
hide_when_empty: true
entities:
  - entity: binary_sensor.zigbee_bridge
    trigger: unavailable
    severity: error
    message: "📡 Zigbee bridge is {state}"
    icon: mdi:zigbee

  - entity: sensor.server_cpu_temperature
    trigger: above
    threshold: 80
    severity: error
    message: "🔥 Server CPU at {state}°C"

  - entity: sensor.nas_disk_usage
    trigger: above
    threshold: 90
    severity: warning
    message: "💾 NAS disk usage at {state}%"

  - entity: sensor.phone_battery
    trigger: below
    threshold: 15
    severity: warning
    message: "🔋 {name} battery low: {state}%"
    icon: mdi:battery-alert
```

### Hidden When Empty (Conditional Alerts)

Use `hide_when_empty: true` to make the card completely disappear when there are no active notifications. The card will reappear with a smooth entry when a notification triggers. This is useful for alert-style cards that should only be visible when something needs attention:

```yaml
type: custom:notification-card
title: "⚠️ Alerts"
hide_when_empty: true
show_empty: false
expiry_minutes: 120
entities:
  - entity: binary_sensor.water_leak
    trigger: "on"
    severity: critical
    message: "💧 WATER LEAK DETECTED — {name}"

  - entity: binary_sensor.smoke_detector
    trigger: "on"
    severity: critical
    message: "🚨 SMOKE DETECTED"
```

---

## Interactions

### On Desktop
- **Hover** over a notification to reveal the ✕ dismiss button
- **Click ✕** to dismiss
- **Click "Clear all"** in the header to dismiss everything
- **Click "Show more"** to expand the full list

### On Mobile / Touch
- **Swipe left or right** on a notification to dismiss it
- **Long-press** (hold ~500ms) on a notification to expand the detail view showing:
  - Entity ID
  - Current and previous state
  - Live current state from HA
  - Key entity attributes
  - Trigger timestamp
  - **Mute 1h** / **Mute 24h** buttons
- **Tap ✕** to dismiss (always visible on touch devices)

### Muting
When you long-press a notification, you can mute that entity for 1 hour or 24 hours. During the mute period, that entity's state changes won't generate new notifications. The mute is stored in localStorage and survives page refreshes.

---

## Storage & Persistence

Notifications are stored in your browser's `localStorage`, scoped by the `card_id` you configure. This means:

- **Notifications survive page refreshes** and browser restarts
- **Different browsers/devices** have independent notification lists
- **Multiple cards** with different `card_id` values maintain separate storage
- **Storage is automatically trimmed** to `max_stored` (default 100) notifications

To clear all stored data for a card, open your browser's developer console and run:
```javascript
localStorage.removeItem("ha-notification-card-YOUR_CARD_ID");
localStorage.removeItem("ha-notification-card-YOUR_CARD_ID-dismissed");
localStorage.removeItem("ha-notification-card-YOUR_CARD_ID-muted");
```

---

## Auto-Expiry

Configure how long notifications stay visible before being automatically dismissed:

- **Global expiry**: Set `expiry_minutes` at the card level — applies to all notifications unless overridden
- **Per-entity expiry**: Set `expiry_minutes` on individual entity entries — overrides the global setting for that entity
- **No expiry**: Set `expiry_minutes: 0` (the default) — notifications stay until manually dismissed
- **Examples**:
  - `expiry_minutes: 15` — 15 minutes
  - `expiry_minutes: 60` — 1 hour
  - `expiry_minutes: 1440` — 24 hours
  - `expiry_minutes: 10080` — 1 week
  - `expiry_minutes: 43200` — 30 days

Expiry is checked every 30 seconds. Expired notifications are automatically dismissed.

---

## Sorting

Control the order notifications appear with the `sort_by` option:

| Value | Behaviour |
|---|---|
| `newest` | Most recent notifications first (default) |
| `oldest` | Oldest notifications first |
| `severity` | Critical → Error → Warning → Info → Success |

---

## Notification Grouping

When `group_repeated` is `true` (the default), if the same entity triggers again while an undismissed notification already exists:

- The existing notification's **message is updated** with the new state
- The **timestamp is refreshed** to the latest trigger time
- A **counter badge** (×2, ×3, etc.) appears showing how many times it fired

This prevents the feed from being flooded by rapidly changing entities (e.g., a temperature sensor that fluctuates around a threshold).

---

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm

### Setup

```bash
git clone https://github.com/robmarkoski/ha-notification-card.git
cd ha-notification-card
npm install
```

### Build

```bash
npm run build      # Production build → dist/ha-notification-card.js
npm run dev        # Watch mode — rebuilds on file changes
```

### Deploy for Testing

Copy the built file to your HA instance:

```bash
# Via SSH
scp dist/ha-notification-card.js root@YOUR_HA_IP:/config/www/

# Or via pipe if scp subsystem is unavailable
cat dist/ha-notification-card.js | ssh root@YOUR_HA_IP 'cat > /config/www/ha-notification-card.js'
```

Then hard-refresh your browser (`Ctrl+Shift+R`).

### Project Structure

```
ha-notification-card/
├── src/
│   └── ha-notification-card.js   # Main source (Lit web component)
├── dist/
│   └── ha-notification-card.js   # Built + minified output
├── hacs.json                     # HACS metadata
├── package.json
├── rollup.config.mjs             # Build config
├── LICENSE
└── README.md
```

---

## FAQ

### Notifications aren't appearing

- Make sure the resource is registered: **Settings → Dashboards → ⋮ → Resources** — you should see `/local/ha-notification-card.js` as a JavaScript Module
- Hard-refresh your browser (`Ctrl+Shift+R`)
- Check the browser console for errors (F12 → Console)
- As of v2.0, the card checks entity states on first load — if an entity is already in a triggered state, a notification will be created immediately

### The card shows "Custom element doesn't exist"

The resource isn't loaded. Check:
1. The file exists at `/config/www/ha-notification-card.js`
2. The resource is registered (see above)
3. You've restarted Home Assistant after adding the resource
4. You've hard-refreshed the browser
5. **If upgrading from v1.x:** make sure your YAML uses `type: custom:notification-card` (not the old `custom:ha-notification-card`)

### Can I use this with entities that change frequently?

Yes. Use `group_repeated: true` (the default) to stack repeated triggers. Consider setting a short `expiry_minutes` (e.g., 5–15) for high-frequency entities to prevent localStorage bloat.

### Do notifications sync between devices?

No. Notifications are stored in each browser's `localStorage`. Each device/browser has its own independent notification feed. The entity watchers will generate the same notifications on each device, but dismissals and mutes are local.

### Can I trigger notifications from automations?

Not directly — this card watches entity states. However, you can create an `input_boolean` helper, toggle it from an automation, and configure the card to watch that helper. This gives you automation-driven notifications:

```yaml
# In the card config:
- entity: input_boolean.notify_laundry_done
  trigger: "on"
  severity: success
  message: "🧺 Laundry is done!"
  expiry_minutes: 120
```

### How do I reset all notifications?

Click **"Clear all"** in the card header, or clear localStorage via the browser console (see [Storage & Persistence](#-storage--persistence)).

---

## License

[MIT](LICENSE) © Rob Markoski

---

## Contributing

Contributions welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Build and test (`npm run build`)
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

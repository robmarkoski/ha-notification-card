# Notification Card

A custom Lovelace card that turns entity state changes into a live notification feed on your dashboard.

## What it does

Configure entity watchers with triggers (state changes, thresholds, unavailability) and the card generates a notification feed — like a phone notification shade, but for your house. No automations or scripts required.

## Key features

- **Entity-driven** — watches entities and fires on state changes, on/off, numeric thresholds, or unavailability
- **Swipe to dismiss** on mobile, tap the X on desktop
- **Long-press for details** — expand entity attributes, live state, and mute options
- **Severity levels** — info, success, warning, error, critical with distinct colour coding
- **Custom message templates** — `{name}`, `{state}`, `{previous}`, `{entity}` variables
- **Auto-expiry** — global or per-entity, from minutes to months
- **Notification grouping** — repeated triggers stack with a counter
- **Mute / snooze** — silence an entity for 1h or 24h
- **Hide when empty** — collapse the card entirely when there's nothing to show
- **Persistent** — survives page refreshes via localStorage
- **Visual editor** — full GUI config, no YAML needed
- **Theme-aware** — uses standard HA CSS variables

## Example

```yaml
type: custom:ha-notification-card
title: Notifications
visible_count: 4
expiry_minutes: 1440
entities:
  - entity: binary_sensor.front_door
    trigger: "on"
    severity: warning
    message: "{name} opened"

  - entity: sensor.outdoor_temperature
    trigger: above
    threshold: 38
    severity: error
    message: "{name} is {state}°C"

  - entity: binary_sensor.smoke_detector
    trigger: "on"
    severity: critical
    message: "SMOKE DETECTED"
```

See the [full documentation](https://github.com/robmarkoski/ha-notification-card) for all options, examples, and configuration reference.

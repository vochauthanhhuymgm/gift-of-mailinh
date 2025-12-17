# Data Model: Daily Life-Healing Suggestions (365-Day Journey)

**Phase**: 1 (Design)  
**Date**: 2025-12-17  
**Status**: Complete

## Overview

This document defines the core entities, relationships, and state transitions for the daily life-healing suggestion app. All data is static and bundled at build time; there is no runtime database or server-side state.

---

## Entity: Message

**Purpose**: A single daily life-healing suggestion displayed to the user on a specific day in the 365-day journey.

### Attributes

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|---------|
| `id` | Integer | Yes | Unique identifier (0–364, representing day 0 to day 364 of the journey) | `0`, `1`, `364` |
| `content` | String | Yes | The main message text; emotionally supportive and motivational. Supports plain text or basic markdown (line breaks, bold/italic). | "You are capable of amazing things. Take one small step today." |
| `author` | String | No | Name or credit for the message author/source (optional; can be empty or omitted) | "Sarah", "Anonymous", "Unknown" |
| `theme` | String | No | Thematic category for organization and editorial purposes. Examples: "self-care", "resilience", "gratitude", "growth" | "self-care", "resilience" |
| `createdAt` | ISO 8601 Date | No | Date when the message was written or last updated (used for changelog/audit, not displayed to users) | "2025-12-01" |

### Relationships

- **1 Message : 1 Day in Cycle**: Each message is tied to a single day (0–364) in the 365-day journey. The `id` directly maps to the day index.
- **No User Relationship**: Messages are not stored per user. No user accounts, no tracking of which messages have been "seen."

### Constraints

- **Uniqueness**: Each `id` (0–364) must be unique; no duplicates.
- **Completeness**: All 365 days (indices 0–364) must have a message. Missing days → build-time validation error.
- **No Null Content**: `content` must never be empty or null; every message must have text to display.
- **No Personal Data**: Messages must not reference user information, device info, or any personally identifiable data.

### Validation Rules

- `id` must be an integer in range [0, 364].
- `content` must be non-empty string, max length 500 characters (soft limit to keep messages concise).
- `theme` must be one of a predefined list (e.g., "self-care", "resilience", "gratitude", "growth", "courage", "mindfulness") or custom per project.
- `author` is optional; if provided, must be a string max 100 characters.

---

## Entity: Configuration

**Purpose**: Build-time and runtime configuration for the app. All values are constants; no runtime mutation.

### Attributes

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|---------|
| `startDate` | ISO 8601 Date | Yes | The date on which day 0 (first message) becomes available. Set at build time. | "2025-12-18" |
| `appName` | String | Yes | Name of the app (used in page title, headers, etc.) | "Daily Life Suggestions" |
| `appDescription` | String | No | Short description (meta tag, footer, etc.) | "365 days of emotional healing and daily inspiration" |
| `timezone` | String | No | Default timezone hint (informational; app uses local device timezone at runtime) | "local", "UTC" |
| `unlockedHour` | Integer | Yes | Hour of day (0–23) when messages unlock (in local time). | `6` (for 6:00 AM) |
| `unlockedMinute` | Integer | Yes | Minute of hour (0–59) when messages unlock. | `0` (for 6:00 AM) |
| `messageMinLength` | Integer | No | Minimum character length for a valid message (build-time validation hint) | `20` |
| `messageMaxLength` | Integer | No | Maximum character length for a valid message (display and validation) | `500` |
| `supportEmail` | String | No | Contact email for feedback or support (optional; if omitted, no support link shown) | "support@example.com" |
| `privacyPolicy` | String | No | URL to privacy policy (optional; if omitted, no privacy link shown) | "https://example.com/privacy" |

### Relationships

- **1 Configuration : N Messages**: A single global configuration applies to all 365 messages. All messages are indexed relative to a single `startDate`.

### Constraints

- **Immutability**: Configuration values must not be mutable at runtime. They are set at build time and baked into the static artifact.
- **Single Instance**: Only one global configuration object exists per deployment.
- **Start Date Validation**: `startDate` must be a valid, future date at deployment time (or in the past if the app is already running).
- **Unlock Time Validation**: `unlockedHour` must be [0, 23]; `unlockedMinute` must be [0, 59].

### Validation Rules

- `startDate` must be a valid ISO 8601 date (YYYY-MM-DD).
- `unlockedHour` must be integer in [0, 23].
- `unlockedMinute` must be integer in [0, 59].
- `appName` and `appDescription` must be non-empty strings.
- `messageMinLength` and `messageMaxLength`, if provided, must satisfy `0 < minLength <= maxLength`.

---

## State Machine: Message Delivery State

### States

```
┌─────────────────┐
│  COMING_SOON    │  User's local date < startDate
└────────┬────────┘
         │ (User's local date == startDate and local time >= unlockedTime)
         ▼
┌─────────────────┐
│   UNLOCKED      │  Daily message displayed (index 0 to 364)
└────────┬────────┘
         │ (Local date > startDate + 364 days)
         ▼
┌─────────────────┐
│   COMPLETED     │  User has reached day 366; completion message shown
└─────────────────┘
```

### Transitions

#### COMING_SOON → UNLOCKED
- **Trigger**: Current local date is `>= startDate` AND current local time is `>= 06:00 AM` (local time).
- **Action**: Display message at index 0. Show no "coming soon" placeholder.
- **Side Effect** (optional): Log "journey started" in localStorage for UX enhancements.

#### UNLOCKED → UNLOCKED
- **Trigger**: Daily transition at 6:00 AM local time (or on page load at any time, if date has advanced).
- **Action**: Calculate `dayIndex = floor((currentDate - startDate) / 86400 seconds)`. Load and display message at `dayIndex`.
- **Side Effect** (optional): Log "last seen date" in localStorage to detect clock manipulation and warn if needed.

#### UNLOCKED → COMPLETED
- **Trigger**: Current local date is `>= startDate + 365 days` (i.e., day index would be `>= 365`).
- **Action**: Transition to COMPLETED state. Display completion message. Do not cycle back to day 0.
- **Side Effect**: Log "journey completed" in localStorage or display confetti animation (optional).

#### COMPLETED → COMPLETED
- **Trigger**: User continues to access app after day 365.
- **Action**: Remain in COMPLETED state. Show completion message indefinitely.

### Edge Cases Handled

#### Edge Case 1: Device Date Before startDate
- **State**: COMING_SOON
- **Behavior**: Display "Coming Soon" placeholder. Do not show message content.
- **Message**: "Your 365-day journey begins on [startDate]. Get ready at 6:00 AM!"

#### Edge Case 2: Device Time Before Unlock Time (e.g., 5:59 AM)
- **State**: UNLOCKED (day index is calculated as if 6:00 AM hasn't occurred)
- **Behavior**: Show yesterday's message (or a placeholder if on `startDate` and time is before 06:00 AM).
- **Example**: If startDate is 2025-12-18 and current time is 2025-12-18 05:59 AM, show placeholder (or nothing yet).

#### Edge Case 3: Device Clock Set Forward (e.g., user changes system date forward by 10 days)
- **State**: UNLOCKED
- **Behavior**: Show the message for the new date (trust the device clock). Optional: log to localStorage and warn user if jump is >7 days.
- **Message** (optional warning): "Your device date appears to have changed. If this is unexpected, please check your system settings."

#### Edge Case 4: Timezone Change (user travels across timezones)
- **State**: UNLOCKED
- **Behavior**: Message index is calculated using local time. If user travels from UTC-5 to UTC+8 (13-hour jump), the "current day" from app's perspective may advance or retreat by up to 1 day. This is expected and correct behavior (respects local time).
- **Example**: On 2025-12-19 at 08:00 AM EST (UTC-5), app shows day X. User flies to JST (UTC+9). Same moment in UTC is 2025-12-19 01:00 PM JST. If that's past 6:00 AM local (JST), day index is calculated fresh based on JST date.

#### Edge Case 5: Device Date Set to Day 365+
- **State**: COMPLETED
- **Behavior**: Show completion message. Do not crash or error.

---

## Storage & Serialization

### messages.json Structure

```json
{
  "messages": [
    {
      "id": 0,
      "content": "You are capable of amazing things. Take one small step today.",
      "author": "Sarah",
      "theme": "self-care",
      "createdAt": "2025-12-01"
    },
    {
      "id": 1,
      "content": "Today is a gift. Embrace it with a calm heart.",
      "author": "Anonymous",
      "theme": "mindfulness",
      "createdAt": "2025-12-02"
    },
    ...
    {
      "id": 364,
      "content": "You have grown. Celebrate every step of your journey.",
      "author": "Unknown",
      "theme": "gratitude",
      "createdAt": "2025-12-31"
    }
  ]
}
```

### Configuration Loading

Configuration values can be:
1. **Hardcoded** in `nuxt.config.ts` or a dedicated `config.ts` module.
2. **Loaded from `.env` at build time**: `VITE_START_DATE=2025-12-18`, `VITE_APP_NAME="Daily Suggestions"`, etc.
3. **Loaded from a separate `config.json`** bundled at build time.

**Recommended**: Use `.env` for environment-specific values (startDate per deployment) and `config.ts` for constants (unlocked hour, app name).

---

## Indexing & Message Access

### Formula: Day Index Calculation

```javascript
const startDate = new Date('2025-12-18');
const today = new Date(); // Today in local timezone
const dayIndex = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
```

### Message Access

```javascript
// In useMessageIndex composable
const message = messages[Math.max(0, Math.min(dayIndex, 364))];
```

- If `dayIndex < 0`: Not yet started; show COMING_SOON placeholder.
- If `0 <= dayIndex <= 364`: Show message at index `dayIndex`.
- If `dayIndex > 364`: Show COMPLETED message; do not index out of bounds.

---

## Validation Checklist (Build-Time)

During the build process (e.g., in `nuxt.config.ts` or a custom build hook):

- [ ] Verify 365 messages exist (indices 0–364).
- [ ] Verify all messages have non-empty `content`.
- [ ] Verify no duplicate `id` values.
- [ ] Verify `content` length is within [minLength, maxLength].
- [ ] Verify `startDate` is a valid ISO 8601 date.
- [ ] Verify `unlockedHour` is [0, 23] and `unlockedMinute` is [0, 59].
- [ ] Warn if any `theme` value is not in the expected list.
- [ ] Warn if `author` fields are missing for many messages (encourage metadata).

---

## Next Steps (Phase 2)

- Implement `useMessageIndex.ts` composable with date calculation and state machine logic.
- Implement `messageService.ts` to load `messages.json` and provide message by index.
- Implement edge case handling (COMING_SOON, COMPLETED) in page components.
- Write unit tests for date calculation, edge cases, and validation.


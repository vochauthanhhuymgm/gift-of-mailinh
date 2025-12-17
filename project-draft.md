Project Overview

Build a front-end web application that delivers one daily life-healing suggestion over a 365-day journey.
Each message is designed to emotionally support, encourage, and help the reader start her day positively.

Target Audience: Female students
Goal: Provide gentle motivation, emotional healing, and daily reassurance in a calm, comforting way.

Every day at 6:00 AM, a new life suggestion message becomes available.
The message remains visible for the entire day and is automatically replaced at 6:00 AM the next day.

Core Functionality

The application contains 365 pre-defined life suggestion messages

Only one message is shown per day

Messages are unlocked strictly by date (no skipping or manual selection)

The experience should feel like a daily ritual or emotional check-in

Technical Requirements
Frontend Framework

Nuxt.js

Vue 3 (Composition API)

Data Storage (No Backend)

No server or database

All messages are stored locally on the frontend (e.g., static array or JSON file)

Message selection logic:

Define a startDate (e.g., 2025-12-18)

Calculate the day difference between currentDate and startDate

Use the result as the array index

Example:

startDate: 2025-12-18

currentDate: 2025-12-19

Selected message index: 1

UI & UX Requirements
UI Library

Vuetify.js

Design & Experience

Visual style must be cute, soft, and chill

The app should feel:

Calm

Warm

Emotionally safe

Animations and transitions should be slow and gentle

Minimal text on screen, strong focus on the daily message

Design Reference

Overall vibe and emotional experience should be inspired by
👉 https://sleepcycle.com/

The UI should capture a similar peaceful, soothing atmosphere,
while allowing flexibility in layout and visual details

Constraints

Frontend-only application

No login, no user accounts

No message repetition within 365 days

Time-based logic must respect local device time
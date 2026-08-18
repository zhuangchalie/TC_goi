# GuardianAI V5 — Senior Zero-Touch

## Product promise
After one-time setup by a caregiver, the older adult should not need to upload,
transcribe, classify, or share anything manually.

## Automatic path
Incoming call -> CallScreeningService -> number risk check -> warning.
After-call -> if the device/phone app has a consented call recording accessible
to GuardianAI -> newest recording is detected -> speech-to-text -> scam analysis
-> local alert -> family escalation.

## Important platform truth
A normal third-party Android app cannot silently capture both sides of a cellular
call. `VOICE_CALL` recording requires a privileged system permission. Therefore
the zero-touch recording branch depends on an accessible recording produced by
the phone/dialer/device, or a device/enterprise configuration that legally and
technically exposes it.

GuardianAI must NEVER pretend it analyzed audio when no audio was available.

## Caregiver setup
1. Caregiver installs the app.
2. Caregiver configures family contacts and alert thresholds.
3. Caregiver grants required Android permissions/roles.
4. GuardianAI runs in the background.
5. Senior only sees large, simple safety alerts.

## Escalation
- >= 70: local warning
- >= 85: family SMS
- >= 95: family SMS + repeated high-priority local alert
Thresholds are configurable by caregiver.

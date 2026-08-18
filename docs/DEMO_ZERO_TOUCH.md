# Competition demo — zero-touch

## Setup
Caregiver configures two family numbers and threshold 85.

## Demo A: incoming scam call
1. Call the demo phone from an unknown number.
2. CallScreeningService evaluates the number.
3. Phone shows a large red warning if risk is high.
4. No interaction from the senior is required.

## Demo B: post-call audio (on a device that exposes recordings)
1. A consented recording is created by the phone/dialer.
2. GuardianAI automatically discovers the newest accessible recording.
3. Speech-to-text -> scam analysis.
4. Score >= 85 triggers family SMS.
5. The senior sees a large red warning.

If the device does not expose call recordings, explicitly demonstrate the
fallback and explain the Android platform restriction. Do not fake an automatic
recording capability.

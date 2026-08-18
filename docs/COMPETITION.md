# GuardianAI — Competition Build

## Pitch
GuardianAI is a privacy-first scam shield for Android. It detects suspicious SMS
at arrival, explains the risk in Vietnamese, warns the user immediately, and
keeps a local audit trail. The architecture is cross-platform at the UI/AI
layer and uses an Intel OpenVINO edge-inference bridge where supported.

## What is genuinely implemented
- Android SMS BroadcastReceiver
- Risk scoring + explanation
- High-risk notification
- Local event history
- Call event capture without secretly recording call audio
- OpenVINO-ready service contract
- Offline fallback

## What must be labeled as prototype
- The baseline detector is heuristic, not a trained benchmarked model.
- Phone/domain reputation is not yet a live intelligence feed.
- iOS cannot provide the same SMS/call interception privileges.

## 3-minute demo
1. Launch GuardianAI.
2. Tap "Chạy demo AI".
3. Show score, reasons and history.
4. Send a test SMS containing a fake bank + OTP + link pattern.
5. Show Android notification.
6. Explain privacy/offline fallback.
7. Show architecture slide: Android -> GuardianAI -> OpenVINO.
8. Be explicit that Intel/OpenVINO is the optimized inference path, not a claim that the current heuristic is an Intel-trained model.

## Judge-friendly differentiators
- Explainable alerts instead of a black-box "SCAM" label.
- Local-first design.
- Edge inference path reduces latency and can reduce data leaving device.
- Modular design: rules -> ML model -> reputation -> fusion.
- Safety by design: no covert call recording.

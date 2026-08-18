# Android limits we design around

- `CallScreeningService` can screen incoming/outgoing calls and obtain call
  details such as caller number verification status.
- A normal app cannot use `MediaRecorder.AudioSource.VOICE_CALL` for cellular
  uplink+downlink capture because `CAPTURE_AUDIO_OUTPUT` is reserved for system
  components.
- Android default-handler roles and Play policy can affect SMS/call permissions.
- On some Android versions, SMS delivery/reading behavior has additional
  restrictions.

Therefore the product has two independent protection layers:
1. pre-call/number screening (zero-touch, broadly feasible);
2. post-call audio analysis only when a consented recording is actually
   accessible.

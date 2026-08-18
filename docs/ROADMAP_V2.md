# Production upgrade roadmap

## P0 — before competition
- Replace demo-only copy with product wording.
- Add consent/privacy screen.
- Add test cases and screenshots.
- Build a release APK for a controlled Android test phone.

## P1 — real ML
- Collect consented, anonymized Vietnamese scam/benign corpus.
- Train a text classifier.
- Export ONNX.
- Convert/load with OpenVINO.
- Measure precision, recall, F1, false-positive rate and latency.

## P2 — threat intelligence
- URL normalization and reputation lookup.
- Domain age / TLS / punycode / redirect signals.
- Phone number reputation with a lawful provider.
- Local deny/allow list.

## P3 — call protection
- Use only Android APIs and user-consented mechanisms available to the target
  device/OS.
- Analyze a user-approved transcript rather than covertly capturing calls.
- Add post-call explanation and "what to do next".

## P4 — privacy
- Encrypt local history.
- Add retention controls.
- Provide one-tap delete/export.
- Never upload raw messages by default.

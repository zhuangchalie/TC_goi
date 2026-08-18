# 2-minute Call AI demo

Prepare a consented recording containing:
- fake bank identity
- urgency
- request for OTP
- request for transfer
- a suspicious link

Open `Call AI Shield` -> select file -> analyze.

Expected:
`Audio -> Whisper/OpenVINO -> transcript -> scam score -> reasons -> family SMS`.

Show the judge the transcript and explain that OpenVINO Whisper can run on
supported Intel CPU/GPU/NPU paths. Do not claim that the phone app can secretly
record both sides of a cellular call.

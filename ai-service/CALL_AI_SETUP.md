# Call AI setup — Intel/OpenVINO

OpenVINO GenAI supports Whisper speech recognition and can run on CPU, GPU or
NPU depending on the supported device/model. The service expects audio,
resamples it to 16 kHz, transcribes Vietnamese, then runs GuardianAI risk
analysis.

Example Windows setup:

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Get/prepare an OpenVINO Whisper model, for example an INT8 model, and set:

```powershell
$env:GUARDIAN_WHISPER_MODEL="C:\models\whisper-base-int8"
$env:GUARDIAN_DEVICE="CPU"
uvicorn main:app --host 0.0.0.0 --port 8787
```

For an Intel NPU/GPU, use a compatible OpenVINO device string and model.

Important: this analyzes a **user-selected recording file**. It does not covertly
capture the audio of a phone call. Android's `VOICE_CALL` capture source requires
a privileged permission unavailable to ordinary third-party apps.

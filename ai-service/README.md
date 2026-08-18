# GuardianAI Intel Edge AI

This optional service is the Intel/OpenVINO inference bridge.

## Run
```bash
cd ai-service
python -m venv .venv
# Windows:
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8787
```

Then POST JSON to `/analyze`.

The mobile app intentionally has a local fallback engine, so it can still
protect the user when the Intel service is offline.

## Real OpenVINO model
Train/export a scam classifier to ONNX or OpenVINO IR and wire it into
`main.py`. Do not pretend the current rule engine is a trained AI model.

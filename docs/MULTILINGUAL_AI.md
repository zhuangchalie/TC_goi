# GuardianAI multilingual scam detection (VI + EN)

GuardianAI now evaluates Vietnamese and English with the same scam concepts and risk weights.

## Supported languages
- Vietnamese (`vi`)
- English (`en`)
- Mixed Vietnamese/English (`mixed`)

## Speech
Whisper/OpenVINO is no longer hard-coded to Vietnamese. By default the call pipeline lets the speech model auto-detect language. Set `GUARDIAN_WHISPER_LANGUAGE=vi` or `en` only when a deployment needs forced language inference.

## Scam concepts mirrored across VI/EN
- OTP/password/verification code
- money transfer/payment/deposit
- account lock/suspension/verification pressure
- authority impersonation
- financial institution impersonation
- prize/reward/easy-money/investment lures
- urgency pressure
- remote-access/app installation requests
- legal intimidation
- suspicious/shortened URLs

The mobile engine and the AI service use the same policy weights so SMS and call analysis behave consistently.

## Important limitation
This release makes English detection genuinely supported by the deterministic/hybrid policy layer. It does **not** claim a trained multilingual neural scam classifier until such a model is trained and benchmarked on a documented dataset. Whisper language detection and English rule coverage are real; ML accuracy claims must be backed by measured evaluation.

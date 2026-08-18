# GuardianAI Intel — Scam Shield

Đây là bản nâng cấp từ demo Expo ban đầu thành một project Android có:

- SMS receiver: tự phân tích SMS khi tin nhắn đến.
- Notification cảnh báo nguy cơ.
- Call receiver: ghi nhận sau khi cuộc gọi kết thúc và cảnh báo khi thiếu dữ liệu/đầu số đáng ngờ.
- Scam score 0–100 + giải thích lý do.
- Local fallback engine để app vẫn chạy khi offline.
- Intel/OpenVINO Edge AI bridge tùy chọn cho PC/server Intel.
- UI GuardianAI hiển thị nhật ký cảnh báo.

## Chạy Android

> Expo Go không đủ để dùng SMS/call native. Hãy dùng development build.

```bash
npm install
npx expo prebuild
npx expo run:android
```

Hoặc:

```bash
npm run android
```

Cấp quyền SMS, Phone và Notifications khi Android hỏi.

## Chạy Intel/OpenVINO backend

```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8787
```

## Giới hạn quan trọng

Android không cho ứng dụng thông thường tự do thu âm/đọc audio của mọi cuộc gọi. Vì vậy bản này **không giả vờ có tính năng nghe lén cuộc gọi**. Call Shield ghi nhận sự kiện sau cuộc gọi và có thể nâng cấp sang phân tích transcript do người dùng cung cấp hoặc cơ chế được Android/thiết bị cho phép.

SMS permission cũng có thể bị Google Play hạn chế. APK nội bộ/development build phù hợp hơn cho prototype nghiên cứu.

## Đường nâng cấp production

1. Huấn luyện classifier scam/phishing thật và export ONNX/OpenVINO.
2. Thêm reputation service cho số điện thoại/domain.
3. Thêm URL sandbox/reputation.
4. Thêm transcript pipeline có consent.
5. Dùng calibration để giảm false positive.
6. Mã hóa lịch sử cục bộ và thêm cơ chế xóa dữ liệu.

## English scam detection

GuardianAI now supports English alongside Vietnamese for zero-touch text analysis and call transcripts. The same risk policy covers credential theft, money transfer requests, account threats, impersonation, urgency, remote-access requests, legal intimidation, and suspicious URLs. Whisper/OpenVINO call transcription is language-flexible instead of Vietnamese-only.

This is multilingual rule/hybrid detection, not a claimed trained multilingual ML classifier. Accuracy claims should only be added after a documented dataset benchmark.

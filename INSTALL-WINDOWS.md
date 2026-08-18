# Cài trên Windows

1. Giải nén project.
2. Mở thư mục bằng VS Code.
3. Cài Node.js LTS và Android Studio/SDK.
4. Mở Terminal:

```powershell
npm install
npx expo prebuild
npx expo run:android
```

Không dùng Expo Go cho SMS/Call native.

Nếu chỉ muốn xem giao diện, có thể `npx expo start`.

const { withAndroidManifest, withProjectBuildGradle, withAppBuildGradle } = require("@expo/config-plugins");

module.exports = function withGuardianNative(config) {
  config = withAndroidManifest(config, config => {
    const app = config.modResults.manifest.application?.[0];
    if (!app) return config;
    app.receiver = app.receiver || [];
    const exists = app.receiver.some(r => r.$?.["android:name"] === "expo.modules.guardianai.SmsReceiver");
    if (!exists) app.receiver.push({
      $: {
        "android:name": "expo.modules.guardianai.SmsReceiver",
        "android:exported": "true",
        "android:permission": "android.permission.BROADCAST_SMS"
      },
      "intent-filter": [{
        action: [
          { $: { "android:name": "android.provider.Telephony.SMS_RECEIVED" } }
        ],
        $: { "android:priority": "999" }
      }]
    });
    app.receiver.push({
      $: { "android:name": "expo.modules.guardianai.CallReceiver", "android:exported": "true" },
      "intent-filter": [{ action: [
        { $: { "android:name": "android.intent.action.PHONE_STATE" } }
      ]}]
    });
    return config;
  });
  return config;
};
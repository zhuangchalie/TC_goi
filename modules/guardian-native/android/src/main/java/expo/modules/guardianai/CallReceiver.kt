package expo.modules.guardianai

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.telephony.TelephonyManager

class CallReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action != TelephonyManager.ACTION_PHONE_STATE_CHANGED) return
    val state = intent.getStringExtra(TelephonyManager.EXTRA_STATE) ?: return
    if (state == TelephonyManager.EXTRA_STATE_IDLE) {
      val number = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER) ?: "Số không xác định"
      // Android does not reliably expose call audio to ordinary apps.
      // We therefore issue a post-call risk prompt based on the caller identity,
      // and the user can feed a transcript into the AI analyzer.
      val risk = if (number == "Số không xác định") 55 else 20
      val reasons = if (risk >= 50) listOf("Cuộc gọi từ số không xác định", "Hãy kiểm tra nội dung và không cung cấp OTP") else listOf("Chưa có tín hiệu nội dung cuộc gọi")
      GuardianStore.add(context, "call", number, "Cuộc gọi đã kết thúc. Hãy kiểm tra lại nội dung nếu người gọi yêu cầu tiền/OTP.", risk, reasons)
      if (risk >= 50) NotificationHelper.notifyHighRisk(context, number, risk, reasons)
    }
  }
}
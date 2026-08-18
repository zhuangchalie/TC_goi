package expo.modules.guardianai

import android.content.Context
import android.telephony.SmsManager

object FamilyAlert {
  fun sendSms(context: Context, phone: String, message: String) {
    if (androidx.core.content.ContextCompat.checkSelfPermission(
        context, android.Manifest.permission.SEND_SMS
      ) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
      throw SecurityException("SEND_SMS permission not granted")
    }
    SmsManager.getDefault().sendTextMessage(phone, null, message, null, null)
  }
}
package expo.modules.guardianai

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony

class SmsReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action != Telephony.Sms.Intents.SMS_RECEIVED_ACTION) return
    val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
    val body = messages.joinToString("") { it.messageBody ?: "" }
    val sender = messages.firstOrNull()?.displayOriginatingAddress ?: "Unknown"
    val risk = ScamEngine.analyze(body)
    GuardianStore.add(context, "sms", sender, body, risk.score, risk.reasons)
    if (risk.score >= 40) NotificationHelper.notifyHighRisk(context, sender, risk.score, risk.reasons)
  }
}
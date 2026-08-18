package expo.modules.guardianai

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat

object NotificationHelper {
  private const val CHANNEL = "guardian_alerts"
  fun notifyHighRisk(context: Context, sender: String, score: Int, reasons: List<String>) {
    val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    if (Build.VERSION.SDK_INT >= 26) manager.createNotificationChannel(
      NotificationChannel(CHANNEL, "GuardianAI cảnh báo", NotificationManager.IMPORTANCE_HIGH)
    )
    val text = reasons.take(3).joinToString(" • ")
    val n = NotificationCompat.Builder(context, CHANNEL)
      .setSmallIcon(android.R.drawable.ic_dialog_alert)
      .setContentTitle("🚨 GuardianAI: nguy cơ lừa đảo $score/100")
      .setContentText("$sender — $text")
      .setStyle(NotificationCompat.BigTextStyle().bigText("$sender\n$text"))
      .setPriority(NotificationCompat.PRIORITY_HIGH)
      .setAutoCancel(true)
      .build()
    manager.notify((System.currentTimeMillis() % Int.MAX_VALUE).toInt(), n)
  }
}
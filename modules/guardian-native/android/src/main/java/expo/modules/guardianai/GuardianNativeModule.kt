package expo.modules.guardianai

import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONArray
import org.json.JSONObject
import kotlin.math.min

class GuardianNativeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("GuardianNative")

    AsyncFunction("getEvents") { GuardianStore.getEvents(appContext.reactContext ?: throw Exception("Context unavailable")) }
    AsyncFunction("clearEvents") { GuardianStore.clear(appContext.reactContext ?: throw Exception("Context unavailable")) }

    AsyncFunction("analyzeText") { sender: String, text: String, type: String ->
      val context = appContext.reactContext ?: throw Exception("Context unavailable")
      val result = ScamEngine.analyze(text)
      GuardianStore.add(context, type, sender, text, result.score, result.reasons, result.language)
      if (result.score >= 70) NotificationHelper.notifyHighRisk(context, sender, result.score, result.reasons)
      "${result.score}/100 — ${result.label} [${result.language}]: ${result.reasons.joinToString(" • ")} | ${result.actions.joinToString(" • ")}"
    }

    AsyncFunction("alertFamily") { phone: String, message: String ->
      val context = appContext.reactContext ?: throw Exception("Context unavailable")
      FamilyAlert.sendSms(context, phone, message)
      "sent"
    }

    AsyncFunction("getEngineStatus") { "GuardianAI bilingual rules + OpenVINO bridge ready (VI/EN)" }
  }
}

data class Risk(val score: Int, val label: String, val reasons: List<String>, val actions: List<String>, val language: String)

object ScamEngine {
  private data class Rule(val regex: Regex, val points: Int, val vi: String, val en: String)
  private val rules = listOf(
    Rule(Regex("(\\botp\\b|mã otp|mật khẩu|password|passcode|verification code|security code|one[- ]time code|pin code|mã xác thực)", RegexOption.IGNORE_CASE),24,"Yêu cầu OTP/mật khẩu","Requests OTP/password"),
    Rule(Regex("(chuyển khoản|chuyển tiền|nạp tiền|thanh toán|đặt cọc|transfer money|wire transfer|send money|make a payment|pay a fee|deposit)", RegexOption.IGNORE_CASE),20,"Yêu cầu tiền/chuyển khoản","Requests money/transfer"),
    Rule(Regex("(tài khoản|account).{0,45}(khóa|đình chỉ|sắp khóa|xác minh|bị khóa|locked|suspended|will be closed|verify|verification)", RegexOption.IGNORE_CASE),14,"Đe dọa/ép xác minh tài khoản","Account threat/verification"),
    Rule(Regex("(công an|tòa án|viện kiểm sát|thuế|cơ quan chức năng|police|court|prosecutor|tax office|government agency|law enforcement)", RegexOption.IGNORE_CASE),16,"Có dấu hiệu giả danh cơ quan","Authority impersonation"),
    Rule(Regex("(ngân hàng|bank|banking|vietcombank|techcombank|mbbank|bidv|agribank|paypal|visa|mastercard)", RegexOption.IGNORE_CASE),8,"Nhắc tới tổ chức tài chính","Financial institution mentioned"),
    Rule(Regex("(trúng thưởng|quà tặng|nhận thưởng|việc nhẹ lương cao|đầu tư lợi nhuận|winner|prize|gift|reward|easy money|work from home|guaranteed profit|investment return)", RegexOption.IGNORE_CASE),15,"Mẫu dụ dỗ phổ biến","Common scam lure"),
    Rule(Regex("(gấp|ngay lập tức|trong hôm nay|khẩn cấp|5 phút|urgent|immediately|right now|within today|act now|within 5 minutes|last chance)", RegexOption.IGNORE_CASE),8,"Tạo áp lực thời gian","Urgency pressure"),
    Rule(Regex("(cài app|cài ứng dụng|app điều khiển|điều khiển từ xa|anydesk|teamviewer|remote access|install this app|screen sharing|remote desktop)", RegexOption.IGNORE_CASE),14,"Yêu cầu quyền điều khiển thiết bị","Remote-access request"),
    Rule(Regex("(bắt giữ|phạt tiền|khởi tố|tù|arrest|fine|prosecution|jail|warrant|legal action)", RegexOption.IGNORE_CASE),12,"Đe dọa pháp lý","Legal intimidation"),
    Rule(Regex("(http|https|www\\.)\\S+", RegexOption.IGNORE_CASE),12,"Có đường link cần kiểm tra","Suspicious link present"),
    Rule(Regex("(bit\\.ly|tinyurl\\.com|t\\.co|goo\\.gl|is\\.gd|cutt\\.ly)", RegexOption.IGNORE_CASE),12,"Có link rút gọn","Shortened link")
  )
  private fun language(text: String): String {
    val vi = Regex("[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]", RegexOption.IGNORE_CASE).findAll(text).count()
    val en = Regex("\\b(the|your|you|please|account|bank|password|code|transfer|money|verify|urgent|click|link|call|security|payment)\\b", RegexOption.IGNORE_CASE).findAll(text).count()
    return when { vi >= 2 && en >= 2 -> "mixed"; vi >= 1 -> "vi"; en >= 2 -> "en"; else -> "unknown" }
  }
  fun analyze(text: String): Risk {
    val lang = language(text); var score=0; val reasons=mutableListOf<String>()
    for (r in rules) if (r.regex.containsMatchIn(text)) { score += r.points; reasons.add(if (lang == "en") r.en else r.vi) }
    score=min(100,score)
    val label=if(score>=70) "SCAM" else if(score>=40) "SUSPICIOUS" else "SAFE"
    val actions=if(lang=="en") {
      if(label=="SCAM") listOf("Do not click links","Do not share OTP/password","Do not transfer money","Verify through an official channel")
      else if(label=="SUSPICIOUS") listOf("Check the sender","Do not share sensitive information","Verify through an official channel")
      else listOf("Stay alert for unusual requests")
    } else {
      if(label=="SCAM") listOf("Không bấm link","Không cung cấp OTP/mật khẩu","Không chuyển tiền","Xác minh bằng kênh chính thức")
      else if(label=="SUSPICIOUS") listOf("Kiểm tra người gửi","Không cung cấp dữ liệu nhạy cảm","Xác minh bằng kênh chính thức")
      else listOf("Vẫn cảnh giác với yêu cầu bất thường")
    }
    return Risk(score,label,if(reasons.isEmpty()) listOf(if(lang=="en") "No strong scam signals detected" else "Chưa phát hiện tín hiệu mạnh") else reasons,actions,lang)
  }
}

object GuardianStore {
  private const val PREF = "guardian_events"
  fun getEvents(context: Context): String = context.getSharedPreferences(PREF, 0).getString("events", "[]") ?: "[]"
  fun clear(context: Context) { context.getSharedPreferences(PREF, 0).edit().putString("events", "[]").apply() }
  fun add(context: Context, type: String, sender: String, text: String, score: Int, reasons: List<String>, language: String = "unknown") {
    val old = JSONArray(getEvents(context)); val next = JSONArray()
    val obj = JSONObject().apply {
      put("id", System.currentTimeMillis().toString()); put("type", type); put("sender", sender)
      put("text", text); put("score", score); put("label", if(score>=70) "SCAM" else if(score>=40) "SUSPICIOUS" else "SAFE")
      put("language", language); put("reasons", JSONArray(reasons)); put("timestamp", System.currentTimeMillis())
    }
    next.put(obj); for(i in 0 until min(old.length(),49)) next.put(old.getJSONObject(i))
    context.getSharedPreferences(PREF,0).edit().putString("events",next.toString()).apply()
  }
}

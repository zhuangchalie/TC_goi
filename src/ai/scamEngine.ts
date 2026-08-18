export type Language = "vi" | "en" | "mixed" | "unknown";
export type Risk = {
  score: number;
  reasons: string[];
  label: "SAFE" | "SUSPICIOUS" | "SCAM";
  actions: string[];
  signals: {name:string; points:number}[];
  language: Language;
};

type Rule = [RegExp, number, string, string];

// Bilingual rules intentionally mirror the same scam concepts and weights so
// English and Vietnamese messages are evaluated by the same risk policy.
const rules: Rule[] = [
  // Credentials / OTP
  [/(\botp\b|mã otp|mật khẩu|password|passcode|verification code|security code|one[- ]time code|pin code|mã xác thực)/i, 24, "Yêu cầu OTP/mật khẩu • Requests OTP/password", "Không cung cấp OTP/mật khẩu • Never share OTP/password"],
  // Money
  [/(chuyển khoản|chuyển tiền|nạp tiền|thanh toán|đặt cọc|transfer money|wire transfer|send money|make a payment|pay a fee|deposit)/i, 20, "Yêu cầu tiền/chuyển khoản • Requests money/transfer", "Không chuyển tiền • Do not transfer money"],
  // Account threat / verification
  [/(tài khoản|account).{0,45}(khóa|đình chỉ|sắp khóa|xác minh|bị khóa|locked|suspended|will be closed|verify|verification)/i, 14, "Đe dọa/ép xác minh tài khoản • Account threat/verification", "Tự kiểm tra qua kênh chính thức • Verify through an official channel"],
  // Authority impersonation
  [/(công an|tòa án|viện kiểm sát|thuế|cơ quan chức năng|police|court|prosecutor|tax office|government agency|law enforcement)/i, 16, "Có dấu hiệu giả danh cơ quan • Authority impersonation", "Không làm theo hướng dẫn qua cuộc gọi • Do not follow phone instructions"],
  // Financial institutions
  [/(ngân hàng|bank|banking|vietcombank|techcombank|mbbank|bidv|agribank|paypal|visa|mastercard)/i, 8, "Nhắc tới tổ chức tài chính • Financial institution mentioned", "Kiểm tra bằng kênh chính thức • Verify through the official channel"],
  // Bait / rewards / jobs / investment
  [/(trúng thưởng|quà tặng|nhận thưởng|việc nhẹ lương cao|đầu tư lợi nhuận|winner|prize|gift|reward|easy money|work from home|guaranteed profit|investment return)/i, 15, "Mẫu dụ dỗ phổ biến • Common scam lure", "Không nộp phí/đặt cọc • Do not pay fees or deposits"],
  // Urgency
  [/(gấp|ngay lập tức|trong hôm nay|khẩn cấp|5 phút|urgent|immediately|right now|within today|act now|within 5 minutes|last chance)/i, 8, "Tạo áp lực thời gian • Urgency pressure", "Dừng lại và kiểm tra • Stop and verify"],
  // Remote access / malware
  [/(cài app|cài ứng dụng|app điều khiển|điều khiển từ xa|anydesk|teamviewer|remote access|install this app|screen sharing|remote desktop)/i, 14, "Yêu cầu quyền điều khiển thiết bị • Remote-access request", "Không cài app/cho quyền điều khiển • Do not install or grant remote access"],
  // Threat / legal intimidation
  [/(bắt giữ|phạt tiền|khởi tố|tù|arrest|fine|prosecution|jail|warrant|legal action)/i, 12, "Đe dọa pháp lý • Legal intimidation", "Không chuyển tiền để 'giải quyết' • Do not pay to resolve the threat"],
  // Links
  [/(https?:\/\/|www\.)\S+/i, 12, "Có đường link cần kiểm tra • Suspicious link present", "Không mở link khi chưa xác minh • Do not open before verification"],
  [/(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly)/i, 12, "Có link rút gọn • Shortened link", "Mở tên miền chính thức • Use the official domain"],
];

function detectLanguage(text:string): Language {
  const vi = (text.match(/[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/gi)||[]).length;
  const en = (text.match(/\b(the|your|you|please|account|bank|password|code|transfer|money|verify|urgent|click|link|call|security|payment)\b/gi)||[]).length;
  if (vi >= 2 && en >= 2) return "mixed";
  if (vi >= 1) return "vi";
  if (en >= 2) return "en";
  return "unknown";
}

function urlRisk(text:string): number {
  let extra=0;
  const urls=text.match(/https?:\/\/\S+|www\.\S+/gi)||[];
  for(const u of urls){
    try{
      const normalized=u.startsWith("http")?u:`https://${u}`;
      const host=new URL(normalized).hostname.toLowerCase();
      if(host.includes("xn--")) extra+=10;
      if((host.match(/\./g)||[]).length>=3) extra+=5;
      if(/\d+\.\d+\.\d+\.\d+/.test(host)) extra+=10;
    }catch{ extra+=5; }
  }
  return Math.min(25,extra);
}

export function analyze(text: string, sender=""): Risk {
  const language=detectLanguage(text);
  let score=0; const reasons:string[]=[]; const signals:{name:string;points:number}[]=[];
  for(const [re,pts,bilingualReason] of rules){
    if(re.test(text)){ score+=pts; const reason=language==="en"?bilingualReason.split(" • ")[1]:(language==="vi"?bilingualReason.split(" • ")[0]:bilingualReason); reasons.push(reason); signals.push({name:reason,points:pts}); }
  }
  const ur=urlRisk(text);
  if(ur){score+=ur; reasons.push(language==="en"?"URL risk":"URL có đặc điểm cần kiểm tra"); signals.push({name:"URL risk",points:ur});}
  if(sender && /unknown|private|ẩn/i.test(sender)){score+=8; reasons.push(language==="en"?"Unknown sender":"Người gửi không xác định"); signals.push({name:"Unknown sender",points:8});}
  score=Math.min(100,score);
  const label=score>=70?"SCAM":score>=40?"SUSPICIOUS":"SAFE";
  const actions=language==="en"
    ? label==="SCAM" ? ["Do not click links","Do not share OTP/password","Do not transfer money","Verify through an official channel"]
      : label==="SUSPICIOUS" ? ["Check the sender","Do not share sensitive information","Verify through an official channel"]
      : ["Stay alert for unusual requests"]
    : label==="SCAM" ? ["Không bấm link","Không cung cấp OTP/mật khẩu","Không chuyển tiền","Gọi lại tổ chức bằng số chính thức"]
      : label==="SUSPICIOUS" ? ["Kiểm tra người gửi","Không cung cấp thông tin nhạy cảm","Xác minh qua kênh chính thức"]
      : ["Vẫn cảnh giác với yêu cầu bất thường"];
  return {score,reasons:reasons.length?reasons:[language==="en"?"No strong scam signals detected":"Chưa phát hiện tín hiệu mạnh"],label,actions,signals,language};
}

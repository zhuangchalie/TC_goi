import os, re, tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel

app=FastAPI(title="GuardianAI Intel Call AI",version="2.1-multilingual")

# Same bilingual concepts and weights as the mobile engine.
RULES=[
 (r"(\botp\b|mã otp|mật khẩu|password|passcode|verification code|security code|one[- ]time code|pin code|mã xác thực)",24,"Yêu cầu OTP/mật khẩu • Requests OTP/password"),
 (r"(chuyển khoản|chuyển tiền|nạp tiền|thanh toán|đặt cọc|transfer money|wire transfer|send money|make a payment|pay a fee|deposit)",20,"Yêu cầu tiền/chuyển khoản • Requests money/transfer"),
 (r"(tài khoản|account).{0,45}(khóa|đình chỉ|sắp khóa|xác minh|bị khóa|locked|suspended|will be closed|verify|verification)",14,"Đe dọa/ép xác minh tài khoản • Account threat/verification"),
 (r"(công an|tòa án|viện kiểm sát|thuế|cơ quan chức năng|police|court|prosecutor|tax office|government agency|law enforcement)",16,"Có dấu hiệu giả danh cơ quan • Authority impersonation"),
 (r"(ngân hàng|bank|banking|vietcombank|techcombank|mbbank|bidv|agribank|paypal|visa|mastercard)",8,"Nhắc tới tổ chức tài chính • Financial institution mentioned"),
 (r"(trúng thưởng|quà tặng|nhận thưởng|việc nhẹ lương cao|đầu tư lợi nhuận|winner|prize|gift|reward|easy money|work from home|guaranteed profit|investment return)",15,"Mẫu dụ dỗ phổ biến • Common scam lure"),
 (r"(gấp|ngay lập tức|trong hôm nay|khẩn cấp|5 phút|urgent|immediately|right now|within today|act now|within 5 minutes|last chance)",8,"Tạo áp lực thời gian • Urgency pressure"),
 (r"(cài app|cài ứng dụng|app điều khiển|điều khiển từ xa|anydesk|teamviewer|remote access|install this app|screen sharing|remote desktop)",14,"Yêu cầu quyền điều khiển thiết bị • Remote-access request"),
 (r"(bắt giữ|phạt tiền|khởi tố|tù|arrest|fine|prosecution|jail|warrant|legal action)",12,"Đe dọa pháp lý • Legal intimidation"),
 (r"(https?:\/\/|www\.)\S+",12,"Có đường link cần kiểm tra • Suspicious link present"),
 (r"(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly)",12,"Có link rút gọn • Shortened link"),
]

def detect_language(text):
    vi=len(re.findall(r"[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]", text or "", re.I))
    en=len(re.findall(r"\b(the|your|you|please|account|bank|password|code|transfer|money|verify|urgent|click|link|call|security|payment)\b", text or "", re.I))
    if vi>=2 and en>=2: return "mixed"
    if vi>=1: return "vi"
    if en>=2: return "en"
    return "unknown"

def pick_reason(reason, lang):
    parts=reason.split(" • ")
    return parts[1] if lang=="en" and len(parts)>1 else parts[0]

def score_text(text):
    lang=detect_language(text)
    score=0; reasons=[]
    for p,pts,r in RULES:
        if re.search(p,text or "",re.I): score+=pts; reasons.append(pick_reason(r,lang))
    score=min(100,score)
    label="SCAM" if score>=70 else "SUSPICIOUS" if score>=40 else "SAFE"
    if not reasons: reasons=["No strong scam signals detected" if lang=="en" else "Chưa phát hiện tín hiệu mạnh"]
    return score,label,reasons,lang

class TextReq(BaseModel):
    text:str
    sender:str=""

@app.get("/health")
def health():
    return {"ok":True,"engine":"GuardianAI","speech":"OpenVINO Whisper ready","languages":["vi","en"],"scam_detection":"bilingual"}

@app.post("/analyze")
def analyze(req:TextReq):
    score,label,reasons,language=score_text(req.text)
    return {"score":score,"label":label,"reasons":reasons,"language":language,"transcript":req.text}

@app.post("/analyze-call")
async def analyze_call(file:UploadFile=File(...)):
    suffix=os.path.splitext(file.filename or ".wav")[1] or ".wav"
    data=await file.read()
    if len(data)>50*1024*1024: raise HTTPException(413,"Audio too large")
    with tempfile.NamedTemporaryFile(delete=False,suffix=suffix) as f:
        f.write(data); path=f.name
    try:
        transcript,language=transcribe_openvino(path)
    except Exception as e:
        raise HTTPException(500,f"Whisper/OpenVINO is not ready: {e}")
    finally:
        try: os.remove(path)
        except: pass
    score,label,reasons,detected=score_text(transcript)
    # Prefer the transcript detector for final text classification, but expose
    # the speech model language hint as well for debugging/competition demos.
    return {"score":score,"label":label,"reasons":reasons,"language":detected,"speech_language":language,"transcript":transcript}

def transcribe_openvino(path):
    import librosa, openvino_genai
    wav,_=librosa.load(path,sr=16000,mono=True)
    model=os.environ.get("GUARDIAN_WHISPER_MODEL","whisper-base-int8")
    device=os.environ.get("GUARDIAN_DEVICE","CPU")
    pipe=openvino_genai.WhisperPipeline(model,device)
    # Do not hard-code Vietnamese. Whisper can auto-detect the language when
    # language/task controls are omitted; optionally force a language via env.
    lang=os.environ.get("GUARDIAN_WHISPER_LANGUAGE", "auto").lower()
    if lang in ("vi","en"):
        result=pipe.generate(wav.tolist(),max_new_tokens=512,language=f"<|{lang}|>",task="transcribe",return_timestamps=False)
        return str(result),lang
    result=pipe.generate(wav.tolist(),max_new_tokens=512,task="transcribe",return_timestamps=False)
    return str(result),"auto"

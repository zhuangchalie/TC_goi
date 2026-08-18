import React,{useState} from "react";
import {ActivityIndicator,Alert,Pressable,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import {GuardianNative} from "../src/native/GuardianNative";

const AI_URL="http://YOUR-PC-IP:8787";

export default function CallAI(){
 const [file,setFile]=useState<any>(null),[loading,setLoading]=useState(false),[result,setResult]=useState<any>(null),[phone,setPhone]=useState("");
 async function pick(){
   const r=await DocumentPicker.getDocumentAsync({type:["audio/*",".wav",".m4a",".mp3"],copyToCacheDirectory:true});
   if(!r.canceled)setFile(r.assets[0]);
 }
 async function analyze(){
   if(!file)return Alert.alert("Thiếu file","Hãy chọn file ghi âm cuộc gọi.");
   setLoading(true); setResult(null);
   try{
     const form=new FormData();
     form.append("file",{uri:file.uri,name:file.name||"call.m4a",type:file.mimeType||"audio/m4a"} as any);
     const res=await fetch(`${AI_URL}/analyze-call`,{method:"POST",body:form});
     if(!res.ok)throw new Error("AI server không phản hồi");
     const data=await res.json(); setResult(data);
     if(data.score>=70 && phone){
       await GuardianNative.alertFamily(phone,`🚨 GuardianAI cảnh báo: cuộc gọi có nguy cơ lừa đảo ${data.score}/100. ${data.reasons.slice(0,3).join(" • ")}`);
       Alert.alert("Đã cảnh báo","GuardianAI đã gửi cảnh báo cho người thân.");
     } else if(data.score>=70) Alert.alert("⚠️ Nguy cơ cao","Hãy cấu hình số người thân để gửi cảnh báo tự động.");
   }catch(e:any){Alert.alert("Không thể phân tích",e?.message||"Kiểm tra IP máy chạy AI service.");}
   finally{setLoading(false);}
 }
 return <ScrollView style={s.page} contentContainerStyle={s.c}>
  <Text style={s.h}>📞 Call AI Shield</Text>
  <Text style={s.p}>Chọn file ghi âm cuộc gọi đã được người dùng cho phép lưu. GuardianAI tự nhận diện tiếng Việt hoặc English, chuyển giọng nói → văn bản → phân tích dấu hiệu lừa đảo.</Text>
  <Pressable style={s.pick} onPress={pick}><Text style={s.pickT}>{file?`🎧 ${file.name}`:"🎧 CHỌN FILE GHI ÂM"}</Text></Pressable>
  <TextInput style={s.input} value={phone} onChangeText={setPhone} placeholder="SĐT người thân nhận cảnh báo" placeholderTextColor="#66839c" keyboardType="phone-pad"/>
  <Text style={s.note}>Chỉ gửi cảnh báo khi điểm nguy cơ ≥ 70/100. Bạn cần có sự đồng ý của người dùng trước khi gửi.</Text>
  <Pressable style={s.btn} onPress={analyze} disabled={loading}><Text style={s.bt}>{loading?"ĐANG PHÂN TÍCH...":"PHÂN TÍCH CUỘC GỌI"}</Text></Pressable>
  {loading&&<ActivityIndicator style={{marginTop:18}}/>}
  {result&&<View style={s.card}>
   <Text style={s.label}>RISK SCORE</Text><Text style={s.score}>{result.score}/100</Text>
   <Text style={s.tag}>{result.label}</Text>
   <Text style={s.h2}>Language</Text><Text style={s.trans}>{result.language || result.speech_language || "auto"}</Text><Text style={s.h2}>Lý do</Text>{result.reasons.map((x:string,i:number)=><Text key={i} style={s.reason}>• {x}</Text>)}
   <Text style={s.h2}>Transcript</Text><Text style={s.trans}>{result.transcript}</Text>
  </View>}
 </ScrollView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:"#07111f"},c:{padding:22,paddingTop:60,paddingBottom:40},h:{color:"#fff",fontSize:28,fontWeight:"900"},h2:{color:"#62d6ff",fontWeight:"900",marginTop:18,marginBottom:7},p:{color:"#9eb3c8",lineHeight:21,marginTop:8},pick:{padding:17,borderRadius:14,borderWidth:1,borderColor:"#1d5a73",backgroundColor:"#0b2030",marginTop:18,alignItems:"center"},pickT:{color:"#8fdcff",fontWeight:"900"},input:{backgroundColor:"#0b1d2d",borderWidth:1,borderColor:"#1b4057",borderRadius:14,padding:15,color:"#fff",marginTop:12},note:{color:"#70879a",fontSize:11,lineHeight:18,marginTop:10},btn:{backgroundColor:"#35bfe9",padding:16,borderRadius:13,alignItems:"center",marginTop:14},bt:{color:"#04111d",fontWeight:"900"},card:{backgroundColor:"#0b1827",borderColor:"#1d4961",borderWidth:1,borderRadius:16,padding:17,marginTop:20},label:{color:"#66839c",letterSpacing:2,fontSize:10},score:{color:"#ff5c7a",fontSize:38,fontWeight:"900",marginTop:3},tag:{color:"#ffbd5c",fontWeight:"900"},reason:{color:"#ffc76a",lineHeight:21},trans:{color:"#b7c8d5",lineHeight:20}})

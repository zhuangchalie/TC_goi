import React,{useState} from "react";
import {ScrollView,StyleSheet,Text,Switch,View} from "react-native";
export default function Settings(){
 const [sms,setSms]=useState(true),[call,setCall]=useState(true),[notify,setNotify]=useState(true);
 return <ScrollView style={s.p} contentContainerStyle={s.c}><Text style={s.h}>⚙️ Bảo vệ</Text>
 {[[sms,setSms,"SMS Shield","Phân tích SMS khi hệ thống gửi sự kiện"],[call,setCall,"Call Shield","Ghi nhận sự kiện sau cuộc gọi; không tự ý ghi âm"],[notify,setNotify,"Cảnh báo","Hiện notification cho rủi ro cao"]].map(([v,set,label,desc]:any)=>
 <View style={s.row}><View style={{flex:1}}><Text style={s.t}>{label}</Text><Text style={s.d}>{desc}</Text></View><Switch value={v} onValueChange={set}/></View>)}
 <Text style={s.note}>Mẹo: Android có thể yêu cầu quyền riêng biệt cho SMS, Phone và Notifications. Nếu tắt quyền hệ thống, GuardianAI không thể giám sát sự kiện tương ứng.</Text>
 </ScrollView>
}
const s=StyleSheet.create({p:{flex:1,backgroundColor:"#07111f"},c:{padding:22,paddingTop:60},h:{color:"#fff",fontSize:28,fontWeight:"900",marginBottom:20},row:{flexDirection:"row",padding:16,borderRadius:15,borderWidth:1,borderColor:"#17334a",backgroundColor:"#0b1827",marginBottom:10},t:{color:"#fff",fontWeight:"800",fontSize:16},d:{color:"#7f96a9",marginTop:4,lineHeight:18},note:{color:"#6f879a",lineHeight:21,marginTop:20}})

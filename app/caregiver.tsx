import React,{useState} from "react";
import {Alert,Pressable,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Caregiver(){
 const [contacts,setContacts]=useState(["",""]);
 const [threshold,setThreshold]=useState("85");
 async function save(){
  await AsyncStorage.setItem("guardian_config",JSON.stringify({contacts,threshold:Number(threshold)}));
  Alert.alert("Đã lưu","GuardianAI sẽ dùng cấu hình này cho cảnh báo tự động.");
 }
 return <ScrollView style={s.p} contentContainerStyle={s.c}>
  <Text style={s.h}>👨‍👩‍👧 Thiết lập người thân</Text>
  <Text style={s.sub}>Màn hình này dành cho người chăm sóc. Người lớn tuổi không cần thao tác sau khi thiết lập.</Text>
  {contacts.map((x,i)=><TextInput key={i} style={s.i} placeholder={`Số người thân ${i+1}`} placeholderTextColor="#68849a" keyboardType="phone-pad" value={x} onChangeText={v=>setContacts(a=>a.map((q,j)=>j===i?v:q))}/>)}
  <Text style={s.label}>Ngưỡng gửi cảnh báo người thân</Text>
  <TextInput style={s.i} keyboardType="number-pad" value={threshold} onChangeText={setThreshold}/>
  <Pressable style={s.btn} onPress={save}><Text style={s.bt}>LƯU CẤU HÌNH BẢO VỆ</Text></Pressable>
  <View style={s.card}><Text style={s.ct}>GuardianAI sẽ tự động</Text><Text style={s.p2}>• kiểm tra cuộc gọi đáng ngờ{`\n`}• phân tích SMS khi hệ thống cho phép{`\n`}• phân tích recording nếu thiết bị cung cấp recording đã được cho phép{`\n`}• cảnh báo người lớn tuổi bằng giao diện lớn{`\n`}• báo người thân khi vượt ngưỡng</Text></View>
 </ScrollView>
}
const s=StyleSheet.create({p:{flex:1,backgroundColor:"#07111f"},c:{padding:24,paddingTop:60},h:{fontSize:27,fontWeight:"900",color:"#fff"},sub:{color:"#91a7ba",lineHeight:21,marginTop:8},i:{backgroundColor:"#0b1d2d",borderColor:"#1c465c",borderWidth:1,borderRadius:13,padding:15,color:"#fff",marginTop:13},label:{color:"#8fdcff",fontWeight:"800",marginTop:18},btn:{backgroundColor:"#35bfe9",borderRadius:13,padding:16,alignItems:"center",marginTop:18},bt:{fontWeight:"900",color:"#04111d"},card:{backgroundColor:"#0b1827",borderWidth:1,borderColor:"#194a62",borderRadius:15,padding:17,marginTop:22},ct:{color:"#62d6ff",fontWeight:"900"},p2:{color:"#b1c3d1",lineHeight:23,marginTop:8}})

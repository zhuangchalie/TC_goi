import React,{useState} from "react";
import {ScrollView,StyleSheet,Text,TextInput,Pressable,View,Alert} from "react-native";
import {GuardianNative} from "../src/native/GuardianNative";

export default function Scan(){
 const [text,setText]=useState(""); const [sender,setSender]=useState(""); const [result,setResult]=useState<any>(null);
 async function run(){if(!text.trim())return; const raw=await GuardianNative.analyzeText(sender||"Manual",text,"manual"); setResult(raw); Alert.alert("GuardianAI",raw);}
 return <ScrollView style={s.page} contentContainerStyle={s.c}>
  <Text style={s.h}>🔍 Quét nội dung</Text>
  <Text style={s.p}>Dán SMS hoặc transcript cuộc gọi để GuardianAI đánh giá ngay.</Text>
  <TextInput style={s.input} placeholder="Số điện thoại / người gửi" placeholderTextColor="#66839c" value={sender} onChangeText={setSender}/>
  <TextInput style={[s.input,s.big]} placeholder="Dán nội dung đáng ngờ..." placeholderTextColor="#66839c" multiline value={text} onChangeText={setText}/>
  <Pressable style={s.btn} onPress={run}><Text style={s.bt}>PHÂN TÍCH NGAY</Text></Pressable>
  {result&&<View style={s.result}><Text style={s.rh}>KẾT QUẢ</Text><Text style={s.score}>{result}</Text><Text style={s.p}>Đây là kết quả của bộ phân tích hiện tại; luôn xác minh qua kênh chính thức.</Text></View>}
 </ScrollView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:"#07111f"},c:{padding:22,paddingTop:60},h:{color:"#fff",fontSize:27,fontWeight:"900",marginBottom:8},p:{color:"#9eb3c8",lineHeight:21},input:{backgroundColor:"#0b1d2d",borderWidth:1,borderColor:"#1b4057",borderRadius:14,padding:15,color:"#fff",marginTop:14},big:{height:180,textAlignVertical:"top"},btn:{backgroundColor:"#35bfe9",padding:16,borderRadius:13,alignItems:"center",marginTop:14},bt:{color:"#04111d",fontWeight:"900"},result:{backgroundColor:"#0b1827",borderColor:"#1d4961",borderWidth:1,borderRadius:15,padding:16,marginTop:18},rh:{color:"#62d6ff",fontWeight:"900",letterSpacing:2},score:{color:"#fff",fontSize:18,fontWeight:"800",marginTop:10}})

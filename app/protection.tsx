import React from "react";
import {ScrollView,StyleSheet,Text,View} from "react-native";
export default function Protection(){
 const items=[["🛡️","Bảo vệ nền","Đang hoạt động"],["📞","Cuộc gọi","Sàng lọc số đáng ngờ"],["📩","Tin nhắn","Phân tích khi Android cho phép"],["🎧","Audio AI","Tự lấy recording nếu thiết bị cung cấp"],["👨‍👩‍👧","Người thân","Tự động báo khi vượt ngưỡng"]];
 return <ScrollView style={s.p} contentContainerStyle={s.c}><Text style={s.h}>🛡️ GuardianAI đang bảo vệ</Text><Text style={s.sub}>Người lớn tuổi không cần thao tác trong quá trình bảo vệ.</Text>{items.map((x,i)=><View key={i} style={s.row}><Text style={s.icon}>{x[0]}</Text><View style={{flex:1}}><Text style={s.t}>{x[1]}</Text><Text style={s.d}>{x[2]}</Text></View><Text style={s.ok}>●</Text></View>)}</ScrollView>
}
const s=StyleSheet.create({p:{flex:1,backgroundColor:"#07111f"},c:{padding:22,paddingTop:60},h:{color:"#fff",fontSize:27,fontWeight:"900"},sub:{color:"#91a7ba",lineHeight:21,marginTop:8,marginBottom:20},row:{flexDirection:"row",alignItems:"center",backgroundColor:"#0b1827",borderColor:"#17384d",borderWidth:1,borderRadius:15,padding:16,marginBottom:10},icon:{fontSize:25,marginRight:14},t:{color:"#fff",fontWeight:"900"},d:{color:"#8199ab",marginTop:3},ok:{color:"#55d98a",fontSize:16}})

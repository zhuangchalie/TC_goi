import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function Privacy() {
  return <ScrollView style={s.page} contentContainerStyle={s.c}>
    <Text style={s.h}>Quyền riêng tư & an toàn</Text>
    <Text style={s.p}>GuardianAI ưu tiên xử lý cục bộ. Bản prototype không tự ý ghi âm cuộc gọi.</Text>
    <Text style={s.h2}>SMS</Text>
    <Text style={s.p}>Android có thể gửi sự kiện SMS đến bộ phân tích cục bộ khi người dùng cấp quyền.</Text>
    <Text style={s.h2}>AI</Text>
    <Text style={s.p}>OpenVINO là đường chạy suy luận tùy chọn. Bản demo hiện dùng bộ luật giải thích được; không tuyên bố đây là model ML đã benchmark.</Text>
    <Text style={s.h2}>Dữ liệu</Text>
    <Text style={s.p}>Lịch sử cảnh báo có thể xóa. Không dùng dữ liệu riêng tư để huấn luyện nếu chưa có sự đồng ý và ẩn danh.</Text>
  </ScrollView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:"#07111f"},c:{padding:24,paddingTop:60},h:{fontSize:25,fontWeight:"900",color:"#fff",marginBottom:18},h2:{fontSize:17,fontWeight:"800",color:"#62d6ff",marginTop:22},p:{color:"#a8bac9",fontSize:14,lineHeight:22}})

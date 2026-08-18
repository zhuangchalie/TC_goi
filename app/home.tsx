import React, { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { GuardianNative } from "../src/native/GuardianNative";

type Event = { id: string; type: string; sender: string; text: string; score: number; reasons: string[]; timestamp: number };

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [status, setStatus] = useState("Đang bảo vệ");

  async function refresh() {
    try {
      const raw = await GuardianNative.getEvents();
      setEvents(JSON.parse(raw || "[]"));
    } catch {}
  }

  useEffect(() => { refresh(); const t = setInterval(refresh, 1500); return () => clearInterval(t); }, []);

  const high = events.filter(x => x.score >= 70).length;

  return (
    <LinearGradient colors={["#07111f", "#0c1c31", "#07111f"]} style={s.page}>
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.top}>
          <View>
            <Text style={s.brand}>GUARDIAN<Text style={s.brandAccent}>AI</Text></Text>
            <Text style={s.sub}>INTEL SECURITY ENGINE</Text>
          </View>
          <View style={s.dot} />
        </View>

        <View style={s.hero}>
          <Text style={s.heroTitle}>{status}</Text>
          <Text style={s.heroText}>Giám sát tin nhắn và cuộc gọi đáng ngờ trên thiết bị Android.</Text>
          <View style={s.engineRow}>
            <View><Text style={s.kicker}>ENGINE</Text><Text style={s.value}>GuardianAI + OpenVINO Ready</Text></View>
            <View><Text style={s.kicker}>THREAT</Text><Text style={s.value}>{high} cảnh báo</Text></View>
          </View>
        </View>

        <Text style={s.section}>BẢO VỆ THỜI GIAN THỰC</Text>
        <View style={s.grid}>
          <Feature title="SMS Shield" text="Phân tích SMS ngay khi đến" ok />
          <Feature title="Call Shield" text="Cảnh báo sau cuộc gọi" ok />
          <Feature title="AI Explain" text="Giải thích lý do nghi ngờ" ok />
          <Feature title="Intel Edge" text="OpenVINO / Intel backend" ok />
        </View>

        <Pressable style={s.privacy} onPress={() => router.push("/privacy")}><Text style={s.privacyText}>🔒 Quyền riêng tư & cách GuardianAI hoạt động</Text></Pressable>

        <View style={s.navRow}><Pressable style={s.navBtn} onPress={()=>router.push("/call-ai")}><Text style={s.navText}>📞 PHÂN TÍCH CALL AI</Text></Pressable><Pressable style={s.navBtn} onPress={()=>router.push("/scan")}><Text style={s.navText}>🔍 QUÉT NỘI DUNG</Text></Pressable><Pressable style={s.navBtn} onPress={()=>router.push("/settings")}><Text style={s.navText}>⚙️ CÀI ĐẶT</Text></Pressable></View>
        <View style={s.actions}>
          <Pressable style={s.button} onPress={async () => {
            const demo = "NGAN HANG: Tai khoan cua ban se bi khoa. Vui long xac minh OTP tai https://example-login.com ngay.";
            const result = await GuardianNative.analyzeText("DEMO", demo, "sms");
            Alert.alert("GuardianAI", result);
            refresh();
          }}>
            <Text style={s.buttonText}>CHẠY DEMO AI</Text>
          </Pressable>
          <Pressable style={s.secondary} onPress={async () => {
            await GuardianNative.clearEvents(); refresh();
          }}>
            <Text style={s.secondaryText}>Xóa lịch sử</Text>
          </Pressable>
        </View>

        <Text style={s.section}>NHẬT KÝ CẢNH BÁO</Text>
        <FlatList
          data={events}
          scrollEnabled={false}
          keyExtractor={(x) => x.id}
          ListEmptyComponent={<Text style={s.empty}>Chưa có cảnh báo. Khi SMS/call đáng ngờ xuất hiện, GuardianAI sẽ ghi nhận tại đây.</Text>}
          renderItem={({ item }) => (
            <View style={s.card}>
              <View style={s.cardTop}>
                <Text style={s.cardTitle}>{item.type === "sms" ? "📩 SMS" : "📞 CALL"} · {item.sender}</Text>
                <Text style={[s.score, { color: item.score >= 80 ? "#ff5c7a" : item.score >= 50 ? "#ffbd5c" : "#6ee7b7" }]}>{item.score}/100</Text>
              </View>
              <Text style={s.cardText} numberOfLines={3}>{item.text}</Text>
              <Text style={s.reason}>{item.reasons.join(" • ")}</Text>
            </View>
          )}
        />

        <Text style={s.footer}>Bản demo nghiên cứu • Không thay thế hệ thống chống lừa đảo của nhà mạng/ngân hàng.</Text>
      </ScrollView>
    </LinearGradient>
  );
}

function Feature({title, text, ok}: {title:string;text:string;ok:boolean}) {
  return <View style={s.feature}><Text style={s.featureIcon}>{ok ? "✓" : "!"}</Text><View><Text style={s.featureTitle}>{title}</Text><Text style={s.featureText}>{text}</Text></View></View>
}

const s = StyleSheet.create({
  page:{flex:1}, content:{padding:20,paddingTop:64,paddingBottom:40},
  top:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:22},
  brand:{fontSize:27,fontWeight:"900",color:"#fff",letterSpacing:1},brandAccent:{color:"#62d6ff"},
  sub:{color:"#7891aa",fontSize:10,letterSpacing:2,marginTop:2},dot:{width:12,height:12,borderRadius:6,backgroundColor:"#39e58c",shadowOpacity:.8,shadowRadius:10},
  hero:{borderWidth:1,borderColor:"#1d4961",borderRadius:22,padding:20,backgroundColor:"#0b1d2d"},
  heroTitle:{color:"#6ee7b7",fontSize:22,fontWeight:"800"},heroText:{color:"#9eb3c8",lineHeight:21,marginTop:7},
  engineRow:{flexDirection:"row",justifyContent:"space-between",marginTop:20},kicker:{color:"#66839c",fontSize:9,letterSpacing:1.5},value:{color:"#e7f4ff",fontWeight:"700",marginTop:3},
  section:{color:"#66839c",fontSize:10,letterSpacing:2,marginTop:26,marginBottom:10,fontWeight:"700"},
  grid:{gap:9},feature:{backgroundColor:"#0b1827",borderWidth:1,borderColor:"#17334a",borderRadius:15,padding:14,flexDirection:"row",alignItems:"center"},
  featureIcon:{width:30,height:30,borderRadius:15,textAlign:"center",textAlignVertical:"center",backgroundColor:"#10382e",color:"#6ee7b7",fontWeight:"900",marginRight:12},
  featureTitle:{color:"#eaf6ff",fontWeight:"800"},featureText:{color:"#7e96aa",fontSize:12,marginTop:3},
  navRow:{flexDirection:"row",gap:9,marginTop:14},navBtn:{flex:1,padding:13,borderRadius:12,borderWidth:1,borderColor:"#194a62",backgroundColor:"#0a2030",alignItems:"center"},navText:{color:"#8fdcff",fontSize:11,fontWeight:"900"},privacy:{padding:13,borderRadius:12,backgroundColor:"#0a2030",borderWidth:1,borderColor:"#194a62",marginTop:16},privacyText:{color:"#8fdcff",textAlign:"center",fontSize:12,fontWeight:"700"},actions:{flexDirection:"row",gap:10,marginTop:12},button:{flex:1,backgroundColor:"#35bfe9",padding:15,borderRadius:13,alignItems:"center"},buttonText:{color:"#04111d",fontWeight:"900"},
  secondary:{padding:15,borderRadius:13,borderWidth:1,borderColor:"#254258",alignItems:"center"},secondaryText:{color:"#b8cad8"},
  card:{backgroundColor:"#0b1827",borderColor:"#17334a",borderWidth:1,borderRadius:15,padding:15,marginBottom:10},
  cardTop:{flexDirection:"row",justifyContent:"space-between"},cardTitle:{color:"#dff3ff",fontWeight:"800"},score:{fontWeight:"900"},
  cardText:{color:"#a7bac9",marginTop:9,lineHeight:19},reason:{color:"#ffbd5c",fontSize:11,marginTop:9},empty:{color:"#73899c",lineHeight:20},
  footer:{color:"#536a7d",fontSize:10,textAlign:"center",marginTop:28}
});
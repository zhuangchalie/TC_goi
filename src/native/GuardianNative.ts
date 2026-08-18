import { requireNativeModule } from "expo-modules-core";

export const GuardianNative = requireNativeModule<{
  getEvents(): Promise<string>;
  clearEvents(): Promise<void>;
  analyzeText(sender: string, text: string, type: string): Promise<string>;
  getEngineStatus(): Promise<string>;
  alertFamily(phone: string, message: string): Promise<string>;
}>("GuardianNative");
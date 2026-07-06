export type MessageRole = "user" | "model" | "system";

export interface ChatMessage {
  role: MessageRole;
  text: string;
}

export interface StadiumMetrics {
  totalAttendance: number;
  capacity: number;
  gateCongestion: {
    gateA: "Low" | "Medium" | "High";
    gateB: "Low" | "Medium" | "High";
    gateC: "Low" | "Medium" | "High";
  };
  temperature: number;
  activeIncidents: number;
}

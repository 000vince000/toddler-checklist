export interface Task {
  id: string;
  name: string;
  description: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  period: "morning" | "evening";
  spriteSheet: string; // path to sprite sheet
  status: 'checked' | 'unchecked' | 'pending';
}

export interface TaskStatus {
  id: string;
  date: string;
  status: 'checked' | 'unchecked' | 'pending';
} 
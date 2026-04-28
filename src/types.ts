export interface HistoryEntry {
  date: string;
  weight: number;
  reward: string;
}

export interface Profile {
  id: string;
  name: string;
  startWeight: number;
  finalGoal: number;
  current: number;
  foodList: string[];
  restaurantList: string[];
  history: HistoryEntry[];
}

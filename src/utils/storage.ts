import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, SavedLink, FocusSession, Target, PeriodicChallenge } from '../types';

const TASKS_KEY = 'notion-app-tasks';
const LINKS_KEY = 'notion-app-links';
const FOCUS_SESSIONS_KEY = 'notion-app-focus-sessions';
const ACHIEVEMENTS_KEY = 'notion-app-achievements';
const CURRENT_STREAK_KEY = 'notion-app-current-streak';
const TARGETS_KEY = 'notion-app-targets';
const PERIODIC_CHALLENGES_KEY = 'notion-app-periodic-challenges';

async function get<T>(key: string, fallback: T): Promise<T> {
  try {
    const v = await AsyncStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function set<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getTasks: () => get<Task[]>(TASKS_KEY, []),
  saveTasks: (tasks: Task[]) => set(TASKS_KEY, tasks),

  getLinks: () => get<SavedLink[]>(LINKS_KEY, []),
  saveLinks: (links: SavedLink[]) => set(LINKS_KEY, links),

  getFocusSessions: () => get<FocusSession[]>(FOCUS_SESSIONS_KEY, []),
  saveFocusSessions: (sessions: FocusSession[]) => set(FOCUS_SESSIONS_KEY, sessions),

  getUnlockedAchievements: () => get<string[]>(ACHIEVEMENTS_KEY, []),
  saveUnlockedAchievements: (ids: string[]) => set(ACHIEVEMENTS_KEY, ids),

  getCurrentStreak: async (): Promise<number> => {
    try {
      const v = await AsyncStorage.getItem(CURRENT_STREAK_KEY);
      return v ? parseInt(v, 10) : 0;
    } catch {
      return 0;
    }
  },
  saveCurrentStreak: (streak: number) => AsyncStorage.setItem(CURRENT_STREAK_KEY, String(streak)),

  getTargets: () => get<Target[]>(TARGETS_KEY, []),
  saveTargets: (targets: Target[]) => set(TARGETS_KEY, targets),

  getPeriodicChallenges: () => get<PeriodicChallenge[]>(PERIODIC_CHALLENGES_KEY, []),
  savePeriodicChallenges: (c: PeriodicChallenge[]) => set(PERIODIC_CHALLENGES_KEY, c),
};

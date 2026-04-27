import { Achievement, FocusSession } from '../types';
import { differenceInDays, startOfDay, isWithinInterval } from 'date-fns';

export const ACHIEVEMENTS: Achievement[] = [
  // Sessions Milestones
  {
    id: 'first-session',
    title: '🎯 Prima Sesiune',
    description: 'Completează prima sesiune de focus',
    icon: '🎯',
    category: 'sessions',
    condition: (sessions) => sessions.filter(s => s.completed).length >= 1,
    isUnlocked: false,
  },
  {
    id: 'sessions-5',
    title: '🔥 Focused Mind',
    description: 'Completează 5 sesiuni de focus',
    icon: '🔥',
    category: 'sessions',
    condition: (sessions) => sessions.filter(s => s.completed).length >= 5,
    isUnlocked: false,
  },
  {
    id: 'sessions-10',
    title: '⚡ Productivity Warrior',
    description: 'Completează 10 sesiuni de focus',
    icon: '⚡',
    category: 'sessions',
    condition: (sessions) => sessions.filter(s => s.completed).length >= 10,
    isUnlocked: false,
  },
  {
    id: 'sessions-25',
    title: '🌟 Focus Master',
    description: 'Completează 25 de sesiuni de focus',
    icon: '🌟',
    category: 'sessions',
    condition: (sessions) => sessions.filter(s => s.completed).length >= 25,
    isUnlocked: false,
  },
  {
    id: 'sessions-50',
    title: '👑 Focus Legend',
    description: 'Completează 50 de sesiuni de focus',
    icon: '👑',
    category: 'sessions',
    condition: (sessions) => sessions.filter(s => s.completed).length >= 50,
    isUnlocked: false,
  },
  {
    id: 'sessions-100',
    title: '🏆 Focus Champion',
    description: 'Completează 100 de sesiuni de focus',
    icon: '🏆',
    category: 'sessions',
    condition: (sessions) => sessions.filter(s => s.completed).length >= 100,
    isUnlocked: false,
  },
  
  // Time-based Achievements
  {
    id: 'time-1hour',
    title: '⏱️ Prima Oră',
    description: 'Acumulează 1 oră de focus time',
    icon: '⏱️',
    category: 'time',
    condition: (sessions) => {
      const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0);
      return totalSeconds >= 3600;
    },
    isUnlocked: false,
  },
  {
    id: 'time-10hours',
    title: '💪 Time Warrior',
    description: 'Acumulează 10 ore de focus time',
    icon: '💪',
    category: 'time',
    condition: (sessions) => {
      const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0);
      return totalSeconds >= 36000;
    },
    isUnlocked: false,
  },
  {
    id: 'time-25hours',
    title: '🎖️ Deep Focus',
    description: 'Acumulează 25 de ore de focus time',
    icon: '🎖️',
    category: 'time',
    condition: (sessions) => {
      const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0);
      return totalSeconds >= 90000;
    },
    isUnlocked: false,
  },
  {
    id: 'time-50hours',
    title: '💎 Diamond Focus',
    description: 'Acumulează 50 de ore de focus time',
    icon: '💎',
    category: 'time',
    condition: (sessions) => {
      const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0);
      return totalSeconds >= 180000;
    },
    isUnlocked: false,
  },
  {
    id: 'time-100hours',
    title: '🌠 Elite Focused',
    description: 'Acumulează 100 de ore de focus time',
    icon: '🌠',
    category: 'time',
    condition: (sessions) => {
      const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0);
      return totalSeconds >= 360000;
    },
    isUnlocked: false,
  },
  
  // Streak Achievements
  {
    id: 'streak-3',
    title: '🔗 Începător Consecvent',
    description: 'Focus timp de 3 zile consecutive',
    icon: '🔗',
    category: 'streak',
    condition: (sessions) => calculateStreak(sessions) >= 3,
    isUnlocked: false,
  },
  {
    id: 'streak-7',
    title: '📅 Weekly Warrior',
    description: 'Focus timp de 7 zile consecutive',
    icon: '📅',
    category: 'streak',
    condition: (sessions) => calculateStreak(sessions) >= 7,
    isUnlocked: false,
  },
  {
    id: 'streak-14',
    title: '🌙 Fortnight Focus',
    description: 'Focus timp de 14 zile consecutive',
    icon: '🌙',
    category: 'streak',
    condition: (sessions) => calculateStreak(sessions) >= 14,
    isUnlocked: false,
  },
  {
    id: 'streak-30',
    title: '🌈 Monthly Master',
    description: 'Focus timp de 30 de zile consecutive',
    icon: '🌈',
    category: 'streak',
    condition: (sessions) => calculateStreak(sessions) >= 30,
    isUnlocked: false,
  },
  
  // Special Achievements
  {
    id: 'special-night-owl',
    title: '🦉 Night Owl',
    description: 'Completează o sesiune între 22:00 și 04:00',
    icon: '🦉',
    category: 'special',
    condition: (sessions) => {
      return sessions.some(s => {
        const hour = new Date(s.startTime).getHours();
        return s.completed && (hour >= 22 || hour < 4);
      });
    },
    isUnlocked: false,
  },
  {
    id: 'special-early-bird',
    title: '🐦 Early Bird',
    description: 'Completează o sesiune între 05:00 și 07:00',
    icon: '🐦',
    category: 'special',
    condition: (sessions) => {
      return sessions.some(s => {
        const hour = new Date(s.startTime).getHours();
        return s.completed && hour >= 5 && hour < 7;
      });
    },
    isUnlocked: false,
  },
  {
    id: 'special-weekend',
    title: '🎮 Weekend Grinder',
    description: 'Completează 5 sesiuni în weekend',
    icon: '🎮',
    category: 'special',
    condition: (sessions) => {
      const weekendSessions = sessions.filter(s => {
        const day = new Date(s.startTime).getDay();
        return s.completed && (day === 0 || day === 6);
      });
      return weekendSessions.length >= 5;
    },
    isUnlocked: false,
  },
  {
    id: 'special-marathon',
    title: '🏃 Marathon Focus',
    description: 'Completează o sesiune de 60 de minute',
    icon: '🏃',
    category: 'special',
    condition: (sessions) => {
      return sessions.some(s => s.completed && s.duration >= 3600);
    },
    isUnlocked: false,
  },
];

// Calculate current streak
export function calculateStreak(sessions: FocusSession[]): number {
  if (sessions.length === 0) return 0;

  const completedSessions = sessions.filter(s => s.completed);
  if (completedSessions.length === 0) return 0;

  // Group sessions by date
  const sessionsByDate = new Map<string, FocusSession[]>();
  completedSessions.forEach(session => {
    const dateKey = startOfDay(new Date(session.startTime)).toISOString();
    if (!sessionsByDate.has(dateKey)) {
      sessionsByDate.set(dateKey, []);
    }
    sessionsByDate.get(dateKey)!.push(session);
  });

  // Sort dates in descending order
  const sortedDates = Array.from(sessionsByDate.keys())
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = startOfDay(new Date());
  const mostRecentDate = sortedDates[0];
  
  // Check if most recent session is today or yesterday
  const daysDiff = differenceInDays(today, mostRecentDate);
  if (daysDiff > 1) return 0;

  // Count consecutive days
  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = differenceInDays(sortedDates[i - 1], sortedDates[i]);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Check which achievements should be unlocked
export function checkAchievements(
  sessions: FocusSession[],
  unlockedIds: string[]
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  ACHIEVEMENTS.forEach(achievement => {
    if (!unlockedIds.includes(achievement.id) && achievement.condition(sessions)) {
      newlyUnlocked.push({
        ...achievement,
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      });
    }
  });

  return newlyUnlocked;
}

// Get all achievements with unlock status
export function getAllAchievements(unlockedIds: string[]): Achievement[] {
  return ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    isUnlocked: unlockedIds.includes(achievement.id),
  }));
}

// Get achievements by category
export function getAchievementsByCategory(
  category: Achievement['category'],
  unlockedIds: string[]
): Achievement[] {
  return getAllAchievements(unlockedIds).filter(a => a.category === category);
}

// Get progress percentage for all achievements
export function getOverallProgress(unlockedIds: string[]): number {
  return Math.round((unlockedIds.length / ACHIEVEMENTS.length) * 100);
}

import { PeriodicChallenge, FocusSession, Task } from '../types';
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, isAfter, isBefore } from 'date-fns';

// Default periodic challenges
export const DEFAULT_CHALLENGES: Omit<PeriodicChallenge, 'id' | 'currentValue' | 'startDate' | 'endDate' | 'isCompleted'>[] = [
  // Daily Challenges
  {
    title: '🌅 Early Bird',
    description: 'Completează 1 sesiune de focus azi',
    icon: '🌅',
    period: 'daily',
    targetType: 'focus-sessions',
    targetValue: 1,
  },
  {
    title: '📝 Task Master',
    description: 'Completează 5 task-uri azi',
    icon: '📝',
    period: 'daily',
    targetType: 'tasks',
    targetValue: 5,
  },
  {
    title: '⏰ Time Manager',
    description: 'Acumulează 2 ore de focus azi',
    icon: '⏰',
    period: 'daily',
    targetType: 'focus-hours',
    targetValue: 2,
  },
  
  // Weekly Challenges
  {
    title: '🎯 Weekly Focus',
    description: 'Completează 10 sesiuni în această săptămână',
    icon: '🎯',
    period: 'weekly',
    targetType: 'focus-sessions',
    targetValue: 10,
  },
  {
    title: '📋 Weekly Tasks',
    description: 'Completează 25 de task-uri în această săptămână',
    icon: '📋',
    period: 'weekly',
    targetType: 'tasks',
    targetValue: 25,
  },
  {
    title: '🕐 Weekly Hours',
    description: 'Acumulează 10 ore de focus în această săptămână',
    icon: '🕐',
    period: 'weekly',
    targetType: 'focus-hours',
    targetValue: 10,
  },
  
  // Monthly Challenges
  {
    title: '🏆 Monthly Champion',
    description: 'Completează 40 de sesiuni în această lună',
    icon: '🏆',
    period: 'monthly',
    targetType: 'focus-sessions',
    targetValue: 40,
  },
  {
    title: '💼 Monthly Productivity',
    description: 'Completează 100 de task-uri în această lună',
    icon: '💼',
    period: 'monthly',
    targetType: 'tasks',
    targetValue: 100,
  },
  {
    title: '⏳ Monthly Dedication',
    description: 'Acumulează 40 de ore de focus în această lună',
    icon: '⏳',
    period: 'monthly',
    targetType: 'focus-hours',
    targetValue: 40,
  },
];

// Get date range for period
export function getDateRangeForPeriod(period: 'daily' | 'weekly' | 'monthly'): { start: Date; end: Date } {
  const now = new Date();
  
  switch (period) {
    case 'daily':
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };
    case 'weekly':
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      };
    case 'monthly':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
  }
}

// Create or refresh challenges
export function initializeChallenges(existingChallenges: PeriodicChallenge[]): PeriodicChallenge[] {
  const now = new Date();
  const activeChallenges: PeriodicChallenge[] = [];

  DEFAULT_CHALLENGES.forEach(template => {
    const { start, end } = getDateRangeForPeriod(template.period);
    
    // Check if there's an existing active challenge
    const existing = existingChallenges.find(
      c => c.title === template.title && 
      isAfter(new Date(c.endDate), now) &&
      isBefore(new Date(c.startDate), end)
    );

    if (existing) {
      activeChallenges.push(existing);
    } else {
      // Create new challenge
      activeChallenges.push({
        id: Math.random().toString(36).substr(2, 9),
        ...template,
        currentValue: 0,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        isCompleted: false,
      });
    }
  });

  return activeChallenges;
}

// Update challenge progress
export function updateChallengeProgress(
  challenges: PeriodicChallenge[],
  sessions: FocusSession[],
  tasks: Task[]
): PeriodicChallenge[] {
  return challenges.map(challenge => {
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    let currentValue = 0;

    switch (challenge.targetType) {
      case 'focus-sessions':
        currentValue = sessions.filter(s => {
          const sessionDate = new Date(s.startTime);
          return s.completed && sessionDate >= startDate && sessionDate <= endDate;
        }).length;
        break;

      case 'focus-hours':
        const totalSeconds = sessions
          .filter(s => {
            const sessionDate = new Date(s.startTime);
            return s.completed && sessionDate >= startDate && sessionDate <= endDate;
          })
          .reduce((sum, s) => sum + s.duration, 0);
        currentValue = Math.floor(totalSeconds / 3600); // Convert to hours
        break;

      case 'tasks':
        currentValue = tasks.filter(t => {
          if (!t.createdAt) return false;
          const taskDate = new Date(t.createdAt);
          return t.status === 'completed' && taskDate >= startDate && taskDate <= endDate;
        }).length;
        break;
    }

    const isCompleted = currentValue >= challenge.targetValue;
    
    return {
      ...challenge,
      currentValue,
      isCompleted,
      completedAt: isCompleted && !challenge.completedAt ? new Date().toISOString() : challenge.completedAt,
    };
  });
}

// Clean up expired challenges
export function cleanupExpiredChallenges(challenges: PeriodicChallenge[]): PeriodicChallenge[] {
  const now = new Date();
  return challenges.filter(c => isAfter(new Date(c.endDate), now));
}

// Get challenges by period
export function getChallengesByPeriod(
  challenges: PeriodicChallenge[],
  period: 'daily' | 'weekly' | 'monthly'
): PeriodicChallenge[] {
  return challenges.filter(c => c.period === period);
}

// Calculate completion percentage
export function getChallengeProgress(challenge: PeriodicChallenge): number {
  return Math.min(Math.round((challenge.currentValue / challenge.targetValue) * 100), 100);
}

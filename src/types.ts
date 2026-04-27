export type TaskStatus = 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'not-important';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: string;
  tags: string[];
  files: TaskFile[];
  createdAt: string;
  isArchived: boolean;
  isTrashed: boolean;
  order?: number;
}

export interface TaskFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface SavedLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  createdAt: string;
  isArchived: boolean;
  isTrashed: boolean;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  duration: number;
  startTime: string;
  endTime: string;
  completed: boolean;
}

export interface ProductivityStats {
  totalFocusTime: number;
  completedSessions: number;
  totalSessions: number;
  sessionsThisWeek: FocusSession[];
  sessionsThisMonth: FocusSession[];
  sessionsThisYear: FocusSession[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'sessions' | 'time' | 'streak' | 'special';
  condition: (sessions: FocusSession[]) => boolean;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface AchievementUnlock {
  achievementId: string;
  unlockedAt: string;
}

export interface Target {
  id: string;
  type: 'tasks' | 'focus-hours' | 'focus-sessions';
  period: 'weekly' | 'monthly' | 'yearly';
  goal: number;
  current: number;
  startDate: string;
  endDate: string;
}

export interface PeriodicChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  period: 'daily' | 'weekly' | 'monthly';
  targetType: 'tasks' | 'focus-hours' | 'focus-sessions';
  targetValue: number;
  currentValue: number;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  completedAt?: string;
}

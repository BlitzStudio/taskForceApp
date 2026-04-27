import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Task, SavedLink, FocusSession, Target, PeriodicChallenge } from '../types';
import { storage } from '../utils/storage';
import { initializeChallenges, updateChallengeProgress, cleanupExpiredChallenges } from '../utils/periodicChallenges';

interface AppDataContextType {
  tasks: Task[];
  links: SavedLink[];
  sessions: FocusSession[];
  targets: Target[];
  challenges: PeriodicChallenge[];
  unlockedAchievements: string[];
  loading: boolean;

  addTask: (data: Omit<Task, 'id' | 'createdAt' | 'isArchived' | 'isTrashed'>) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  archiveTask: (id: string) => void;
  restoreTask: (id: string) => void;
  setStatus: (id: string, status: Task['status']) => void;

  addLink: (data: Omit<SavedLink, 'id' | 'createdAt' | 'isArchived' | 'isTrashed'>) => void;
  updateLink: (id: string, data: Partial<SavedLink>) => void;
  deleteLink: (id: string) => void;
  archiveLink: (id: string) => void;

  addSession: (s: FocusSession) => void;
  setUnlocked: (ids: string[]) => void;
  setTargets: (t: Target[]) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const newId = () => Math.random().toString(36).slice(2, 11);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [links, setLinks] = useState<SavedLink[]>([]);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [targets, setTargetsState] = useState<Target[]>([]);
  const [challenges, setChallenges] = useState<PeriodicChallenge[]>([]);
  const [unlockedAchievements, setUnlocked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [t, l, s, tg, ch, ua] = await Promise.all([
        storage.getTasks(),
        storage.getLinks(),
        storage.getFocusSessions(),
        storage.getTargets(),
        storage.getPeriodicChallenges(),
        storage.getUnlockedAchievements(),
      ]);
      setTasks(t);
      setLinks(l);
      setSessions(s);
      setTargetsState(tg);
      const fresh = initializeChallenges(cleanupExpiredChallenges(ch));
      setChallenges(updateChallengeProgress(fresh, s, t));
      setUnlocked(ua);
      setLoading(false);
    })();
  }, []);

  useEffect(() => { if (!loading) storage.saveTasks(tasks); }, [tasks, loading]);
  useEffect(() => { if (!loading) storage.saveLinks(links); }, [links, loading]);
  useEffect(() => { if (!loading) storage.saveFocusSessions(sessions); }, [sessions, loading]);
  useEffect(() => { if (!loading) storage.saveTargets(targets); }, [targets, loading]);
  useEffect(() => { if (!loading) storage.savePeriodicChallenges(challenges); }, [challenges, loading]);
  useEffect(() => { if (!loading) storage.saveUnlockedAchievements(unlockedAchievements); }, [unlockedAchievements, loading]);

  const addTask: AppDataContextType['addTask'] = useCallback((data) => {
    setTasks((prev) => [
      ...prev,
      { ...data, id: newId(), createdAt: new Date().toISOString(), isArchived: false, isTrashed: false },
    ]);
  }, []);

  const updateTask: AppDataContextType['updateTask'] = useCallback((id, data) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  }, []);

  const deleteTask: AppDataContextType['deleteTask'] = useCallback((id) => {
    setTasks((prev) => {
      const t = prev.find((x) => x.id === id);
      if (t?.isTrashed) return prev.filter((x) => x.id !== id);
      return prev.map((x) => (x.id === id ? { ...x, isTrashed: true, isArchived: false } : x));
    });
  }, []);

  const archiveTask: AppDataContextType['archiveTask'] = useCallback((id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isArchived: true, isTrashed: false } : t)));
  }, []);

  const restoreTask: AppDataContextType['restoreTask'] = useCallback((id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isArchived: false, isTrashed: false } : t)));
  }, []);

  const setStatus: AppDataContextType['setStatus'] = useCallback((id, status) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const addLink: AppDataContextType['addLink'] = useCallback((data) => {
    setLinks((prev) => [
      ...prev,
      { ...data, id: newId(), createdAt: new Date().toISOString(), isArchived: false, isTrashed: false },
    ]);
  }, []);

  const updateLink: AppDataContextType['updateLink'] = useCallback((id, data) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
  }, []);

  const deleteLink: AppDataContextType['deleteLink'] = useCallback((id) => {
    setLinks((prev) => {
      const l = prev.find((x) => x.id === id);
      if (l?.isTrashed) return prev.filter((x) => x.id !== id);
      return prev.map((x) => (x.id === id ? { ...x, isTrashed: true, isArchived: false } : x));
    });
  }, []);

  const archiveLink: AppDataContextType['archiveLink'] = useCallback((id) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, isArchived: true, isTrashed: false } : l)));
  }, []);

  const addSession = useCallback((s: FocusSession) => {
    setSessions((prev) => [...prev, s]);
  }, []);

  const setTargets = useCallback((t: Target[]) => setTargetsState(t), []);

  return (
    <AppDataContext.Provider
      value={{
        tasks, links, sessions, targets, challenges, unlockedAchievements, loading,
        addTask, updateTask, deleteTask, archiveTask, restoreTask, setStatus,
        addLink, updateLink, deleteLink, archiveLink,
        addSession, setUnlocked, setTargets,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}

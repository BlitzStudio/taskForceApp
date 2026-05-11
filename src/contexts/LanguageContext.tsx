import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'ro';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const STORAGE_KEY = 'taskforce-language';

// NOTE: Copy the FULL `translations` object from
// src/app/contexts/LanguageContext.tsx (web version) here.
// Only a sample subset is included below.
const translations: Record<Language, Record<string, string>> = {
  en: {
    'tasks.title': 'Tasks',
    'tasks.addTask': 'Add Task',
    'tasks.listView': 'List View',
    'tasks.boardView': 'Board View',
    'tasks.noTasks': 'No tasks yet',
    'tasks.getStarted': 'Get started by creating your first task',
    'taskModal.createTask': 'Create New Task',
    'taskModal.editTask': 'Edit Task',
    'taskModal.title': 'Title',
    'taskModal.titlePlaceholder': 'Enter task title',
    'taskModal.description': 'Description',
    'taskModal.status': 'Status',
    'taskModal.priority': 'Priority',
    'taskModal.deadline': 'Deadline',
    'taskModal.tags': 'Tags',
    'taskModal.cancel': 'Cancel',
    'taskModal.save': 'Save',
    'status.notStarted': 'Not Started',
    'status.inProgress': 'In Progress',
    'status.completed': 'Completed',
    'status.onHold': 'On Hold',
    'status.notImportant': 'Not Important',
    'priority.low': 'Low',
    'priority.medium': 'Medium',
    'priority.high': 'High',
    'calendar.title': 'Calendar',
    'focus.title': 'Focus Mode',
    'focus.start': 'Start',
    'focus.pause': 'Pause',
    'focus.resume': 'Resume',
    'focus.complete': 'Complete',
    'focus.cancel': 'Cancel',
    'targets.title': 'Targets & Goals',
    'targets.personalTargets': 'Personal Targets',
    'targets.periodicChallenges': 'Periodic Challenges',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.logout': 'Logout',
    'settings.account': 'Account',
    'archive.title': 'Archive',
    'trash.title': 'Trash Bin',
    'links.title': 'Saved Links',
  },
  ro: {
    'tasks.title': 'Sarcini',
    'tasks.addTask': 'Adaugă Sarcină',
    'tasks.listView': 'Listă',
    'tasks.boardView': 'Tablă',
    'tasks.noTasks': 'Încă nu ai sarcini',
    'tasks.getStarted': 'Începe prin a crea prima ta sarcină',
    'taskModal.createTask': 'Creează Sarcină Nouă',
    'taskModal.editTask': 'Editează Sarcina',
    'taskModal.title': 'Titlu',
    'taskModal.titlePlaceholder': 'Introdu titlul sarcinii',
    'taskModal.description': 'Descriere',
    'taskModal.status': 'Status',
    'taskModal.priority': 'Prioritate',
    'taskModal.deadline': 'Termen Limită',
    'taskModal.tags': 'Etichete',
    'taskModal.cancel': 'Anulează',
    'taskModal.save': 'Salvează',
    'status.notStarted': 'Neînceput',
    'status.inProgress': 'În Progres',
    'status.completed': 'Finalizat',
    'status.onHold': 'Pe Pauză',
    'status.notImportant': 'Neimportant',
    'priority.low': 'Scăzută',
    'priority.medium': 'Medie',
    'priority.high': 'Ridicată',
    'calendar.title': 'Calendar',
    'focus.title': 'Mod Focus',
    'focus.start': 'Pornește',
    'focus.pause': 'Pauză',
    'focus.resume': 'Reia',
    'focus.complete': 'Finalizează',
    'focus.cancel': 'Anulează',
    'targets.title': 'Obiective',
    'targets.personalTargets': 'Obiective Personale',
    'targets.periodicChallenges': 'Provocări Periodice',
    'settings.title': 'Setări',
    'settings.language': 'Limbă',
    'settings.theme': 'Temă',
    'settings.light': 'Luminos',
    'settings.dark': 'Întunecat',
    'settings.logout': 'Deconectare',
    'settings.account': 'Cont',
    'archive.title': 'Arhivă',
    'trash.title': 'Coș de Gunoi',
    'links.title': 'Link-uri Salvate',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === 'en' || v === 'ro') setLanguageState(v);
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang);
  };

  const t = (key: string) => translations[language][key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

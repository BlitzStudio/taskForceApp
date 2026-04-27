import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useAppData } from '../../src/contexts/AppDataContext';
import { FocusSession } from '../../src/types';
import { checkAchievements, calculateStreak, getAllAchievements } from '../../src/utils/achievements';
import { AchievementBadge } from '../../src/components/AchievementBadge';
import { spacing, radii } from '../../src/theme';

const TOTAL = 25 * 60;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function FocusScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { sessions, addSession, unlockedAchievements, setUnlocked } = useAppData();

  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(TOTAL);
  const startTimeRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            stop(true);
            return TOTAL;
          }
          return r - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  const start = () => {
    startTimeRef.current = new Date().toISOString();
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const stop = (completed: boolean) => {
    setRunning(false);
    const end = new Date();
    const startStr = startTimeRef.current ?? end.toISOString();
    const duration = completed ? TOTAL : Math.max(0, TOTAL - remaining);
    const session: FocusSession = {
      id: Math.random().toString(36).slice(2, 11),
      duration,
      startTime: startStr,
      endTime: end.toISOString(),
      completed,
    };
    addSession(session);
    const newUnlocks = checkAchievements([...sessions, session], unlockedAchievements);
    if (newUnlocks.length) {
      setUnlocked([...unlockedAchievements, ...newUnlocks.map((a) => a.id)]);
    }
    setRemaining(TOTAL);
    startTimeRef.current = null;
  };

  const completedCount = sessions.filter((s) => s.completed).length;
  const totalSec = sessions.reduce((sum, s) => sum + s.duration, 0);
  const streak = calculateStreak(sessions);
  const achievements = getAllAchievements(unlockedAchievements).slice(0, 6);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
      <View style={[styles.timerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.timer, { color: colors.text }]}>{fmt(remaining)}</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
          {!running ? (
            <Pressable onPress={start} style={[styles.btn, { backgroundColor: colors.primary }]}>
              <Text style={styles.btnText}>{t('focus.start')}</Text>
            </Pressable>
          ) : (
            <Pressable onPress={pause} style={[styles.btn, { backgroundColor: colors.warning }]}>
              <Text style={styles.btnText}>{t('focus.pause')}</Text>
            </Pressable>
          )}
          {(running || remaining < TOTAL) && (
            <Pressable onPress={() => stop(false)} style={[styles.btn, { backgroundColor: colors.danger }]}>
              <Text style={styles.btnText}>{t('focus.cancel')}</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Sessions" value={String(completedCount)} />
        <Stat label="Hours" value={(totalSec / 3600).toFixed(1)} />
        <Stat label="Streak" value={String(streak)} />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
        {achievements.map((a) => <AchievementBadge key={a.id} achievement={a} />)}
      </ScrollView>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.statValue, { color: colors.primary }]}>{value}</Text>
      <Text style={{ color: colors.textMuted, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timerCard: { padding: spacing.xl, borderRadius: radii.xl, borderWidth: 1, alignItems: 'center' },
  timer: { fontSize: 64, fontVariant: ['tabular-nums'] },
  btn: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radii.md },
  btnText: { color: '#fff', fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statCard: { flex: 1, padding: spacing.md, borderRadius: radii.lg, borderWidth: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 24, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
});

import { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAppData } from '../../src/contexts/AppDataContext';
import { TaskRow } from '../../src/components/TaskRow';
import { spacing, radii } from '../../src/theme';

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function daysInMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }
function ymd(d: Date) { return d.toISOString().slice(0, 10); }

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { tasks } = useAppData();

  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(ymd(new Date()));

  const grid = useMemo(() => {
    const first = startOfMonth(cursor);
    const startDay = (first.getDay() + 6) % 7; // monday-first
    const total = daysInMonth(cursor);
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    return cells;
  }, [cursor]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => {
      if (t.deadline && !t.isTrashed && !t.isArchived) {
        const k = t.deadline.slice(0, 10);
        map[k] = (map[k] || 0) + 1;
      }
    });
    return map;
  }, [tasks]);

  const dayTasks = tasks.filter((t) => t.deadline?.slice(0, 10) === selected && !t.isTrashed && !t.isArchived);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
          <Text style={{ color: colors.primary, fontSize: 18 }}>‹</Text>
        </Pressable>
        <Text style={[styles.month, { color: colors.text }]}>
          {cursor.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <Pressable onPress={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
          <Text style={{ color: colors.primary, fontSize: 18 }}>›</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <Text key={i} style={[styles.dow, { color: colors.textMuted }]}>{d}</Text>
        ))}
        {grid.map((d, i) => {
          if (!d) return <View key={i} style={styles.cell} />;
          const k = ymd(d);
          const isSel = k === selected;
          const count = tasksByDate[k] ?? 0;
          return (
            <Pressable
              key={i}
              onPress={() => setSelected(k)}
              style={[
                styles.cell,
                { borderColor: colors.border },
                isSel && { backgroundColor: colors.primary },
              ]}
            >
              <Text style={{ color: isSel ? '#fff' : colors.text }}>{d.getDate()}</Text>
              {count > 0 && <View style={[styles.dot, { backgroundColor: isSel ? '#fff' : colors.primary }]} />}
            </Pressable>
          );
        })}
      </View>

      <View style={{ padding: spacing.md, gap: spacing.sm }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{selected}</Text>
        {dayTasks.length === 0 ? (
          <Text style={{ color: colors.textMuted }}>No tasks</Text>
        ) : (
          dayTasks.map((t) => (
            <TaskRow key={t.id} task={t} onPress={() => {}} onToggleComplete={() => {}} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1 },
  month: { fontSize: 16, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.sm },
  dow: { width: `${100 / 7}%`, textAlign: 'center', paddingVertical: spacing.xs, fontSize: 11 },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radii.sm, gap: 2 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginTop: spacing.sm },
});

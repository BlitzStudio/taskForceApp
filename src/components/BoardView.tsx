import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskStatus } from '../types';
import { TaskRow } from './TaskRow';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { STATUS_COLORS, radii, spacing } from '../theme';

const COLUMNS: TaskStatus[] = ['not-started', 'in-progress', 'completed', 'on-hold', 'not-important'];

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function BoardView({ tasks, onEdit, onToggleComplete, onAddTask }: Props) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  function camel(s: string) { return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase()); }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
      {COLUMNS.map((status) => {
        const items = tasks.filter((tk) => tk.status === status);
        return (
          <View
            key={status}
            style={[styles.col, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
          >
            <View style={styles.colHeader}>
              <View style={[styles.dot, { backgroundColor: STATUS_COLORS[status] }]} />
              <Text style={[styles.colTitle, { color: colors.text }]}>
                {t(`status.${camel(status)}`)}
              </Text>
              <Text style={[styles.count, { color: colors.textMuted }]}>{items.length}</Text>
              <Pressable onPress={() => onAddTask(status)} hitSlop={8} style={{ marginLeft: 'auto' }}>
                <Ionicons name="add" size={18} color={colors.textMuted} />
              </Pressable>
            </View>
            <ScrollView style={{ flex: 1 }}>
              {items.map((tk) => (
                <TaskRow key={tk.id} task={tk} onPress={onEdit} onToggleComplete={onToggleComplete} />
              ))}
              {items.length === 0 && (
                <Text style={{ color: colors.textSubtle, fontSize: 12, padding: spacing.md, textAlign: 'center' }}>—</Text>
              )}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  col: { width: 280, borderRadius: radii.lg, borderWidth: 1, padding: spacing.md, height: '100%' },
  colHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.md },
  colTitle: { fontWeight: '600', fontSize: 14 },
  count: { fontSize: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

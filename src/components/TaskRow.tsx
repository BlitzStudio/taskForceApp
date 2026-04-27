import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { STATUS_COLORS, PRIORITY_COLORS, radii, spacing } from '../theme';

interface Props {
  task: Task;
  onPress: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onLongPress?: (task: Task) => void;
}

export function TaskRow({ task, onPress, onToggleComplete, onLongPress }: Props) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const isDone = task.status === 'completed';

  return (
    <Pressable
      onPress={() => onPress(task)}
      onLongPress={() => onLongPress?.(task)}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <Pressable
        onPress={() => onToggleComplete(task)}
        hitSlop={8}
        style={[styles.checkbox, { borderColor: isDone ? colors.success : colors.borderStrong, backgroundColor: isDone ? colors.success : 'transparent' }]}
      >
        {isDone && <Ionicons name="checkmark" size={14} color="#fff" />}
      </Pressable>

      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            { color: colors.text },
            isDone && { textDecorationLine: 'line-through', color: colors.textMuted },
          ]}
        >
          {task.title}
        </Text>
        <View style={styles.metaRow}>
          <View style={[styles.pill, { backgroundColor: STATUS_COLORS[task.status] + '22' }]}>
            <View style={[styles.dot, { backgroundColor: STATUS_COLORS[task.status] }]} />
            <Text style={[styles.pillText, { color: STATUS_COLORS[task.status] }]}>
              {t(`status.${camel(task.status)}`)}
            </Text>
          </View>
          <View style={[styles.pill, { backgroundColor: PRIORITY_COLORS[task.priority] + '22' }]}>
            <Text style={[styles.pillText, { color: PRIORITY_COLORS[task.priority] }]}>
              {t(`priority.${task.priority}`)}
            </Text>
          </View>
          {task.deadline && (
            <Text style={[styles.deadline, { color: colors.textMuted }]}>
              {new Date(task.deadline).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

function camel(s: string) {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  title: { fontSize: 15, fontWeight: '500' },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radii.pill },
  pillText: { fontSize: 11, fontWeight: '600' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  deadline: { fontSize: 11 },
});

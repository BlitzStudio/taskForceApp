import { useEffect, useState } from 'react';
import {
  Modal, View, Text, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Task, TaskStatus, TaskPriority } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { radii, spacing, STATUS_COLORS, PRIORITY_COLORS } from '../theme';

const STATUSES: TaskStatus[] = ['not-started', 'in-progress', 'completed', 'on-hold', 'not-important'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Omit<Task, 'id' | 'createdAt' | 'isArchived' | 'isTrashed'>) => void;
  task?: Task;
  mode: 'create' | 'edit';
}

export function TaskModal({ visible, onClose, onSave, task, mode }: Props) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('not-started');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [deadline, setDeadline] = useState('');
  const [tagsRaw, setTagsRaw] = useState('');

  useEffect(() => {
    if (visible) {
      setTitle(task?.title ?? '');
      setDescription(task?.description ?? '');
      setStatus(task?.status ?? 'not-started');
      setPriority(task?.priority ?? 'medium');
      setDeadline(task?.deadline ?? '');
      setTagsRaw(task?.tags?.join(', ') ?? '');
    }
  }, [visible, task]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      deadline: deadline.trim() || undefined,
      tags: tagsRaw.split(',').map((s) => s.trim()).filter(Boolean),
      files: task?.files ?? [],
      order: task?.order,
    });
    onClose();
  };

  function camel(s: string) { return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase()); }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {mode === 'create' ? t('taskModal.createTask') : t('taskModal.editTask')}
            </Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={{ color: colors.textMuted, fontSize: 18 }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
            <Field label={t('taskModal.title')}>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder={t('taskModal.titlePlaceholder')}
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}
              />
            </Field>

            <Field label={t('taskModal.description')}>
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.textMuted}
                style={[styles.input, styles.multiline, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}
              />
            </Field>

            <Field label={t('taskModal.status')}>
              <View style={styles.chipsRow}>
                {STATUSES.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => setStatus(s)}
                    style={[
                      styles.chip,
                      { borderColor: colors.border },
                      status === s && { backgroundColor: STATUS_COLORS[s] + '22', borderColor: STATUS_COLORS[s] },
                    ]}
                  >
                    <Text style={{ color: status === s ? STATUS_COLORS[s] : colors.textMuted, fontSize: 12 }}>
                      {t(`status.${camel(s)}`)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Field>

            <Field label={t('taskModal.priority')}>
              <View style={styles.chipsRow}>
                {PRIORITIES.map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => setPriority(p)}
                    style={[
                      styles.chip,
                      { borderColor: colors.border },
                      priority === p && { backgroundColor: PRIORITY_COLORS[p] + '22', borderColor: PRIORITY_COLORS[p] },
                    ]}
                  >
                    <Text style={{ color: priority === p ? PRIORITY_COLORS[p] : colors.textMuted, fontSize: 12 }}>
                      {t(`priority.${p}`)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Field>

            <Field label={t('taskModal.deadline') + ' (YYYY-MM-DD)'}>
              <TextInput
                value={deadline}
                onChangeText={setDeadline}
                placeholder="2026-12-31"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}
              />
            </Field>

            <Field label={t('taskModal.tags')}>
              <TextInput
                value={tagsRaw}
                onChangeText={setTagsRaw}
                placeholder="work, urgent"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}
              />
            </Field>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Pressable onPress={onClose} style={[styles.btn, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={{ color: colors.text }}>{t('taskModal.cancel')}</Text>
            </Pressable>
            <Pressable onPress={handleSave} style={[styles.btn, { backgroundColor: colors.primary }]}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>{t('taskModal.save')}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600' }}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { maxHeight: '90%', borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: 14 },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.pill, borderWidth: 1 },
  footer: { flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, borderTopWidth: 1 },
  btn: { flex: 1, paddingVertical: spacing.md, borderRadius: radii.md, alignItems: 'center' },
});

import { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useAppData } from '../../src/contexts/AppDataContext';
import { TaskRow } from '../../src/components/TaskRow';
import { TaskModal } from '../../src/components/TaskModal';
import { BoardView } from '../../src/components/BoardView';
import { FloatingAddButton } from '../../src/components/FloatingAddButton';
import { SearchBar } from '../../src/components/SearchBar';
import { Task, TaskStatus } from '../../src/types';
import { spacing, radii } from '../../src/theme';

type ViewMode = 'list' | 'board';

export default function TasksScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { tasks, addTask, updateTask, setStatus } = useAppData();

  const [search, setSearch] = useState('');
  const [view, setView] = useState<ViewMode>('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<Task | undefined>();
  const [initialStatus, setInitialStatus] = useState<TaskStatus>('not-started');

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    return tasks.filter(
      (tk) =>
        !tk.isArchived && !tk.isTrashed &&
        (tk.title.toLowerCase().includes(q) ||
          tk.description?.toLowerCase().includes(q) ||
          tk.tags.some((g) => g.toLowerCase().includes(q))),
    );
  }, [tasks, search]);

  const openCreate = (status: TaskStatus = 'not-started') => {
    setMode('create');
    setSelected(undefined);
    setInitialStatus(status);
    setModalOpen(true);
  };
  const openEdit = (task: Task) => {
    setMode('edit');
    setSelected(task);
    setModalOpen(true);
  };
  const onSave = (data: Omit<Task, 'id' | 'createdAt' | 'isArchived' | 'isTrashed'>) => {
    if (mode === 'create') addTask(data);
    else if (selected) updateTask(selected.id, data);
  };
  const onToggleComplete = (task: Task) => {
    setStatus(task.id, task.status === 'completed' ? 'not-started' : 'completed');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.toolbar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <SearchBar value={search} onChange={setSearch} placeholder={t('tasks.title') + '...'} />
        <View style={[styles.toggle, { backgroundColor: colors.surfaceAlt }]}>
          {(['list', 'board'] as ViewMode[]).map((v) => (
            <Pressable
              key={v}
              onPress={() => setView(v)}
              style={[
                styles.toggleBtn,
                view === v && { backgroundColor: colors.surface },
              ]}
            >
              <Text style={{ color: view === v ? colors.text : colors.textMuted, fontSize: 13 }}>
                {v === 'list' ? t('tasks.listView') : t('tasks.boardView')}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {view === 'list' ? (
        visible.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('tasks.noTasks')}</Text>
            <Text style={{ color: colors.textMuted }}>{t('tasks.getStarted')}</Text>
          </View>
        ) : (
          <FlatList
            data={visible}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: spacing.md, paddingBottom: 96 }}
            renderItem={({ item }) => (
              <TaskRow task={item} onPress={openEdit} onToggleComplete={onToggleComplete} />
            )}
          />
        )
      ) : (
        <BoardView
          tasks={visible}
          onEdit={openEdit}
          onToggleComplete={onToggleComplete}
          onAddTask={openCreate}
        />
      )}

      <FloatingAddButton onPress={() => openCreate(initialStatus)} />

      <TaskModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
        task={selected ?? (mode === 'create' ? ({
          id: '', title: '', status: initialStatus, priority: 'medium',
          tags: [], files: [], createdAt: '', isArchived: false, isTrashed: false,
        } as Task) : undefined)}
        mode={mode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toolbar: { gap: spacing.sm, padding: spacing.md, borderBottomWidth: 1 },
  toggle: { flexDirection: 'row', borderRadius: radii.md, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radii.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '600' },
});

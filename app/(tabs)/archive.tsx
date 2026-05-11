import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useAppData } from '../../src/contexts/AppDataContext';
import { TaskRow } from '../../src/components/TaskRow';
import { spacing } from '../../src/theme';

export default function ArchiveScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { tasks, restoreTask, setStatus } = useAppData();

  const archived = tasks.filter((tk) => tk.isArchived && !tk.isTrashed);

  

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {archived.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.textMuted }}>No archived items</Text>
        </View>
      ) : (
        <FlatList
          data={archived}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.md }}
          renderItem={({ item }) => (
            <TaskRow
              task={item}
              onPress={() => restoreTask(item.id)}
              onToggleComplete={(t) => setStatus(t.id, t.status === 'completed' ? 'not-started' : 'completed')}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

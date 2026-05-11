import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAppData } from '../../src/contexts/AppDataContext';
import { TaskRow } from '../../src/components/TaskRow';
import { spacing, radii } from '../../src/theme';

export default function TrashScreen() {
  const { colors } = useTheme();
  const { tasks, deleteTask, restoreTask } = useAppData();

  const trashed = tasks.filter((tk) => tk.isTrashed);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {trashed.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.textMuted }}>Trash is empty</Text>
        </View>
      ) : (
        <FlatList
          data={trashed}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
          renderItem={({ item }) => (
            <View>
              <TaskRow task={item} onPress={() => restoreTask(item.id)} onToggleComplete={() => {}} />
              <Pressable
                onPress={() =>
                  Alert.alert('Delete permanently?', '', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => deleteTask(item.id) },
                  ])
                }
                style={[styles.deleteBtn, { backgroundColor: colors.danger + '22' }]}
              >
                <Text style={{ color: colors.danger, fontSize: 12, fontWeight: '600' }}>Delete forever</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  deleteBtn: { padding: spacing.sm, borderRadius: radii.sm, alignItems: 'center', marginTop: -spacing.xs, marginBottom: spacing.sm },
});

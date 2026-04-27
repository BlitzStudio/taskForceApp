import { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Modal, TextInput, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAppData } from '../src/contexts/AppDataContext';
import { FloatingAddButton } from '../src/components/FloatingAddButton';
import { spacing, radii } from '../src/theme';

export default function LinksScreen() {
  const { colors } = useTheme();
  const { links, addLink, deleteLink } = useAppData();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');

  const visible = links.filter((l) => !l.isArchived && !l.isTrashed);

  const onSave = () => {
    if (!title.trim() || !url.trim()) return;
    addLink({
      title: title.trim(),
      url: url.trim(),
      description: desc.trim() || undefined,
      tags: [],
    });
    setTitle(''); setUrl(''); setDesc('');
    setOpen(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {visible.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.textMuted }}>No saved links yet</Text>
        </View>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.md, paddingBottom: 96 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => Linking.openURL(item.url)}
              onLongPress={() => deleteLink(item.id)}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Ionicons name="link" size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.url, { color: colors.textMuted }]} numberOfLines={1}>{item.url}</Text>
              </View>
            </Pressable>
          )}
        />
      )}

      <FloatingAddButton onPress={() => setOpen(true)} />

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.backdrop}>
          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>New Link</Text>
            <TextInput placeholder="Title" placeholderTextColor={colors.textMuted} value={title} onChangeText={setTitle} style={[styles.input, { color: colors.text, borderColor: colors.border }]} />
            <TextInput placeholder="https://..." placeholderTextColor={colors.textMuted} value={url} onChangeText={setUrl} autoCapitalize="none" style={[styles.input, { color: colors.text, borderColor: colors.border }]} />
            <TextInput placeholder="Description" placeholderTextColor={colors.textMuted} value={desc} onChangeText={setDesc} multiline style={[styles.input, { color: colors.text, borderColor: colors.border, minHeight: 70 }]} />
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Pressable onPress={() => setOpen(false)} style={[styles.btn, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={{ color: colors.text }}>Cancel</Text>
              </Pressable>
              <Pressable onPress={onSave} style={[styles.btn, { backgroundColor: colors.primary }]}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: radii.md, borderWidth: 1, marginBottom: spacing.sm },
  title: { fontSize: 14, fontWeight: '600' },
  url: { fontSize: 12 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { padding: spacing.lg, gap: spacing.md, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl },
  sheetTitle: { fontSize: 18, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: radii.md, padding: spacing.md, fontSize: 14 },
  btn: { flex: 1, padding: spacing.md, borderRadius: radii.md, alignItems: 'center' },
});

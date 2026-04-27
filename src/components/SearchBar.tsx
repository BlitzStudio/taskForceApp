import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { radii, spacing } from '../theme';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
      <Ionicons name="search" size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { color: colors.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  input: { flex: 1, paddingVertical: 4 },
});

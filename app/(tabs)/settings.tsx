import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useLanguage } from '../../src/contexts/LanguageContext';

import { spacing, radii } from '../../src/theme';
import { useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();


  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;





  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>

      <Section title={t('settings.language')}>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {(['en', 'ro'] as const).map((l) => (
            <Pressable
              key={l}
              onPress={() => setLanguage(l)}
              style={[
                styles.langBtn,
                { borderColor: colors.border, backgroundColor: colors.surface },
                language === l && { borderColor: colors.primary, backgroundColor: colors.primary + '22' },
              ]}
            >
              <Text style={{ color: language === l ? colors.primary : colors.text, fontWeight: '600' }}>
                {l === 'en' ? 'English' : 'Română'}
              </Text>
            </Pressable>
          ))}
        </View>
      </Section>

      <Section title={t('settings.theme')}>
        <Pressable 
          onPress={toggleTheme}
          style={({ pressed }) => [
            styles.row, 
            { 
              backgroundColor: colors.surface, 
              borderColor: colors.border,
              opacity: pressed ? 0.7 : 1 
            }
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Ionicons 
              name={theme === 'light' ? 'moon' : 'sunny'} 
              size={20} 
              color={theme === 'light' ? '#404043' : '#cbcbcb'} 
            />
            <Text style={{ color: colors.text, fontWeight: '500' }}>
              {theme === 'light' ? t('settings.dark') : t('settings.light')}
            </Text>
          </View>
          <Ionicons name="refresh-outline" size={18} color={colors.textMuted} />
        </Pressable>
      </Section>

      <Section title="More">
        {!isLargeScreen && (
          <>
            <NavRow label={t('archive.title')} href="/archive" />
            <NavRow label={t('trash.title')} href="/trash" />
            <NavRow label={t('links.title')} href="/links" />
          </>
        )}
      </Section>

      

      <Text style={{ color: colors.textSubtle, fontSize: 12, textAlign: 'center', marginTop: spacing.lg }}>
        TaskForce · v1.0.0
      </Text>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{title.toUpperCase()}</Text>
      {children}
    </View>
  );
}

function NavRow({ label, href }: { label: string; href: '/archive' | '/trash' | '/links' }) {
  const { colors } = useTheme();
  return (
    <Link href={href} asChild>
      <Pressable style={StyleSheet.flatten([styles.row, { backgroundColor: colors.surface, borderColor: colors.border }])}>
        <Text style={{ color: colors.text }}>{label}</Text>
        <Text style={{ color: colors.textMuted, fontSize: 18 }}>›</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderRadius: radii.md, borderWidth: 1 },
  langBtn: { flex: 1, padding: spacing.md, borderRadius: radii.md, borderWidth: 1, alignItems: 'center' },
});

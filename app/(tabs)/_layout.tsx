import { Tabs } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useLanguage } from '../../src/contexts/LanguageContext';

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 800;
  return (
    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        
        tabBarPosition: isLargeScreen ? 'left' : 'bottom', 
        tabBarVariant: isLargeScreen ? 'material' : 'uikit',
        
        
        tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        minWidth: 0,
        width: isLargeScreen ? 'auto': '100%',
        },

        headerShown: false,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tasks.title'),
          
          tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('calendar.title'),
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          title: t('focus.title'),
          tabBarIcon: ({ color, size }) => <Ionicons name="timer-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="targets"
        options={{
          title: t('targets.title'),
          tabBarIcon: ({ color, size }) => <Ionicons name="trophy-outline" size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="links"
        options={{
          title: t('links.title'),
          href: isLargeScreen ? '/links' : null, 
          tabBarIcon: ({ color, size }) => <Ionicons name="link-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="archive"
        options={{
          title: t('archive.title'),
          href: isLargeScreen ? '/archive' : null, 
          tabBarIcon: ({ color, size }) => <Ionicons name="archive-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trash"
        options={{
          title: t('trash.title'),
          href: isLargeScreen ? '/trash' : null,
          tabBarIcon: ({ color, size }) => <Ionicons name="trash-outline" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings.title'),
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />

    </Tabs>
  );
}

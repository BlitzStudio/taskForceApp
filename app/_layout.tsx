import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import { AppDataProvider } from '../src/contexts/AppDataContext';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';

function StackWithTheme() {
  const { theme, colors } = useTheme();
  const { isLoading } = useAuth();

  // Opțional: Dacă AuthContext-ul tău are o stare de încărcare (ex. verifică token-ul în AsyncStorage)
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors?.bg || '#000' }}>
        <ActivityIndicator size="large" color={colors?.primary || '#2563eb'} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        {/* RECOMANDARE: Lasă rutele definite aici. 
           Protecția (redirecționarea) o facem în interiorul ecranelor 
           sau într-un fișier separat, pentru a evita erorile de "Uncaught Error" 
        */}
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="archive" options={{ title: 'Archive' }} />
        <Stack.Screen name="trash" options={{ title: 'Trash Bin' }} />
        <Stack.Screen name="links" options={{ title: 'Saved Links' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          {/* Asigură-te că AuthProvider este importat corect */}
          <AuthProvider>
            <LanguageProvider>
              <AppDataProvider>
                <StackWithTheme />
              </AppDataProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';

type AuthMode = 'signin' | 'signup';

export default function AuthScreen() {
  const { login, signup, continueAsGuest } = useAuth();
  const { theme, colors } = useTheme();
  const router = useRouter();
  const isDark = theme === 'dark';

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await login(email, password);
      } else {
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        await signup(email, password, name);
      }
      router.replace('/(tabs)');
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestContinue = () => {
    continueAsGuest();
    router.replace('/(tabs)');
  };

  const getToggleButtonStyle = (active: boolean) => ({
    backgroundColor: active
      ? '#2563eb'
      : (isDark ? '#262626' : '#f5f5f5'),
  });

  const getToggleTextStyle = (active: boolean) => ({
    color: active
      ? '#ffffff'
      : (isDark ? '#a3a3a3' : '#525252'),
  });

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#0a0a0a' : '#f0f9ff',
    },
    logoContainer: {
      backgroundColor: isDark ? '#3b82f6' : '#2563eb',
    },
    title: {
      color: isDark ? '#f5f5f5' : '#171717',
    },
    subtitle: {
      color: isDark ? '#a3a3a3' : '#525252',
    },
    card: {
      backgroundColor: isDark ? '#171717' : '#ffffff',
      borderColor: isDark ? '#262626' : '#e5e5e5',
    },
    label: {
      color: isDark ? '#d4d4d4' : '#3f3f3f',
    },
    input: {
      backgroundColor: isDark ? '#262626' : '#f9fafb',
      borderColor: isDark ? '#404040' : '#d1d5db',
      color: isDark ? '#f5f5f5' : '#111827',
    },
    submitButton: {
      backgroundColor: isDark ? '#3b82f6' : '#2563eb',
    },
    dividerLine: {
      backgroundColor: isDark ? '#404040' : '#d4d4d4',
    },
    dividerText: {
      color: isDark ? '#a3a3a3' : '#737373',
    },
    guestButton: {
      backgroundColor: isDark ? '#262626' : '#f5f5f5',
    },
    guestText: {
      color: isDark ? '#d4d4d4' : '#3f3f3f',
    },
    footer: {
      color: isDark ? '#a3a3a3' : '#737373',
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex1}
    >
      <ScrollView
        style={[styles.flex1, dynamicStyles.container]}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Logo & Title */}
        <View style={styles.header}>
          <View style={[styles.logoIcon, dynamicStyles.logoContainer]}>
            <Ionicons name="checkbox-outline" size={32} color="white" />
          </View>
          <Text style={[styles.title, dynamicStyles.title]}>
            TaskForce
          </Text>
          <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
            Organize your tasks efficiently
          </Text>
        </View>

        {/* Auth Card */}
        <View style={[styles.card, dynamicStyles.card]}>
          {/* Mode Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              onPress={() => setMode('signin')}
              style={[styles.toggleButton, getToggleButtonStyle(mode === 'signin')]}
            >
              <Text style={[styles.toggleText, getToggleTextStyle(mode === 'signin')]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('signup')}
              style={[styles.toggleButton, getToggleButtonStyle(mode === 'signup')]}
            >
              <Text style={[styles.toggleText, getToggleTextStyle(mode === 'signup')]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, dynamicStyles.label]}>
                  Name
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
                    placeholderTextColor={isDark ? '#737373' : '#a3a3a3'}
                    style={[styles.input, dynamicStyles.input]}
                  />
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={isDark ? '#737373' : '#a3a3a3'}
                    style={styles.inputIcon}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>
                Email
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={isDark ? '#737373' : '#a3a3a3'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[styles.input, dynamicStyles.input]}
                />
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={isDark ? '#737373' : '#a3a3a3'}
                  style={styles.inputIcon}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>
                Password
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={isDark ? '#737373' : '#a3a3a3'}
                  secureTextEntry
                  style={[styles.input, dynamicStyles.input]}
                />
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={isDark ? '#737373' : '#a3a3a3'}
                  style={styles.inputIcon}
                />
              </View>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.submitButton, dynamicStyles.submitButton, loading && styles.disabled]}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitText}>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, dynamicStyles.dividerLine]} />
            <Text style={[styles.dividerText, dynamicStyles.dividerText]}>or</Text>
            <View style={[styles.dividerLine, dynamicStyles.dividerLine]} />
          </View>

          {/* Continue as Guest */}
          <TouchableOpacity
            onPress={handleGuestContinue}
            style={[styles.guestButton, dynamicStyles.guestButton]}
          >
            <Text style={[styles.guestText, dynamicStyles.guestText]}>
              Continue without logging in
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={[styles.footerText, dynamicStyles.footer]}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  toggleText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitText: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  divider: {
    marginVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
  guestButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
  guestText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 24,
  },
});

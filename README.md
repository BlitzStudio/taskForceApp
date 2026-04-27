# TaskForce — React Native / Expo SDK 55 Port

Acest folder conține portul aplicației web TaskForce către **React Native cu Expo SDK 55** și **expo-router v4**. Codul nu rulează în mediul Figma Make (care este web-only), dar este pregătit să fie copiat într-un proiect Expo local.

## Cum pornești proiectul local

```bash
# 1. Creează un proiect Expo nou cu SDK 55
npx create-expo-app@latest TaskForce --template blank-typescript

cd TaskForce

# 2. Înlocuiește/copiază fișierele din acest folder peste rădăcina proiectului
#    (păstrează structura: app/, src/, package.json, app.json, etc.)

# 3. Instalează dependențele
npx expo install expo-router react-native-safe-area-context react-native-screens \
  expo-linking expo-constants expo-status-bar @react-native-async-storage/async-storage \
  date-fns react-native-gesture-handler react-native-reanimated \
  @expo/vector-icons expo-document-picker react-native-svg

# 4. Pornește
npx expo start
```

## Mapări web → native

| Web | React Native |
|---|---|
| Tailwind classes | `StyleSheet.create` + tokens din `src/theme.ts` |
| `localStorage` | `@react-native-async-storage/async-storage` |
| `react-router` | `expo-router` (file-based routing în `app/`) |
| `<div>` `<span>` `<button>` | `<View>` `<Text>` `<Pressable>` |
| `<input>` `<textarea>` | `<TextInput>` |
| `<select>` | Custom dropdown / `@react-native-picker/picker` |
| `lucide-react` | `@expo/vector-icons` (Ionicons / Feather) |
| `react-dnd` | `react-native-reanimated` + `react-native-gesture-handler` |
| `confetti` | `react-native-confetti-cannon` |
| `react-slick` | `react-native-snap-carousel` sau ScrollView |
| `document.title` / SEO | nu se aplică |
| CSS variables / `dark:` prefix | `useTheme()` din `src/contexts/ThemeContext.tsx` |

## Ce e portat aici

- ✅ Scaffolding complet (package.json, app.json, tsconfig, babel.config)
- ✅ `src/types.ts` — copiat fără modificări
- ✅ `src/utils/storage.ts` — convertit la AsyncStorage (async API)
- ✅ `src/utils/achievements.ts`, `src/utils/periodicChallenges.ts` — copiate (logică pură, depind doar de `date-fns`)
- ✅ `src/contexts/ThemeContext.tsx` — RN cu AsyncStorage
- ✅ `src/contexts/LanguageContext.tsx` — RN cu AsyncStorage (copiază obiectul `translations` din webul original)
- ✅ `src/theme.ts` — tokens (culori, spacing, radii) pentru ambele teme
- ✅ `src/contexts/AppDataContext.tsx` — state global pentru tasks, links, sessions, achievements
- ✅ `app/_layout.tsx` — root layout cu providere
- ✅ `app/(tabs)/_layout.tsx` — bottom-tabs (înlocuiește Sidebar + BottomNav)
- ✅ `app/(tabs)/index.tsx` — Tasks (list + board toggle)
- ✅ `app/(tabs)/calendar.tsx` — Calendar (stub funcțional)
- ✅ `app/(tabs)/focus.tsx` — Focus Mode cu timer
- ✅ `app/(tabs)/targets.tsx` — Targets & Goals + Periodic Challenges
- ✅ `app/(tabs)/settings.tsx` — limbă, temă
- ✅ `app/archive.tsx`, `app/trash.tsx`, `app/links.tsx` — accesibile prin navigare
- ✅ Componente: `TaskRow`, `TaskModal`, `BoardView`, `AchievementBadge`, `FloatingAddButton`, `SearchBar`

## Ce a rămas pentru tine (TODO local)

1. **Copiază obiectul `translations` complet** din `src/app/contexts/LanguageContext.tsx` (web) în `src/contexts/LanguageContext.tsx` (RN). Am pus doar un sample pentru `en` și `ro` ca să arate structura.
2. **Drag-and-drop pe Kanban**: web-ul folosește react-dnd. Pentru RN folosește `react-native-draggable-flatlist` sau `react-native-reanimated` + `Gesture`.
3. **Confetti la achievements/challenges**: instalează `react-native-confetti-cannon` și înlocuiește efectele canvas.
4. **File attachments**: `expo-document-picker` poate selecta fișiere; salvează URI-urile (nu base64-uri masive în AsyncStorage).
5. **Notificări** (taskReminders, focusReminders din Settings): `expo-notifications`.
6. **Date picker** pentru deadline: `@react-native-community/datetimepicker`.
7. **Achievements section UI** (am pus doar `AchievementBadge`): replicați grila/categoriile din `AchievementsSection.tsx` web.
8. **Sortarea pe tabel**: m-am limitat la 2 opțiuni; copiați logica completă din `Tasks.tsx` web dacă vreți.
9. **Verificați iconurile**: am folosit `Ionicons`. Dacă vreți alt set (Feather, MaterialCommunity), schimbați importul.

## Note importante

- **Nu folosește Tailwind** — totul prin `StyleSheet.create` așa cum ai cerut.
- **AsyncStorage e async** — fiecare `getX()` din storage returnează `Promise<T>`. Codul a fost adaptat să folosească `useEffect` + `await`.
- **expo-router** folosește file-based routing — fișierele din `app/` definesc rutele automat. `_layout.tsx` definește layout-ul părinte.
- Versiunile din `package.json` corespund **Expo SDK 55** (lansat începutul lui 2026). Dacă instalezi cu `npx expo install` versiunile vor fi auto-aliniate.

## Structura finală

```
react-native-port/
├── README.md              ← acest fișier
├── package.json
├── app.json
├── tsconfig.json
├── babel.config.js
├── app/                   ← rute (expo-router)
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx      ← Tasks
│   │   ├── calendar.tsx
│   │   ├── focus.tsx
│   │   ├── targets.tsx
│   │   └── settings.tsx
│   ├── archive.tsx
│   ├── trash.tsx
│   └── links.tsx
└── src/
    ├── theme.ts
    ├── types.ts
    ├── utils/
    │   ├── storage.ts
    │   ├── achievements.ts
    │   └── periodicChallenges.ts
    ├── contexts/
    │   ├── ThemeContext.tsx
    │   ├── LanguageContext.tsx
    │   └── AppDataContext.tsx
    └── components/
        ├── TaskRow.tsx
        ├── TaskModal.tsx
        ├── BoardView.tsx
        ├── AchievementBadge.tsx
        ├── FloatingAddButton.tsx
        └── SearchBar.tsx
```

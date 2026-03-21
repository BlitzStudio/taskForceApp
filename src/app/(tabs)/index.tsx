import { Redirect } from "expo-router";
import { StyleSheet } from "react-native";

//pagina index este cea default,dar vrem ca Tasks sa fie pagina default
export default function Index() {
  return (
    <Redirect href="/tasks" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});

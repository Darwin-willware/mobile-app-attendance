import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import SignIn from "../components/auth/SignIn";
import { CyberGradient } from "../components/shared/CyberGradient";

export default function Index() {
  return (
    <CyberGradient>
      <SignIn />
      <Link style={styles.Link} href={'/main'}>Go To Check In</Link>
    </CyberGradient>
  );
}
const styles = StyleSheet.create({
  Link: { fontSize: 20, fontWeight: 'bold', padding: 20 },
});
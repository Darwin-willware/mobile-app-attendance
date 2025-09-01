import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Gradients } from '../../constants/constants';

export const CyberGradient = ({ children }: { children: React.ReactNode }) => (
  <LinearGradient
    colors={Gradients.bg}
    style={styles.gradient}
  >
    {children}
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
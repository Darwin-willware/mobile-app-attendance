import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Gradients } from '../../constants/constants';
import { CustomButtonProps } from '../../types/models';

export default function GradButton({ text,gradientColors=Gradients.btn, ...props }: CustomButtonProps) {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Pressable {...props} style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  button: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

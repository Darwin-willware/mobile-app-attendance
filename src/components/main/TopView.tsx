import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';
const TopCard = ({userName}:{userName:string}) => {
    const welcomeOpacity = useSharedValue(0);
    const nameOpacity = useSharedValue(0);
    const emojiOpacity = useSharedValue(0);

    useEffect(() => {
        welcomeOpacity.value = withDelay(100, withTiming(1, { duration: 500 }));
        nameOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
        emojiOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    }, [])
    const welcomeStyle = useAnimatedStyle(() => ({
        opacity: welcomeOpacity.value,
    }));

    const nameStyle = useAnimatedStyle(() => ({
        opacity: nameOpacity.value,
    }));

    const emojiStyle = useAnimatedStyle(() => ({
        opacity: emojiOpacity.value,
    }));
    return (
        <><Animated.Text style={[styles.welcomeText, welcomeStyle]}>
            Welcome Back,
        </Animated.Text><Animated.Text style={[styles.userName, nameStyle]}>
                {userName}
            </Animated.Text><Animated.Text style={[styles.emoji, emojiStyle]}>
                👋
            </Animated.Text></>
    );
}
const styles = StyleSheet.create({
    welcomeText: {
        fontSize: 22,
        color: '#fff',
        fontWeight: '600',
        marginBottom: 5,
        marginTop: 80,
    },
    userName: {
        fontSize: 26,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    emoji: {
        fontSize: 28,
        marginBottom: 20,
    },
});
export default TopCard;
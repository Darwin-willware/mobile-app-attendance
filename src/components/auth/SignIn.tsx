import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gradients } from '../../constants/constants';
import { useUser } from '../../context/userContext';
import {
    configureGoogleSignIn,
    signInWithGoogle
} from '../../services/authService';
import GradButton from '../shared/GradButton';

export default function SignIn() {
    const { setUser } = useUser();
    useEffect(() => {
        setUser(null);
        configureGoogleSignIn();
    }, []);

    const handleSignIn = async () => {
        const user = await signInWithGoogle();
        if (user) {
            router.replace('/main');
        };
    };

    return (
        <View style={styles.container}>
            <GradButton text="Sign In With Google" gradientColors={Gradients.signIn} onPress={handleSignIn} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
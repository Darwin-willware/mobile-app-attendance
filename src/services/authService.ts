// src/services/authService.ts
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { oAuthWebClientId } from '../constants/constants';
import { showGlobalToast } from '../context/ToastContext';
import supabase from '../lib/supabase';
import { GoogleUser } from '../types/models';

let cachedUser: GoogleUser | null = null;

const waitForSupabaseSession = async (retries = 5, delay = 500): Promise<any> => {
    for (let i = 0; i < retries; i++) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) return user;
        await new Promise(res => setTimeout(res, delay));
    }
    return null;
};

export const configureGoogleSignIn = () => {
    GoogleSignin.configure({
        webClientId: oAuthWebClientId,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
};

export const signInWithGoogle = async (): Promise<GoogleUser | null> => {
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();

        if (isSuccessResponse(response)) {
            const { user, idToken } = response.data;

            if (!idToken) {
                showGlobalToast('Missing ID token','error');
                return null;
            }

            const { error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: idToken,
            });

            if (error) {
                showGlobalToast(`Supabase sign-in failed: ${error.message}`,'error');
                return null;
            }

            const supabaseUser = await waitForSupabaseSession();
            if (!supabaseUser) {
                showGlobalToast('Supabase session not established','error');
                return null;
            }

            const userInfo: GoogleUser = {
                name: user.name,
                email: user.email,
                photo: user.photo,
                idToken,
            };

            cachedUser = userInfo;
            showGlobalToast('Successfully Signed In','success');
            return userInfo;
        }

        showGlobalToast('Google Sign-In failed','error');
        return null;
    } catch (error: any) {
        if (isErrorWithCode(error)) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                    showGlobalToast('Sign-in in progress','error');
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    showGlobalToast('Google Play Services not available','error');
                    break;
                default:
                    showGlobalToast(`Sign-in error: ${error.message}`,'error');
            }
        } else {
            showGlobalToast(`Unknown error: ${JSON.stringify(error)}`,'error');
        }
        return null;
    }
};

export const signOutFromGoogle = async () => {
    try {
        await supabase.auth.signOut();
        await GoogleSignin.signOut();
        router.replace('/');
        cachedUser = null;
        showGlobalToast('Successfully Logged Out','success');
    } catch (error) {
        showGlobalToast(`Logout failed: ${JSON.stringify(error)}`,'success');
    }
};

export const getCachedUser = (): GoogleUser | null => cachedUser;

export const isUserSignedIn = async (): Promise<boolean> => {
    return await GoogleSignin.hasPreviousSignIn();
};

export const getCurrentGoogleUser = async (): Promise<GoogleUser | null> => {
    const isSignedIn = await isUserSignedIn();
    if (!isSignedIn) return null;

    const currentUser = await GoogleSignin.getCurrentUser();
    if (!currentUser?.user || !currentUser.idToken) return null;

    const userInfo: GoogleUser = {
        name: currentUser.user.name,
        email: currentUser.user.email,
        photo: currentUser.user.photo,
        idToken: currentUser.idToken,
    };

    cachedUser = userInfo;
    return userInfo;
};

export const getCurrentSupabaseUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
};


export const isUserLoggedIn = async (): Promise<boolean> => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session || !data.session.user) {
        return false;
    }

    return true;
};

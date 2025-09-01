import { toast } from '@backpackapp-io/react-native-toast';
import supabase from '../lib/supabase';

export const getCurrentSessionUser = async () => {

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    console.log("Userdetails", user);
    if (error || !user) {
        toast.error('User not logged in');
        return null;
    }
    return user;
};

export const ensureUserExists = async (userId: string, email: string, name?: string, photo?: string) => {
    const { data: existingUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .eq('email', email)
        .single();

    if (error && error.code !== 'PGRST116') {
        toast.error('Error checking user');
        return null;
    }

    if (!existingUser) {
        const { data, error: insertError } = await supabase
            .from('users')
            .insert({
                user_id: userId,
                email,
                name,
                photo,
                status: 'active',
            })
            .select()
            .single();

        if (insertError) {
            toast.error('Error creating user');
            return null;
        }

        return data;
    }

    return existingUser;
};
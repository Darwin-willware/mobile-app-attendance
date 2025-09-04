import { showGlobalToast } from '../context/ToastContext';
import supabase from '../lib/supabase';
export const getCurrentSessionUser = async () => {

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    console.log("Userdetails", user);
    if (error || !user) {
        showGlobalToast('User not logged in','error');
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
        showGlobalToast('Error checking user','error');
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
            showGlobalToast('Error creating user','error');
            return null;
        }

        return data;
    }

    return existingUser;
};
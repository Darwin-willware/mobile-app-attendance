import supabase from '../lib/supabase';
import { CheckInResult, CheckOutResult, GetUserDetailsParams } from '../types/models';

export const getUserDetails = async ({ email, userId }: GetUserDetailsParams) => {
  const query = supabase.from('users').select('*');

  const { data, error } = email
    ? await query.eq('email', email).single()
    : await query.eq('user_id', userId).single();
  if (error) throw error;
  return data;
};

export const getTodayCheckInStatus = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('timelogs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (error) {
    console.log("Error fetching today's check-in:", error);
    return null;
  }

  return data;
};

export const checkIn = async (userId: string): Promise<CheckInResult> => {
  const today = new Date().toISOString().split('T')[0];

  const { data: existing } = await supabase
    .from('timelogs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (existing) return { error: 'Already checked in today' };

  const { data, error } = await supabase
    .from('timelogs')
    .insert({
      user_id: userId,
      date: today,
      check_in_time: new Date().toISOString()
    })
    .select()
    .single();

  if (error || !data) return { error: error?.message || 'Insert failed' };

  return { check_in_time: data.check_in_time };
};

export const checkOut = async (userId: string): Promise<CheckOutResult> => {
  const today = new Date().toISOString().split('T')[0];

  const { data: log, error: fetchError } = await supabase
    .from('timelogs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (fetchError || !log?.check_in_time) return { error: 'No check-in found' };

  const checkIn = new Date(log.check_in_time);
  const checkOut = new Date();

  const durationMs = checkOut.getTime() - checkIn.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

  const totalHours = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const { data: updated, error } = await supabase
    .from('timelogs')
    .update({
      check_out_time: checkOut.toISOString(),
      total_hours: totalHours
    })
    .eq('id', log.id)
    .select()
    .single();

  if (error || !updated) return { error: error?.message || 'Update failed' };

  return {
    check_out_time: updated.check_out_time,
    total_hours: updated.total_hours
  };
};

export const convertUTCToIST = (utcDateString: string): string => {
  const utcDate = new Date(utcDateString);

  return utcDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });
};
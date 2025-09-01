import supabase from "@/src/lib/supabase";
import { RequestType } from "@/src/types/models";


export const applyRequest = async (
  userId: string,
  date: string,
  type: RequestType,
  force = false
): Promise<
  | { success: true }
  | { success: false; message: string }
  | { conflict: RequestType }
> => {
  const currentTable = type === 'leave' ? 'applied_leaves' : 'applied_wfh';
  const conflictTable = type === 'leave' ? 'applied_wfh' : 'applied_leaves';

  try {
    const { data: conflictData } = await supabase
      .from(conflictTable)
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    if (conflictData && !force) {
      return { conflict: type === 'leave' ? 'wfh' : 'leave' };
    }

    const { data: existingData } = await supabase
      .from(currentTable)
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    if (existingData && !force) {
      return { success: false, message: `Already applied for ${type.toUpperCase()} on this date.` };
    }

    if (conflictData && force) {
      await supabase
        .from(conflictTable)
        .delete()
        .eq('user_id', userId)
        .eq('date', date);
    }

    if (existingData && force) {
      await supabase
        .from(currentTable)
        .delete()
        .eq('user_id', userId)
        .eq('date', date);
    }

    const { error: insertError } = await supabase
      .from(currentTable)
      .insert([{ user_id: userId, date }]);

    if (insertError) {
      return { success: false, message: insertError.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || 'Unexpected error occurred' };
  }
};
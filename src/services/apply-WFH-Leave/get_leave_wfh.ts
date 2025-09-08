import supabase from "@/src/lib/supabase";
import { FetchType } from "@/src/types/models";

export const fetchAppliedEntries = async (userId: string,fetchType:FetchType = 'applied_wfh') => {
  const today = new Date().toISOString().split('T')[0]; 

  const { data, error } = await supabase
    .from(fetchType)
    .select('*')
    .eq('user_id', userId)
    .gte('date', today); 
  if (error) {
    console.error('Error fetching WFH entries:', error);
    return [];
  }

  return data;
};


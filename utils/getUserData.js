import { supabase } from "./supabase";

const user = supabase.auth.user();

const getUserData = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return data;
};

export default getUserData;

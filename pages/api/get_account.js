import { supabase } from "../../utils/supabase";
import { client } from "../../utils/plaidConfig";

export default async function get_account(req, res) {
  const jsonData = JSON.parse(req.body);
  const user = jsonData.userID;
  try {
    const { data, error, status } = await supabase
      .from("profiles")
      .select("plaid_key")
      .eq("id", user)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      const accountsResponse = await client.accountsGet({
        access_token: data.plaid_key,
      });
      res.json(accountsResponse.data);
    }
  } catch (error) {
    res.json({ name: "You got an error", desc: error });
  }
}

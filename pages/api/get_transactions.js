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
      // Set cursor to empty to receive all historical updates
      let cursor = null;

      // New transaction updates since "cursor"
      let added = [];
      let modified = [];
      // Removed transaction ids
      let removed = [];
      let hasMore = true;
      // Iterate through each page of new transaction updates for item
      while (hasMore) {
        const request = {
          access_token: data.plaid_key,
          cursor: cursor,
        };
        const response = await client.transactionsSync(request);
        const plaidData = response.data;
        // Add this page of results
        added = added.concat(plaidData.added);
        modified = modified.concat(plaidData.modified);
        removed = removed.concat(plaidData.removed);
        hasMore = plaidData.has_more;
        // Update cursor to the next cursor
        cursor = plaidData.next_cursor;
      }

      const compareTxnsByDateAscending = (a, b) =>
        (a.date > b.date) - (a.date < b.date);
      // Return the 8 most recent transactions
      const recently_added = [...added]
        .sort(compareTxnsByDateAscending)
        .slice(-8);
      res.json({ latest_transactions: recently_added });
    }
  } catch (error) {
    res.json({ name: "You got an error", desc: error });
  }
}

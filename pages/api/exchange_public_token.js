// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

const client = new PlaidApi(configuration);

//Create Link Token
export default async function handler(req, res, next) {
  const publicToken = req.body.public_token;
  console.log(`public Token: ${publicToken}`);
  try {
    const tokenResponse = await client.itemPublicTokenExchange({
      public_token: publicToken,
    });
    //prettyPrintResponse(tokenResponse);
    console.log(`tokenResponse: ${tokenResponse}`);
    res.json({
      access_token: tokenResponse.data.access_token,
      item_id: tokenResponse.data.item_id,
      error: null,
    });
  } catch (error) {
    console.log("ERROR:" + error);
    res.json(error);
  }
}

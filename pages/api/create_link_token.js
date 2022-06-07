// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || "transactions").split(
  ","
);

const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || "US").split(
  ","
);
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || "";
const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || "";

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;

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

export const config = {
  api: {
    bodyParser: true,
  },
};

//Create Link Token
export default async function handler(req, res, next) {
  const body = JSON.parse(req.body);
  try {
    const configs = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: body.userID,
      },
      client_name: "Plaid Quickstart",
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: "en",
    };

    if (PLAID_REDIRECT_URI !== "") {
      configs.redirect_uri = PLAID_REDIRECT_URI;
    }

    if (PLAID_ANDROID_PACKAGE_NAME !== "") {
      configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;
    }
    const createTokenResponse = await client.linkTokenCreate(configs);
    res.json(createTokenResponse.data);
  } catch (error) {
    next(error);
  }
}

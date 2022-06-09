const { default: Abound, Environment } = require("@withabound/node-sdk");

const abound = new Abound({
  appId: "appId_dfc98e73e785bc123ae89d26765f8865",
  appSecret: "appSecret_c2e05656aadb87e1da00764c7af6c235",
  environment: Environment.SANDBOX,
  apiVersion: "v2",
});

export default abound;

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import moment from "moment";

const user = supabase.auth.user();

const Dashboard = ({ classes }) => {
  const [accountData, setAccountData] = useState([]);

  useEffect(() => {
    getPlaidData();
  }, []);

  const getPlaidData = async () => {
    const results = await fetch("/api/get_account", {
      method: "POST",
      headers: {
        "Content-Type": "applications/json",
      },
      body: JSON.stringify({ userID: user.id }),
    });
    const data = await results.json();
    console.log(data.accounts[0]);
    setAccountData(() => [data.accounts[0]]);
  };

  return (
    <div className="w-full">
      <h1 className={classes}>This is the dashboard!</h1>
      <h2 className="text-xl mt-8">Accounts</h2>
      {accountData.map((account, index) => (
        <div
          key={index}
          className="border border-blue-200 mt-4 rounded-md px-4 py-4"
        >
          <h3 className=" font-bold text-2xl mb-6">{account.name}</h3>
          <div className="flex flex-col gap-1">
            <p>
              <b>Available Balance:</b> ${account.balances.available}
            </p>
            <p>
              <b>Current Balance:</b> ${account.balances.current}
            </p>
            <p>
              <b>Account Type:</b> {account.subtype}
            </p>
          </div>
        </div>
      ))}
      <Transactions />
    </div>
  );
};

const Transactions = () => {
  const [transactions, setTransactions] = useState(null);
  const [txType, setTxType] = useState(null);

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = async () => {
    const results = await fetch("/api/get_transactions", {
      method: "POST",
      body: JSON.stringify({ userID: user.id }),
    });
    const data = await results.json();
    setTransactions(() => [data.latest_transactions]);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl">Recent Transactions</h2>
      {transactions &&
        transactions[0].map((tx, index) => {
          return (
            <div
              key={index}
              className="bg-white shadow-md mt-4 rounded-md px-4 py-4"
            >
              <div className="flex justify-between">
                <h3 className=" font-normal text-xl">{tx.merchant_name}</h3>
                <span className="text-red-600 font-semibold">${tx.amount}</span>
              </div>
              <span className="text-xs text-gray-600">
                {moment(tx.date).format("ll")}
              </span>

              <div className="flex gap-3 mt-4">
                <button
                  className={`block cursor-pointer bg-blue-100 w-full py-2 rounded-full text-blue-600 text-sm font-regular ${
                    txType == "Business" ? "bg-blue-600 text-blue-200" : ""
                  } `}
                  onClick={() => setTxType("Business")}
                >
                  Business
                </button>
                <button
                  className={`block cursor-pointer bg-blue-100 w-full py-2 rounded-full text-blue-600 text-sm font-regular ${
                    txType == "Personal" ? "bg-blue-600 text-blue-200" : ""
                  } `}
                  onClick={() => setTxType("Personal")}
                >
                  Personal
                </button>
              </div>
              <div className="mt-4">
                <label className="text-xs text-gray-600" htmlFor="category">
                  We Automatically matched an expense category
                </label>
                <input
                  className=" w-full bg-gray-100 px-4 py-2 text-sm mt-2 "
                  type="text"
                  placeholder="Category"
                  defaultValue={tx.category[0]}
                />
              </div>
              <button className="bg-blue-600 rounded-full w-full text-white py-2 mt-4 shadow shadow-blue-600/20">
                Save Expense
              </button>
            </div>
          );
        })}
    </div>
  );
};

export default Dashboard;

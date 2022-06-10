import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import moment from "moment";
import abound from "../utils/aboundConfig";
import getUserData from "../utils/getUserData";

const user = supabase.auth.user();

const Dashboard = ({ classes }) => {
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!data.abound_id) {
        const response = await fetch("/api/abound_create_user", {
          method: "POST",
          body: JSON.stringify({ emailAddress: user.email }),
        });

        const { data } = await response.json();
        let { error } = await supabase
          .from("profiles")
          .update({ abound_id: data.userId })
          .eq("id", user.id);

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={() => {
          supabase.auth.signOut();
        }}
        className="bg-blue-600 float-right rounded-full text-white py-2 px-4 mt-4 shadow shadow-blue-600/20"
      >
        Log out
      </button>
      <div className={classes}>Welcome back 👋</div>
      <div className="text-xl font-bold">{user.email}</div>
      <Transactions />
    </div>
  );
};

const Transactions = () => {
  const [transactions, setTransactions] = useState(null);
  const [txType, setTxType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aboundData, setAboundData] = useState(null);

  useEffect(() => {
    getTransactions();
    setLoading(false);
  }, []);

  const getTransactions = async () => {
    const results = await fetch("/api/get_transactions", {
      method: "POST",
      body: JSON.stringify({ userID: user.id }),
    });
    const data = await results.json();
    setTransactions(() => [data.latest_transactions]);
  };

  const handleAbound = async (txData) => {
    const { abound_id: aboundID } = await getUserData();
    try {
      const response = await abound.expenses.create(aboundID, [
        {
          amount: txData.amount,
          description: txData.merchant_name,
          date: txData.date,
        },
      ]);

      if (response.error) {
        throw error;
      }

      console.log(response);
      setAboundData(() => [response]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl">Recent Transactions</h2>
      {transactions ? (
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
              <button
                onClick={() => handleAbound(tx)}
                className="bg-blue-600 rounded-full w-full text-white py-2 mt-4 shadow shadow-blue-600/20"
              >
                Test Send to Abound
              </button>
            </div>
          );
        })
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Dashboard;

const Accounts = () => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAccounts();
  }, []);

  const getAccounts = async () => {
    const results = await fetch("/api/get_account", {
      method: "POST",
      headers: {
        "Content-Type": "applications/json",
      },
      body: JSON.stringify({ userID: user.id }),
    });
    const data = await results.json();
    setAccountData(() => [data.accounts[0]]);
  };

  return (
    <>
      <h2 className="text-xl mt-8">Accounts</h2>
      {accountData ? (
        accountData.map((account, index) => (
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
        ))
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

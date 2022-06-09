import { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabase";
import { usePlaidLink } from "react-plaid-link";

export default function Onboarding({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);

  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    getProfile();
    generateToken();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const generateToken = async () => {
    const user = supabase.auth.user();

    const response = await fetch("/api/create_link_token", {
      method: "POST",
      headers: {
        "Content-Type": "applications/json",
      },
      body: JSON.stringify({ userID: user.id }),
    });
    const data = await response.json();
    setLinkToken(data.link_token);
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <img src="/ff-logo.svg" alt="Forcefield logo" className="m-auto" />
        <h1 className="text-3xl mt-20 text-center">Welcome to Forcefield</h1>
        <p className="text-center mt-16">
          Forcefield is compatible with nearly 200+ banks &amp; credit cards.
          After you link your account, we automatically scan &amp; identify your
          past business purchases for hidden write-offs and deductions. Safe,
          secure, and automated!
        </p>
      </div>
      <div>
        {linkToken != null ? <Link linkToken={linkToken} /> : <></>}

        <button
          className="mt-4 bg-gray-200 px-4 py-1 rounded"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
const Link = (props) => {
  const [loading, setLoading] = useState(false);

  const updatePlaidProfile = async (key) => {
    try {
      setLoading(true);

      const user = supabase.auth.user();

      let { error } = await supabase
        .from("profiles")
        .update({ plaid_key: key })
        .eq("id", user.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSuccess = useCallback(async (public_token, metadata) => {
    // send public_token to server
    const response = await fetch("/api/exchange_public_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_token }),
    });
    const data = await response.json();
    updatePlaidProfile(data.access_token);
  }, []);
  const config = {
    token: props.linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);
  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className=" cursor-pointer bg-blue-500 text-white hover:bg-blue-600 transition-colors px-10 py-4 mt-20 rounded block w-full"
    >
      Link account
    </button>
  );
};

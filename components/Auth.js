import { useState } from "react";
import { supabase } from "../utils/supabase";

export default function Auth({ className }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="w-full">
        <input
          className=" bg-gray-100 block my-2 px-4 py-2 rounded w-full text-lg"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogin(email);
          }}
          className="w-full my-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 
          cursor-pointer transition-colors rounded text-white font-bold"
          disabled={loading}
        >
          <span>{loading ? "Loading" : "Send magic link"}</span>
        </button>
      </div>
    </div>
  );
}

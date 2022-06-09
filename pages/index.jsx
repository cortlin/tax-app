import { useState, useEffect } from "react";
import Head from "next/head";
import Auth from "../components/Auth";
import { supabase } from "../utils/supabase";
import Dashboard from "./Dashboard";

export default function Home() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="flex flex-col py-8 min-h-full bg-gray-50">
      <Head>
        <title>Forcefield Tax App</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-8 ">
        {!session ? (
          <div>
            <img src="/ff-logo.svg" alt="Forcefield logo" className="mt-8" />

            <h1 className="text-6xl font-bold mt-20 leading-tight">
              <a className="text-black" href="/">
                Create your account
              </a>
            </h1>
            <Auth className="mt-20 w-full" />
          </div>
        ) : (
          <Dashboard classes="mt-20" />
        )}
      </main>
    </div>
  );
}

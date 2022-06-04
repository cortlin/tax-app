import Head from "next/head";

export default function Home() {
  return (
    <div className="flex flex-col py-2">
      <div>
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
          <img src="/ff-logo.svg" alt="Forcefield logo" className="mt-8" />

          <h1 className="text-6xl font-bold mt-20 leading-tight">
            <a className="text-black" href="/">
              Create your account
            </a>
          </h1>

          <form className="w-full mt-20">
            <input
              type="email"
              name="email"
              className=" bg-gray-100 block my-2 px-4 py-2 rounded w-full text-lg"
              placeholder="Email Address"
            />
            <input
              type="password"
              name="password"
              className="bg-gray-100 block my-2 px-4 py-2 rounded w-full text-lg "
              placeholder="Password"
            />
            <input
              type="submit"
              value="Sign Up"
              className="w-full my-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 
              cursor-pointer transition-colors rounded text-white font-bold"
            />
          </form>
        </main>
      </div>
    </div>
  );
}

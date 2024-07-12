import { HomeComp } from "@/components/Home";
import { Layout } from "@/components/Layout";
import "@/styles/globals.css";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      {router.asPath !== '/home' ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )
        : (
          <HomeComp />
        )}
    </>
  )
}

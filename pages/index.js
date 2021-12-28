import Head from "next/head";
import { getProviders, getSession, useSession } from "next-auth/react";
import Feed from "../components/Feed/Feed";
import Sidebar from "../components/Sidebar/Sidebar";
import Login from "../components/Login/Login";
import Modal from "../components/Modal/Modal";
import { useRecoilState } from "recoil";
import { modalState } from "../atom/modalAtom";

export default function Home({ trendingResults, followResults, providers }) {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useRecoilState(modalState);

	if (!session) return <Login providers={providers} />;

	return (
		<main>
			<Head>
				<title>Social App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="flex min-h-screen bg-black">
				{/* Sidebar */}
				<Sidebar />

				{/* Feed */}
				<Feed />

				{isOpen && <Modal />}
			</div>
		</main>
	);
}

export async function getServerSideProps(context) {
	const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then(
		(res) => res.json()
	);
	const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
		(res) => res.json()
	);
	const providers = await getProviders();
	const session = await getSession(context);

	return {
		props: {
			trendingResults,
			followResults,
			providers,
			session,
		},
	};
}

import Head from "next/head";
import { getProviders, getSession, useSession } from "next-auth/react";
import Feed from "../components/Feed/Feed";
import Header from "../components/Header/Header";
import Login from "../components/Login/Login";
import Modal from "../components/Modal/Modal";
import { useRecoilState } from "recoil";
import { modalState } from "../atom/modalAtom";
import { Fragment } from "react";

export default function Home({ providers }) {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useRecoilState(modalState);

	if (!session) return <Login providers={providers} />;

	return (
		<Fragment>
			<Head>
				<title>Social App</title>
				<link rel="icon" href="/favicon.ico" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
			</Head>

			<div>
				{/* Header */}
				<Header />

				<main className="px-4 py-10">
					{/* Feed */}
					<Feed />
				</main>

				{isOpen && <Modal />}
			</div>
		</Fragment>
	);
}

export async function getServerSideProps(context) {
	const providers = await getProviders();
	const session = await getSession(context);

	return {
		props: {
			providers,
			session,
		},
	};
}

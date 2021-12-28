import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
} from "@firebase/firestore";
import { getProviders, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atom/modalAtom";
import Modal from "../components/Modal/Modal";
import Post from "../components/Post/Post";
import { db } from "../firebase";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import Comment from "../components/Comment/Comment";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header/Header";

function PostPage({ providers }) {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useRecoilState(modalState);
	const [post, setPost] = useState();
	const [comments, setComments] = useState([]);
	const router = useRouter();
	const { id } = router.query;

	useEffect(
		() =>
			onSnapshot(doc(db, "posts", id), (snapshot) => {
				setPost(snapshot.data());
			}),
		[db]
	);

	if (!session) return <Login providers={providers} />;

	return (
		<Fragment>
			<Head>
				<title>
					{post?.username} post: "{post?.text}"
				</title>
				<link rel="icon" href="/favicon.ico" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
			</Head>
			<div>
				{/* Header */}
				<Header />

				<main className="px-4 py-10">
					<div className="max-w-2xl mx-auto">
						<Post id={id} post={post} postPage />
					</div>
				</main>

				{isOpen && <Modal />}
			</div>
		</Fragment>
	);
}

export default PostPage;

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

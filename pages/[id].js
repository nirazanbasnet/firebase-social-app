import { doc, onSnapshot } from "@firebase/firestore";
import { getProviders, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atom/modalAtom";
import { db } from "../firebase";
import Modal from "../components/ui/Modal";
import Post from "../components/ui/Post";
import AppLayout from "../components/layouts/AppLayout";
import AppContent from "../components/layouts/AppContent";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import Link from "next/link";

function PostDetail({ providers }) {
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
		<AppLayout title={`${post?.username} posted: ${post?.text}`}>
			<AppContent>
				<div className="px-4 py-10">
					<div className="max-w-2xl mx-auto">
						<Link href="/">
							<a className="flex items-center mb-4 space-x-3 hover:text-primary">
								<ArrowLeftIcon className="h-5" />
								<span>Back</span>
							</a>
						</Link>
						<Post id={id} post={post} postPage />
					</div>
				</div>
				{isOpen && <Modal />}
			</AppContent>
		</AppLayout>
	);
}

export default PostDetail;

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

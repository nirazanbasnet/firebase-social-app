import { getProviders, getSession, useSession } from "next-auth/react";
import Feed from "../components/layouts/Feed";
import Login from "../components/layouts/Login";
import Modal from "../components/ui/Modal";
import { useRecoilState } from "recoil";
import { modalState } from "../atom/modalAtom";
import AppLayout from "../components/layouts/AppLayout";
import AppContent from "../components/layouts/AppContent";

export default function Home({ providers }) {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useRecoilState(modalState);

	if (!session) return <Login providers={providers} />;

	return (
		<AppLayout title="Posts Feed | Social App">
			<AppContent>
				<div className="px-4 py-10">
					{/* Post Feeds */}
					<Feed />
				</div>
				{isOpen && <Modal />}
			</AppContent>
		</AppLayout>
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

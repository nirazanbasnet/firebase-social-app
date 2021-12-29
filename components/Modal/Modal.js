import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../../atom/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import {
	onSnapshot,
	doc,
	addDoc,
	collection,
	serverTimestamp,
} from "@firebase/firestore";
import { db } from "../../firebase";
import { useSession } from "next-auth/react";
import {
	CalendarIcon,
	ChartBarIcon,
	EmojiHappyIcon,
	PhotographIcon,
	XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Moment from "react-moment";

function Modal() {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useRecoilState(modalState);
	const [postId, setPostId] = useRecoilState(postIdState);
	const [post, setPost] = useState();
	const [comment, setComment] = useState("");
	const router = useRouter();

	useEffect(
		() =>
			onSnapshot(doc(db, "posts", postId), (snapshot) => {
				setPost(snapshot.data());
			}),
		[db]
	);

	const sendComment = async (e) => {
		e.preventDefault();

		await addDoc(collection(db, "posts", postId, "comments"), {
			comment: comment,
			username: session.user.name,
			tag: session.user.tag,
			userImg: session.user.image,
			timestamp: serverTimestamp(),
		});

		setIsOpen(false);
		setComment("");
	};

	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<Dialog as="div" className="fixed inset-0 z-50 pt-8" onClose={setIsOpen}>
				<div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 transition-opacity bg-slate-800 bg-opacity-80" />
					</Transition.Child>

					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white shadow-xl rounded-2xl sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
							<div className="flex items-center justify-end p-4 border-b border-slate-100">
								<div
									className="flex items-center justify-center rounded-full cursor-pointer w-9 h-9 bg-slate-500"
									onClick={() => setIsOpen(false)}
								>
									<XIcon className="h-5 text-white" />
								</div>
							</div>
							<div className="flex px-4 pt-5 pb-2.5 sm:px-6">
								<div className="w-full">
									<div className="text-[#6e767d] flex gap-x-3 relative">
										<span className="w-[2px] h-full z-[-1] absolute left-5 top-11 bg-gray-100" />
										<img
											src={post?.userImg}
											alt={post?.username}
											className="border rounded-full h-11 w-11 bg-slate-200 border-slate-400"
										/>
										<div>
											<div className="">
												<h4 className="font-medium">{post?.username}</h4>
											</div>
											<span className="block text-xs text-slate-400">
												<Moment fromNow>{post?.timestamp?.toDate()}</Moment>
											</span>
											<p className="mt-2 text-sm text-slate-500">
												{post?.text}
											</p>
										</div>
									</div>

									<div className="flex w-full pb-4 mt-4 space-x-3">
										<img
											src={session.user.image}
											alt={session.user.name}
											className="border rounded-full h-11 w-11 bg-slate-200 border-slate-400"
										/>
										<div className="flex-grow mt-2 overflow-y-scroll scrollbar-hide">
											<textarea
												value={comment}
												onChange={(e) => setComment(e.target.value)}
												placeholder="Reply your comment..."
												rows="2"
												className="bg-transparent outline-none w-full resize-none min-h-[80px]"
											/>

											<div className="flex items-center justify-end mt-4">
												<button
													className="bg-primary text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#4a30cb] disabled:opacity-30 disabled:cursor-not-allowed"
													type="submit"
													onClick={sendComment}
													disabled={!comment.trim()}
												>
													Comment
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
}

export default Modal;

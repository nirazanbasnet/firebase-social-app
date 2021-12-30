import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	setDoc,
} from "@firebase/firestore";
import { ChatIcon, HeartIcon, TrashIcon } from "@heroicons/react/outline";
import {
	HeartIcon as HeartIconFilled,
	ChatIcon as ChatIconFilled,
} from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../../atom/modalAtom";
import { db } from "../../firebase";
import Link from "next/link";
import Comment from "./Comment";
import ProfilePicture from "./ProfilePicture";

function Post({ id, post }) {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useRecoilState(modalState);
	const [postId, setPostId] = useRecoilState(postIdState);
	const [comments, setComments] = useState([]);
	const [likes, setLikes] = useState([]);
	const [liked, setLiked] = useState(false);
	const router = useRouter();

	// Getting Comments Data from Collection
	useEffect(
		() =>
			onSnapshot(
				query(
					collection(db, "posts", id, "comments"),
					orderBy("timestamp", "asc")
				),
				(snapshot) => setComments(snapshot.docs)
			),
		[db, id]
	);

	// Getting Likes Data from Collection
	useEffect(
		() =>
			onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
				setLikes(snapshot.docs)
			),
		[db, id]
	);

	useEffect(
		() =>
			setLiked(
				likes.findIndex((like) => like.id === session?.user?.uid) !== -1
			),
		[likes]
	);

	const likePost = async () => {
		if (liked) {
			await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
		} else {
			await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
				username: session.user.name,
			});
		}
	};

	return (
		<div className="relative p-4 transition duration-75 rounded-md shadow shadow-slate-300 hover:shadow-lg">
			<div className="flex items-center">
				<Link href={`/${id}`}>
					<a>
						<img
							src={post?.userImg}
							alt="..."
							className="w-12 h-12 mr-4 rounded-full bg-slate-200"
						/>
					</a>
				</Link>
				{/* TODO */}
				{/* <ProfilePicture userId={post?.id} selectedFile={post?.userImg} /> */}
				<div className="leading-tight">
					<h4 className="font-medium">
						<Link href={`/${id}`}>
							<a className="hover:text-primary">{post?.username}</a>
						</Link>
					</h4>
					<span className="text-xs text-slate-400">
						<Moment fromNow>{post?.timestamp?.toDate()}</Moment>
					</span>
				</div>
			</div>

			{session.user.uid === post?.id ? (
				<div
					className="absolute flex items-center p-2 text-sm rounded-md cursor-pointer right-4 top-3 group hover:bg-slate-100"
					onClick={(e) => {
						e.stopPropagation();
						alert("Delete the post");
						deleteDoc(doc(db, "posts", id));
						router.push("/");
					}}
				>
					<div className="flex items-center space-x-2 group-hover:text-red-600">
						<TrashIcon className="h-5" />
						<span>Delete</span>
					</div>
				</div>
			) : (
				""
			)}

			<div className="-mx-4">
				<p className="px-4 mt-4">{post?.text}</p>

				{post?.image ? (
					<Fragment>
						{post?.type === "video" ? (
							<video className="w-full mt-4 bg-slate-200" controls>
								<source src={post?.image} type="video/mp4" />
								Your browser does not support the video tag.
							</video>
						) : (
							<img
								src={post?.image}
								alt={post?.text}
								className="object-cover w-full mt-4 max-h-[500px] bg-slate-200"
							/>
						)}
					</Fragment>
				) : (
					""
				)}
			</div>

			<div className="flex items-center justify-between mt-4">
				<div className="flex items-center space-x-1">
					<div
						className="flex items-center p-2 text-sm rounded-md cursor-pointer group hover:bg-slate-100"
						onClick={(e) => {
							e.stopPropagation();
							setPostId(id);
							setIsOpen(true);
						}}
					>
						<div className="flex items-center space-x-2 group-hover:text-primary">
							<ChatIcon className="h-5 " />
						</div>
					</div>

					<div
						className="flex items-center p-2 text-sm rounded-md cursor-pointer group hover:bg-slate-100"
						onClick={(e) => {
							e.stopPropagation();
							likePost();
						}}
					>
						<div className="flex items-center">
							{liked ? (
								<HeartIconFilled className="h-5 text-pink-600" />
							) : (
								<HeartIcon className="h-5 group-hover:text-pink-600" />
							)}
						</div>
						{likes.length > 0 && (
							<span
								className={`group-hover:text-pink-600 text-sm ml-1 ${
									liked && "text-pink-600"
								}`}
							>
								{likes.length}
							</span>
						)}
					</div>
				</div>

				{comments.length > 0 && (
					<span className="text-sm">{comments.length} Comments</span>
				)}
			</div>

			{comments.length > 0 && (
				<div className="px-4 pt-6 mt-4 -mx-4 space-y-4 border-t border-gray-100">
					{comments.map((comment) => (
						<Comment
							key={comment.id}
							id={comment.id}
							comment={comment.data()}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default Post;

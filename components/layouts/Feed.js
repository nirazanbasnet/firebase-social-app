import { useEffect, useState } from "react";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import { db } from "../../firebase";
import Post from "../ui/Post";
import PostInput from "../ui/PostInput";

function Feed() {
	const [posts, setPosts] = useState([]);

	// Getting Data from Posts Collection
	useEffect(
		() =>
			onSnapshot(
				query(collection(db, "posts"), orderBy("timestamp", "desc")),
				(snapshot) => {
					setPosts(snapshot.docs);
				}
			),
		[db]
	);

	return (
		<div className="max-w-2xl mx-auto">
			{/* Post Input */}
			<PostInput />

			{/* List of Posts */}
			<div className="mt-10 space-y-6">
				{posts.map((post) => (
					<Post key={post.id} id={post.id} post={post.data()} />
				))}
			</div>
		</div>
	);
}

export default Feed;

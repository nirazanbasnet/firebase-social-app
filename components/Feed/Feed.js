import { SparklesIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import Input from "../Input/Input";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import { db } from "../../firebase";
import Post from "../Post/Post";

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
			{/* Input */}
			<Input />

			<div className="mt-10 space-y-6">
				{posts.map((post) => (
					<Post key={post.id} id={post.id} post={post.data()} />
				))}
			</div>
		</div>
	);
}

export default Feed;

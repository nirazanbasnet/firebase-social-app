import { onSnapshot, doc, query, orderBy } from "@firebase/firestore";
import { db } from "../../firebase";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useState } from "react";

function ProfilePicture({ userId, selectedFile }) {
	const [profilePicture, setProfilePicture] = useState(null);
	const { data: session } = useSession();

	useEffect(
		() =>
			onSnapshot(query(doc(db, "users", userId)), (snapshot) => {
				setProfilePicture(snapshot.data()?.profilePicture);
				console.log(snapshot.data());
			}),
		[db]
	);

	return (
		<div>
			<img
				src={selectedFile || profilePicture || session.user.image}
				alt={session.user.name}
				className="inline-block w-10 h-10 border border-gray-200 rounded-full shadow-md xl:mr-3"
			/>
		</div>
	);
}

export default ProfilePicture;

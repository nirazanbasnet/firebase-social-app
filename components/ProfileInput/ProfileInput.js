import { collection, serverTimestamp, setDoc, doc } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { db, storage } from "../../firebase";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

function ProfileInput() {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const filePickerRef = useRef(null);

	// Send post to firestore
	const sendPicture = async (selectedFile) => {
		if (loading) return;
		setLoading(true);

		const imageRef = ref(storage, `users/${session.user.uid}/image`);

		if (selectedFile) {
			await uploadString(imageRef, selectedFile, "data_url").then(async () => {
				const downloadURL = await getDownloadURL(imageRef);
				await setDoc(doc(db, "users", session.user.uid), {
					profilePicture: downloadURL,
				});
			});
		}

		setLoading(false);
		setSelectedFile(null);
	};

	// Add Image to post
	const addImageToPost = (e) => {
		const reader = new FileReader();
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0]);
		}

		reader.onload = (readerEvent) => {
			setSelectedFile(readerEvent.target.result);
			sendPicture(readerEvent.target.result);
		};
	};

	return (
		<div>
			<div onClick={() => filePickerRef.current.click()}>
				<div>
					<ProfilePicture
						userId={session.user.uid}
						selectedFile={selectedFile}
					/>
					{/* <img
						src={selectedFile || session.user.image}
						alt={session.user.name}
						className="inline-block w-10 h-10 border border-gray-200 rounded-full shadow-md xl:mr-3"
					/> */}
					<input type="file" />
				</div>
				<input
					type="file"
					ref={filePickerRef}
					hidden
					onChange={addImageToPost}
				/>
			</div>
		</div>
	);
}

export default ProfileInput;

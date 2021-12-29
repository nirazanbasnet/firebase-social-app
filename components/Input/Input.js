import {
	CalendarIcon,
	ChartBarIcon,
	EmojiHappyIcon,
	PhotographIcon,
	XIcon,
} from "@heroicons/react/outline";
import { useRef, useState } from "react";
import { db, storage } from "../../firebase";
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { signOut, useSession } from "next-auth/react";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

function Input() {
	const { data: session } = useSession();
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [selectedFileType, setSelectedFileType] = useState(null);
	const filePickerRef = useRef(null);
	const [showEmojis, setShowEmojis] = useState(false);

	// Send post to firestore
	const sendPost = async () => {
		if (loading) return;
		setLoading(true);

		const docRef = await addDoc(collection(db, "posts"), {
			id: session.user.uid,
			username: session.user.name,
			userImg: session.user.image,
			tag: session.user.tag,  
			text: input,
			timestamp: serverTimestamp(),
		});

		const imageRef = ref(storage, `posts/${docRef.id}/image`);

		if (selectedFile) {
			console.log(selectedFile);
			await uploadString(imageRef, selectedFile, "data_url").then(async () => {
				const downloadURL = await getDownloadURL(imageRef);
				await updateDoc(doc(db, "posts", docRef.id), {
					image: downloadURL,
					type: selectedFileType,
				});
			});
		}

		setLoading(false);
		setInput("");
		setSelectedFile(null);
		setSelectedFileType(null);
		setShowEmojis(false);
	};

	// Add Image to post
	const addImageToPost = (e) => {
		const reader = new FileReader();
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0]);
		}

		reader.onload = (readerEvent) => {
			console.log(e.target.files[0]);
			const type = e.target.files[0].type.startsWith("image")
				? "image"
				: e.target.files[0].type.startsWith("video")
				? "video"
				: "";

			if (!type) {
				alert("Only supports Image or Video type");
				return;
			}

			setSelectedFile(readerEvent.target.result);
			setSelectedFileType(type);
		};
	};

	// Add emoji to textarea
	const addEmoji = (e) => {
		let sym = e.unified.split("-");
		let codesArray = [];
		sym.forEach((el) => codesArray.push("0x" + el));
		let emoji = String.fromCodePoint(...codesArray);
		setInput(input + emoji);
	};

	return (
		<div
			className={`shadow shadow-slate-300 p-4 rounded-md ${
				loading && "opacity-60"
			}`}
		>
			<div className="flex mb-4">
				<img
					src={session.user.image}
					alt={session.user.name}
					className="w-12 h-12 mr-3 rounded-full cursor-pointer bg-slate-200"
				/>

				<div className="relative flex-grow">
					<div className="overflow-y-scroll scrollbar-hide">
						<textarea
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder={`What's Your Mind ? ${session.user.name}`}
							rows="2"
							className="w-full h-12 px-3 py-3 text-sm rounded-full outline-none resize-none xl:px-6 xl:pr-20 placeholder-slate-500 bg-slate-100"
						/>
					</div>

					{!loading && (
						<div className="xl:absolute flex items-center justify-between top-1.5 right-3">
							<div className="flex items-center space-x-1">
								<div
									className="icon"
									onClick={() => filePickerRef.current.click()}
								>
									<PhotographIcon className="h-6 text-green-500" />
									<input
										type="file"
										ref={filePickerRef}
										hidden
										// accept="image/png, image/gif, image/jpeg"
										onChange={addImageToPost}
									/>
								</div>

								<div
									className="icon"
									onClick={() => setShowEmojis(!showEmojis)}
								>
									<EmojiHappyIcon className="h-6 text-yellow-400" />
								</div>

								{showEmojis && (
									<Picker
										onSelect={addEmoji}
										style={{
											position: "absolute",
											marginTop: "465px",
											marginLeft: -40,
											maxWidth: "320px",
											borderRadius: "20px",
											zIndex: 999,
										}}
										theme="dark"
									/>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			{selectedFile && (
				<div className="relative my-4 rounded-md bg-slate-300">
					<div
						className="absolute flex items-center justify-center w-8 h-8 transition duration-75 bg-opacity-75 rounded-full cursor-pointer bg-slate-600 hover:bg-red-600 top-1 right-1"
						onClick={() => setSelectedFile(null)}
						title="Delete the photo"
					>
						<XIcon className="h-5 text-white" />
					</div>
					{selectedFileType === "image" ? (
						<img
							src={selectedFile}
							alt=""
							className="object-cover w-full rounded-md"
						/>
					) : (
						<video className="w-full" controls>
							<source src={selectedFile} type="video/mp4" />
							Your browser does not support the video tag.
						</video>
					)}
				</div>
			)}

			{!loading && (
				<div className="flex items-center justify-end">
					<button
						className="bg-primary text-white rounded-full px-6 py-1 font-medium text-lg shadow-md hover:bg-[#4a30cb] disabled:opacity-30 disabled:cursor-not-allowed"
						disabled={!input.trim() && !selectedFile}
						onClick={sendPost}
					>
						Share
					</button>
				</div>
			)}
		</div>
	);
}

export default Input;

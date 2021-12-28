import {
	ChartBarIcon,
	ChatIcon,
	DotsHorizontalIcon,
	HeartIcon,
	ShareIcon,
} from "@heroicons/react/outline";
import Moment from "react-moment";

function Comment({ comment }) {
	return (
		<div className="flex p-3 border-b border-gray-700 cursor-pointer">
			<img
				src={comment?.userImg}
				alt=""
				className="mr-4 rounded-full h-11 w-11"
			/>
			<div className="flex flex-col w-full space-y-2">
				<div className="flex justify-between">
					<div className="text-[#6e767d]">
						<div className="inline-block group">
							<h4 className="font-bold text-[#d9d9d9] text-[15px] sm:text-base inline-block group-hover:underline">
								{comment?.username}
							</h4>
							<span className="ml-1.5 text-sm sm:text-[15px]">
								@{comment?.tag}{" "}
							</span>
						</div>{" "}
						·{" "}
						<span className="hover:underline text-sm sm:text-[15px]">
							<Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
						</span>
						<p className="text-[#d9d9d9] mt-0.5 max-w-lg overflow-scroll text-[15px] sm:text-base">
							{comment?.comment}
						</p>
					</div>
					<div className="flex-shrink-0 icon group">
						<DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Comment;

import Moment from "react-moment";

function Comment({ comment }) {
	return (
		<div className="flex items-center">
			<img
				src={comment?.userImg}
				alt={comment?.username}
				className="w-10 h-10 mr-4 rounded-full bg-slate-200"
			/>
			<div className="p-2 px-4 rounded-md bg-slate-50 xl:min-w-[300px]">
				<div className="flex flex-wrap items-center justify-between">
					<h4 className="text-sm font-medium xl:text-base">{comment?.username}</h4>
					<span className="block w-full mb-2 text-xs text-slate-400 xl:w-auto xl:mb-0">
						<Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
					</span>
				</div>
				<p className="text-sm text-slate-500">{comment?.comment}</p>
			</div>
		</div>
	);
}

export default Comment;

import { useRouter } from "next/router";

function HeaderLink({ Icon, text, active }) {
	const router = useRouter();
	return (
		<div
			className={`flex text-white items-center text-lg space-x-2 ${
				active && "font-bold"
			}`}
			onClick={() => active && router.push("/")}
		>
			<Icon className="h-7" />
			<span className="hidden xl:inline">{text}</span>
		</div>
	);
}

export default HeaderLink;

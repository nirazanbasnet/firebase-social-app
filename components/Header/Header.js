import { LogoutIcon } from "@heroicons/react/outline";
import { HomeIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react/cjs/react.production.min";
import Link from "next/link";
import ProfileInput from "../ProfileInput/ProfileInput";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

function Header() {
	const { data: session } = useSession();
	console.log(session);
	return (
		<header className="flex items-center justify-between px-4 py-4 xl:px-10 bg-primary">
			<div className="flex items-center space-x-4">
				<Link href="/">
					<a className="flex items-center text-xl text-white">
						<HomeIcon className="mr-3 h-7" />
						<span>Home</span>
					</a>
				</Link>
			</div>

			{/* TODO:For Profile upload */}
			{/* <ProfileInput /> */}
			{/* <ProfilePicture userId={session.user.uid} /> */}
			<Menu as="div" className="relative">
				<Menu.Button>
					<div className="flex items-center text-left text-white cursor-pointer">
						<img
							src={session.user.image}
							alt={session.user.name}
							className="inline-block w-10 h-10 mr-2 border border-gray-200 rounded-full shadow-md xl:mr-3"
						/>
						<div className="leading-tight">
							<h4 className="font-medium">{session.user.name}</h4>
							<p className="text-xs">@{session.user.tag}</p>
						</div>
					</div>
				</Menu.Button>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute right-0 z-50 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
						<Menu.Item>
							{({ active }) => (
								<button
									onClick={signOut}
									className={`flex w-full items-center px-4 py-2 ${
										active && "text-primary"
									}`}
								>
									<LogoutIcon className="w-5 mr-3 " />
									<span>Logout</span>
								</button>
							)}
						</Menu.Item>
					</Menu.Items>
				</Transition>
			</Menu>
		</header>
	);
}

export default Header;

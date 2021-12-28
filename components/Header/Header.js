import Image from "next/image";
import { HashtagIcon, RssIcon, LogoutIcon } from "@heroicons/react/outline";
import { HomeIcon } from "@heroicons/react/solid";
import HeaderLink from "./HeaderLink";
import { signOut, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react/cjs/react.production.min";
import Link from "next/link";

function Header() {
	const { data: session } = useSession();
	return (
		<header className="flex items-center justify-between px-10 py-4 bg-primary">
			<div className="flex items-center space-x-4">
				<Link href="/">
					<a>
						<HeaderLink text="Home" Icon={HomeIcon} />
					</a>
				</Link>
				<HeaderLink text="Explore" Icon={HashtagIcon} />
			</div>
			<Menu as="div" className="relative">
				<Menu.Button>
					<div className="flex items-center text-left text-white cursor-pointer">
						<img
							src={session.user.image}
							alt={session.user.name}
							className="inline-block w-10 h-10 border border-gray-200 rounded-full shadow-md xl:mr-3"
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

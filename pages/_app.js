import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

import "../assets/sass/tailwind.scss";
import "../assets/sass/styles.scss";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	const { events: routerEvents } = useRouter();
	const [pageLoading, setPageLoading] = useState(false);

	useEffect(() => {
		const startLoader = () => {
			setPageLoading(true);
		};

		const stopLoader = () => {
			setPageLoading(false);
		};

		routerEvents.on("routeChangeStart", startLoader);
		routerEvents.on("routeChangeComplete", stopLoader);
		routerEvents.on("routeChangeError", stopLoader);
	}, [routerEvents]);

	return (
		<SessionProvider session={session}>
			<Fragment>
				{pageLoading ? <div className="page-loader"></div> : ""}
				<RecoilRoot>
					<Component {...pageProps} />
				</RecoilRoot>
			</Fragment>
		</SessionProvider>
	);
}

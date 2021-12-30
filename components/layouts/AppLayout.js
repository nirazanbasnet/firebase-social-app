import Head from "next/head";
import React from "react";
import Header from "./Header";

function AppLayout ({ title, children }){
	return (
		<main>
			<Head>
				<title>{title}</title>
				<link rel="icon" href="/favicon.ico" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
			</Head>
			{/* Header */}
			<Header />
			<div>{children}</div>
		</main>
	);
};

export default AppLayout


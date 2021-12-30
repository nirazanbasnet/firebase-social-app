import { signIn } from "next-auth/react";

function Login({ providers }) {
	return (
		<section className="relative grid min-h-screen place-content-center">
			<div className="absolute inset-0">
				<img
					src="/img/bg-hero.jpeg"
					className="object-cover w-full h-full"
					alt="..."
				/>
			</div>
			<div className="relative p-10 mx-auto bg-white rounded-md shadow-sm max-h-80 w-[320px]">
				<h2 className="mb-20 text-2xl font-medium">
					Sign Into <br />
					Your Account
				</h2>

				{Object.values(providers).map((provider) => (
					<div key={provider.name}>
						<button
							onClick={() => signIn(provider.id, { callbackUrl: "/" })}
							className="relative w-full px-5 py-3 overflow-hidden font-medium bg-gray-100 border border-gray-100 rounded-lg text-slate-600 group"
						>
							<span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
							<span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
							<span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
							<span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
							<span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
							<span className="relative flex items-center justify-center transition-colors duration-300 delay-200 group-hover:text-white ease">
								<img
									className="h-10 p-2 mr-2 bg-white rounded-md"
									src="/img/google-logo.png"
									alt="..."
								/>{" "}
								<span className="font-medium ">{provider.name} Sign in</span>
							</span>
						</button>
					</div>
				))}
			</div>
		</section>
	);
}

export default Login;

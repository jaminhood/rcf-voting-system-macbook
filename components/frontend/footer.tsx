import Link from "next/link"

const Footer = () => {
	return (
		<footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
					{/* Brand */}
					<div className="lg:col-span-2">
						<Link
							href="/"
							className="flex items-center gap-2 mb-4">
							<div className="w-8 h-8 rounded-xl bg-zinc-950 dark:bg-white flex items-center justify-center">
								<span className="text-white dark:text-zinc-950 text-xs font-black">R</span>
							</div>
							<span className="text-sm font-black tracking-tight dark:text-white">RCF Votes</span>
						</Link>
						<p className="text-sm text-zinc-500 leading-relaxed max-w-xs">A transparent and fair voting platform for the RCF elections. Every vote counts.</p>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-center gap-4">
					<p className="text-xs text-zinc-400 text-center">© {new Date().getFullYear()} RCF Votes. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}

export { Footer }

"use client"

import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const Header = () => {
	const { user, logout } = useAuth()
	const router = useRouter()
	const [menuOpen, setMenuOpen] = useState(false)

	const handleLogout = async () => {
		await logout()
		router.push("/login")
	}

	return (
		<header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-center md:justify-between h-16">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-xl bg-zinc-950 dark:bg-white flex items-center justify-center">
							<span className="text-white dark:text-zinc-950 text-xs font-black">R</span>
						</div>
						<span className="text-sm font-black tracking-tight dark:text-white">RCF Votes</span>
					</Link>

					{/* Desktop right */}
					<div className="hidden md:flex items-center gap-3">
						{user && (
							<div className="flex items-center gap-3">
								<Link
									href="/admin"
									className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
									Dashboard
								</Link>
								<div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">
									<div className="w-6 h-6 rounded-full bg-zinc-950 dark:bg-white flex items-center justify-center">
										<span className="text-white dark:text-zinc-950 text-xs font-black">{user.name.charAt(0).toUpperCase()}</span>
									</div>
									<span className="text-sm font-bold dark:text-white">{user.name.split(" ")[0]}</span>
								</div>
								<button
									onClick={handleLogout}
									className="px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
									Logout
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	)
}

export { Header }

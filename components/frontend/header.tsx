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
				<div className="flex items-center justify-between h-16">
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

					{/* Mobile menu button */}
					<button
						onClick={() => setMenuOpen(prev => !prev)}
						className="md:hidden p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:text-white">
						{menuOpen ? "✕" : "☰"}
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			{menuOpen && (
				<div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-1">
					{[
						{ label: "Home", href: "/" },
						{ label: "Candidates", href: "/candidates" },
						{ label: "Leaderboard", href: "/leaderboard" },
					].map(item => (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => setMenuOpen(false)}
							className="block px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
							{item.label}
						</Link>
					))}

					<div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
						{user ? (
							<>
								<div className="flex items-center gap-2 px-4 py-2.5">
									<div className="w-7 h-7 rounded-full bg-zinc-950 dark:bg-white flex items-center justify-center">
										<span className="text-white dark:text-zinc-950 text-xs font-black">{user.name.charAt(0).toUpperCase()}</span>
									</div>
									<span className="text-sm font-bold dark:text-white">{user.name}</span>
								</div>
								<Link
									href="/admin"
									onClick={() => setMenuOpen(false)}
									className="block px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
									Dashboard
								</Link>
								<button
									onClick={() => {
										handleLogout()
										setMenuOpen(false)
									}}
									className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
									Logout
								</button>
							</>
						) : (
							<div className="flex flex-col gap-2 pt-1">
								<Link
									href="/login"
									onClick={() => setMenuOpen(false)}
									className="block px-4 py-2.5 rounded-xl text-sm font-bold text-center border border-zinc-200 dark:border-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
									Sign in
								</Link>
								<Link
									href="/register"
									onClick={() => setMenuOpen(false)}
									className="block px-4 py-2.5 rounded-xl text-sm font-black text-center bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 transition-opacity">
									Sign up
								</Link>
							</div>
						)}
					</div>
				</div>
			)}
		</header>
	)
}

export { Header }

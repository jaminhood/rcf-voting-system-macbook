"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FC, ReactNode, useState } from "react"

const navItems = [
	{ label: "Dashboard", href: "/admin", icon: "⊞" },
	{ label: "Candidates", href: "/admin/candidates", icon: "◎" },
	{ label: "Vote Requests", href: "/admin/vote-requests", icon: "✓" },
]

const AdminLayout: FC<{ children: ReactNode }> = ({ children }) => {
	const pathname = usePathname()
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950">
			{/* Mobile overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-20 bg-black/50 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`sticky top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:z-auto`}>
				{/* Logo */}
				<div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
					<h1 className="text-lg font-black tracking-tight dark:text-white">RCF Voting System</h1>
					<p className="text-xs text-zinc-500 mt-0.5">Management Panel</p>
				</div>

				{/* Nav */}
				<nav className="flex-1 p-4 space-y-1">
					{navItems.map(item => {
						const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setSidebarOpen(false)}
								className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors
                                    ${active ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"}`}>
								<span className="text-base">{item.icon}</span>
								{item.label}
							</Link>
						)
					})}
				</nav>

				{/* Footer */}
				<div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
					<div className="flex items-center gap-3 px-4 py-2.5">
						<div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-black dark:text-white">A</div>
						<div>
							<p className="text-sm font-bold dark:text-white">Admin</p>
							<p className="text-xs text-zinc-500">admin@votesystem.com</p>
						</div>
					</div>
				</div>
			</aside>

			{/* Main content */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Topbar */}
				<header className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center gap-4 lg:hidden">
					<button
						onClick={() => setSidebarOpen(true)}
						className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:text-white">
						☰
					</button>
					<h1 className="text-sm font-black dark:text-white">RCF Voting System</h1>
				</header>

				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	)
}

export { AdminLayout }

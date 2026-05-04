"use client"

import { api } from "@/lib/axios"
import { useEffect, useState } from "react"

export default function AdminDashboard() {
	const [stats, setStats] = useState({
		candidates: 0,
		pending: 0,
		approved: 0,
		rejected: 0,
	})

	useEffect(() => {
		Promise.all([api.get("/api/candidates"), api.get("/api/vote-requests")]).then(([candidates, voteRequests]) => {
			const requests = voteRequests.data.data
			setStats({
				candidates: candidates.data.data.length,
				pending: requests.filter((r: any) => r.status === "pending").length,
				approved: requests.filter((r: any) => r.status === "approved").length,
				rejected: requests.filter((r: any) => r.status === "rejected").length,
			})
		})
	}, [])

	const cards = [
		{ label: "Total Candidates", value: stats.candidates, color: "text-zinc-900 dark:text-white" },
		{ label: "Pending Requests", value: stats.pending, color: "text-yellow-600" },
		{ label: "Approved Votes", value: stats.approved, color: "text-green-600" },
		{ label: "Rejected Requests", value: stats.rejected, color: "text-red-600" },
	]

	return (
		<div>
			<div className="mb-6 mx-auto max-w-5xl w-full">
				<h1 className="text-2xl font-black dark:text-white">Dashboard</h1>
				<p className="text-sm text-zinc-500 mt-1">Overview of the voting system</p>
			</div>

			<div className="grid grid-cols-2 gap-4 mx-auto max-w-5xl w-full">
				{cards.map(c => (
					<div
						key={c.label}
						className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-5">
						<p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">{c.label}</p>
						<p className={`text-3xl font-black ${c.color}`}>{c.value}</p>
					</div>
				))}
			</div>
		</div>
	)
}

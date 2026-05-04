"use client"

import { api } from "@/lib/axios"
import { useEffect, useState } from "react"

interface VoteRequest {
	id: number
	voter_name: string
	voter_email: string
	vote_count: number
	candidate: {
		id: number
		name: string
		position: string
	}
	proof_url: string
	status: "pending" | "approved" | "rejected"
	created_at: string
}

type FilterType = "all" | "pending" | "approved" | "rejected"
type ActionType = "approve" | "reject"

interface ModalState {
	open: boolean
	action: ActionType | null
	request: VoteRequest | null
}

const statusStyles: Record<string, string> = {
	pending: "bg-yellow-100 text-yellow-800",
	approved: "bg-green-100 text-green-800",
	rejected: "bg-red-100 text-red-800",
}

const truncate = (str: string, n: number) => (str.length > n ? str.slice(0, n) + "..." : str)

const fmt = (iso: string) =>
	new Date(iso).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	})

const PRICE_PER_VOTE = Number(process.env.NEXT_PUBLIC_PRICE_PER_VOTE) || 100

const VoteRequests = () => {
	const [requests, setRequests] = useState<VoteRequest[]>([])
	const [filter, setFilter] = useState<FilterType>("all")
	const [loading, setLoading] = useState(true)
	const [actionLoading, setActionLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [modal, setModal] = useState<ModalState>({
		open: false,
		action: null,
		request: null,
	})

	const fetchRequests = async () => {
		setLoading(true)
		setError(null)
		try {
			const { data } = await api.get("/api/vote-requests")
			setRequests(data.data)
		} catch {
			setError("Failed to load vote requests.")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchRequests()
	}, [])

	const openModal = (request: VoteRequest, action: ActionType) => {
		setModal({ open: true, action, request })
	}

	const closeModal = () => {
		setModal({ open: false, action: null, request: null })
	}

	const confirmAction = async () => {
		if (!modal.request || !modal.action) return
		setActionLoading(true)
		try {
			await api.post(`/api/vote-requests/${modal.request.id}/${modal.action}`)
			setRequests(prev => prev.map(r => (r.id === modal.request!.id ? { ...r, status: modal.action === "approve" ? "approved" : "rejected" } : r)))
			closeModal()
		} catch {
			setError("Action failed. Please try again.")
		} finally {
			setActionLoading(false)
		}
	}

	const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter)

	const stats = {
		pending: requests.filter(r => r.status === "pending").length,
		approved: requests.filter(r => r.status === "approved").length,
		rejected: requests.filter(r => r.status === "rejected").length,
		totalVotes: requests.filter(r => r.status === "approved").reduce((sum, r) => sum + r.vote_count, 0),
		totalRevenue: requests.filter(r => r.status === "approved").reduce((sum, r) => sum + r.vote_count * PRICE_PER_VOTE, 0),
	}

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-black dark:text-white">Vote Requests</h1>
					<p className="text-sm text-zinc-500 mt-1">Review and approve pending voter submissions</p>
				</div>
				<button
					onClick={fetchRequests}
					className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
					Refresh
				</button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
				{[
					{ label: "Pending", value: stats.pending, color: "text-yellow-600" },
					{ label: "Approved", value: stats.approved, color: "text-green-600" },
					{ label: "Rejected", value: stats.rejected, color: "text-red-600" },
					{
						label: "Votes Confirmed",
						value: stats.totalVotes.toLocaleString(),
						color: "text-blue-600",
					},
					{
						label: "Revenue",
						value: `₦${stats.totalRevenue.toLocaleString()}`,
						color: "text-emerald-600",
					},
				].map(s => (
					<div
						key={s.label}
						className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4">
						<p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">{s.label}</p>
						<p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
					</div>
				))}
			</div>

			{error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

			{/* Filter */}
			<div className="flex gap-2 mb-4 flex-wrap">
				{(["all", "pending", "approved", "rejected"] as FilterType[]).map(f => (
					<button
						key={f}
						onClick={() => setFilter(f)}
						className={`px-4 py-1.5 rounded-xl text-sm font-bold capitalize transition-colors ${filter === f ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "border border-zinc-200 dark:border-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
						{f}
						{f !== "all" && <span className="ml-1.5 text-xs opacity-60">({requests.filter(r => r.status === f).length})</span>}
					</button>
				))}
			</div>

			{/* Table — desktop */}
			<div className="hidden md:block rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
				{loading ? (
					<div className="p-12 text-center text-sm text-zinc-500">Loading vote requests...</div>
				) : filtered.length === 0 ? (
					<div className="p-12 text-center text-sm text-zinc-500">No requests found</div>
				) : (
					<table className="w-full text-sm">
						<thead className="bg-zinc-50 dark:bg-zinc-800">
							<tr>
								{["Voter", "Email", "Candidate", "Votes", "Amount", "Submitted", "Status", "Proof", "Actions"].map(h => (
									<th
										key={h}
										className="text-left px-4 py-3 text-zinc-500 font-bold text-xs uppercase tracking-wider">
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
							{filtered.map(r => (
								<tr
									key={r.id}
									className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
									<td className="px-4 py-3 font-bold dark:text-white">{truncate(r.voter_name, 16)}</td>
									<td className="px-4 py-3 text-zinc-500">{truncate(r.voter_email, 20)}</td>
									<td className="px-4 py-3">
										<p className="font-bold dark:text-white">{truncate(r.candidate.name, 14)}</p>
										<p className="text-xs text-zinc-500">{r.candidate.position}</p>
									</td>
									<td className="px-4 py-3">
										<span className="font-black text-blue-600">{r.vote_count}</span>
									</td>
									<td className="px-4 py-3 font-bold text-emerald-600 whitespace-nowrap">₦{(r.vote_count * PRICE_PER_VOTE).toLocaleString()}</td>
									<td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{fmt(r.created_at)}</td>
									<td className="px-4 py-3">
										<span className={`text-xs px-3 py-1 rounded-full font-bold capitalize ${statusStyles[r.status]}`}>{r.status}</span>
									</td>
									<td className="px-4 py-3">
										<a
											href={`${process.env.NEXT_PUBLIC_API_URL}${r.proof_url}`}
											target="_blank"
											rel="noreferrer"
											className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 font-bold dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
											View
										</a>
									</td>
									<td className="px-4 py-3">
										{r.status === "pending" ? (
											<div className="flex gap-2">
												<button
													onClick={() => openModal(r, "approve")}
													className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-800 font-bold hover:bg-green-200 transition-colors">
													Approve
												</button>
												<button
													onClick={() => openModal(r, "reject")}
													className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-800 font-bold hover:bg-red-200 transition-colors">
													Reject
												</button>
											</div>
										) : (
											<span className="text-zinc-400 text-xs">—</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			{/* Cards — mobile */}
			<div className="md:hidden space-y-3">
				{loading ? (
					<p className="text-sm text-zinc-500 text-center py-8">Loading...</p>
				) : filtered.length === 0 ? (
					<p className="text-sm text-zinc-500 text-center py-8">No requests found</p>
				) : (
					filtered.map(r => (
						<div
							key={r.id}
							className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-4 space-y-3">
							<div className="flex items-start justify-between">
								<div>
									<p className="font-black dark:text-white">{r.voter_name}</p>
									<p className="text-xs text-zinc-500">{r.voter_email}</p>
								</div>
								<span className={`text-xs px-3 py-1 rounded-full font-bold capitalize ${statusStyles[r.status]}`}>{r.status}</span>
							</div>

							<div className="grid grid-cols-2 gap-2 text-sm">
								<div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3">
									<p className="text-xs text-zinc-500 mb-0.5">Candidate</p>
									<p className="font-bold dark:text-white text-xs">{truncate(r.candidate.name, 16)}</p>
									<p className="text-xs text-zinc-500">{r.candidate.position}</p>
								</div>
								<div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3">
									<p className="text-xs text-zinc-500 mb-0.5">Votes / Amount</p>
									<p className="font-black text-blue-600">{r.vote_count} votes</p>
									<p className="text-xs font-bold text-emerald-600">₦{(r.vote_count * PRICE_PER_VOTE).toLocaleString()}</p>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<p className="text-xs text-zinc-400">{fmt(r.created_at)}</p>
								<a
									href={`${process.env.NEXT_PUBLIC_API_URL}${r.proof_url}`}
									target="_blank"
									rel="noreferrer"
									className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 font-bold dark:text-white">
									View Proof
								</a>
							</div>

							{r.status === "pending" && (
								<div className="flex gap-2 pt-1">
									<button
										onClick={() => openModal(r, "approve")}
										className="flex-1 py-2 rounded-xl bg-green-100 text-green-800 text-xs font-black hover:bg-green-200 transition-colors">
										Approve
									</button>
									<button
										onClick={() => openModal(r, "reject")}
										className="flex-1 py-2 rounded-xl bg-red-100 text-red-800 text-xs font-black hover:bg-red-200 transition-colors">
										Reject
									</button>
								</div>
							)}
						</div>
					))
				)}
			</div>

			{/* Confirmation Modal */}
			{modal.open && modal.request && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
					<div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-sm shadow-xl border border-zinc-200 dark:border-zinc-700">
						<h2 className="text-lg font-black dark:text-white mb-2">{modal.action === "approve" ? "Approve vote request?" : "Reject vote request?"}</h2>
						<p className="text-sm text-zinc-500 mb-4">{modal.action === "approve" ? `This will approve ${modal.request.voter_name}'s request and add ${modal.request.vote_count} vote${modal.request.vote_count > 1 ? "s" : ""} to ${modal.request.candidate.name}.` : `This will reject ${modal.request.voter_name}'s request. They will be notified via email.`}</p>

						{/* Request summary */}
						<div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3 mb-5 space-y-1.5 text-sm">
							<div className="flex justify-between">
								<span className="text-zinc-500">Voter</span>
								<span className="font-bold dark:text-white">{modal.request.voter_name}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-zinc-500">Candidate</span>
								<span className="font-bold dark:text-white">{modal.request.candidate.name}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-zinc-500">Votes</span>
								<span className="font-black text-blue-600">{modal.request.vote_count}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-zinc-500">Amount</span>
								<span className="font-black text-emerald-600">₦{(modal.request.vote_count * PRICE_PER_VOTE).toLocaleString()}</span>
							</div>
						</div>

						<div className="flex gap-3">
							<button
								onClick={closeModal}
								disabled={actionLoading}
								className="flex-1 h-11 rounded-xl border border-zinc-200 dark:border-zinc-700 font-black text-sm dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50">
								Cancel
							</button>
							<button
								onClick={confirmAction}
								disabled={actionLoading}
								className={`flex-1 h-11 rounded-xl font-black text-sm transition-colors disabled:opacity-50 ${modal.action === "approve" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}>
								{actionLoading ? "Processing..." : modal.action === "approve" ? "Yes, approve" : "Yes, reject"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export { VoteRequests }

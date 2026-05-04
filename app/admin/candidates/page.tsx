"use client"

import { api } from "@/lib/axios"
import { Candidate } from "@/typings/candidates"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const truncate = (str: string, n: number) => (str.length > n ? str.slice(0, n) + "..." : str)

export default function CandidatesPage() {
	const [candidates, setCandidates] = useState<Candidate[]>([])
	const [loading, setLoading] = useState(true)
	const [deletingId, setDeletingId] = useState<number | null>(null)

	const fetchCandidates = async () => {
		setLoading(true)
		try {
			const { data } = await api.get("/api/candidates")
			setCandidates(data.data)
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this candidate?")) return
		setDeletingId(id)
		try {
			await api.delete(`/api/candidates/${id}`)
			setCandidates(prev => prev.filter(c => c.id !== id))
		} finally {
			setDeletingId(null)
		}
	}

	useEffect(() => {
		fetchCandidates()
	}, [])

	return (
		<div>
			<div className="flex max-w-5xl mx-auto w-full items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-black dark:text-white">Candidates</h1>
					<p className="text-sm text-zinc-500 mt-1">Manage all election candidates</p>
				</div>
				<Link
					href="/admin/candidates/create"
					className="px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-sm font-black hover:opacity-90 transition-opacity">
					+ Add Candidate
				</Link>
			</div>

			{loading ? (
				<p className="text-sm text-zinc-500">Loading candidates...</p>
			) : (
				<div className="grid max-w-5xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{candidates.map(c => (
						<div
							key={c.id}
							className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
							<div className="relative h-62 bg-zinc-100 dark:bg-zinc-800">
								<Image
									src={`${process.env.NEXT_PUBLIC_API_URL}public${c.image_url}`}
									alt={c.name}
									fill
									className="object-cover object-bottom"
								/>
							</div>
							<div className="p-4">
								<h2 className="font-black dark:text-white">{truncate(c.name, 20)}</h2>
								<p className="text-xs text-zinc-500 mt-0.5">{c.position}</p>
								<div className="flex items-center justify-between mt-1">
									<p className="text-xs text-zinc-400">{c.votes.toLocaleString()} votes</p>
								</div>
								<div className="flex gap-2 mt-4">
									<Link
										href={`/admin/candidates/${c.id}/edit`}
										className="flex-1 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-black dark:text-white flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
										Edit
									</Link>
									<button
										onClick={() => handleDelete(c.id)}
										disabled={deletingId === c.id}
										className="flex-1 h-9 rounded-xl bg-red-50 text-red-600 border border-red-100 text-xs font-black hover:bg-red-100 transition-colors disabled:opacity-50">
										{deletingId === c.id ? "Deleting..." : "Delete"}
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

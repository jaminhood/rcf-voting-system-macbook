"use client"

import { useApp } from "@/context/app-context"
import { api } from "@/lib/axios"
import { Candidate } from "@/typings/candidates"
import Image from "next/image"
import { useEffect, useState } from "react"
import { CandidateProfileCard } from "../shared/candidate-profile-card"

const CandidateProfile = () => {
	const [candidates, setCandidates] = useState<Candidate[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { fetchCandidates } = useApp()

	const fetchData = async () => {
		setLoading(true)
		fetchCandidates()
			.then(data => setCandidates(data))
			.catch(error => setError(error))
			.finally(() => setLoading(false))
	}

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<section className="grid md:grid-cols-3 grid-cols-1 gap-8 w-full p-4 sm:p-6 lg:p-8 max-w-7xl bg-zinc-50 dark:bg-black">
			<div className="md:col-span-3 flex items-center gap-3 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/30 shadow-sm">
				<div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/50">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-5 h-5 text-amber-600 dark:text-amber-400"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<circle
							cx="12"
							cy="12"
							r="10"
						/>
						<line
							x1="12"
							y1="8"
							x2="12"
							y2="12"
						/>
						<line
							x1="12"
							y1="16"
							x2="12.01"
							y2="16"
						/>
					</svg>
				</div>
				<p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
					<span className="font-semibold">Payment required to vote.</span> Please upload your proof of payment — your request will be reviewed by an admin before your vote is counted.
				</p>
			</div>
			{loading && (
				<div className="md:col-span-3 justify-center items-center py-8 px-4">
					<p className="dark:text-zinc-100 text-zinc-900 text-center">Loading Candidates</p>
				</div>
			)}
			{candidates.length === 0 && !loading && (
				<div className="md:col-span-3 justify-center items-center py-8 px-4">
					<p className="dark:text-zinc-100 text-zinc-900 text-center">No Candidate yet</p>
				</div>
			)}
			{candidates.map((candidate, idx) => (
				<CandidateProfileCard
					candidate={candidate}
					key={idx}
				/>
			))}
		</section>
	)
}

export { CandidateProfile }

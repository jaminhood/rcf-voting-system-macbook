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
		<section className="grid md:grid-cols-3 grid-cols-1 gap-8 w-full max-w-7xl p-4 bg-zinc-50 dark:bg-black">
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

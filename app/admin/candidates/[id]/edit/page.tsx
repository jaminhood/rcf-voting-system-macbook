"use client"

import { CandidateForm } from "@/components/admin/candidate-form"
import { api } from "@/lib/axios"
import { Candidate } from "@/typings/candidates"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditCandidatePage() {
	const { id } = useParams()
	const [candidate, setCandidate] = useState<Candidate | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		api
			.get(`/api/candidates/${id}`)
			.then(({ data }) => setCandidate(data.data))
			.finally(() => setLoading(false))
	}, [id])

	if (loading) return <p className="text-sm text-zinc-500">Loading candidate...</p>
	if (!candidate) return <p className="text-sm text-red-500">Candidate not found.</p>

	return <CandidateForm candidate={candidate} />
}

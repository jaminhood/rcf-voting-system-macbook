import { api } from "@/lib/axios"
import { Candidate } from "@/typings/candidates"
import { FC, useRef, useState } from "react"

interface Props {
	candidate: Candidate
	onClose: () => void
}

const PRICE_PER_VOTE = Number(process.env.NEXT_PUBLIC_PRICE_PER_VOTE) || 100 // in Naira — adjust as needed

const VotingModal: FC<Props> = ({ candidate, onClose }) => {
	const [voterName, setVoterName] = useState("")
	const [voterEmail, setVoterEmail] = useState("")
	const [voteCount, setVoteCount] = useState(1)
	const [proof, setProof] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)
	const [submitted, setSubmitted] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const fileRef = useRef<HTMLInputElement>(null)

	const totalAmount = voteCount * PRICE_PER_VOTE

	const handleVoteCount = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value)
		if (value >= 1 && value <= 100) setVoteCount(value)
	}

	const handleSubmit = async () => {
		if (!voterName || !voterEmail || !proof) {
			setError("Please fill in all fields and upload proof of payment.")
			return
		}

		setLoading(true)
		setError(null)

		try {
			const formData = new FormData()
			formData.append("candidate_id", String(candidate.id))
			formData.append("voter_name", voterName)
			formData.append("voter_email", voterEmail)
			formData.append("vote_count", String(voteCount))
			formData.append("proof_of_payment", proof)

			await api.post("/api/vote-requests", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})

			setSubmitted(true)
		} catch (err) {
			setError("Failed to submit vote request. Please try again.")
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
			<div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90dvh]">
				{submitted ? (
					<div className="overflow-y-auto p-6">
						<div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
							<span className="text-2xl">✓</span>
						</div>
						<h2 className="text-2xl font-black dark:text-white">Request Submitted!</h2>
						<p className="text-zinc-500 text-sm">
							Your vote request for <span className="font-bold dark:text-white">{candidate.name}</span> has been submitted and is awaiting admin approval. You will be notified via email.
						</p>

						{/* Summary */}
						<div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 text-left space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-zinc-500">Candidate</span>
								<span className="font-bold dark:text-white">{candidate.name}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-zinc-500">Votes Requested</span>
								<span className="font-bold dark:text-white">{voteCount}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-zinc-500">Amount Paid</span>
								<span className="font-bold dark:text-white">₦{totalAmount.toLocaleString()}</span>
							</div>
						</div>

						<button
							onClick={onClose}
							className="w-full h-12 rounded-2xl bg-zinc-950 text-white font-black tracking-widest uppercase text-sm">
							Close
						</button>
					</div>
				) : (
					<>
						{/* Header — fixed, never scrolls */}
						<div className="flex items-start justify-between p-6 pb-4 shrink-0">
							<div>
								<h2 className="text-xl font-black dark:text-white">Vote for {candidate.name}</h2>
								<p className="text-zinc-500 text-xs mt-0.5">{candidate.position}</p>
							</div>
							<button
								onClick={onClose}
								className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-lg leading-none mt-0.5">
								✕
							</button>
						</div>

						{/* Scrollable body */}
						<div className="overflow-y-auto px-6 pb-4 flex-1">
							<div className="rounded-lg border border-zinc-700/50 bg-zinc-800/40 p-4 mb-5 space-y-2.5">
								<p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Payment Details</p>

								<div className="flex items-center justify-between gap-4">
									<span className="text-xs text-zinc-500 shrink-0">Account Number</span>
									<span className="text-sm font-mono font-medium text-zinc-100 tracking-wider">5073720757</span>
								</div>

								<div className="flex items-center justify-between gap-4">
									<span className="text-xs text-zinc-500 shrink-0">Account Name</span>
									<span className="text-sm font-medium text-zinc-100">Benjamin Onyebuch Ovu</span>
								</div>

								<div className="flex items-center justify-between gap-4">
									<span className="text-xs text-zinc-500 shrink-0">Bank Name</span>
									<span className="text-sm font-medium text-zinc-100">Moniepoint</span>
								</div>
							</div>

							{/*  */}
							<div className="md:col-span-3 flex items-center gap-3 px-3 py-2 mb-5 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/30 shadow-sm">
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
							{/*  */}

							{error && <div className="text-red-500 text-sm mb-4 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 p-3 rounded-xl">{error}</div>}

							<div className="space-y-4">
								<div className="space-y-4">
									{/* Full Name */}
									<div>
										<label className="text-sm font-bold dark:text-white block mb-1.5">Full Name</label>
										<input
											type="text"
											value={voterName}
											onChange={e => setVoterName(e.target.value)}
											placeholder="Enter your full name"
											className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm outline-none focus:border-zinc-400 transition-colors"
										/>
									</div>

									{/* Email */}
									<div>
										<label className="text-sm font-bold dark:text-white block mb-1.5">Email Address</label>
										<input
											type="email"
											value={voterEmail}
											onChange={e => setVoterEmail(e.target.value)}
											placeholder="Enter your email"
											className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm outline-none focus:border-zinc-400 transition-colors"
										/>
									</div>

									{/* Number of votes */}
									<div>
										<label className="text-sm font-bold dark:text-white block mb-1.5">Number of Votes</label>
										<div className="flex items-center gap-3">
											<button
												onClick={() => setVoteCount(prev => Math.max(1, prev - 1))}
												className="w-11 h-11 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:text-white font-black text-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center">
												−
											</button>
											<input
												type="number"
												min={1}
												max={100}
												value={voteCount}
												onChange={handleVoteCount}
												className="flex-1 h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm text-center outline-none focus:border-zinc-400 transition-colors"
											/>
											<button
												onClick={() => setVoteCount(prev => Math.min(100, prev + 1))}
												className="w-11 h-11 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:text-white font-black text-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center">
												+
											</button>
										</div>
									</div>

									{/* Amount summary */}
									<div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 space-y-2">
										<div className="flex justify-between text-sm">
											<span className="text-zinc-500">Price per vote</span>
											<span className="font-bold dark:text-white">₦{PRICE_PER_VOTE.toLocaleString()}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-zinc-500">Number of votes</span>
											<span className="font-bold dark:text-white">{voteCount}</span>
										</div>
										<div className="border-t border-zinc-200 dark:border-zinc-700 pt-2 flex justify-between">
											<span className="text-sm font-black dark:text-white">Total Amount</span>
											<span className="text-sm font-black dark:text-white">₦{totalAmount.toLocaleString()}</span>
										</div>
									</div>

									{/* Proof of payment */}
									<div>
										<label className="text-sm font-bold dark:text-white block mb-1.5">Proof of Payment</label>
										<div
											onClick={() => fileRef.current?.click()}
											className="w-full h-24 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors">
											{proof ? (
												<div className="text-center">
													<p className="text-sm text-zinc-700 dark:text-zinc-300 font-bold">{proof.name}</p>
													<p className="text-xs text-zinc-400 mt-0.5">Click to change file</p>
												</div>
											) : (
												<div className="text-center">
													<p className="text-sm text-zinc-400 font-bold">Click to upload</p>
													<p className="text-xs text-zinc-400 mt-0.5">JPG, PNG or PDF — max 5MB</p>
												</div>
											)}
										</div>
										<input
											ref={fileRef}
											type="file"
											accept=".jpg,.jpeg,.png,.pdf"
											className="hidden"
											onChange={e => setProof(e.target.files?.[0] ?? null)}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Actions — fixed at bottom, never scrolls */}
						<div className="flex gap-3 p-6 pt-4 shrink-0 border-t border-zinc-100 dark:border-zinc-800">
							<button
								onClick={onClose}
								className="flex-1 h-12 rounded-2xl border border-zinc-200 dark:border-zinc-700 font-black tracking-widest uppercase text-sm dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
								Cancel
							</button>
							<button
								onClick={handleSubmit}
								disabled={loading}
								className="flex-1 h-12 rounded-2xl bg-zinc-950 text-white font-black tracking-widest uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
								{loading ? "Submitting..." : `Pay ₦${totalAmount.toLocaleString()}`}
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export { VotingModal }

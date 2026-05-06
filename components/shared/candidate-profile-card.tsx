import { Candidate } from "@/typings/candidates"
import { truncate } from "@/utils/general"
import Image from "next/image"
import { FC, useState } from "react"
import { VotingModal } from "../frontend/voting-modal"

const CandidateProfileCard: FC<{ candidate: Candidate }> = ({ candidate }) => {
	const [showModal, setShowModal] = useState(false)

	return (
		<>
			<div className="w-full rounded-lg overflow-hidden flex group flex-col cursor-pointer shadow-2xl">
				<div className="h-100 relative overflow-hidden">
					<Image
						src={`${process.env.NEXT_PUBLIC_API_URL}public${candidate.image_url}`}
						className="w-full h-full object-cover z-0 object-bottom group-hover:scale-110 transition-all ease-in-out duration-300"
						alt={candidate.name}
						fill
					/>
				</div>
				<div className="p-4 -mt-8 rounded-t-2xl dark:bg-zinc-100 bg-white z-10 transition-all ease-in-out duration-300">
					<h2 className="text-zinc-950 font-black text-2xl">{truncate(candidate.name, 20)}</h2>
					<h6 className="text-zinc-800 italic text-xs">
						{"{"} {candidate.position} {"}"}
					</h6>
					<hr className="my-2 border-t border-zinc-300" />
					<div className="flex justify-between items-center">
						<h5 className="text-zinc-950 font-black text-sm">Votes Count:</h5>
						<h5 className="text-zinc-950 font-black text-sm">{candidate.votes}</h5>
					</div>
					<div>
						<button
							onClick={() => setShowModal(true)}
							className="h-12 w-full cursor-pointer bg-zinc-950 text-zinc-100 inline-flex items-center mt-4 justify-center rounded-2xl uppercase font-black tracking-widest border border-solid border-black/8 px-5 transition-colors dark:bg-zinc-950 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-full">
							Vote
						</button>
					</div>
				</div>
			</div>

			{showModal && (
				<VotingModal
					candidate={candidate}
					onClose={() => setShowModal(false)}
				/>
			)}
		</>
	)
}

export { CandidateProfileCard }

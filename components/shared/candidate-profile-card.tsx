import { Candidate } from "@/typings/candidates"
import { truncate } from "@/utils/general"
import Image from "next/image"
import { FC, useState } from "react"
import { VotingModal } from "../frontend/voting-modal"

const CandidateProfileCard: FC<{ candidate: Candidate }> = ({ candidate }) => {
	const [showModal, setShowModal] = useState(false)

	return (
		<>
			<div className="w-full p-2 rounded-lg relative overflow-hidden h-120 flex group flex-col-reverse cursor-pointer">
				<Image
					src={candidate.image_url}
					className="w-full h-full object-cover z-0 object-top group-hover:scale-110 transition-all ease-in-out duration-300"
					alt="/placeholder.jpg"
					fill
				/>
				<div className="p-4 rounded-2xl dark:bg-zinc-100 z-10 relative mt-auto transition-all ease-in-out duration-300">
					<h2 className="dark:text-zinc-950 font-black text-2xl">{truncate(candidate.name, 17)}</h2>
					<h6 className="dark:text-zinc-800 italic text-xs">
						{"{"} {candidate.position} {"}"}
					</h6>
					<hr className="my-2 border-t border-zinc-300" />
					<div className="flex justify-between items-center">
						<h5 className="dark:text-zinc-950 font-black text-sm">Votes Count:</h5>
						<h5 className="dark:text-zinc-950 font-black text-sm">{candidate.votes}</h5>
					</div>
					<div>
						<button
							onClick={() => setShowModal(true)}
							className="h-12 w-full cursor-pointer inline-flex items-center mt-4 justify-center rounded-2xl uppercase font-black tracking-widest border border-solid border-black/8 px-5 transition-colors dark:bg-zinc-950 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-full">
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

import { Candidate } from "@/typings/candidates"
import { truncate } from "@/utils/general"
import Image from "next/image"
import { FC, useState } from "react"
import { VotingModal } from "../frontend/voting-modal"

const CandidateProfileCard: FC<{ candidate: Candidate }> = ({ candidate }) => {
	const [showModal, setShowModal] = useState(false)

	return (
		<>
			<div className="flex flex-col w-full overflow-hidden rounded-lg shadow-2xl cursor-pointer group">
				<div className="relative overflow-hidden h-100">
					<Image
						src={`${process.env.NEXT_PUBLIC_API_URL}public${candidate.image_url}`}
						className="z-0 object-cover object-bottom w-full h-full transition-all duration-300 ease-in-out group-hover:scale-110"
						alt={candidate.name}
						fill
					/>
				</div>
				<div className="z-10 p-4 -mt-8 transition-all duration-300 ease-in-out bg-white rounded-t-2xl dark:bg-zinc-100">
					<h2 className="text-2xl font-black text-zinc-950">{truncate(candidate.name, 20)}</h2>
					<h6 className="text-xs italic text-zinc-800">
						{"{"} {candidate.position} {"}"}
					</h6>
					<hr className="my-2 border-t border-zinc-300" />
					{/* <div className="flex items-center justify-between">
						<h5 className="text-sm font-black text-zinc-950">Votes Count:</h5>
						<h5 className="text-sm font-black text-zinc-950">{candidate.votes}</h5>
					</div> */}
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

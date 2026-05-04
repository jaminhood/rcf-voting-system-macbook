import { VoteRequests } from "@/components/admin/vote-requests"
import { CandidateProfile } from "@/components/frontend/candidate-profile"

export default function VoteRequestsScreen() {
	return (
		<main className="flex flex-col flex-1 max-w-5xl w-full mx-auto items-center bg-zinc-50 font-sans dark:bg-black">
			<VoteRequests />
		</main>
	)
}

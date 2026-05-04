import { CandidateProfile } from "@/components/frontend/candidate-profile"

export default function Home() {
	return (
		<main className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
			<CandidateProfile />
		</main>
	)
}

"use client"

import { api } from "@/lib/axios"
import { Candidate } from "@/typings/candidates"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FC, useRef, useState } from "react"

interface Props {
	candidate?: Candidate
}

const awardTitles = [
	"Graphics and Creative Designer of the Year",
	"Vocal Minister of the Year (Male)",
	"Most Influential Christian Student",
	"Creative Director of the Zone",
	"Voice of Enugu/Ebonyi Zone (Female)",
	"Bible Scholar of the Year",
	"Most Dedicated Worker",
	"RCFite of the Year",
	"Gospel Content Creator of the Year",
	"Most Elegant RCFite (Female)",
	"Excellence in Personal Presentation (Male)",
	"Orator of the Year",
	"Most Outstanding Worker of the Year",
	"Christian Model of the Year (Male)",
	"Christian Model of the Year (Female)",
	"Praise Machine of the Year",
]

const CandidateForm: FC<Props> = ({ candidate }) => {
	const router = useRouter()
	const isEditing = !!candidate
	const fileRef = useRef<HTMLInputElement>(null)

	const [name, setName] = useState(candidate?.name ?? "")
	const [position, setPosition] = useState(candidate?.position ?? "")
	const [image, setImage] = useState<File | null>(null)
	const [preview, setPreview] = useState<string | null>(candidate?.image_url ? `${process.env.NEXT_PUBLIC_API_URL}public${candidate?.image_url}` : null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null
		setImage(file)
		if (file) setPreview(URL.createObjectURL(file))
	}

	const handleSubmit = async () => {
		if (!name || !position) {
			setError("Name and position are required.")
			return
		}
		if (!isEditing && !image) {
			setError("Please upload a candidate image.")
			return
		}

		setLoading(true)
		setError(null)

		try {
			const formData = new FormData()
			formData.append("name", name)
			formData.append("position", position)
			if (image) formData.append("image", image)
			if (isEditing) formData.append("_method", "PUT")

			await api.post(isEditing ? `/api/candidates/${candidate.id}` : "/api/candidates", formData, { headers: { "Content-Type": "multipart/form-data" } })

			router.push("/admin/candidates")
			router.refresh()
		} catch {
			setError("Something went wrong. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="max-w-xl mx-auto">
			<div className="mb-6">
				<h1 className="text-2xl font-black dark:text-white">{isEditing ? "Edit Candidate" : "Add Candidate"}</h1>
				<p className="text-sm text-zinc-500 mt-1">{isEditing ? "Update the candidate's details below." : "Fill in the details to add a new candidate."}</p>
			</div>

			{error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}

			<div className="space-y-5">
				{/* Image upload */}
				<div>
					<label className="text-sm font-bold dark:text-white block mb-2">Candidate Image</label>
					<div
						onClick={() => fileRef.current?.click()}
						className="relative w-full h-52 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 overflow-hidden cursor-pointer hover:border-zinc-500 transition-colors flex items-center justify-center bg-zinc-50 dark:bg-zinc-800">
						{preview ? (
							<Image
								src={preview}
								alt="Preview"
								fill
								className="object-cover object-top"
							/>
						) : (
							<div className="text-center">
								<p className="text-sm font-bold text-zinc-400">Click to upload image</p>
								<p className="text-xs text-zinc-400 mt-1">JPG, PNG or WEBP — max 2MB</p>
							</div>
						)}
						{preview && (
							<div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
								<p className="text-white text-sm font-bold">Change image</p>
							</div>
						)}
					</div>
					<input
						ref={fileRef}
						type="file"
						accept=".jpg,.jpeg,.png,.webp"
						className="hidden"
						onChange={handleImageChange}
					/>
				</div>

				{/* Name */}
				<div>
					<label className="text-sm font-bold dark:text-white block mb-2">Full Name</label>
					<input
						type="text"
						value={name}
						onChange={e => setName(e.target.value)}
						placeholder="e.g. Amara Nwosu"
						className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
					/>
				</div>

				{/* Position */}
				<div>
					<label className="text-sm font-bold dark:text-white block mb-2">Position</label>
					<select
						value={position}
						onChange={e => setPosition(e.target.value)}
						className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm outline-none focus:border-zinc-400 transition-colors">
						<option value="">Select a position</option>
						{awardTitles.map(p => (
							<option
								key={p}
								value={p}>
								{p}
							</option>
						))}
					</select>
				</div>

				{/* Actions */}
				<div className="flex gap-3 pt-2">
					<button
						onClick={() => router.back()}
						className="flex-1 h-12 rounded-2xl border border-zinc-200 dark:border-zinc-700 font-black text-sm dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						disabled={loading}
						className="flex-1 h-12 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
						{loading ? (isEditing ? "Saving..." : "Creating...") : isEditing ? "Save Changes" : "Add Candidate"}
					</button>
				</div>
			</div>
		</div>
	)
}

export { CandidateForm }

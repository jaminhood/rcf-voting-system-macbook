"use client"

import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const LoginForm = () => {
	const { login } = useAuth()
	const router = useRouter()

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [showPassword, setShowPassword] = useState(false)

	const handleSubmit = async () => {
		if (!email || !password) {
			setError("Please fill in all fields.")
			return
		}

		setLoading(true)
		setError(null)

		try {
			await login(email, password)
			router.push("/admin")
		} catch (err: any) {
			setError(err?.response?.data?.message ?? "Invalid credentials. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleSubmit()
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-black dark:text-white">Welcome back</h1>
					<p className="text-sm text-zinc-500 mt-2">Sign in to your admin account</p>
				</div>

				{/* Card */}
				<div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
					{error && <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">{error}</div>}

					<div className="space-y-4">
						{/* Email */}
						<div>
							<label className="text-sm font-bold dark:text-white block mb-2">Email Address</label>
							<input
								type="email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="admin@example.com"
								className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
							/>
						</div>

						{/* Password */}
						<div>
							<label className="text-sm font-bold dark:text-white block mb-2">Password</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={e => setPassword(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Enter your password"
									className="w-full h-11 px-4 pr-12 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(prev => !prev)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-xs font-bold transition-colors">
									{showPassword ? "Hide" : "Show"}
								</button>
							</div>
						</div>

						{/* Submit */}
						<button
							onClick={handleSubmit}
							disabled={loading}
							className="w-full h-12 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2">
							{loading ? "Signing in..." : "Sign In"}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export { LoginForm }

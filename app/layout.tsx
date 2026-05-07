import { Header } from "@/components/frontend/header"
import { AppProvider } from "@/context/app-context"
import { AuthProvider } from "@/context/auth-context"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "RCF Voting System",
	description: "Built By NexBiT Tech",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
			<link
				rel="icon"
				href="/favicon.png"
				type="image/png"
				sizes="32x32"
			/>
			<body className="min-h-full flex flex-col">
				<AuthProvider>
					<AppProvider>{children}</AppProvider>
				</AuthProvider>
			</body>
		</html>
	)
}

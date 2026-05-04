"use client"

import { api } from "@/lib/axios"
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react"

interface User {
	id: number
	name: string
	email: string
}

interface AuthContextType {
	user: User | null
	token: string | null
	loading: boolean
	login: (email: string, password: string) => Promise<void>
	logout: () => Promise<void>
}

// Add this helper at the top of AuthContext.tsx
const setAuthCookie = (token: string | null) => {
	if (token) {
		document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
	} else {
		document.cookie = "auth_token=; path=/; max-age=0"
	}
}

const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [token, setToken] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	// Load token from localStorage on mount
	useEffect(() => {
		const savedToken = localStorage.getItem("auth_token")
		if (savedToken) {
			setToken(savedToken)
			fetchUser()
		} else {
			setLoading(false)
		}
	}, [])

	const fetchUser = async () => {
		try {
			const { data } = await api.get("/api/user")
			setUser(data)
		} catch {
			clearAuth()
		} finally {
			setLoading(false)
		}
	}

	const clearAuth = () => {
		setUser(null)
		setToken(null)
		localStorage.removeItem("auth_token")
		setAuthCookie(null)
	}

	const login = async (email: string, password: string) => {
		const { data } = await api.post("/api/login", { email, password })
		const authToken = data.token
		setToken(authToken)
		setAuthCookie(authToken)
		setUser(data.user)
		localStorage.setItem("auth_token", authToken)
	}

	const logout = async () => {
		try {
			await api.post("/api/logout")
		} finally {
			clearAuth()
		}
	}

	return <AuthContext.Provider value={{ user, token, loading, login, logout }}>{children}</AuthContext.Provider>
}

const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) throw new Error("useAuth must be used within an AuthProvider")
	return context
}

export { AuthProvider, useAuth }

"use client"

import { api } from "@/lib/axios"
import { Candidate } from "@/typings/candidates"
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-context"

interface User {
	id: number
	name: string
	email: string
}

interface AppContextType {
	fetchCandidates: () => Promise<Candidate[]>
	// user: User | null
	// token: string | null
	// loading: boolean
	// login: (email: string, password: string) => Promise<void>
	// register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>
	// logout: () => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const fetchCandidates = async () => {
		try {
			const response = await api.get("/api/candidates")
			return response.data.data
		} catch (err) {
			throw new Error("Failed to fetch candidates. Please try again.")
		}
	}

	// Load token from localStorage on mount
	// useEffect(() => {
	// 	const savedToken = localStorage.getItem("auth_token")
	// 	if (savedToken) {
	// 		setToken(savedToken)
	// 		api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`
	// 		fetchUser()
	// 	} else {
	// 		setLoading(false)
	// 	}
	// }, [])

	// const fetchUser = async () => {
	// 	try {
	// 		const { data } = await api.get("/api/user")
	// 		setUser(data)
	// 	} catch {
	// 		clearAuth()
	// 	} finally {
	// 		setLoading(false)
	// 	}
	// }

	// const clearAuth = () => {
	// 	setUser(null)
	// 	setToken(null)
	// 	localStorage.removeItem("auth_token")
	// 	delete api.defaults.headers.common["Authorization"]
	// }

	// const login = async (email: string, password: string) => {
	// 	const { data } = await api.post("/api/login", { email, password })
	// 	const authToken = data.token
	// 	setToken(authToken)
	// 	setUser(data.user)
	// 	localStorage.setItem("auth_token", authToken)
	// 	api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`
	// }

	// const register = async (name: string, email: string, password: string, password_confirmation: string) => {
	// 	const { data } = await api.post("/api/register", {
	// 		name,
	// 		email,
	// 		password,
	// 		password_confirmation,
	// 	})
	// 	const authToken = data.token
	// 	setToken(authToken)
	// 	setUser(data.user)
	// 	localStorage.setItem("auth_token", authToken)
	// 	api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`
	// }

	// const logout = async () => {
	// 	try {
	// 		await api.post("/api/logout")
	// 	} finally {
	// 		clearAuth()
	// 	}
	// }

	return <AppContext.Provider value={{ fetchCandidates }}>{children}</AppContext.Provider>
}

const useApp = () => {
	const context = useContext(AppContext)
	if (!context) throw new Error("useApp must be used within an AppProvider")
	return context
}

export { AppProvider, useApp }

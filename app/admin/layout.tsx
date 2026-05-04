import { AdminLayout } from "@/components/admin/admin-layout"
import { Header } from "@/components/frontend/header"
import { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
	return <AdminLayout>{children}</AdminLayout>
}

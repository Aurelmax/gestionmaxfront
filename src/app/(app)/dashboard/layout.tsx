'use client'

import { usePathname } from 'next/navigation'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Pages qui ne doivent pas avoir le DashboardLayout
  const isLoginPage = pathname === '/dashboard/login'
  const isLogoutPage = pathname === '/dashboard/logout'

  if (isLoginPage || isLogoutPage) {
    return <AuthGuard>{children}</AuthGuard>
  }

  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  )
}

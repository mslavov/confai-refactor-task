"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-provider"
import { Bug } from "lucide-react"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Bug className="h-6 w-6" />
          <span className="text-xl">Bugzy AI</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/#features" className="text-sm font-medium hover:underline">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm font-medium hover:underline">
            Pricing
          </Link>
          <Link href="/docs" className="text-sm font-medium hover:underline">
            Documentation
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

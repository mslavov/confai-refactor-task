import Link from "next/link"
import { Bug } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Bug className="h-5 w-5" />
            <span>Bugzy AI</span>
          </Link>
          <p className="text-sm text-muted-foreground">AI-powered functional testing platform</p>
        </div>
        <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Product</h3>
            <Link href="/#features" className="text-sm text-muted-foreground hover:underline">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm text-muted-foreground hover:underline">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm text-muted-foreground hover:underline">
              Documentation
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Company</h3>
            <Link href="/about" className="text-sm text-muted-foreground hover:underline">
              About
            </Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:underline">
              Blog
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Legal</h3>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </nav>
      </div>
      <div className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Bugzy AI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Twitter
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              GitHub
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

export function PricingSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Pricing</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Simple, transparent pricing for teams of all sizes
            </p>
          </div>
        </div>
        <div className="grid max-w-sm mx-auto items-start gap-8 md:max-w-none md:grid-cols-2 lg:grid-cols-3 mt-12">
          <div className="flex flex-col rounded-lg border bg-background shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold">Starter</h3>
              <div className="mt-4 text-3xl font-bold">$49</div>
              <p className="text-sm text-muted-foreground">per month</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>1 Project</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>50 Test Cases</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>10 Test Runs per Month</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>Linear Integration</span>
                </li>
              </ul>
              <Button className="mt-6 w-full" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-background shadow-sm relative">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-0 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              Popular
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold">Pro</h3>
              <div className="mt-4 text-3xl font-bold">$99</div>
              <p className="text-sm text-muted-foreground">per month</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>3 Projects</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>200 Test Cases</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>50 Test Runs per Month</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>Linear Integration</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>Priority Support</span>
                </li>
              </ul>
              <Button className="mt-6 w-full" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-background shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold">Enterprise</h3>
              <div className="mt-4 text-3xl font-bold">Custom</div>
              <p className="text-sm text-muted-foreground">contact for pricing</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>Unlimited Projects</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>Unlimited Test Cases</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>Unlimited Test Runs</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>Advanced Integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>Dedicated Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  <span>Custom Features</span>
                </li>
              </ul>
              <Button className="mt-6 w-full" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

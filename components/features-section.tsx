import { Bot, CheckIcon as BrowserCheck, ClipboardList, LineChart, TicketCheck, Zap } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to automate your functional testing workflow
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <ClipboardList className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">AI Test Generation</h3>
            <p className="text-sm text-muted-foreground text-center">
              Automatically generate human-readable test plans from your project documentation
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <BrowserCheck className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Automated Execution</h3>
            <p className="text-sm text-muted-foreground text-center">
              Execute tests through our Browser-Use agent against your supplied URL
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <LineChart className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Results Dashboard</h3>
            <p className="text-sm text-muted-foreground text-center">
              View test results in an intuitive dashboard with detailed failure information
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <TicketCheck className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Linear Integration</h3>
            <p className="text-sm text-muted-foreground text-center">
              Automatically create Linear tickets for failed and unaccepted tests
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Bot className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Smart Test Management</h3>
            <p className="text-sm text-muted-foreground text-center">
              Review and toggle acceptance on generated tests before execution
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Zap className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Fast Setup</h3>
            <p className="text-sm text-muted-foreground text-center">
              Get started quickly with our intuitive onboarding wizard
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

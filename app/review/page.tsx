"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, PlayCircle } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { TestCase, getTestCases, startTestRun, updateTestAcceptance } from "@/lib/api"

export default function ReviewPage() {
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const testPlanId = searchParams.get("id")

  useEffect(() => {
    async function fetchTestCases() {
      if (!testPlanId) {
        toast({
          title: "No test plan specified",
          description: "Please go back to the dashboard and select a test plan.",
          variant: "destructive",
        })
        return
      }

      try {
        const cases = await getTestCases(testPlanId)
        setTestCases(cases)
      } catch (error) {
        console.error("Error fetching test cases:", error)
        toast({
          title: "Failed to load test cases",
          description: "There was an error loading the test cases. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestCases()
  }, [testPlanId, toast])

  const handleToggleAccept = async (id: string) => {
    const testCase = testCases.find(test => test.id === id)
    if (!testCase) return

    try {
      // Update in the database
      await updateTestAcceptance(id, !testCase.accepted)

      // Update local state
      setTestCases(testCases.map(test =>
        test.id === id ? { ...test, accepted: !test.accepted } : test
      ))
    } catch (error) {
      console.error("Error updating test acceptance:", error)
      toast({
        title: "Failed to update test",
        description: "There was an error updating the test case. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRunTests = async () => {
    if (!testPlanId) return

    const acceptedTests = testCases.filter((test) => test.accepted)

    if (acceptedTests.length === 0) {
      toast({
        title: "No tests accepted",
        description: "Please accept at least one test to run.",
        variant: "destructive",
      })
      return
    }

    setIsRunning(true)

    try {
      // Start the test run
      const runId = await startTestRun(acceptedTests.map(test => test.id))

      toast({
        title: "Tests started",
        description: "Your tests are now running. You'll be redirected to the results page.",
      })

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push(`/dashboard?run=${runId}`)
      }, 1500)
    } catch (error) {
      console.error("Error starting test run:", error)
      toast({
        title: "Failed to start tests",
        description: "There was an error starting your tests. Please try again.",
        variant: "destructive",
      })
      setIsRunning(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-blue-500"
    }
  }

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Review Test Plan</h1>
          <p className="text-muted-foreground">Review and accept the generated test cases before running them.</p>
        </div>
        <Button
          onClick={handleRunTests}
          disabled={isRunning || testCases.filter((t) => t.accepted).length === 0}
          className="ml-auto"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Run Tests
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 mt-6">
        {testCases.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No test cases found. Please go back and generate a test plan.
          </div>
        ) : (
          testCases.map((test) => (
            <Card key={test.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{test.name}</h3>
                    <Badge className={`${getSeverityColor(test.severity)} text-white`}>{test.severity}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`accept-${test.id}`}
                      checked={test.accepted}
                      onCheckedChange={() => handleToggleAccept(test.id)}
                    />
                    <Label htmlFor={`accept-${test.id}`}>{test.accepted ? "Accepted" : "Unaccepted"}</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid gap-2">
                  <div>
                    <h4 className="text-sm font-medium">Steps:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{test.steps}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Expected Result:</h4>
                    <p className="text-sm text-muted-foreground">{test.expected}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardShell>
  )
}

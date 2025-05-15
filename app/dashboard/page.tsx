"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/dashboard-shell"
import { PlayCircle, ExternalLink, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

// Mock test results
const mockResults = [
  {
    id: "1",
    name: "User can log in with valid credentials",
    status: "passed",
    description: "",
    linearIssueId: null,
  },
  {
    id: "2",
    name: "User cannot log in with invalid credentials",
    status: "failed",
    description: "Expected error message not displayed",
    linearIssueId: "BUG-123",
  },
  {
    id: "3",
    name: "User can reset password",
    status: "passed",
    description: "",
    linearIssueId: null,
  },
  {
    id: "4",
    name: "User can navigate to signup page from login",
    status: "passed",
    description: "",
    linearIssueId: null,
  },
  {
    id: "5",
    name: "User can create a new account",
    status: "unaccepted",
    description: "Test not accepted",
    linearIssueId: "BUG-124",
  },
]

export default function DashboardPage() {
  const [results, setResults] = useState(mockResults)
  const [runStatus, setRunStatus] = useState<"idle" | "queued" | "running" | "completed">("completed")
  const [progress, setProgress] = useState(100)
  const { toast } = useToast()

  const handleRunTests = () => {
    setRunStatus("queued")
    setProgress(0)

    toast({
      title: "Tests queued",
      description: "Your tests have been queued and will start running shortly.",
    })

    // Simulate test run progress
    setTimeout(() => {
      setRunStatus("running")

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setRunStatus("completed")
            return 100
          }
          return prev + 10
        })
      }, 500)
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "skipped":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "unaccepted":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-500">Passed</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      case "skipped":
        return <Badge className="bg-yellow-500">Skipped</Badge>
      case "unaccepted":
        return <Badge className="bg-blue-500">Unaccepted</Badge>
      default:
        return null
    }
  }

  const passedCount = results.filter((r) => r.status === "passed").length
  const failedCount = results.filter((r) => r.status === "failed").length
  const unacceptedCount = results.filter((r) => r.status === "unaccepted").length
  const skippedCount = results.filter((r) => r.status === "skipped").length
  const totalCount = results.length

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">View your latest test run results and manage your project.</p>
        </div>
        <Button onClick={handleRunTests} disabled={runStatus === "queued" || runStatus === "running"}>
          <PlayCircle className="mr-2 h-4 w-4" />
          Run Tests
        </Button>
      </div>

      {(runStatus === "queued" || runStatus === "running") && (
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle>Test Run in Progress</CardTitle>
            <CardDescription>
              {runStatus === "queued"
                ? "Your tests are queued and will start running shortly."
                : "Your tests are currently running."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{passedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{failedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unaccepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{unacceptedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Latest Run Results</CardTitle>
          <CardDescription>Results from your most recent test run</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-[1fr,auto,auto] gap-4 p-4 font-medium">
              <div>Test Name</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="divide-y">
              {results.map((result) => (
                <div key={result.id} className="grid grid-cols-[1fr,auto,auto] gap-4 p-4 items-center">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span>{result.name}</span>
                  </div>
                  <div>{getStatusText(result.status)}</div>
                  <div>
                    {result.linearIssueId && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`https://linear.app/issue/${result.linearIssueId}`} target="_blank">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          {result.linearIssueId}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}

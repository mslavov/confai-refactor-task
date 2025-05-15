"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Bug, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { createProject, generateTestPlan, saveTestPlan, updateCredentials, updateLinearPat } from "@/lib/api"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [projectName, setProjectName] = useState("")
  const [documentation, setDocumentation] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [linearPat, setLinearPat] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerationComplete, setIsGenerationComplete] = useState(false)
  const [testPlanId, setTestPlanId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleNext = () => {
    if (step === 1 && !projectName) {
      toast({
        title: "Project name required",
        description: "Please enter a project name to continue.",
        variant: "destructive",
      })
      return
    }

    if (step === 2 && !documentation) {
      toast({
        title: "Documentation required",
        description: "Please paste your project documentation to continue.",
        variant: "destructive",
      })
      return
    }

    if (step === 3 && (!baseUrl || !username || !password)) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields to continue.",
        variant: "destructive",
      })
      return
    }

    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleGenerateTestPlan = async () => {
    setIsGenerating(true)

    try {
      // 1. Create the project in the database
      const projectId = await createProject(projectName, baseUrl);

      // 2. Update credentials
      await updateCredentials(baseUrl, username, password);

      // 3. Update Linear PAT if provided
      if (linearPat) {
        await updateLinearPat(linearPat);
      }

      // 4. Generate test cases using AI
      const testCases = await generateTestPlan(documentation);

      // 5. Save test plan and test cases to the database
      const savedTestPlanId = await saveTestPlan(projectId, documentation, testCases);
      setTestPlanId(savedTestPlanId);

      toast({
        title: "Test plan generated",
        description: "Your test plan has been successfully generated.",
      })

      setIsGenerationComplete(true)

      // Redirect to review page after a short delay
      setTimeout(() => {
        router.push(`/review?id=${savedTestPlanId}`);
      }, 1500)
    } catch (error) {
      console.error("Error generating test plan:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your test plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 text-2xl font-bold">
        <Bug className="h-8 w-8" />
        <span>Bugzy AI</span>
      </Link>
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Bugzy AI</CardTitle>
          <CardDescription>Let&apos;s set up your first project</CardDescription>
          <Progress value={step * 25} className="mt-2" />
        </CardHeader>
        <CardContent>
          <Tabs value={`step-${step}`} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="step-1" disabled>
                Project
              </TabsTrigger>
              <TabsTrigger value="step-2" disabled>
                Documentation
              </TabsTrigger>
              <TabsTrigger value="step-3" disabled>
                Credentials
              </TabsTrigger>
              <TabsTrigger value="step-4" disabled>
                Generate
              </TabsTrigger>
            </TabsList>
            <TabsContent value="step-1" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="Enter your project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value="step-2" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="documentation">Project Documentation</Label>
                <Textarea
                  id="documentation"
                  placeholder="Paste your project documentation here"
                  className="min-h-[200px]"
                  value={documentation}
                  onChange={(e) => setDocumentation(e.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value="step-3" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="base-url">Base URL</Label>
                <Input
                  id="base-url"
                  placeholder="https://your-website.com"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Test account username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Test account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="linear-pat">Linear Personal Access Token (Optional)</Label>
                </div>
                <Input
                  id="linear-pat"
                  placeholder="Enter your Linear PAT"
                  value={linearPat}
                  onChange={(e) => setLinearPat(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">This will be used to create tickets for failed tests.</p>
              </div>
            </TabsContent>
            <TabsContent value="step-4" className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold">Ready to Generate Test Plan</h3>
                  <p className="text-muted-foreground mt-2">
                    We&apos;ll analyze your documentation and generate a comprehensive test plan.
                  </p>
                </div>
                {isGenerationComplete ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-green-500 font-medium">Test plan generated successfully!</div>
                    <div className="text-sm text-muted-foreground">Redirecting to review page...</div>
                  </div>
                ) : (
                  <Button onClick={handleGenerateTestPlan} disabled={isGenerating} size="lg" className="mt-4">
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Test Plan...
                      </>
                    ) : (
                      "Generate Test Plan"
                    )}
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1 || isGenerating || isGenerationComplete}>
            Back
          </Button>
          {step < 4 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  )
}

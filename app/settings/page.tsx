"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save } from "lucide-react"

export default function SettingsPage() {
  const [baseUrl, setBaseUrl] = useState("https://example.com")
  const [username, setUsername] = useState("testuser")
  const [password, setPassword] = useState("********")
  const [linearPat, setLinearPat] = useState("lin_api_***********************")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSaveCredentials = async () => {
    setIsSaving(true)

    try {
      // Simulate API call to save credentials
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Your credentials have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to save settings",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveLinearPat = async () => {
    setIsSaving(true)

    try {
      // Simulate API call to save Linear PAT
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Linear PAT saved",
        description: "Your Linear Personal Access Token has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to save Linear PAT",
        description: "There was an error saving your Linear PAT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardShell>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your project settings and credentials</p>
      </div>

      <Tabs defaultValue="credentials" className="mt-6">
        <TabsList>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="credentials" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Credentials</CardTitle>
              <CardDescription>Update the base URL and credentials used for test execution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base-url">Base URL</Label>
                <Input id="base-url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveCredentials} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="integrations" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Linear Integration</CardTitle>
              <CardDescription>Connect to Linear to automatically create tickets for failed tests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linear-pat">Linear Personal Access Token</Label>
                <Input id="linear-pat" value={linearPat} onChange={(e) => setLinearPat(e.target.value)} />
                <p className="text-xs text-muted-foreground">
                  You can generate a Personal Access Token in your Linear account settings.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveLinearPat} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

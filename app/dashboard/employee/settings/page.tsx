"use client"

import * as React from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Palette, Bell, Lock, Settings, LifeBuoy, Upload, Sun, Moon, Laptop } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const loginHistory = [
    { id: 1, device: "Chrome on macOS", ip: "192.168.1.101", time: "2 hours ago" },
    { id: 2, device: "iPhone App", ip: "10.0.0.5", time: "1 day ago" },
    { id: 3, device: "Safari on macOS", ip: "192.168.1.101", time: "3 days ago" },
]

const connectedDevices = [
    { id: 1, device: "Chrome on macOS", lastLogin: "2 hours ago" },
    { id: 2, device: "iPhone App", lastLogin: "1 day ago" },
]

export default function EmployeeSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account, preferences, and more.</p>
      </div>

      <Tabs defaultValue="account" className="flex gap-6 flex-col md:flex-row">
        <TabsList className="flex-col h-auto items-start bg-transparent p-0 border-r">
          <TabsTrigger value="account" className="w-full justify-start gap-2"><User className="h-4 w-4"/> Account</TabsTrigger>
          <TabsTrigger value="personalization" className="w-full justify-start gap-2"><Palette className="h-4 w-4"/> Personalization</TabsTrigger>
          <TabsTrigger value="notifications" className="w-full justify-start gap-2"><Bell className="h-4 w-4"/> Notifications</TabsTrigger>
          <TabsTrigger value="privacy" className="w-full justify-start gap-2"><Lock className="h-4 w-4"/> Privacy & Permissions</TabsTrigger>
          <TabsTrigger value="system" className="w-full justify-start gap-2"><Settings className="h-4 w-4"/> System Preferences</TabsTrigger>
          <TabsTrigger value="support" className="w-full justify-start gap-2"><LifeBuoy className="h-4 w-4"/> Support & About</TabsTrigger>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="account">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src="/avatars/alex.jpg" alt="Alex" />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold">Alex</h2>
                                <p className="text-muted-foreground">alex.employee@goat.media</p>
                                <p className="text-sm text-muted-foreground">Content Strategist</p>
                                <p className="text-xs text-muted-foreground">Joined on January 15, 2023</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" defaultValue="+1 234 567 890" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="avatar">Avatar</Label>
                                    <Input id="avatar" type="file" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" placeholder="Tell us a little about yourself." defaultValue="Experienced content strategist with a passion for creating engaging narratives."/>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Password & Security</CardTitle>
                        <CardDescription>Manage your password and security settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label>Two-Factor Authentication</Label>
                                <CardDescription>Add an extra layer of security to your account.</CardDescription>
                            </div>
                            <Switch/>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Login History</CardTitle>
                        <CardDescription>Your recent login activity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Device</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loginHistory.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>{entry.device}</TableCell>
                                        <TableCell>{entry.ip}</TableCell>
                                        <TableCell>{entry.time}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <div className="flex justify-end">
                    <Button>Save Changes</Button>
                </div>
            </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="personalization">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
             <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Theme</CardTitle>
                        <CardDescription>Choose how the dashboard looks.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue="light" className="grid grid-cols-3 gap-4">
                            <div>
                                <RadioGroupItem value="light" id="light" className="peer sr-only" />
                                <Label htmlFor="light" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    <Sun className="mb-2"/> Light
                                </Label>
                            </div>
                             <div>
                                <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                                <Label htmlFor="dark" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    <Moon className="mb-2"/> Dark
                                </Label>
                            </div>
                             <div>
                                <RadioGroupItem value="system" id="system" className="peer sr-only" />
                                <Label htmlFor="system" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    <Laptop className="mb-2"/> System
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Accent Color</CardTitle>
                        <CardDescription>Pick an accent color for the UI.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-400 cursor-pointer border-2 border-primary"></div>
                        <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer"></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Layout</CardTitle>
                        <CardDescription>Adjust the density and style of the interface.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label>Layout Density</Label>
                                <CardDescription>Choose between a more spacious or compact view.</CardDescription>
                            </div>
                            <RadioGroup defaultValue="comfortable" className="flex">
                                <Button variant="outline" size="sm">Comfortable</Button>
                                <Button variant="outline" size="sm">Compact</Button>
                            </RadioGroup>
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label>Sidebar Style</Label>
                                <CardDescription>Collapse the sidebar for a more focused view.</CardDescription>
                            </div>
                            <Switch/>
                        </div>
                    </CardContent>
                </Card>
                 <div className="flex justify-end">
                    <Button>Save Changes</Button>
                </div>
            </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="notifications">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
             <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Notification Channels</CardTitle>
                        <CardDescription>Select how you want to be notified.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label>Email Notifications</Label>
                                <CardDescription>Receive notifications via email.</CardDescription>
                            </div>
                            <Switch defaultChecked/>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label>SMS Notifications</Label>
                                <CardDescription>Receive notifications via text message.</CardDescription>
                            </div>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label>In-App Notifications</Label>
                                <CardDescription>Receive notifications within the dashboard.</CardDescription>
                            </div>
                            <Switch defaultChecked/>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Category Preferences</CardTitle>
                        <CardDescription>Select which types of notifications you want to receive.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="tasks" defaultChecked/>
                            <Label htmlFor="tasks">Tasks</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="approvals" defaultChecked/>
                            <Label htmlFor="approvals">Approvals</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="shoots" />
                            <Label htmlFor="shoots">Shoots</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="system" defaultChecked/>
                            <Label htmlFor="system">System</Label>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Do Not Disturb</CardTitle>
                        <CardDescription>Temporarily mute all notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <Switch/>
                        <Input type="number" placeholder="Mute for X hours" className="w-48"/>
                    </CardContent>
                </Card>
                 <div className="flex justify-end">
                    <Button>Save Changes</Button>
                </div>
            </div>
            </motion.div>
          </TabsContent>
           <TabsContent value="privacy">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
             <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Privacy Settings</CardTitle>
                        <CardDescription>Control how your information is shared.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label>Show my online status</Label>
                                <CardDescription>Allow others to see when you are active.</CardDescription>
                            </div>
                            <Switch defaultChecked/>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Connected Devices</CardTitle>
                        <CardDescription>Manage devices connected to your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Device</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {connectedDevices.map((device) => (
                                    <TableRow key={device.id}>
                                        <TableCell>{device.device}</TableCell>
                                        <TableCell>{device.lastLogin}</TableCell>
                                        <TableCell><Button variant="destructive" size="sm">Revoke</Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Consent Preferences</CardTitle>
                        <CardDescription>Manage your consent for data collection.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label>Analytics</Label>
                                <CardDescription>Allow us to collect anonymous analytics.</CardDescription>
                            </div>
                            <Switch defaultChecked/>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label>Marketing</Label>
                                <CardDescription>Receive marketing communications.</CardDescription>
                            </div>
                            <Switch />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label>Tracking</Label>
                                <CardDescription>Allow tracking for personalized experiences.</CardDescription>
                            </div>
                            <Switch defaultChecked/>
                        </div>
                    </CardContent>
                </Card>
                 <div className="flex justify-end">
                    <Button>Save Changes</Button>
                </div>
            </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="system">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Defaults</CardTitle>
                        <CardDescription>Set your default views and pages.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Default Landing Page</Label>
                            <Select defaultValue="dashboard">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a page" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dashboard">Dashboard</SelectItem>
                                    <SelectItem value="tasks">Tasks</SelectItem>
                                    <SelectItem value="shoots">Shoots</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Default Calendar View</Label>
                            <RadioGroup defaultValue="week" className="flex">
                                <Button variant="outline" size="sm">Week</Button>
                                <Button variant="outline" size="sm">Month</Button>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Localization</CardTitle>
                        <CardDescription>Set your language and time preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Time Zone</Label>
                            <Select defaultValue="est">
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Select a time zone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="est">(GMT-5:00) Eastern Time</SelectItem>
                                    <SelectItem value="pst">(GMT-8:00) Pacific Time</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Date Format</Label>
                            <Select defaultValue="mm-dd-yyyy">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                                    <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Language</Label>
                            <Select defaultValue="en">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="es">Español (Demo)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                 <div className="flex justify-end">
                    <Button>Save Changes</Button>
                </div>
            </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="support">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Support</CardTitle>
                        <CardDescription>Get help with using the dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">Go to Help Centre</Button>
                        <Button variant="outline" className="w-full justify-start">View Tutorials</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                        <CardDescription>Information about the application.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            <strong>GOAT Media × SNR Automations</strong><br/>
                            This dashboard is a collaboration to streamline media production workflows.
                        </p>
                        <p className="text-xs text-muted-foreground">Version: 1.0.0</p>
                        <p className="text-xs text-muted-foreground">Last Updated: 2025-08-30</p>
                    </CardContent>
                </Card>
            </div>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

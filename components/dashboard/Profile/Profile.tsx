"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useMemo, useState } from "react"



 export default function ProfileCard({ name, email, tagline, about }: { name: string | undefined | null; email: string | undefined; tagline: string | undefined; about: string | undefined} ) {
    const originalName = name?.trim() ?? ""
    const originalTagline = tagline?.trim() ?? ""
    const originalAbout = about?.trim() ?? ""
    const [localName, setName] = useState(originalName)
    const [localTagline, setTagline] = useState(originalTagline)
    const [localAbout, setAbout] = useState(originalAbout)
    const hasChanges = useMemo(() => {
        return (
            localName.trim() !== originalName ||
            localTagline.trim() !== originalTagline ||
            localAbout.trim() !== originalAbout
        )
    }, [localName, localTagline, localAbout, originalName, originalTagline, originalAbout])
    const saveChanges = () => {
        const changes: Record<string, string> = {}
        if (localName !== originalName) changes.name = localName
        if (localTagline !== originalTagline) changes.tagline = localTagline
        if (localAbout !== originalAbout) changes.about = localAbout

        if (Object.keys(changes).length === 0) {
            console.log("No changes made.")
        } else {
            console.log("Changed fields:", changes)
        }
    }
    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Personal Details </CardTitle>
                        {hasChanges && (
                            <button
                                className="text-sm px-3 py-1 bg-black text-white rounded-md hover:bg-gray-500 transition disabled:opacity-50"
                                onClick={saveChanges}
                            >
                                Save
                            </button>)}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={localName as string | undefined} onChange={(e) => {
                                setName(e.target.value)

                            } } placeholder="John Doe" />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={email} type="email" placeholder="john@example.com" disabled />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input id="tagline" value={localTagline} onChange={(e) => {
                            setTagline(e.target.value)
                        } } placeholder="Full Stack Developer" />
                    </div>

                    <div>
                        <Label htmlFor="about">About</Label>
                        <Textarea
                            id="about"
                            value={localAbout}
                            onChange={(e) => {
                                setAbout(e.target.value)
                            } }
                            rows={4} />
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
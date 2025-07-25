"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"
import { useMemo, useState } from "react"



  export default function SkillCard({ skills }: { skills: Set<string> | undefined} ) {
    const originalSkills = useMemo(() => skills ?? new Set<string>(), [skills])

    const [skillInput, setSkillInput] = useState("")
    const [newSkills, setNewSkills] = useState<Set<string>>(new Set())
    const [removedSkills, setRemovedSkills] = useState<Set<string>>(new Set())
    const addSkill = (skillStr: string) => {
        const trimmed = skillStr.trim()
        const isInOriginal = originalSkills.has(trimmed) && !removedSkills.has(trimmed)
        const isInNew = newSkills.has(trimmed)

        if (trimmed && !isInOriginal && !isInNew) {
            const updated = new Set(newSkills)
            updated.add(trimmed)
            setNewSkills(updated)
            setSkillInput("")
        }
    }

    const removeSkill = (skill: string) => {
        if (newSkills.has(skill)) {
            const updated = new Set(newSkills)
            updated.delete(skill)
            setNewSkills(updated)
        } else if (originalSkills.has(skill)) {
            const updated = new Set(removedSkills)
            updated.add(skill)
            setRemovedSkills(updated)
        }
    }
    const hasChanges = newSkills.size > 0 || removedSkills.size > 0
    const displaySkills = useMemo(() => {
        const filteredOriginal = Array.from(originalSkills).filter(
            (s) => !removedSkills.has(s)
        )
        return [...filteredOriginal, ...Array.from(newSkills)]
    }, [originalSkills, newSkills, removedSkills])
    const onSave = async () => {
        return
    }
    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Skills </CardTitle>
                        {hasChanges && (
                            <button
                                className="text-sm px-3 py-1 bg-black text-white rounded-md hover:bg-gray-500 transition disabled:opacity-50"
                                onClick={onSave}
                            >
                                Save
                            </button>)}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {displaySkills && displaySkills?.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1">
                                {skill}
                                <button
                                    onClick={() => removeSkill(skill)}
                                    className="ml-2 text-gray-500 hover:text-red-500"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a skill"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyUp={(e) => e.key === "Enter" && addSkill(skillInput) && setSkillInput("")} />
                        <Button onClick={() => addSkill(skillInput)} size="sm">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
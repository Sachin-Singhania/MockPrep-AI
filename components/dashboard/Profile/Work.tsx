"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog"
import { Briefcase, Plus, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { usePrevious } from "./Hook"
import { toast } from "sonner"
import { updateProfile } from "@/lib/actions/api"

export default function Exp({ experiences,save }: { experiences: Experience[] | undefined ,save(addExp:Experience[],removedExpId:string[]):void}) {
    const originalExperiences = useMemo(() => experiences ?? [], [experiences])
    const [expRemovedIds, setexpRemovedIds] = useState<string[]>([])
    const [newExp, setnewExp] = useState<Experience[]>([])
    const setExperiences = (experiences: Experience) => {
        setnewExp((prevExp) => [...prevExp ?? [], experiences])
    }
  const prevExperiences = usePrevious(originalExperiences);
    useEffect(() => {
        if (prevExperiences && prevExperiences !== originalExperiences) {
            const newItemsFromAI = originalExperiences.filter(exp => 
                !prevExperiences.some(prevExp => prevExp.company.trim() === exp.company.trim())
            );

            if (newItemsFromAI.length > 0) {
                setnewExp(currentAdded => [...currentAdded, ...newItemsFromAI]);
            }
        }
    }, [originalExperiences, prevExperiences]);
    const removeExp = (exp: Experience) => {
      
        if (exp.id) {
            setexpRemovedIds((prev) => [...prev ?? [], exp.id as string])
        } else {
            setnewExp((prevExp) => prevExp?.filter((e) => e !== exp))
        }
    }
    const hasChanges = useMemo(() => {
        return expRemovedIds?.length > 0 || newExp?.length > 0
    }, [expRemovedIds, newExp])

    const onSave = async () => {
        try {
            save( newExp, expRemovedIds)
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
    const displayExperience = useMemo(() => {
        const filteredOriginal = originalExperiences.filter(
            (exp) => !expRemovedIds.includes(exp.id ?? "")
        ).filter((exp)=>  !newExp.some(newExp => newExp.id === exp.id))
        return [...filteredOriginal, ...newExp]
    }, [originalExperiences, expRemovedIds, newExp])

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Work Experience </CardTitle>
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
                    <div className="space-y-4">
                        {displayExperience?.map((val, index) => (
                            <div key={val.id ? val.id : index + 1} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{val.role}</p>
                                        <p className="text-sm text-gray-600">
                                            {val.company} •{" "}
                                            {typeof val.endYear === "number"
                                                ? val.endYear - val.startYear === 0
                                                    ? "<1 years"
                                                    : `${val.endYear - val.startYear} years`
                                                : `${new Date().getFullYear() - val.startYear} years`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex ">
                                    <Badge variant="secondary">{val.endYear ? `${val.startYear}-${val.endYear}` : "Current"}</Badge>
                                    <button
                                        onClick={() => removeExp(val)}
                                        className="text-red-500 text-xs ml-2 underline"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <AddExperienceDialog onAddExperience={(exp) => setExperiences(exp)} />
                </CardContent>
            </Card>
        </>
    )
}
interface Props {
    onAddExperience: (exp: Experience) => void;
}
const AddExperienceDialog = ({ onAddExperience }: Props) => {
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [startYear, setStartYear] = useState<number | "">("");
    const [endYear, setEndYear] = useState<number | "">("");

    const handleSave = () => {
        if (!title || !company || !startYear) return;

        onAddExperience({
            role: title,
            company,
            startYear: Number(startYear),
            endYear: endYear ? Number(endYear) : undefined,
        });

        setTitle("");
        setCompany("");
        setStartYear("");
        setEndYear("");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div className="grid gap-4 py-4">
                    <Input placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Input placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
                    <Input
                        placeholder="Start Year"
                        type="number"
                        value={startYear}
                        onChange={(e) => setStartYear(Number(e.target.value))}
                    />
                    <Input
                        placeholder="End Year (Leave empty if current)"
                        type="number"
                        value={endYear}
                        onChange={(e) => setEndYear(Number(e.target.value))}
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
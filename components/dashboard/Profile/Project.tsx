"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog"
import { Plus, X } from "lucide-react"
import { useMemo, useState } from "react"




 export default function ProjectCard({ projects }: { projects: Project[] | undefined} ) {
    const originalProjects = useMemo(() => projects ?? [], [projects])
    const [newProjects, setNewProjects] = useState<Project[]>([])
    const [removedProjectIds, setRemovedProjectIds] = useState<string[]>([])

    const handleAddProject = (proj: Project) => {
        setNewProjects((prev) => [...prev, proj])
    }

    const removeProject = (proj: Project) => {
        if (proj.id) {
            setRemovedProjectIds((prev) => [...prev, proj.id!])
        } else {
            setNewProjects((prev) => prev.filter((p) => p !== proj))
        }
    }

    const hasChanges = useMemo(() => {
        return newProjects.length > 0 || removedProjectIds.length > 0
    }, [newProjects, removedProjectIds])

    const onSave = () => {
        console.log("New projects:", newProjects)
        console.log("Removed project IDs:", removedProjectIds)
    }

    const displayProjects = useMemo(() => {
        const filteredOriginal = originalProjects.filter(
            (proj) => !removedProjectIds.includes(proj.id ?? "")
        )
        return [...filteredOriginal, ...newProjects]
    }, [originalProjects, newProjects, removedProjectIds])
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Projects</CardTitle>
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
                    {displayProjects.map((project, index) => (
                        <div
                            key={project.id ?? `new-${index}`}
                            className="p-4 border rounded-lg flex justify-between items-start"
                        >
                            <div>
                                <h4 className="font-medium mb-2">{project.name}</h4>
                                <p className="text-sm text-gray-600">{project.description}</p>
                            </div>
                            <button
                                onClick={() => removeProject(project)}
                                className="text-xs text-red-500 underline ml-4"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
                <AddProjectDialog onAddProject={(p) => handleAddProject(p)} />
            </CardContent>
        </Card>
    )
}



function AddProjectDialog({
  onAddProject,
}: {
  onAddProject: (project: Project) => void;
}) {
  const [project, setProject] = useState<Project>({
    name: "",
    description: "",
  });

  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (!project.name || !project.description) return;
    onAddProject(project);
    setProject({ name: "", description: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          <Plus className="w-4 h-14 mr-2" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4">
          <Input
            placeholder="Project Name"
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
          />
          <Textarea
            placeholder="Project Description"
            value={project.description}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
          />
          <Button onClick={handleAdd} className="w-full">
            Save Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
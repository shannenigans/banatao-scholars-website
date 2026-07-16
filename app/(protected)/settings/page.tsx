import React from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card"
import { Separator } from "@/app/components/ui/separator"
import { ProfileForm } from "./form"
import { requireViewer } from '@/app/lib/auth'
import { fetchOwnProfile } from '@/app/lib/data'

export default async function SettingsPage() {
    const viewer = await requireViewer()
    const profile = await fetchOwnProfile(viewer)
    return (
        <div className="container p-6 mx-auto">
        <Card> 
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your profile.</CardDescription>
                <Separator/>
            </CardHeader>
            <CardContent className="w-full">
                <ProfileForm profile={profile} />
            </CardContent>
        </Card>
        </div>
    )
}

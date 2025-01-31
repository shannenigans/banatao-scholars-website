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

export default async function SettingsPage() {
    return (
        <div className="container p-6 mx-auto">
        <Card> 
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your profile.</CardDescription>
                <Separator/>
            </CardHeader>
            <CardContent className="w-full">
                <ProfileForm />
            </CardContent>
        </Card>
        </div>
    )
}
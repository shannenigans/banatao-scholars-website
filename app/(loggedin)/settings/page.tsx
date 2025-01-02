import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./form"

export default function SettingsPage() {
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
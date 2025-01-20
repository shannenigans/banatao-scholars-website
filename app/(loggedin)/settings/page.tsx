import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card"
import { Separator } from "@/app/components/ui/separator"
import { ProfileForm } from "./form"
import { Footer } from "@/app/components/ui/footer"

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
        <Footer />
        </div>
    )
}
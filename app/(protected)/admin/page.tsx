import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ImportScholarForm from "./importScholarForm";

export default function AdminPage() {
    return (
        <div className="container p-6 mx-auto">
        <Card> 
            <CardHeader>
                <CardTitle>Admin</CardTitle>
                <CardDescription></CardDescription>
                <Separator/>
            </CardHeader>
            <CardContent className="w-full">
                <ImportScholarForm />
            </CardContent>
        </Card>
        </div>
    )
}
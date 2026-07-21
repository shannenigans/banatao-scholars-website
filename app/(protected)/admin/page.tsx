import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ImportScholarForm from "./importScholarForm";
import { PendingSubmissions } from "./pending-submissions";
import { requireAdmin } from '@/app/lib/auth';
import { fetchPendingEvents, fetchPendingStories } from '@/app/lib/data';

export default async function AdminPage() {
    await requireAdmin();
    const [events, stories] = await Promise.all([fetchPendingEvents(), fetchPendingStories()]);
    return (
        <div className="container space-y-6 p-6 mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>Pending submissions</CardTitle>
                <CardDescription>Scholar-submitted events and spotlight stories awaiting review.</CardDescription>
                <Separator/>
            </CardHeader>
            <CardContent className="w-full">
                <PendingSubmissions events={events} stories={stories} />
            </CardContent>
        </Card>
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

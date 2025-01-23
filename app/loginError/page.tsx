export default function LoginErrorPage() {
    return (
        <div className="text-xl h-screen flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <div className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-6xl font-bold tracking-tight text-foreground sm:text-7xl">OOPS!</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                   Looks you're not authorized to be on this site. Please validate your credentials with an administrator.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                    If you think this is in error, clear your cookies and try again.
                </p>
            </div>
        </div>
    )
}
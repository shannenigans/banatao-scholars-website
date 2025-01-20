export function Footer() {
    return (
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Banatao Scholars. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }
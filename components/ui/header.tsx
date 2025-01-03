import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Banatao Scholars
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  href="/"
                  className="text-sm font-medium hover:text-primary"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/scholars"
                  className="text-sm font-medium hover:text-primary"
                >
                  Scholars
                </Link>
              </li>
              <li>
                <Link
                  href="/protected"
                  className="text-sm font-medium hover:text-primary"
                >
                  Sign in
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
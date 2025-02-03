import React from "react";
import Link from "next/link";

import { TABS } from "@/app/constants/tabs";
import { Tab } from "@/app/types/tab";
import { useUser } from "@/app/hooks/use-user";

export function Header() {
  const [linkTabs, setLinkTabs] = React.useState<Tab[]>([TABS.Home, TABS.SignIn]);
  const userContext = useUser();
  const { supabaseResponseUser } = userContext;

  React.useEffect(() => {
    if (supabaseResponseUser?.user) {
      setLinkTabs([TABS.Home, TABS.Scholars, TABS.Gallery, TABS.Profile]);
    }
  }, [supabaseResponseUser])

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
              {linkTabs.map((tab) => {
                return (
                  <li>
                  <Link
                    href={tab.url}
                    className="text-sm font-medium hover:text-primary"
                  >
                    {tab.title}
                  </Link>
                </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
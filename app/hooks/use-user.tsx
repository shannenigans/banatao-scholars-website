'use client';

import React from 'react';

import type { AuthenticatedViewer } from '@/app/lib/auth';
import type { PrivateScholarProfile } from '@/app/types/scholar';

export type UserContextValue = {
  viewer: AuthenticatedViewer | null;
  scholarProfile: PrivateScholarProfile | null;
};

const UserContext = React.createContext<UserContextValue>({
  viewer: null,
  scholarProfile: null,
});

export default function UserProvider({
  children,
  viewer = null,
  scholarProfile = null,
}: {
  children: React.ReactNode;
  viewer?: AuthenticatedViewer | null;
  scholarProfile?: PrivateScholarProfile | null;
}) {
  return (
    <UserContext.Provider value={{ viewer, scholarProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return React.useContext(UserContext);
}

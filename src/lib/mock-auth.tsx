'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { SEED_USERS } from './db/seed-data';

interface AuthContextType {
  currentUser: User;
  allUsers: User[];
  currentOrg: {
    id: string;
    name: string;
    currency: string;
    plan: string;
  };
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[0]);
  const [currentOrg] = useState({
    id: 'org_apex',
    name: 'Apex Growth Media',
    currency: 'USD',
    plan: 'Scale Agency Plan',
  });

  const switchUser = (userId: string) => {
    const found = SEED_USERS.find((u) => u.id === userId);
    if (found) setCurrentUser(found);
  };

  const switchRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers: SEED_USERS,
        currentOrg,
        switchUser,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

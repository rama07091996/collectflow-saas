'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { SEED_USERS } from './db/seed-data';
import { JWTAuthService, TwoFactorConfig } from './jwt-auth';

interface AuthContextType {
  currentUser: User;
  allUsers: User[];
  currentOrg: {
    id: string;
    name: string;
    currency: string;
    plan: string;
  };
  isAuthenticated: boolean;
  twoFactorConfig: TwoFactorConfig;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  update2FA: (config: Partial<TwoFactorConfig>) => void;
  generatePaymentToken: (invoiceId: string, invoiceNumber: string, amount: number) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentOrg] = useState({
    id: 'org_apex',
    name: 'Apex Growth Media',
    currency: 'USD',
    plan: 'Scale Agency Plan',
  });

  const [twoFactorConfig, setTwoFactorConfig] = useState<TwoFactorConfig>({
    totpEnabled: true,
    smsEnabled: true,
    emailEnabled: true,
    phoneLast4: '2831',
    emailMasked: 's***@apexmedia.io',
    secretKey: 'JBSWY3DPEHPK3PXP',
    backupCodes: [
      'A7B2-C9F1',
      'X3K8-M4P9',
      'E2W1-Q8L5',
      'N9D4-V7T2',
      'H5J3-Z1X6',
      'B8M2-K4W7',
      'T1P9-R6C3',
      'Y4L8-S2Q5',
    ],
  });

  const switchUser = (userId: string) => {
    const found = SEED_USERS.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
    }
  };

  const switchRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
    }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const update2FA = (config: Partial<TwoFactorConfig>) => {
    setTwoFactorConfig((prev) => ({ ...prev, ...config }));
  };

  const generatePaymentToken = (invoiceId: string, invoiceNumber: string, amount: number): string => {
    return JWTAuthService.generatePaymentAuthToken({
      invoiceId,
      invoiceNumber,
      amount,
      customerId: currentUser.id,
      authorizedBy: currentUser.name,
      role: currentUser.role,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers: SEED_USERS,
        currentOrg,
        isAuthenticated,
        twoFactorConfig,
        switchUser,
        switchRole,
        logout,
        update2FA,
        generatePaymentToken,
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

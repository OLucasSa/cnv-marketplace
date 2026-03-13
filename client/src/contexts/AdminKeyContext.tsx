import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminKeyContextType {
  adminKey: string | null;
  setAdminKey: (key: string | null) => void;
}

const AdminKeyContext = createContext<AdminKeyContextType | undefined>(undefined);

export function AdminKeyProvider({ children }: { children: ReactNode }) {
  // Extrair chave da URL se estiver em /admin?key=...
  const urlParams = new URLSearchParams(window.location.search);
  const keyFromUrl = urlParams.get('key');
  
  const [adminKey, setAdminKey] = useState<string | null>(keyFromUrl);

  return (
    <AdminKeyContext.Provider value={{ adminKey, setAdminKey }}>
      {children}
    </AdminKeyContext.Provider>
  );
}

export function useAdminKey() {
  const context = useContext(AdminKeyContext);
  if (!context) {
    throw new Error('useAdminKey deve ser usado dentro de AdminKeyProvider');
  }
  return context;
}

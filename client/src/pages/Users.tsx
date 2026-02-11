import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import UsersTable from "@/components/UsersTable";
import { useLocation } from "wouter";
import { Users as UsersIcon } from "lucide-react";

export default function Users() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  if (user?.role !== "admin") {
    navigate("/admin");
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <UsersIcon className="h-6 w-6 text-accent" />
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Usuários</h1>
        </div>
        <p className="text-muted-foreground">
          Gerencie roles e permissões dos usuários do sistema
        </p>
      </div>

      <UsersTable />
    </div>
  );
}

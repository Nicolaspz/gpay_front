'use client'

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FiUsers, FiSearch, FiBriefcase } from 'react-icons/fi';
import { useAuth } from "@/hooks/useAuth";
import { useAdminClients } from "@/hooks/useAdminClients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientsService } from "@/services/clients.service";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/api-error";
import { MoreVertical, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ClientsDashboard() {
  const { user, isLoadingUser } = useAuth();
  const isAdmin = user?.user_type === "admin";
  const [searchTerm, setSearchTerm] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: clients = [], isLoading } = useAdminClients();
  const queryClient = useQueryClient();

  const activateMutation = useMutation({
    mutationFn: (id: string) => ClientsService.activateUser(id),
    onSuccess: () => {
      toast.success("Usuário ativado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Erro ao ativar usuário"));
    },
  });

  const blockMutation = useMutation({
    mutationFn: (id: string) => ClientsService.blockUser(id),
    onSuccess: () => {
      toast.success("Usuário bloqueado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Erro ao bloquear usuário"));
    },
  });

  const filteredClients = clients.filter(client => 
    client.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.tenant?.legal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoadingUser) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

  if (!isAdmin) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-[var(--danger)]">Acesso Negado</h2>
        <p className="text-[var(--muted-foreground)]">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[var(--background)] min-h-screen">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <FiUsers className="text-[var(--accent-primary)]" />
            Gestão de Clientes
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Administre todas as empresas e usuários registrados na plataforma.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-[var(--muted)] p-4 rounded-xl border border-[var(--border)]">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input 
            type="text" 
            placeholder="Buscar por nome, empresa ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
          />
        </div>
        <div className="text-sm text-[var(--muted-foreground)]">
          Total: <strong>{filteredClients.length}</strong> clientes
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-sm bg-[var(--card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="p-4 text-sm font-semibold text-[var(--muted-foreground)]">Empresa / Razão Social</th>
                <th className="p-4 text-sm font-semibold text-[var(--muted-foreground)]">Representante</th>
                <th className="p-4 text-sm font-semibold text-[var(--muted-foreground)]">Contacto</th>
                <th className="p-4 text-sm font-semibold text-[var(--muted-foreground)]">Status</th>
                <th className="p-4 text-sm font-semibold text-[var(--muted-foreground)]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {paginatedClients.map((client) => (
                <tr key={client.id} className="hover:bg-[var(--muted)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[var(--accent-primary-subtle)] flex items-center justify-center">
                        <FiBriefcase className="text-[var(--accent-primary)] text-xl" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--foreground)]">
                          {client.tenant?.legal_name || "Sem Empresa"}
                        </p>
                        <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-tighter">ID: {client.tenant?.id || "---"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-[var(--foreground)] font-medium">{client.fullname}</p>
                    <p className="text-xs text-[var(--accent-primary)] font-semibold">{client.user_type.toUpperCase()}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-[var(--muted-foreground)]">{client.email}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      client.status === 'active' 
                      ? 'bg-[var(--success-subtle)] text-[var(--success)]' 
                      : client.status === 'blocked'
                      ? 'bg-[var(--danger-subtle)] text-[var(--danger)]'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                    }`}>
                      {client.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-md hover:bg-[var(--muted)] transition-colors cursor-pointer">
                          <MoreVertical className="h-4 w-4 text-[var(--muted-foreground)]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[var(--card)] border border-[var(--border)] min-w-[120px]">
                        {client.status === 'blocked' ? (
                          <DropdownMenuItem
                            onClick={() => activateMutation.mutate(client.id)}
                            disabled={activateMutation.isPending}
                            className="cursor-pointer text-[var(--success)] hover:opacity-80 hover:bg-[var(--success-subtle)] focus:text-[var(--success)] focus:bg-[var(--success-subtle)]"
                          >
                            {activateMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Ativar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => blockMutation.mutate(client.id)}
                            disabled={blockMutation.isPending}
                            className="cursor-pointer text-[var(--danger)] hover:opacity-80 hover:bg-[var(--danger-subtle)] focus:text-[var(--danger)] focus:bg-[var(--danger-subtle)]"
                          >
                            {blockMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Bloquear
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-[var(--muted-foreground)]">
                    Nenhum cliente encontrado para sua busca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Paginação */}
      <div className="flex justify-between items-center bg-[var(--muted)] p-4 rounded-xl border border-[var(--border)]">
        <p className="text-sm text-[var(--muted-foreground)]">
          Mostrando <strong>{paginatedClients.length}</strong> de <strong>{filteredClients.length}</strong> clientes
        </p>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          <div className="flex items-center px-4 text-sm font-medium">
            Página {currentPage} de {totalPages}
          </div>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}

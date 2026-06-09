'use client'

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FiUsers, FiSearch, FiBriefcase } from 'react-icons/fi';
import { useAuth } from "@/hooks/useAuth";
import { useAdminClients } from "@/hooks/useAdminClients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientsService } from "@/services/clients.service";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/api-error";
import { Loader2 } from "lucide-react";

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
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

  if (!isAdmin) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">Acesso Negado</h2>
        <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-[#111827] min-h-screen">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiUsers className="text-blue-600" />
            Gestão de Clientes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Administre todas as empresas e usuários registrados na plataforma.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, empresa ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="text-sm text-gray-500">
          Total: <strong>{filteredClients.length}</strong> clientes
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-sm bg-[#F9FAFB] dark:bg-[#1F2937]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Empresa / Razão Social</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Representante</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Contacto</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FiBriefcase className="text-blue-600 dark:text-blue-400 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {client.tenant?.legal_name || "Sem Empresa"}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">ID: {client.tenant?.id || "---"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{client.fullname}</p>
                    <p className="text-xs text-blue-600 font-semibold">{client.user_type.toUpperCase()}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{client.email}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      client.status === 'active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : client.status === 'blocked'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-gray-100 text-gray-600'
                    }`}>
                      {client.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {client.status === 'blocked' ? (
                        <button
                          onClick={() => activateMutation.mutate(client.id)}
                          disabled={activateMutation.isPending}
                          className="px-3 py-1.5 text-xs font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 disabled:opacity-50 transition-colors"
                        >
                          {activateMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Ativar"
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => blockMutation.mutate(client.id)}
                          disabled={blockMutation.isPending}
                          className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 disabled:opacity-50 transition-colors"
                        >
                          {blockMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Bloquear"
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    Nenhum cliente encontrado para sua busca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Paginação */}
      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
        <p className="text-sm text-gray-500">
          Mostrando <strong>{paginatedClients.length}</strong> de <strong>{filteredClients.length}</strong> clientes
        </p>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          <div className="flex items-center px-4 text-sm font-medium">
            Página {currentPage} de {totalPages}
          </div>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}

'use client'

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FiSearch, FiClock } from 'react-icons/fi';
import { useAuth } from "@/hooks/useAuth";
import { useLogs } from "@/hooks/useLogs";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X, Eye } from "lucide-react";
import type { Log } from "@/types/global";

export default function LogsDashboard() {
  const { user, isLoadingUser } = useAuth();
  const isAdmin = user?.user_type === "admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const itemsPerPage = 15;

  const { data: logs = [], isLoading } = useLogs();

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
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
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-[#111827] min-h-screen">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiClock className="text-blue-600" />
            Logs do Sistema
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Registro de todas as ações realizadas na plataforma.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ação, usuário ou detalhes..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="text-sm text-gray-500">
          Total: <strong>{filteredLogs.length}</strong> registos
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-sm bg-[#F9FAFB] dark:bg-[#1F2937]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Ação</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Usuário</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Recurso</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Data</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {log.user_name || "---"}
                    </p>
                    {log.user_email && (
                      <p className="text-xs text-gray-500">{log.user_email}</p>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {log.resource || "---"}
                    </p>
                    {log.resource_id && (
                      <p className="text-[10px] text-gray-500 font-mono">ID: {log.resource_id}</p>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                    <p>{new Date(log.created_at).toLocaleDateString("pt-PT")}</p>
                    <p className="text-[10px]">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: ptBR })}
                    </p>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    Nenhum registo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
        <p className="text-sm text-gray-500">
          Mostrando <strong>{paginatedLogs.length}</strong> de <strong>{filteredLogs.length}</strong> registos
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 cursor-pointer"
          >
            Anterior
          </button>
          <div className="flex items-center px-4 text-sm font-medium">
            Página {currentPage} de {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 cursor-pointer"
          >
            Próximo
          </button>
        </div>
      </div>

      {selectedLog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detalhes do Log</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Ação</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                    {selectedLog.action}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Data</p>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">
                    {new Date(selectedLog.created_at).toLocaleString("pt-PT")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Usuário</p>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">
                    {selectedLog.user_name || "---"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">
                    {selectedLog.user_email || "---"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Recurso</p>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">
                    {selectedLog.resource || "---"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">ID do Recurso</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white mt-1">
                    {selectedLog.resource_id || "---"}
                  </p>
                </div>
                {selectedLog.ip_address && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">IP</p>
                    <p className="text-sm font-mono text-gray-900 dark:text-white mt-1">
                      {selectedLog.ip_address}
                    </p>
                  </div>
                )}
              </div>
              {selectedLog.details && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Detalhes</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    {selectedLog.details}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

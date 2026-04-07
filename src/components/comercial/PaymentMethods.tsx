"use client";
import { useState, useContext } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, MoreVertical, Edit, Trash2 } from "lucide-react";
import { AddPaymentMethodModal, PaymentMethodData } from './add-payment-method-modal';
import { parseCookies } from 'nookies';
import { api } from "@/services/apiClients";
import { AuthContext } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'react-toastify';


// Tipo para o método de pagamento da API
interface ApiPaymentMethod {
  id: string;
  name: string;
  type: string;
  rsa_key?: string;
  redirect_url?: string;
  merchant_id?: string;
  merchant_member_id?: string;
  sale_product_code?: string;
  async_url?: string;
  rsa_key_priv?: string;
  rsa_key_pub?: string;
  created_at: string;
  updated_at: string;
}

// Converter dados da API para o formato do componente
const mapApiToComponent = (apiMethod: ApiPaymentMethod) => ({
  id: apiMethod.id,
  name: apiMethod.name || apiMethod.type,
  icon: <CreditCard className="w-5 h-5" />,
  data: {
    id: apiMethod.id,
    rsa_key: apiMethod.rsa_key || "",
    redirect_url: apiMethod.redirect_url || "",
    merchant_id: apiMethod.merchant_id || "",
    merchant_member_id: apiMethod.merchant_member_id || "",
    sale_product_code: apiMethod.sale_product_code || "",
    async_url: apiMethod.async_url || "",
    rsa_key_priv: apiMethod.rsa_key_priv || "",
    rsa_key_pub: apiMethod.rsa_key_pub || "",
    created_at: apiMethod.created_at,
    updated_at: apiMethod.updated_at
  }
});

// Modal de Confirmação para Eliminar
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  methodName: string;
  isDeleting: boolean;
}

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  methodName,
  isDeleting
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>

          <h3 className="text-lg font-semibold text-center mb-2">
            Eliminar Método de Pagamento
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Tem a certeza que deseja eliminar o método <strong>"{methodName}"</strong>?
            Esta ação não pode ser desfeita.
          </p>

          <div className="flex justify-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Sim, Eliminar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function PaymentMethodsSection() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingMethod, setEditingMethod] = useState<PaymentMethodData | null>(null);
  const [methodToDelete, setMethodToDelete] = useState<{ id: string, name: string } | null>(null);
  const { user } = useContext(AuthContext);

  const { data: paymentMethods = [], isLoading: loading, error: fetchError } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const { '@gCorporate.token': token } = parseCookies();
      const response = await api.get(`/payments`, {
        headers: {
          'Authorization': `Bearer ${token || user?.token}`
        }
      });
      if (response.data && Array.isArray(response.data)) {
        return response.data.map(mapApiToComponent);
      }
      return [];
    },
    enabled: !!(user?.token || parseCookies()['@gCorporate.token']),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { '@gCorporate.token': token } = parseCookies();
      await api.delete(`/payments/${id}`, {
        headers: {
          'Authorization': `Bearer ${token || user?.token}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      setIsDeleteModalOpen(false);
      setMethodToDelete(null);
      toast.success("Método de pagamento removido com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao remover método de pagamento");
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: PaymentMethodData) => {
      const { '@gCorporate.token': token } = parseCookies();
      if (modalMode === 'add') {
        const response = await api.post('/payments', data, {
          headers: {
            'Authorization': `Bearer ${token || user?.token}`,
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      } else {
        const updateData = { ...data, id: editingMethod?.id };
        const response = await api.put(`/payments`, updateData, {
          headers: {
            'Authorization': `Bearer ${token || user?.token}`,
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      handleCloseModal();
      toast.success(`Método de pagamento ${modalMode === 'add' ? 'adicionado' : 'atualizado'} com sucesso!`);
    },
    onError: (error: any) => {
      console.error(`Erro ao ${modalMode === 'add' ? 'adicionar' : 'editar'} método:`, error);
      const errorMessage = error.response?.data?.message || error.message || `Erro ao ${modalMode === 'add' ? 'adicionar' : 'editar'} método de pagamento`;
      toast.error(errorMessage);
    }
  });

  const handleAddMethod = () => {
    setModalMode('add');
    setEditingMethod(null);
    setIsModalOpen(true);
  };

  const handleEditMethod = (method: PaymentMethodData) => {
    setModalMode('edit');
    setEditingMethod(method);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMethod(null);
  };

  const handleSubmit = async (data: PaymentMethodData) => {
    if (!data.rsa_key || !data.redirect_url || !data.merchant_id ||
      !data.merchant_member_id || !data.sale_product_code ||
      !data.async_url || !data.rsa_key_priv || !data.rsa_key_pub) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }
    submitMutation.mutate(data);
  };

  const handleDeleteClick = (methodId: string, methodName: string) => {
    setMethodToDelete({ id: methodId, name: methodName });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!methodToDelete) return;
    deleteMutation.mutate(methodToDelete.id);
  };

  const isDeleting = deleteMutation.isPending;
  const error = fetchError ? (fetchError as any).message : null;

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setMethodToDelete(null);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Métodos de Pagamento</h2>
          <Button disabled>
            <Plus className="mr-2" /> Adicionar
          </Button>
        </div>
        <div className="text-center py-8">
          <p>Carregando métodos de pagamento...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Métodos de Pagamento</h2>
          <Button
            onClick={handleAddMethod}
            className='cursor-pointer'
          >
            <Plus className="mr-2" /> Adicionar
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {paymentMethods.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum método de pagamento cadastrado.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                className="p-4 relative cursor-pointer transition-all duration-200
                           hover:bg-gray-100 hover:shadow-md hover:-translate-y-1
                           dark:hover:bg-gray-800 dark:hover:shadow-gray-700/30"
              >
                {/* Botão no canto superior direito */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditMethod(method.data);
                        }}
                        className="flex items-center cursor-pointer"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(method.data.id, method.data.rsa_key);
                        }}
                        className="flex items-center text-red-600 focus:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Conteúdo do card */}
                <div
                  className="flex items-center space-x-3 pt-2"
                  onClick={() => handleEditMethod(method.data)}
                >
                  {method.icon}
                  <div>
                    <span className="font-medium block">{method.data.rsa_key}</span>
                    <span className="text-sm text-gray-500">{method.data.merchant_id}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Modal para Adicionar/Editar */}
      <AddPaymentMethodModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingMethod={editingMethod}
        mode={modalMode}
      />

      {/* Modal de Confirmação para Eliminar */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        methodName={methodToDelete?.name || ''}
        isDeleting={isDeleting}
      />
    </>
  );
}
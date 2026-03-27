"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface PaymentMethodData {
  id?: string;
  rsa_key: string;
  redirect_url: string;
  merchant_id: string;
  merchant_member_id: string;
  sale_product_code: string;
  async_url: string;
  rsa_key_priv: string;
  rsa_key_pub: string;
}

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentMethodData) => void;
  editingMethod?: PaymentMethodData | null;
  mode: 'add' | 'edit';
}

export function AddPaymentMethodModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingMethod,
  mode 
}: AddPaymentMethodModalProps) {
  const [formData, setFormData] = useState<PaymentMethodData>({
    rsa_key: '',
    redirect_url: '',
    merchant_id: '',
    merchant_member_id: '',
    sale_product_code: '',
    async_url: '',
    rsa_key_priv: '',
    rsa_key_pub: ''
  });

  // Preenche o formulário quando estiver editando
  useEffect(() => {
    if (mode === 'edit' && editingMethod) {
      setFormData(editingMethod);
    } else {
      // Reseta o formulário quando estiver adicionando
      setFormData({
        rsa_key: '',
        redirect_url: '',
        merchant_id: '',
        merchant_member_id: '',
        sale_product_code: '',
        async_url: '',
        rsa_key_priv: '',
        rsa_key_pub: ''
      });
    }
  }, [editingMethod, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof PaymentMethodData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const title = mode === 'add' ? 'Adicionar Método de Pagamento' : 'Editar Método de Pagamento';
  const description = mode === 'add' 
    ? 'Adicione um novo método de pagamento à sua conta.' 
    : 'Edite as informações do método de pagamento.';

  const submitButtonText = mode === 'add' ? 'Adicionar Método' : 'Salvar Alterações';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Chave</label>
              <input
                type="text"
                value={formData.rsa_key}
                onChange={(e) => handleChange('rsa_key', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                placeholder="Inserir a Chave"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Redirect URL</label>
              <input
                type="url"
                value={formData.redirect_url}
                onChange={(e) => handleChange('redirect_url', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                placeholder="https://br.millenium.gg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ID do Comerciante</label>
              <input
                type="text"
                value={formData.merchant_id}
                onChange={(e) => handleChange('merchant_id', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                placeholder="adicionar id do Comerciante"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ID de membro comerciante</label>
              <input
                type="text"
                value={formData.merchant_member_id}
                onChange={(e) => handleChange('merchant_member_id', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                placeholder="8237832783"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sale Product Code</label>
              <input
                type="text"
                value={formData.sale_product_code}
                onChange={(e) => handleChange('sale_product_code', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                placeholder="ndjhewulewii2245"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Async URL</label>
              <input
                type="url"
                value={formData.async_url}
                onChange={(e) => handleChange('async_url', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                placeholder="https://br.millenium.gg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Chave privada</label>
              <input
                type="text"
                value={formData.rsa_key_priv}
                onChange={(e) => handleChange('rsa_key_priv', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                placeholder="inserir a Chave Privada"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Chave Pública</label>
              <input
                type="text"
                value={formData.rsa_key_pub}
                onChange={(e) => handleChange('rsa_key_pub', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                placeholder="Inserir a Chave Pública"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 mt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              type="button"
              variant="outline"
              onClick={onClose}
              className='cursor-pointer'
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className='cursor-pointer'
            >
              {submitButtonText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { TransactionsTable } from "@/components/dashboard/TransactionsTable"; 
import { mockTransactions } from "@/components/dashboard/TransactionsTable";

export default function TransactionsPage() {
  // Se estiver buscando dados de uma API:
  // const { data: transactions, isLoading } = useFetchTransactions();
  
  return (
    <div className="p-6 space-y-6 bg-white dark:bg-[#111827] min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transações</h1>
      
      
      <TransactionsTable transactions={mockTransactions} />
      
    </div>
  );
}
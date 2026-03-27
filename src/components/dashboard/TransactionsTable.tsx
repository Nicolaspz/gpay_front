import { Card } from "@/components/ui/card";
import { FiUser, FiArrowUpRight, FiArrowDownRight, FiAlertCircle } from 'react-icons/fi';

type Transaction = {
  id: string;
  member: string;
  email: string;
  plan: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  date: string;
  type: 'credit' | 'debit';
};

export function TransactionsTable({ transactions = [] }: { transactions?: Transaction[] }) {
  return (
    <Card className="p-6 bg-[#F9FAFB] dark:bg-[#1F2937] border-0 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transações Recentes</h2>
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
          View all
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <FiAlertCircle className="h-8 w-8 mb-4" />
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 px-4">Member</th>
                <th className="pb-3 px-4">Plan</th>
                <th className="pb-3 px-4">Amount</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

// ... (mantenha os outros componentes auxiliares como TransactionRow, MemberCell, etc.)

// Componente de linha da tabela
function TransactionRow({ transaction }: { transaction: Transaction }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <td className="py-4 px-4">
        <MemberCell member={transaction.member} email={transaction.email} />
      </td>
      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{transaction.plan}</td>
      <td className="py-4 px-4">
        <AmountCell amount={transaction.amount} type={transaction.type} />
      </td>
      <td className="py-4 px-4">
        <StatusBadge status={transaction.status} />
      </td>
      <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{transaction.date}</td>
    </tr>
  );
}

// Componente de célula do membro
function MemberCell({ member, email }: { member: string; email: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
        <FiUser className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </div>
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{member}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
      </div>
    </div>
  );
}

// Componente de valor (com ícone de crédito/débito)
function AmountCell({ amount, type }: { amount: string; type: 'credit' | 'debit' }) {
  const Icon = type === 'credit' ? FiArrowUpRight : FiArrowDownRight;
  const colorClass = type === 'credit' ? 'text-green-500' : 'text-red-500';
  
  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${colorClass}`} />
      <span className={`font-medium ${colorClass}`}>{amount}</span>
    </div>
  );
}

// Componente de badge de status
function StatusBadge({ status }: { status: Transaction['status'] }) {
  const statusClasses = {
    Completed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    Pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    Failed: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    Refunded: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
      {status}
    </span>
  );
}

// Dados mockados (pode ser movido para um arquivo separado)
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    member: "Alex Johnson",
    email: "alex@example.com",
    plan: "Premium",
    amount: "$49.99",
    status: "Completed",
    date: "Jan 20, 2024",
    type: "credit"
  },
  {
    id: '2',
    member: "Maria Garcia",
    email: "maria@example.com",
    plan: "Basic",
    amount: "$19.99",
    status: "Pending",
    date: "Jan 18, 2024",
    type: "credit"
  },
  {
    id: '3',
    member: "James Smith",
    email: "james@example.com",
    plan: "Enterprise",
    amount: "$99.99",
    status: "Refunded",
    date: "Jan 22, 2024",
    type: "debit"
  },
];
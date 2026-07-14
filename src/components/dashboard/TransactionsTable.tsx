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
    <Card className="p-0 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--border)]">
        <div>
          <h2 className="text-[15px] font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-clash-display)" }}>Transações Recentes</h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Últimas transações processadas</p>
        </div>
        <button className="text-xs font-medium text-[var(--accent-primary)] hover:underline">
          Ver todas →
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[var(--muted-foreground)]">
          <FiAlertCircle className="h-8 w-8 mb-3 opacity-40" />
          <p className="text-sm">Nenhuma transação encontrada</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-[var(--secondary)] text-left">
                <th className="px-6 py-3 text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-[0.05em]">Membro</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-[0.05em]">Plano</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-[0.05em]">Valor</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-[0.05em]">Status</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-[0.05em]">Data</th>
              </tr>
            </thead>
            <tbody>
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

function TransactionRow({ transaction }: { transaction: Transaction }) {
  return (
    <tr className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--secondary)] transition-colors duration-150">
      <td className="px-6 py-3.5">
        <MemberCell member={transaction.member} email={transaction.email} />
      </td>
      <td className="px-6 py-3.5 text-sm text-[var(--muted-foreground)]">{transaction.plan}</td>
      <td className="px-6 py-3.5">
        <AmountCell amount={transaction.amount} type={transaction.type} />
      </td>
      <td className="px-6 py-3.5">
        <StatusBadge status={transaction.status} />
      </td>
      <td className="px-6 py-3.5 text-xs text-[var(--muted-foreground)]">{transaction.date}</td>
    </tr>
  );
}

function MemberCell({ member, email }: { member: string; email: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-[var(--muted)] flex items-center justify-center">
        <FiUser className="h-4 w-4 text-[var(--muted-foreground)]" />
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--foreground)]">{member}</p>
        <p className="text-xs text-[var(--muted-foreground)]">{email}</p>
      </div>
    </div>
  );
}

function AmountCell({ amount, type }: { amount: string; type: 'credit' | 'debit' }) {
  const Icon = type === 'credit' ? FiArrowUpRight : FiArrowDownRight;
  const colorClass = type === 'credit' ? 'text-[var(--success)]' : 'text-[var(--danger)]';

  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
      <span className={`text-sm font-semibold ${colorClass}`} style={{ fontFeatureSettings: '"tnum"' }}>{amount}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const config = {
    Completed: { bg: "bg-[var(--success-subtle)]", text: "text-[var(--success)]", dot: "bg-[var(--success)]" },
    Pending: { bg: "bg-[var(--warning-subtle)]", text: "text-[var(--warning)]", dot: "bg-[var(--warning)]" },
    Failed: { bg: "bg-[var(--danger-subtle)]", text: "text-[var(--danger)]", dot: "bg-[var(--danger)]" },
    Refunded: { bg: "bg-[var(--info-subtle)]", text: "text-[var(--info)]", dot: "bg-[var(--info)]" },
  };

  const c = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status === 'Completed' ? 'Concluída' : status === 'Pending' ? 'Pendente' : status === 'Failed' ? 'Falhou' : 'Reembolsado'}
    </span>
  );
}

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

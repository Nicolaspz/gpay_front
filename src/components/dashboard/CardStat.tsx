import { Card } from "@/components/ui/card";

export function CardStat({ 
  title, 
  amount, 
  change,
  icon
}: { 
  title: string; 
  amount: string; 
  change?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="p-4 w-full bg-[#F9FAFB] dark:bg-[#1F2937] border-0 rounded-xl shadow-sm flex flex-col gap-2 text-gray-900 dark:text-white">
      <div className="flex justify-between items-start">
        <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100">
          {icon}
        </div>
        {change && (
          <span className={`text-sm font-semibold ${
            change.startsWith('+') ? 'text-green-500' :
            change.startsWith('-') ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
          }`}>
            ▲ {change}
          </span>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words leading-tight">
          {amount}
        </p>
        <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{title}</p>
      </div>
    </Card>
  );
}

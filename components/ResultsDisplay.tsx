
import React from 'react';
import type { StatementData } from '../types';
import { BankIcon, CalendarIcon, CreditCardIcon, DollarSignIcon, FileTextIcon } from './Icons';

interface ResultsDisplayProps {
  data: StatementData;
}

const ResultItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start py-4">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-blue-500 dark:text-blue-400">
           {icon}
        </div>
        <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{value || 'Not found'}</p>
        </div>
    </div>
);


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data }) => {
  return (
    <div className="w-full animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 text-center text-slate-800 dark:text-white">Extracted Details</h2>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
            <ResultItem icon={<BankIcon />} label="Issuer Name" value={data.issuerName} />
            <ResultItem icon={<CreditCardIcon />} label="Card (Last 4 Digits)" value={data.cardLastFour} />
            <ResultItem icon={<FileTextIcon />} label="Statement Period" value={data.statementPeriod} />
            <ResultItem icon={<CalendarIcon />} label="Payment Due Date" value={data.paymentDueDate} />
            <ResultItem icon={<DollarSignIcon />} label="Total Amount Due" value={data.totalAmountDue} />
        </div>
    </div>
  );
};

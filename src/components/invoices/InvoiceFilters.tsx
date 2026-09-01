'use client';

import React from 'react';
import { Search, Filter, Plus, FileSpreadsheet } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface InvoiceFiltersProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateModal: () => void;
}

const TABS = [
  { id: 'ALL', label: 'All Invoices' },
  { id: 'OVERDUE', label: 'Overdue & Escalated' },
  { id: 'PENDING', label: 'Due Soon / Pending' },
  { id: 'PAID', label: 'Settled / Paid' },
];

export const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  currentTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
        {TABS.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search and Create */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search by invoice or client..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            className="h-9 text-xs"
          />
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenCreateModal}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="text-xs shrink-0 font-bold bg-emerald-600 hover:bg-emerald-700"
        >
          New Invoice
        </Button>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { WorkflowStep } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  Clock,
  Mail,
  ShieldAlert,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from 'lucide-react';

interface CadenceStepCardProps {
  step: WorkflowStep;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updated: WorkflowStep) => void;
}

export const CadenceStepCard: React.FC<CadenceStepCardProps> = ({
  step,
  isSelected,
  onSelect,
  onChange,
}) => {
  const getTimingLabel = () => {
    if (step.offsetDays < 0) return `${Math.abs(step.offsetDays)} Days Before Due`;
    if (step.offsetDays === 0) return 'On Due Date';
    if (step.offsetDays === 30) return '30+ Days (Legal Escalation)';
    return `${step.offsetDays} Days Overdue`;
  };

  const getToneBadge = () => {
    if (step.offsetDays < 0) return { label: 'Friendly & Proactive', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (step.offsetDays === 0) return { label: 'Due Settlement', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (step.offsetDays === 7) return { label: 'Firm Reminder', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (step.offsetDays === 14) return { label: 'Urgent & Late Fee', bg: 'bg-orange-50 text-orange-800 border-orange-200' };
    return { label: 'Final Escalation', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
  };

  const tone = getToneBadge();

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-emerald-50/40 border-emerald-500 shadow-md ring-1 ring-emerald-500'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {step.stepOrder}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{getTimingLabel()}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${tone.bg}`}>
                {tone.label}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 truncate max-w-sm">
              {step.templateSubject}
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onChange({ ...step, isAutomated: !step.isAutomated });
          }}
          className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-900"
          title="Toggle automation"
        >
          {step.isAutomated ? (
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Auto
            </span>
          ) : (
            <span className="text-slate-400 font-medium">Manual Review</span>
          )}
        </button>
      </div>
    </div>
  );
};

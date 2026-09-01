'use client';

import React, { useState } from 'react';
import { Workflow, WorkflowStep } from '@/lib/types';
import { CadenceStepCard } from './CadenceStepCard';
import { EmailTemplatePreview } from './EmailTemplatePreview';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import {
  GitBranch,
  Play,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface WorkflowBuilderProps {
  initialWorkflow: Workflow;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ initialWorkflow }) => {
  const { toast } = useToast();
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow);
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateStep = (updated: WorkflowStep) => {
    const newSteps = [...workflow.steps];
    newSteps[selectedStepIndex] = updated;
    setWorkflow({ ...workflow, steps: newSteps });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/workflows', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow),
      });
      const data = await res.json();
      if (data.success) {
        toast('AR Follow-Up Cadence saved and deployed!', 'success');
      } else {
        toast('Failed to save cadence settings.', 'error');
      }
    } catch (err) {
      toast('Network error saving cadence.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedStep = workflow.steps[selectedStepIndex] || workflow.steps[0];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <GitBranch className="w-4 h-4" />
            <span>Active AR Follow-Up Automation Sequence</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">{workflow.name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{workflow.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Visual Step Timeline Sequence */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Cadence Stages & Timeline
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Click any step to edit its copy & schedule
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {workflow.steps.map((step, idx) => (
            <CadenceStepCard
              key={step.id}
              step={step}
              isSelected={selectedStepIndex === idx}
              onSelect={() => setSelectedStepIndex(idx)}
              onChange={(updated) => {
                const newSteps = [...workflow.steps];
                newSteps[idx] = updated;
                setWorkflow({ ...workflow, steps: newSteps });
              }}
            />
          ))}
        </div>
      </div>

      {/* Editor & Preview */}
      {selectedStep && (
        <EmailTemplatePreview
          step={selectedStep}
          onUpdateStep={handleUpdateStep}
          onSaveWorkflow={handleSave}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

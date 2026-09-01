'use client';

import React, { useEffect, useState } from 'react';
import { Workflow } from '@/lib/types';
import { WorkflowBuilder } from '@/components/workflows/WorkflowBuilder';
import { Loader2 } from 'lucide-react';

export default function WorkflowsPage() {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const res = await fetch('/api/workflows');
        const data = await res.json();
        if (data.success) {
          setWorkflow(data.data);
        }
      } catch (e) {
        console.error('Failed to load workflow', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkflow();
  }, []);

  if (isLoading || !workflow) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WorkflowBuilder initialWorkflow={workflow} />
    </div>
  );
}

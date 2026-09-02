import React from 'react';

/**
 * Loosely Coupled Widget Plugin Architecture
 * Enables adding, removing, or swapping widget options dynamically without modifying core UI code.
 */

export type WidgetTabId = 'ai' | 'actions' | 'payments' | 'security' | 'pulse' | 'personas' | string;

export interface WidgetTabPlugin {
  id: WidgetTabId;
  label: string;
  tooltip: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  order: number;
  component: React.ComponentType<WidgetTabProps>;
}

export interface WidgetTabProps {
  onClose?: () => void;
  onSwitchTab?: (tabId: WidgetTabId) => void;
}

import { WidgetTabPlugin } from './types';
import { Bot, Zap, DollarSign, ShieldCheck, TrendingUp, UserCheck } from 'lucide-react';
import { AICopilotTab } from './tabs/AICopilotTab';
import { ActionTriggersTab } from './tabs/ActionTriggersTab';
import { PaymentLinkTab } from './tabs/PaymentLinkTab';
import { SecurityJWTTab } from './tabs/SecurityJWTTab';
import { ARPulseTab } from './tabs/ARPulseTab';
import { PersonaSwitcherTab } from './tabs/PersonaSwitcherTab';

/**
 * Open/Closed Plugin Registry for CollectFlow Widget
 * Any new tool or option can be registered here with 0 modifications to the widget core.
 */
class WidgetPluginRegistry {
  private plugins: Map<string, WidgetTabPlugin> = new Map();

  constructor() {
    this.registerDefaultPlugins();
  }

  public register(plugin: WidgetTabPlugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  public unregister(pluginId: string): void {
    this.plugins.delete(pluginId);
  }

  public getPlugin(pluginId: string): WidgetTabPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  public getAllPlugins(): WidgetTabPlugin[] {
    return Array.from(this.plugins.values()).sort((a, b) => a.order - b.order);
  }

  private registerDefaultPlugins(): void {
    this.register({
      id: 'ai',
      label: 'AI Copilot',
      tooltip: 'Autonomous AI Dunning & Chat',
      icon: Bot,
      iconColor: 'text-emerald-400',
      order: 1,
      component: AICopilotTab,
    });

    this.register({
      id: 'actions',
      label: 'Triggers',
      tooltip: '1-Click Workflow Action Triggers',
      icon: Zap,
      iconColor: 'text-amber-400',
      order: 2,
      component: ActionTriggersTab,
    });

    this.register({
      id: 'payments',
      label: 'Links',
      tooltip: '1-Click Stripe Payment Link Generator',
      icon: DollarSign,
      iconColor: 'text-emerald-400',
      order: 3,
      component: PaymentLinkTab,
    });

    this.register({
      id: 'security',
      label: '2FA/JWT',
      tooltip: '2FA Security & Payment JWT Signer',
      icon: ShieldCheck,
      iconColor: 'text-purple-400',
      order: 4,
      component: SecurityJWTTab,
    });

    this.register({
      id: 'pulse',
      label: 'Pulse',
      tooltip: 'Live AR Financial Pulse & Velocity',
      icon: TrendingUp,
      iconColor: 'text-blue-400',
      order: 5,
      component: ARPulseTab,
    });

    this.register({
      id: 'personas',
      label: 'User',
      tooltip: 'Instant 1-Click Persona Switcher',
      icon: UserCheck,
      iconColor: 'text-rose-400',
      order: 6,
      component: PersonaSwitcherTab,
    });
  }
}

export const widgetRegistry = new WidgetPluginRegistry();

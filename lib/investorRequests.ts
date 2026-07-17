import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export type InvestorRequest = {
  id: string;
  name: string;
  email: string;
  organization: string;
  investorType: string;
  useCase: string;
  assetClasses: string;
  modelCategories: string;
  accountType: string;
  desiredBroker: string;
  apiRequirements: string;
  userCount: string;
  subscriptionLevel: string;
  timeline: string;
  status: 'pending';
  createdAt: string;
};

const filePath = path.join(process.cwd(), '.qsentia-cache', 'investor-requests.json');

const allowed = {
  investorType: new Set(['Individual', 'Advisor', 'Family office', 'Institutional team', 'Model creator']),
  useCase: new Set(['Model discovery', 'Research diligence', 'Signal subscription', 'Portfolio monitoring', 'API integration']),
  accountType: new Set(['Individual', 'Advisor', 'Family office', 'Institutional', 'Internal research']),
  desiredBroker: new Set(['Alpaca', 'IBKR', 'Schwab', 'Other', 'Not sure yet']),
  apiRequirements: new Set(['Dashboard only', 'Exports', 'Read API', 'Webhooks', 'Custom integration']),
  userCount: new Set(['1', '2-5', '6-20', '20+']),
  subscriptionLevel: new Set(['Explorer', 'Investor', 'Professional', 'Enterprise', 'Not sure yet']),
  timeline: new Set(['Immediate', '1-3 months', '3-6 months', '6+ months']),
};

function required(value: unknown, label: string, max = 200) {
  const result = String(value || '').trim();
  if (!result || result.length > max) throw new Error(`${label} is required`);
  return result;
}

function allowedValue<K extends keyof typeof allowed>(key: K, input: Record<string, unknown>, label: string) {
  const value = required(input[key], label);
  if (!allowed[key].has(value)) throw new Error(`Select a valid ${label.toLowerCase()}`);
  return value;
}

export async function createInvestorRequest(input: Record<string, unknown>) {
  const email = required(input.email, 'Email').toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email address');

  const record: InvestorRequest = {
    id: crypto.randomUUID(),
    name: required(input.name, 'Name', 160),
    email,
    organization: required(input.organization, 'Organization', 160),
    investorType: allowedValue('investorType', input, 'Investor or organization type'),
    useCase: allowedValue('useCase', input, 'Intended use case'),
    assetClasses: required(input.assetClasses, 'Asset classes of interest'),
    modelCategories: required(input.modelCategories, 'Model categories of interest'),
    accountType: allowedValue('accountType', input, 'Account type'),
    desiredBroker: allowedValue('desiredBroker', input, 'Desired broker'),
    apiRequirements: allowedValue('apiRequirements', input, 'API requirements'),
    userCount: allowedValue('userCount', input, 'Number of users'),
    subscriptionLevel: allowedValue('subscriptionLevel', input, 'Expected subscription level'),
    timeline: allowedValue('timeline', input, 'Desired pilot timeline'),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { supabaseAdmin } = await import('../backend/lib/supabase');
    const { error } = await supabaseAdmin.from('investor_requests').insert({
      id: record.id,
      name: record.name,
      email: record.email,
      organization: record.organization,
      investor_type: record.investorType,
      use_case: record.useCase,
      asset_classes: record.assetClasses,
      model_categories: record.modelCategories,
      account_type: record.accountType,
      desired_broker: record.desiredBroker,
      api_requirements: record.apiRequirements,
      user_count: record.userCount,
      subscription_level: record.subscriptionLevel,
      timeline: record.timeline,
      status: record.status,
      created_at: record.createdAt,
    });
    if (error) throw new Error('Model access request could not be stored');
    return record;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  let rows: InvestorRequest[] = [];
  try {
    rows = JSON.parse(await fs.readFile(filePath, 'utf8')) as InvestorRequest[];
  } catch {
    rows = [];
  }
  rows.unshift(record);
  await fs.writeFile(filePath, JSON.stringify(rows.slice(0, 1000), null, 2), 'utf8');
  return record;
}

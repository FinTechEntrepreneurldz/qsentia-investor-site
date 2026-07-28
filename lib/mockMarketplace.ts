import type { MarketplaceModel, ModelDetails } from '@/lib/modelCatalog';

const MOCK_BASE_TIMESTAMP = '2026-07-16T09:30:00.000Z';

function curve(values: number[]) {
  return values.map((value, index) => ({
    timestamp: `2026-0${Math.min(9, Math.floor(index / 3) + 1)}-${String((index % 3) * 10 + 1).padStart(2, '0')}`,
    value,
  }));
}

export const MOCK_MARKETPLACE_MODELS: MarketplaceModel[] = [
  {
    id: 'model_c_etf',
    slug: 'model-c-etf',
    name: 'Model C ETF Regime Alpha',
    description:
      'Systematic ETF regime allocator for investors who want a transparent, monitored machine-learning product with disciplined drawdown controls.',
    category: 'equity',
    performance: {
      sharpeRatio: 2.14,
      totalReturn: 0.347,
      annualizedReturn: 0.281,
      maxDrawdown: -0.082,
      winRate: 0.643,
    },
    pricing: '$2,500',
    billingInterval: 'monthly',
    minimumCapital: '$50,000',
    accessStatus: 'active',
    visibility: 'public',
    featured: true,
    salesOwner: 'Investor Relations',
    onboardingNotes:
      'Available for platform subscribers seeking monitored ETF allocation signals and model oversight.',
    commercialUpdatedAt: MOCK_BASE_TIMESTAMP,
    tags: ['etf', 'regime', 'signals', 'machine-learning'],
    repo: 'QSentia-com/model_c_etf',
    logsPath: 'logs',
    chart: curve([100, 101.8, 103.6, 104.2, 106.1, 108.4, 109.8, 111.1, 112.3, 114.2, 113.4, 115.6]),
    latestValue: 115.6,
    startingCapital: 100,
    observationCount: 12,
    evidenceRowCount: 248,
    inceptionDate: '2026-01-01',
    benchmarkLabel: 'SPY',
  },
  {
    id: 'crypto_sentiment_mlp',
    slug: 'crypto-sentiment-mlp-ppo-ibkr',
    name: 'Crypto Sentiment MLP/PPO - IBKR',
    description:
      'Crypto sentiment strategy with live decision telemetry, benchmark context, and broker-readiness review for higher-volatility allocations.',
    category: 'crypto',
    performance: {
      sharpeRatio: 1.87,
      totalReturn: 0.182,
      annualizedReturn: 0.224,
      maxDrawdown: -0.041,
      winRate: 0.589,
    },
    pricing: '$1,900',
    billingInterval: 'monthly',
    minimumCapital: '$25,000',
    accessStatus: 'active',
    visibility: 'public',
    featured: true,
    salesOwner: 'Investor Relations',
    onboardingNotes:
      'Suitable for investors seeking a monitored crypto sleeve with execution-readiness evidence before deployment.',
    commercialUpdatedAt: MOCK_BASE_TIMESTAMP,
    tags: ['crypto', 'sentiment', 'ppo', 'telemetry'],
    repo: 'QSentia-com/crypto_sentiment_MLP',
    logsPath: 'logs',
    chart: curve([100, 100.6, 101.9, 103.4, 103.1, 104.6, 106.8, 107.9, 109.2, 110.4, 112.1, 113.7]),
    latestValue: 113.7,
    startingCapital: 100,
    observationCount: 12,
    evidenceRowCount: 226,
    inceptionDate: '2026-02-01',
    benchmarkLabel: 'BTC',
  },
  {
    id: 'qsentia_eth_micro_futures_sentiment_alpha',
    slug: 'eth-futures-sentiment',
    name: 'ETH Futures Sentiment - Hourly',
    description:
      'Hourly ETH futures sentiment strategy built for active crypto exposure with monitored signal cadence, IBKR routing, and live account telemetry.',
    category: 'sentiment',
    performance: {
      sharpeRatio: 2.31,
      totalReturn: 0.224,
      annualizedReturn: 0.263,
      maxDrawdown: -0.067,
      winRate: 0.712,
    },
    pricing: '$2,250',
    billingInterval: 'monthly',
    minimumCapital: '$75,000',
    accessStatus: 'active',
    visibility: 'public',
    featured: false,
    salesOwner: 'Investor Relations',
    onboardingNotes:
      'Hourly micro futures model with monitored drawdown and return telemetry for higher-conviction trading accounts.',
    commercialUpdatedAt: MOCK_BASE_TIMESTAMP,
    tags: ['eth', 'futures', 'sentiment', 'derivatives', 'hourly'],
    repo: 'QSentia-com/qsentia-eth-micro-futures-sentiment-alpha',
    logsPath: 'logs',
    chart: curve([100, 101.1, 102.8, 103.2, 104.7, 105.9, 106.4, 108.1, 109.5, 110.1, 111.4, 112.8]),
    latestValue: 112.8,
    startingCapital: 100,
    observationCount: 12,
    evidenceRowCount: 264,
    inceptionDate: '2026-01-10',
    benchmarkLabel: 'ETH',
  },
  {
    id: 'eth-futures-sentiment-daily',
    slug: 'eth-futures-sentiment-daily',
    name: 'ETH Futures Sentiment - Daily',
    description:
      'Daily ETH futures sentiment strategy using the same backtest evidence as the hourly model, with separate once-daily execution and dedicated IBKR account routing.',
    category: 'sentiment',
    performance: {
      sharpeRatio: 2.31,
      totalReturn: 0.224,
      annualizedReturn: 0.263,
      maxDrawdown: -0.067,
      winRate: 0.712,
    },
    pricing: '$2,250',
    billingInterval: 'monthly',
    minimumCapital: '$75,000',
    accessStatus: 'active',
    visibility: 'public',
    featured: false,
    salesOwner: 'Investor Relations',
    onboardingNotes:
      'Daily ETH futures sentiment model with independent IBKR account routing and shared ETH backtest evidence.',
    commercialUpdatedAt: MOCK_BASE_TIMESTAMP,
    tags: ['eth', 'futures', 'sentiment', 'derivatives', 'daily'],
    repo: 'QSentia-com/qsentia-eth-micro-futures-sentiment-alpha',
    logsPath: 'logs',
    chart: curve([100, 101.1, 102.8, 103.2, 104.7, 105.9, 106.4, 108.1, 109.5, 110.1, 111.4, 112.8]),
    latestValue: 112.8,
    startingCapital: 100,
    observationCount: 12,
    evidenceRowCount: 264,
    inceptionDate: '2026-01-10',
    benchmarkLabel: 'ETH',
  },
  {
    id: 'br_ppo_crypto_v15',
    slug: 'br-ppo-crypto-v15',
    name: 'BR-PPO Crypto V15',
    description:
      'Higher-beta crypto allocation model intended for investors who can tolerate deeper swings in pursuit of stronger upside capture.',
    category: 'reinforcement-learning',
    performance: {
      sharpeRatio: 0.72,
      totalReturn: -0.032,
      annualizedReturn: 0.064,
      maxDrawdown: -0.184,
      winRate: 0.441,
    },
    pricing: '$1,250',
    billingInterval: 'monthly',
    minimumCapital: '$20,000',
    accessStatus: 'waitlist',
    visibility: 'public',
    featured: false,
    salesOwner: 'Investor Relations',
    onboardingNotes:
      'Currently offered through waitlist review while operating controls and deployment thresholds are finalized.',
    commercialUpdatedAt: MOCK_BASE_TIMESTAMP,
    tags: ['crypto', 'ppo', 'rl', 'waitlist'],
    repo: 'QSentia-com/br_ppo_crypto_v15',
    logsPath: 'logs',
    chart: curve([100, 99.6, 99.2, 100.8, 98.4, 97.6, 99.1, 97.2, 96.4, 97.1, 96.2, 96.8]),
    latestValue: 96.8,
    startingCapital: 100,
    observationCount: 12,
    evidenceRowCount: 197,
    inceptionDate: '2026-03-01',
    benchmarkLabel: 'ETH',
  },
  {
    id: 'brppo_fixed_income_regime',
    slug: 'fixed-income-regime-signal',
    name: 'Fixed Income Regime Signal',
    description:
      'Lower-volatility multi-asset signal product focused on macro regime shifts and more conservative capital preservation.',
    category: 'macro',
    performance: {
      sharpeRatio: 1.61,
      totalReturn: 0.146,
      annualizedReturn: 0.171,
      maxDrawdown: -0.038,
      winRate: 0.674,
    },
    pricing: '$1,600',
    billingInterval: 'monthly',
    minimumCapital: '$50,000',
    accessStatus: 'active',
    visibility: 'public',
    featured: false,
    salesOwner: 'Investor Relations',
    onboardingNotes:
      'Designed for allocators who want a steadier signal sleeve alongside equities and higher-volatility strategies.',
    commercialUpdatedAt: MOCK_BASE_TIMESTAMP,
    tags: ['macro', 'fixed-income', 'multi-asset', 'defensive'],
    repo: 'QSentia-com/fixed_income_regime',
    logsPath: 'logs',
    chart: curve([100, 100.4, 100.9, 101.2, 101.7, 102.1, 102.6, 103.1, 103.4, 103.9, 104.6, 105.1]),
    latestValue: 105.1,
    startingCapital: 100,
    observationCount: 12,
    evidenceRowCount: 182,
    inceptionDate: '2026-01-15',
    benchmarkLabel: 'AGG',
  },
];

export function getMockMarketplaceResponse() {
  return {
    models: MOCK_MARKETPLACE_MODELS,
    timestamp: MOCK_BASE_TIMESTAMP,
  };
}

export function getMockMarketplaceModel(slug: string): ModelDetails | null {
  const summary = MOCK_MARKETPLACE_MODELS.find((model) => model.slug === slug);
  if (!summary) return null;

  return {
    ...summary,
    longDescription:
      'This is a fast-loading marketplace preview used to keep the commercial buying experience immediate while live telemetry connections continue to mature.',
    performance: {
      ...summary.performance,
      avgHoldingPeriod: '3 to 10 sessions',
      totalSignals: summary.observationCount ? summary.observationCount * 9 : 96,
    },
    features: [
      'Published model profile with structured return and drawdown context',
      'Commercial access review, minimum capital, and subscription packaging',
      'Broker-readiness and execution oversight before deployment',
      'Continuous telemetry and operating state visible in the customer workspace',
    ],
    latest: {
      decision: {
        action: summary.performance.totalReturn && summary.performance.totalReturn > 0 ? 'hold' : 'review',
        confidence: 0.82,
      },
      portfolioValue: summary.latestValue,
      portfolioValueTimestamp: MOCK_BASE_TIMESTAMP,
      latestSignalGrossWeight: 0.34,
      lastRun: MOCK_BASE_TIMESTAMP,
      paperStatus: 'Published',
      paperReplayStatus: 'Ready',
    },
  };
}

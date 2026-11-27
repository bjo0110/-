import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Search,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Clock,
  Globe,
  TrendingUp,
  AlertCircle,
  X,
  Plus,
  Star,
} from 'lucide-react';

const WATCHLIST_STORAGE_KEY = 'sp500_earnings_watchlist_v1';
const LIMIT_PER_STATUS = 30;
const MAX_WATCHLIST = 50;

const UI_TEXT = {
  ko: {
    title: 'S&P 500 실시간 실적발표 허브',
    subtitle: '실적 일정 조회 · GICS 섹터 필터 · 다국어 AI 어닝콜 심층 요약',
    searchPlaceholder: '티커 또는 기업명 검색 (예: AAPL, NVDA, DE, JPM)',
    searchBtn: '실시간 조회',
    searching: '조회 중...',
    all: '전체 (60)',
    upcoming: '예정 (빠른 순 30개)',
    reported: '발표완료 (최근 순 30개)',
    watchlistTab: (count) => `관심목록 (${count}/${MAX_WATCHLIST})`,
    allSectors: '전체 섹터',
    refreshAll: '일정 초기화',
    epsEst: 'EPS 예상',
    epsAct: 'EPS 실제',
    revEst: '매출 예상',
    revAct: '매출 실제',
    surprise: '어닝 서프라이즈',
    aiSummaryBtn: 'AI 어닝콜 요약',
    aiSummaryTitle: '어닝콜(Earnings Call) AI 심층 요약',
    aiLoading: '실적 수치와 핵심 사업부 전략을 심층 분석 중입니다...',
    noApiKey:
      'VITE_GEMINI_API_KEY가 아직 빌드에 반영되지 않았습니다. Vercel Settings → Environment Variables에 무료 API 키를 저장한 뒤 Deployments에서 Redeploy를 실행해 주세요.',
    watchlistFull: `관심목록은 최대 ${MAX_WATCHLIST}개까지 등록할 수 있습니다. 기존 종목을 해제한 뒤 추가해 주세요.`,
    addWatchlist: '관심 추가',
    inWatchlist: '관심 등록됨',
    regenerate: '다시 심층 분석',
    close: '닫기',
    noResults: '조건에 맞는 실적 발표 일정이 없습니다.',
    emptyWatchlist: `관심목록이 비어 있습니다. 카드의 별 아이콘을 눌러 최대 ${MAX_WATCHLIST}개까지 추가해 보세요.`,
    addTickerHint: '상단 검색창에서 원하는 S&P 500 종목을 실시간으로 추가해 보세요.',
    statusUpcoming: '발표예정',
    statusReported: '발표완료',
    timeBMO: '장 시작 전 (BMO)',
    timeAMC: '장 마감 후 (AMC)',
    countBadge: (upCount, repCount, watchCount) =>
      `예정 ${upCount}개 · 발표완료 ${repCount}개 · 관심 ${watchCount}/${MAX_WATCHLIST}`,
    disclaimer:
      '※ 본 앱의 일정 및 AI 요약은 참고용이며, 최종 공시 및 투자 판단의 책임은 이용자 본인에게 있습니다.',
  },
  en: {
    title: 'S&P 500 Earnings Hub',
    subtitle: 'Earnings Schedule · Sector Filter · Multilingual AI Call Summaries',
    searchPlaceholder: 'Search ticker or company (e.g. AAPL, NVDA, DE, JPM)',
    searchBtn: 'Live Lookup',
    searching: 'Looking up...',
    all: 'All (60)',
    upcoming: 'Upcoming (Earliest 30)',
    reported: 'Reported (Latest 30)',
    watchlistTab: (count) => `Watchlist (${count}/${MAX_WATCHLIST})`,
    allSectors: 'All Sectors',
    refreshAll: 'Reset Schedule',
    epsEst: 'EPS Est.',
    epsAct: 'EPS Act.',
    revEst: 'Rev. Est.',
    revAct: 'Rev. Act.',
    surprise: 'Surprise',
    aiSummaryBtn: 'AI Call Summary',
    aiSummaryTitle: 'AI Earnings Call Deep Summary',
    aiLoading: 'Analyzing earnings metrics and key conference call takeaways...',
    noApiKey:
      'VITE_GEMINI_API_KEY is not active in this build. Save your free API key in Vercel Environment Variables and trigger Redeploy.',
    watchlistFull: `Watchlist supports up to ${MAX_WATCHLIST} stocks. Remove an item before adding another.`,
    addWatchlist: 'Watch',
    inWatchlist: 'Watching',
    regenerate: 'Re-analyze',
    close: 'Close',
    noResults: 'No earnings events match your current filters.',
    emptyWatchlist: `Your watchlist is empty. Click the star button on any card to save up to ${MAX_WATCHLIST} stocks.`,
    addTickerHint: 'Use the search bar above to look up any S&P 500 ticker live.',
    statusUpcoming: 'Upcoming',
    statusReported: 'Reported',
    timeBMO: 'Before Market Open',
    timeAMC: 'After Market Close',
    countBadge: (upCount, repCount, watchCount) =>
      `Upcoming ${upCount} · Reported ${repCount} · Watchlist ${watchCount}/${MAX_WATCHLIST}`,
    disclaimer:
      '※ Earnings dates and AI summaries are for informational purposes only. Always verify official filings.',
  },
  ja: {
    title: 'S&P 500 決算スケジュールハブ',
    subtitle: '決算日程検索 · セクター絞り込み · 多言語AI決算コール詳細要約',
    searchPlaceholder: 'ティッカーまたは企業名で検索 (例: AAPL, NVDA, DE, JPM)',
    searchBtn: 'リアルタイム検索',
    searching: '検索中...',
    all: 'すべて (60)',
    upcoming: '予定（早い順 30件）',
    reported: '発表済（最新順 30件）',
    watchlistTab: (count) => `ウォッチリスト (${count}/${MAX_WATCHLIST})`,
    allSectors: '全セクター',
    refreshAll: '日程リセット',
    epsEst: 'EPS 予想',
    epsAct: 'EPS 実績',
    revEst: '売上 予想',
    revAct: '売上 実績',
    surprise: 'サプライズ',
    aiSummaryBtn: 'AI 決算コール要約',
    aiSummaryTitle: 'AI 決算コール詳細要約',
    aiLoading: '決算数値と主要事業の戦略ポイントを分析中...',
    noApiKey:
      'VITE_GEMINI_API_KEY がビルドに反映されていません。Vercelの環境変数設定後に Redeploy を実行してください。',
    watchlistFull: `ウォッチリストは最大${MAX_WATCHLIST}件まで登録できます。解除してから追加してください。`,
    addWatchlist: 'お気に入り',
    inWatchlist: '登録済み',
    regenerate: '再分析',
    close: '閉じる',
    noResults: '条件に一致する決算発表がありません。',
    emptyWatchlist: `ウォッチリストが空です。カードの星マークから最大${MAX_WATCHLIST}件まで追加できます。`,
    addTickerHint: '上の検索バーからS&P 500銘柄をリアルタイム検索できます。',
    statusUpcoming: '発表予定',
    statusReported: '発表済',
    timeBMO: '寄り付き前 (BMO)',
    timeAMC: '引け後 (AMC)',
    countBadge: (upCount, repCount, watchCount) =>
      `予定 ${upCount}件 · 発表済 ${repCount}件 · 注目 ${watchCount}/${MAX_WATCHLIST}`,
    disclaimer:
      '※ 決算日程およびAI要約は参考情報です。最終的な投資判断はご自身の責任で行ってください。',
  },
  zh: {
    title: '标普500财报日历中心',
    subtitle: '财报日程查询 · 行业筛选 · 多语言AI电话会议深度摘要',
    searchPlaceholder: '搜索代码或公司名称（如 AAPL, NVDA, DE, JPM）',
    searchBtn: '实时查询',
    searching: '查询中...',
    all: '全部 (60)',
    upcoming: '即将发布（最早30条）',
    reported: '已发布（最新30条）',
    watchlistTab: (count) => `自选股 (${count}/${MAX_WATCHLIST})`,
    allSectors: '全部行业',
    refreshAll: '重置日程',
    epsEst: 'EPS 预期',
    epsAct: 'EPS 实际',
    revEst: '营收 预期',
    revAct: '营收 实际',
    surprise: '业绩超预期',
    aiSummaryBtn: 'AI 电话会深度摘要',
    aiSummaryTitle: '财报电话会议 AI 深度摘要',
    aiLoading: '正在深度分析财报数据与核心业务要点...',
    noApiKey:
      'VITE_GEMINI_API_KEY 尚未生效。请在 Vercel 环境变量中保存密钥后执行 Redeploy。',
    watchlistFull: `自选股最多支持${MAX_WATCHLIST}只股票，请先取消一项后再添加。`,
    addWatchlist: '加自选',
    inWatchlist: '已自选',
    regenerate: '重新分析',
    close: '关闭',
    noResults: '没有符合当前筛选条件的财报日程。',
    emptyWatchlist: `自选股为空。点击卡片上的星标最多可添加${MAX_WATCHLIST}只股票。`,
    addTickerHint: '可在上方搜索框实时查询标普500成分股。',
    statusUpcoming: '即将发布',
    statusReported: '已发布',
    timeBMO: '盘前 (BMO)',
    timeAMC: '盘后 (AMC)',
    countBadge: (upCount, repCount, watchCount) =>
      `即将发布 ${upCount} · 已发布 ${repCount} · 自选 ${watchCount}/${MAX_WATCHLIST}`,
    disclaimer:
      '※ 财报日期与 AI 摘要仅供参考，请以官方披露为准并审慎决策。',
  },
  es: {
    title: 'Centro de Resultados S&P 500',
    subtitle: 'Calendario de Ganancias · Filtros por Sector · Análisis IA Multilingüe',
    searchPlaceholder: 'Buscar ticker o empresa (ej. AAPL, NVDA, DE, JPM)',
    searchBtn: 'Consulta en vivo',
    searching: 'Consultando...',
    all: 'Todos (60)',
    upcoming: 'Próximos (Primeros 30)',
    reported: 'Reportados (Últimos 30)',
    watchlistTab: (count) => `Seguimiento (${count}/${MAX_WATCHLIST})`,
    allSectors: 'Todos los sectores',
    refreshAll: 'Restablecer agenda',
    epsEst: 'BPA Est.',
    epsAct: 'BPA Real',
    revEst: 'Ing. Est.',
    revAct: 'Ing. Real',
    surprise: 'Sorpresa',
    aiSummaryBtn: 'Resumen IA Detallado',
    aiSummaryTitle: 'Análisis Profundo IA de la Llamada',
    aiLoading: 'Analizando métricas de resultados y puntos clave de la llamada...',
    noApiKey:
      'VITE_GEMINI_API_KEY no está activa en esta compilación. Guárdala en Vercel y ejecuta Redeploy.',
    watchlistFull: `La lista de seguimiento admite hasta ${MAX_WATCHLIST} acciones. Quita una antes de añadir otra.`,
    addWatchlist: 'Seguir',
    inWatchlist: 'Siguiendo',
    regenerate: 'Reanalizar',
    close: 'Cerrar',
    noResults: 'No hay eventos que coincidan con los filtros actuales.',
    emptyWatchlist: `Tu lista de seguimiento está vacía. Toca la estrella en cualquier tarjeta para guardar hasta ${MAX_WATCHLIST}.`,
    addTickerHint: 'Usa la barra superior para consultar cualquier empresa del S&P 500.',
    statusUpcoming: 'Próximo',
    statusReported: 'Reportado',
    timeBMO: 'Antes de apertura',
    timeAMC: 'Tras el cierre',
    countBadge: (upCount, repCount, watchCount) =>
      `Próximos ${upCount} · Reportados ${repCount} · Seguimiento ${watchCount}/${MAX_WATCHLIST}`,
    disclaimer:
      '※ Las fechas y resúmenes generados por IA son informativos. Verifique siempre los comunicados oficiales.',
  },
};

const INITIAL_EARNINGS = [
  { id: 'up-01', ticker: 'MRVL', company: 'Marvell Technology, Inc.', sector: 'Information Technology', date: '2026-12-01', timing: 'AMC', status: 'upcoming', epsEst: '$0.48', epsAct: '-', revEst: '$1.51B', revAct: '-', surprise: '-' },
  { id: 'up-02', ticker: 'NTAP', company: 'NetApp, Inc.', sector: 'Information Technology', date: '2026-12-01', timing: 'AMC', status: 'upcoming', epsEst: '$1.78', epsAct: '-', revEst: '$1.66B', revAct: '-', surprise: '-' },
  { id: 'up-03', ticker: 'CRWD', company: 'CrowdStrike Holdings, Inc.', sector: 'Information Technology', date: '2026-12-01', timing: 'AMC', status: 'upcoming', epsEst: '$0.81', epsAct: '-', revEst: '$1.03B', revAct: '-', surprise: '-' },
  { id: 'up-04', ticker: 'OKTA', company: 'Okta, Inc.', sector: 'Information Technology', date: '2026-12-01', timing: 'AMC', status: 'upcoming', epsEst: '$0.59', epsAct: '-', revEst: '$650M', revAct: '-', surprise: '-' },
  { id: 'up-05', ticker: 'CRM', company: 'Salesforce, Inc.', sector: 'Information Technology', date: '2026-12-02', timing: 'AMC', status: 'upcoming', epsEst: '$2.44', epsAct: '-', revEst: '$9.46B', revAct: '-', surprise: '-' },
  { id: 'up-06', ticker: 'DG', company: 'Dollar General Corporation', sector: 'Consumer Staples', date: '2026-12-03', timing: 'BMO', status: 'upcoming', epsEst: '$0.95', epsAct: '-', revEst: '$10.2B', revAct: '-', surprise: '-' },
  { id: 'up-07', ticker: 'KR', company: 'The Kroger Co.', sector: 'Consumer Staples', date: '2026-12-03', timing: 'BMO', status: 'upcoming', epsEst: '$0.98', epsAct: '-', revEst: '$34.2B', revAct: '-', surprise: '-' },
  { id: 'up-08', ticker: 'ULTA', company: 'Ulta Beauty, Inc.', sector: 'Consumer Discretionary', date: '2026-12-03', timing: 'AMC', status: 'upcoming', epsEst: '$4.52', epsAct: '-', revEst: '$2.50B', revAct: '-', surprise: '-' },
  { id: 'up-09', ticker: 'HPE', company: 'Hewlett Packard Enterprise', sector: 'Information Technology', date: '2026-12-03', timing: 'AMC', status: 'upcoming', epsEst: '$0.56', epsAct: '-', revEst: '$8.25B', revAct: '-', surprise: '-' },
  { id: 'up-10', ticker: 'COO', company: 'The Cooper Companies, Inc.', sector: 'Health Care', date: '2026-12-03', timing: 'AMC', status: 'upcoming', epsEst: '$1.00', epsAct: '-', revEst: '$1.02B', revAct: '-', surprise: '-' },
  { id: 'up-11', ticker: 'AZO', company: 'AutoZone, Inc.', sector: 'Consumer Discretionary', date: '2026-12-08', timing: 'BMO', status: 'upcoming', epsEst: '$33.60', epsAct: '-', revEst: '$4.30B', revAct: '-', surprise: '-' },
  { id: 'up-12', ticker: 'SNPS', company: 'Synopsys, Inc.', sector: 'Information Technology', date: '2026-12-08', timing: 'AMC', status: 'upcoming', epsEst: '$3.30', epsAct: '-', revEst: '$1.63B', revAct: '-', surprise: '-' },
  { id: 'up-13', ticker: 'CPB', company: 'The Campbell’s Company', sector: 'Consumer Staples', date: '2026-12-09', timing: 'BMO', status: 'upcoming', epsEst: '$0.87', epsAct: '-', revEst: '$2.79B', revAct: '-', surprise: '-' },
  { id: 'up-14', ticker: 'AVGO', company: 'Broadcom Inc.', sector: 'Information Technology', date: '2026-12-09', timing: 'AMC', status: 'upcoming', epsEst: '$1.39', epsAct: '-', revEst: '$14.0B', revAct: '-', surprise: '-' },
  { id: 'up-15', ticker: 'ORCL', company: 'Oracle Corporation', sector: 'Information Technology', date: '2026-12-09', timing: 'AMC', status: 'upcoming', epsEst: '$1.48', epsAct: '-', revEst: '$14.1B', revAct: '-', surprise: '-' },
  { id: 'up-16', ticker: 'ADBE', company: 'Adobe Inc.', sector: 'Information Technology', date: '2026-12-09', timing: 'AMC', status: 'upcoming', epsEst: '$4.67', epsAct: '-', revEst: '$5.60B', revAct: '-', surprise: '-' },
  { id: 'up-17', ticker: 'COST', company: 'Costco Wholesale Corp.', sector: 'Consumer Staples', date: '2026-12-10', timing: 'AMC', status: 'upcoming', epsEst: '$3.82', epsAct: '-', revEst: '$62.1B', revAct: '-', surprise: '-' },
  { id: 'up-18', ticker: 'LULU', company: 'Lululemon Athletica Inc.', sector: 'Consumer Discretionary', date: '2026-12-10', timing: 'AMC', status: 'upcoming', epsEst: '$2.71', epsAct: '-', revEst: '$2.36B', revAct: '-', surprise: '-' },
  { id: 'up-19', ticker: 'JBL', company: 'Jabil Inc.', sector: 'Information Technology', date: '2026-12-16', timing: 'BMO', status: 'upcoming', epsEst: '$1.88', epsAct: '-', revEst: '$6.60B', revAct: '-', surprise: '-' },
  { id: 'up-20', ticker: 'GIS', company: 'General Mills, Inc.', sector: 'Consumer Staples', date: '2026-12-16', timing: 'BMO', status: 'upcoming', epsEst: '$1.22', epsAct: '-', revEst: '$5.14B', revAct: '-', surprise: '-' },
  { id: 'up-21', ticker: 'MU', company: 'Micron Technology, Inc.', sector: 'Information Technology', date: '2026-12-17', timing: 'AMC', status: 'upcoming', epsEst: '$1.75', epsAct: '-', revEst: '$8.70B', revAct: '-', surprise: '-' },
  { id: 'up-22', ticker: 'LEN', company: 'Lennar Corporation', sector: 'Consumer Discretionary', date: '2026-12-17', timing: 'AMC', status: 'upcoming', epsEst: '$4.15', epsAct: '-', revEst: '$10.1B', revAct: '-', surprise: '-' },
  { id: 'up-23', ticker: 'ACN', company: 'Accenture plc', sector: 'Information Technology', date: '2026-12-17', timing: 'BMO', status: 'upcoming', epsEst: '$3.42', epsAct: '-', revEst: '$17.1B', revAct: '-', surprise: '-' },
  { id: 'up-24', ticker: 'NKE', company: 'NIKE, Inc.', sector: 'Consumer Discretionary', date: '2026-12-17', timing: 'AMC', status: 'upcoming', epsEst: '$0.63', epsAct: '-', revEst: '$12.1B', revAct: '-', surprise: '-' },
  { id: 'up-25', ticker: 'FDX', company: 'FedEx Corporation', sector: 'Industrials', date: '2026-12-17', timing: 'AMC', status: 'upcoming', epsEst: '$3.98', epsAct: '-', revEst: '$22.1B', revAct: '-', surprise: '-' },
  { id: 'up-26', ticker: 'DRI', company: 'Darden Restaurants, Inc.', sector: 'Consumer Discretionary', date: '2026-12-18', timing: 'BMO', status: 'upcoming', epsEst: '$2.02', epsAct: '-', revEst: '$2.87B', revAct: '-', surprise: '-' },
  { id: 'up-27', ticker: 'CCL', company: 'Carnival Corporation', sector: 'Consumer Discretionary', date: '2026-12-18', timing: 'BMO', status: 'upcoming', epsEst: '$0.08', epsAct: '-', revEst: '$5.93B', revAct: '-', surprise: '-' },
  { id: 'up-28', ticker: 'PAYX', company: 'Paychex, Inc.', sector: 'Industrials', date: '2026-12-18', timing: 'BMO', status: 'upcoming', epsEst: '$1.12', epsAct: '-', revEst: '$1.31B', revAct: '-', surprise: '-' },
  { id: 'up-29', ticker: 'CTAS', company: 'Cintas Corporation', sector: 'Industrials', date: '2026-12-22', timing: 'BMO', status: 'upcoming', epsEst: '$1.01', epsAct: '-', revEst: '$2.56B', revAct: '-', surprise: '-' },
  { id: 'up-30', ticker: 'JPM', company: 'JPMorgan Chase & Co.', sector: 'Financials', date: '2027-01-14', timing: 'BMO', status: 'upcoming', epsEst: '$4.05', epsAct: '-', revEst: '$41.8B', revAct: '-', surprise: '-' },

  { id: 'rep-01', ticker: 'DE', company: 'Deere & Company', sector: 'Industrials', date: '2026-11-24', timing: 'BMO', status: 'reported', epsEst: '$3.90', epsAct: '$4.55', revEst: '$9.27B', revAct: '$11.1B', surprise: '+16.7%' },
  { id: 'rep-02', ticker: 'ADSK', company: 'Autodesk, Inc.', sector: 'Information Technology', date: '2026-11-24', timing: 'AMC', status: 'reported', epsEst: '$2.12', epsAct: '$2.17', revEst: '$1.56B', revAct: '$1.57B', surprise: '+2.4%' },
  { id: 'rep-03', ticker: 'WDAY', company: 'Workday, Inc.', sector: 'Information Technology', date: '2026-11-24', timing: 'AMC', status: 'reported', epsEst: '$1.76', epsAct: '$1.89', revEst: '$2.13B', revAct: '$2.16B', surprise: '+7.4%' },
  { id: 'rep-04', ticker: 'DELL', company: 'Dell Technologies Inc.', sector: 'Information Technology', date: '2026-11-24', timing: 'AMC', status: 'reported', epsEst: '$2.06', epsAct: '$2.15', revEst: '$24.6B', revAct: '$24.4B', surprise: '+4.4%' },
  { id: 'rep-05', ticker: 'HPQ', company: 'HP Inc.', sector: 'Information Technology', date: '2026-11-24', timing: 'AMC', status: 'reported', epsEst: '$0.93', epsAct: '$0.93', revEst: '$14.0B', revAct: '$14.1B', surprise: '0.0%' },
  { id: 'rep-06', ticker: 'BBY', company: 'Best Buy Co., Inc.', sector: 'Consumer Discretionary', date: '2026-11-24', timing: 'BMO', status: 'reported', epsEst: '$1.29', epsAct: '$1.26', revEst: '$9.63B', revAct: '$9.45B', surprise: '-2.3%' },
  { id: 'rep-07', ticker: 'ADI', company: 'Analog Devices, Inc.', sector: 'Information Technology', date: '2026-11-24', timing: 'BMO', status: 'reported', epsEst: '$1.64', epsAct: '$1.67', revEst: '$2.41B', revAct: '$2.44B', surprise: '+1.8%' },
  { id: 'rep-08', ticker: 'A', company: 'Agilent Technologies, Inc.', sector: 'Health Care', date: '2026-11-23', timing: 'AMC', status: 'reported', epsEst: '$1.41', epsAct: '$1.46', revEst: '$1.67B', revAct: '$1.70B', surprise: '+3.5%' },
  { id: 'rep-09', ticker: 'INTU', company: 'Intuit Inc.', sector: 'Information Technology', date: '2026-11-19', timing: 'AMC', status: 'reported', epsEst: '$2.36', epsAct: '$2.50', revEst: '$3.14B', revAct: '$3.28B', surprise: '+5.9%' },
  { id: 'rep-10', ticker: 'ROST', company: 'Ross Stores, Inc.', sector: 'Consumer Discretionary', date: '2026-11-19', timing: 'AMC', status: 'reported', epsEst: '$1.40', epsAct: '$1.48', revEst: '$5.15B', revAct: '$5.07B', surprise: '+5.7%' },
  { id: 'rep-11', ticker: 'WMT', company: 'Walmart Inc.', sector: 'Consumer Staples', date: '2026-11-19', timing: 'BMO', status: 'reported', epsEst: '$0.53', epsAct: '$0.58', revEst: '$167.7B', revAct: '$169.6B', surprise: '+9.4%' },
  { id: 'rep-12', ticker: 'NVDA', company: 'NVIDIA Corporation', sector: 'Information Technology', date: '2026-11-18', timing: 'AMC', status: 'reported', epsEst: '$0.75', epsAct: '$0.81', revEst: '$33.1B', revAct: '$35.1B', surprise: '+7.7%' },
  { id: 'rep-13', ticker: 'PANW', company: 'Palo Alto Networks, Inc.', sector: 'Information Technology', date: '2026-11-18', timing: 'AMC', status: 'reported', epsEst: '$1.48', epsAct: '$1.56', revEst: '$2.12B', revAct: '$2.14B', surprise: '+5.4%' },
  { id: 'rep-14', ticker: 'TGT', company: 'Target Corporation', sector: 'Consumer Discretionary', date: '2026-11-18', timing: 'BMO', status: 'reported', epsEst: '$2.30', epsAct: '$1.85', revEst: '$25.9B', revAct: '$25.7B', surprise: '-19.6%' },
  { id: 'rep-15', ticker: 'TJX', company: 'The TJX Companies, Inc.', sector: 'Consumer Discretionary', date: '2026-11-18', timing: 'BMO', status: 'reported', epsEst: '$1.09', epsAct: '$1.14', revEst: '$13.9B', revAct: '$14.1B', surprise: '+4.6%' },
  { id: 'rep-16', ticker: 'LOW', company: "Lowe's Companies, Inc.", sector: 'Consumer Discretionary', date: '2026-11-17', timing: 'BMO', status: 'reported', epsEst: '$2.82', epsAct: '$2.89', revEst: '$19.9B', revAct: '$20.2B', surprise: '+2.5%' },
  { id: 'rep-17', ticker: 'MDT', company: 'Medtronic plc', sector: 'Health Care', date: '2026-11-17', timing: 'BMO', status: 'reported', epsEst: '$1.25', epsAct: '$1.26', revEst: '$8.27B', revAct: '$8.40B', surprise: '+0.8%' },
  { id: 'rep-18', ticker: 'AMAT', company: 'Applied Materials, Inc.', sector: 'Information Technology', date: '2026-11-12', timing: 'AMC', status: 'reported', epsEst: '$2.19', epsAct: '$2.32', revEst: '$6.95B', revAct: '$7.05B', surprise: '+5.9%' },
  { id: 'rep-19', ticker: 'DIS', company: 'The Walt Disney Company', sector: 'Communication Services', date: '2026-11-12', timing: 'BMO', status: 'reported', epsEst: '$1.11', epsAct: '$1.14', revEst: '$22.4B', revAct: '$22.6B', surprise: '+2.7%' },
  { id: 'rep-20', ticker: 'CSCO', company: 'Cisco Systems, Inc.', sector: 'Information Technology', date: '2026-11-11', timing: 'AMC', status: 'reported', epsEst: '$0.87', epsAct: '$0.91', revEst: '$13.8B', revAct: '$13.8B', surprise: '+4.6%' },
  { id: 'rep-21', ticker: 'HD', company: 'The Home Depot, Inc.', sector: 'Consumer Discretionary', date: '2026-11-10', timing: 'BMO', status: 'reported', epsEst: '$3.64', epsAct: '$3.67', revEst: '$39.3B', revAct: '$40.2B', surprise: '+0.8%' },
  { id: 'rep-22', ticker: 'QCOM', company: 'QUALCOMM Incorporated', sector: 'Information Technology', date: '2026-11-04', timing: 'AMC', status: 'reported', epsEst: '$2.56', epsAct: '$2.69', revEst: '$9.91B', revAct: '$10.2B', surprise: '+5.1%' },
  { id: 'rep-23', ticker: 'PLTR', company: 'Palantir Technologies Inc.', sector: 'Information Technology', date: '2026-11-02', timing: 'AMC', status: 'reported', epsEst: '$0.09', epsAct: '$0.10', revEst: '$701M', revAct: '$726M', surprise: '+11.1%' },
  { id: 'rep-24', ticker: 'AMZN', company: 'Amazon.com, Inc.', sector: 'Consumer Discretionary', date: '2026-10-31', timing: 'AMC', status: 'reported', epsEst: '$1.14', epsAct: '$1.43', revEst: '$157.2B', revAct: '$158.9B', surprise: '+25.4%' },
  { id: 'rep-25', ticker: 'AAPL', company: 'Apple Inc.', sector: 'Information Technology', date: '2026-10-29', timing: 'AMC', status: 'reported', epsEst: '$1.60', epsAct: '$1.64', revEst: '$94.5B', revAct: '$94.9B', surprise: '+2.5%' },
  { id: 'rep-26', ticker: 'GOOGL', company: 'Alphabet Inc.', sector: 'Communication Services', date: '2026-10-29', timing: 'AMC', status: 'reported', epsEst: '$1.85', epsAct: '$2.12', revEst: '$86.3B', revAct: '$88.3B', surprise: '+14.6%' },
  { id: 'rep-27', ticker: 'META', company: 'Meta Platforms, Inc.', sector: 'Communication Services', date: '2026-10-28', timing: 'AMC', status: 'reported', epsEst: '$5.25', epsAct: '$6.03', revEst: '$40.3B', revAct: '$40.6B', surprise: '+14.9%' },
  { id: 'rep-28', ticker: 'MSFT', company: 'Microsoft Corporation', sector: 'Information Technology', date: '2026-10-28', timing: 'AMC', status: 'reported', epsEst: '$3.10', epsAct: '$3.30', revEst: '$64.5B', revAct: '$65.6B', surprise: '+6.5%' },
  { id: 'rep-29', ticker: 'AMD', company: 'Advanced Micro Devices', sector: 'Information Technology', date: '2026-10-27', timing: 'AMC', status: 'reported', epsEst: '$0.92', epsAct: '$0.92', revEst: '$6.71B', revAct: '$6.82B', surprise: '0.0%' },
  { id: 'rep-30', ticker: 'TSLA', company: 'Tesla, Inc.', sector: 'Consumer Discretionary', date: '2026-10-21', timing: 'AMC', status: 'reported', epsEst: '$0.58', epsAct: '$0.72', revEst: '$25.4B', revAct: '$25.2B', surprise: '+24.1%' },
];

function curateEarningsList(items) {
  const dedupedMap = new Map();
  items.forEach((item) => {
    const ticker = (item.ticker || '').toUpperCase();
    const key = `${ticker}_${item.date}_${item.status}`;
    dedupedMap.set(key, {
      ...item,
      ticker,
    });
  });

  const allUnique = Array.from(dedupedMap.values());

  const upcomingSorted = allUnique
    .filter((item) => item.status === 'upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, LIMIT_PER_STATUS);

  const reportedSorted = allUnique
    .filter((item) => item.status === 'reported')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, LIMIT_PER_STATUS);

  return {
    upcoming: upcomingSorted,
    reported: reportedSorted,
    combined: [...upcomingSorted, ...reportedSorted],
  };
}

async function generateGeminiText(apiKey, prompt) {
  const cleanKey = (apiKey || '').trim();
  if (!cleanKey) {
    throw new Error('VITE_GEMINI_API_KEY가 비어 있습니다.');
  }

  const candidateModels = [
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash',
  ];

  let lastError = null;

  for (let i = 0; i < candidateModels.length; i += 1) {
    const model = candidateModels[i];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
      cleanKey
    )}`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 1600,
          },
        }),
      });

      clearTimeout(timeoutId);

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const apiMessage = data?.error?.message || `HTTP ${res.status}`;
        lastError = new Error(`Gemini API 오류 (${model} / ${res.status}): ${apiMessage}`);
        continue;
      }

      const parts = data?.candidates?.[0]?.content?.parts || [];
      const text = parts
        .map((p) => p.text || '')
        .join('\n')
        .trim();

      if (!text) {
        lastError = new Error(`${model} 응답 본문이 비어 있습니다.`);
        continue;
      }
      return text;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err?.name === 'AbortError') {
        lastError = new Error(`${model} 응답 시간 초과 (10초)`);
      } else {
        lastError = err;
      }
    }
  }

  throw lastError || new Error('AI 요약 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
}

export default function App() {
  const [lang, setLang] = useState('ko');
  const [earnings, setEarnings] = useState(INITIAL_EARNINGS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [watchlist, setWatchlist] = useState(() => {
    try {
      const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.slice(0, MAX_WATCHLIST) : [];
    } catch {
      return [];
    }
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [summaryText, setSummaryText] = useState('');
  const [summaryError, setSummaryError] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const t = UI_TEXT[lang] || UI_TEXT.ko;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist.slice(0, MAX_WATCHLIST)));
    } catch {
      // ignore storage errors
    }
  }, [watchlist]);

  const curated = useMemo(() => curateEarningsList(earnings), [earnings]);

  const watchlistSet = useMemo(
    () => new Set(watchlist.map((w) => w.ticker.toUpperCase())),
    [watchlist]
  );

  const toggleWatchlist = (item) => {
    const tickerKey = item.ticker.toUpperCase();
    setErrorMsg('');

    setWatchlist((prev) => {
      const exists = prev.some((w) => w.ticker.toUpperCase() === tickerKey);
      if (exists) {
        return prev.filter((w) => w.ticker.toUpperCase() !== tickerKey);
      }
      if (prev.length >= MAX_WATCHLIST) {
        setErrorMsg(t.watchlistFull);
        return prev;
      }
      return [
        {
          id: item.id || `watch-${tickerKey}-${Date.now()}`,
          ticker: tickerKey,
          company: item.company,
          sector: item.sector,
          date: item.date,
          timing: item.timing,
          status: item.status,
          epsEst: item.epsEst,
          epsAct: item.epsAct,
          revEst: item.revEst,
          revAct: item.revAct,
          surprise: item.surprise,
        },
        ...prev,
      ];
    });
  };

  const sectors = useMemo(() => {
    const pool = [...curated.combined, ...watchlist];
    const set = new Set(pool.map((item) => item.sector).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [curated.combined, watchlist]);

  const filteredItems = useMemo(() => {
    let baseList = curated.combined;
    if (statusFilter === 'upcoming') {
      baseList = curated.upcoming;
    } else if (statusFilter === 'reported') {
      baseList = curated.reported;
    } else if (statusFilter === 'watchlist') {
      baseList = watchlist.slice(0, MAX_WATCHLIST);
    }

    return baseList.filter((item) => {
      const matchesSector = sectorFilter === 'all' || item.sector === sectorFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.ticker.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.sector.toLowerCase().includes(q);
      return matchesSector && matchesQuery;
    });
  }, [curated, statusFilter, sectorFilter, searchQuery, watchlist]);

  const handleLiveLookup = async (e) => {
    e.preventDefault();
    const rawQuery = searchQuery.trim();
    if (!rawQuery) return;

    setErrorMsg('');
    if (!apiKey) {
      setErrorMsg(t.noApiKey);
      return;
    }

    setIsSearching(true);
    try {
      const prompt = `Provide quarterly earnings schedule and consensus/reported figures for S&P 500 stock "${rawQuery}".
Return ONLY a valid JSON object (no markdown fences) with these exact keys:
{
  "ticker": "UPPERCASE TICKER",
  "company": "Company Name",
  "sector": "GICS Sector in English (e.g. Information Technology, Financials, Health Care, Consumer Discretionary, Consumer Staples, Industrials, Energy, Communication Services, Utilities, Real Estate, Materials)",
  "date": "YYYY-MM-DD",
  "timing": "BMO" or "AMC",
  "status": "upcoming" or "reported",
  "epsEst": "string e.g. $1.65 or -",
  "epsAct": "string e.g. $1.72 or -",
  "revEst": "string e.g. $95.0B or -",
  "revAct": "string e.g. $96.2B or -",
  "surprise": "string e.g. +4.2% or -"
}`;

      const text = await generateGeminiText(apiKey, prompt);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('응답에서 종목 JSON 형식을 파싱하지 못했습니다.');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const newRecord = {
        id: `${parsed.ticker || rawQuery.toUpperCase()}-${parsed.date || Date.now()}`,
        ticker: (parsed.ticker || rawQuery).toUpperCase(),
        company: parsed.company || rawQuery.toUpperCase(),
        sector: parsed.sector || 'Information Technology',
        date: parsed.date || '2026-12-01',
        timing: parsed.timing === 'BMO' ? 'BMO' : 'AMC',
        status: parsed.status === 'reported' ? 'reported' : 'upcoming',
        epsEst: parsed.epsEst || '-',
        epsAct: parsed.epsAct || '-',
        revEst: parsed.revEst || '-',
        revAct: parsed.revAct || '-',
        surprise: parsed.surprise || '-',
      };

      setEarnings((prev) => [newRecord, ...prev]);
      if (statusFilter === 'watchlist') {
        setStatusFilter('all');
      }
    } catch (err) {
      setErrorMsg(err?.message || '종목 조회 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleOpenSummary = async (item) => {
    setSelectedItem(item);
    setSummaryText('');
    setSummaryError('');

    if (!apiKey) {
      setSummaryError(t.noApiKey);
      return;
    }

    setIsSummarizing(true);
    try {
      const langNames = {
        ko: 'Korean (한국어)',
        en: 'English',
        ja: 'Japanese (日本語)',
        zh: 'Simplified Chinese (简体中文)',
        es: 'Spanish (Español)',
      };
      const targetLang = langNames[lang] || 'Korean (한국어)';

      const metricsContext = `Company: ${item.company} (${item.ticker}), GICS Sector: ${item.sector}, Earnings Date: ${item.date} (${item.timing}), Status: ${item.status}, EPS Est: ${item.epsEst}, EPS Act: ${item.epsAct}, Revenue Est: ${item.revEst}, Revenue Act: ${item.revAct}, Earnings Surprise: ${item.surprise}.`;

      const prompt =
        item.status === 'reported'
          ? `You are a senior Wall Street equity research analyst. Analyze the earnings release and earnings call takeaways for the following company using both the exact figures provided below and your institutional knowledge of the company's business segments, margin structure, and management strategy:
${metricsContext}

Write a detailed, well-structured earnings call analysis strictly in ${targetLang} covering these 5 sections with specific bullet points:
1. [실적 핵심 수치 및 서프라이즈 해석] (Analyze the reported EPS ${item.epsAct} vs Est ${item.epsEst}, Revenue ${item.revAct} vs Est ${item.revEst}, and surprise ${item.surprise})
2. [핵심 사업부별 매출 동인 및 수요 흐름] (Break down key operating segments, pricing vs volume dynamics, and end-market demand)
3. [경영진 어닝콜 핵심 전략 및 마진 포인트] (Operating margin drivers, cost discipline, CapEx / AI / R&D capital allocation priorities)
4. [차기 분기 가이던스 및 중장기 체크포인트] (Key forward-looking indicators, backlog/order trends, and guidance sensitivity)
5. [월가 애널리스트 Q&A 핵심 쟁점 및 리스크] (Main institutional investor questions, competitive threats, macro/FX/tariff headwinds)`
          : `You are a senior Wall Street equity research analyst. Prepare a comprehensive earnings call preview for the following company using the consensus figures provided below and your institutional knowledge of the company's business segments and strategic catalysts:
${metricsContext}

Write a detailed, well-structured earnings preview strictly in ${targetLang} covering these 5 sections with specific bullet points:
1. [컨센서스 기대치 및 실적 눈높이 분석] (Evaluate EPS Est ${item.epsEst} and Revenue Est ${item.revEst} relative to seasonal and industry expectations)
2. [핵심 사업부별 관전 포인트] (Which segments and KPIs institutional investors will scrutinize first)
3. [경영진 어닝콜 주요 주목 발언 예상] (Key strategic themes around margins, pricing power, CapEx, and demand visibility)
4. [가이던스 상향/하향 시나리오] (What guidance metrics will trigger positive or negative post-earnings stock reaction)
5. [주요 리스크 요인 및 애널리스트 Q&A 쟁점] (Macro headwinds, cost pressures, and key questions expected on the call)`;

      const result = await generateGeminiText(apiKey, prompt);
      setSummaryText(result);
    } catch (err) {
      setSummaryError(
        `${err?.message || 'AI 요약 호출 실패'}\n\n※ 구글 AI 서버가 일시적으로 혼잡하거나 무료 분당 호출 한도에 도달했습니다. 10~20초 후 [다시 심층 분석] 버튼을 눌러 주세요.`
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      handleOpenSummary(selectedItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                {t.title}
              </h1>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                {t.countBadge(
                  curated.upcoming.length,
                  curated.reported.length,
                  watchlist.length
                )}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">{t.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-slate-400" />
            <select
              aria-label="Language selector"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="zh">简体中文</option>
              <option value="es">Español</option>
            </select>
          </div>
        </header>

        {!apiKey && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-950/40 p-4 text-sm text-amber-200">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <p>{t.noApiKey}</p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-rose-500/40 bg-rose-950/40 p-4 text-sm text-rose-200">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMsg('')}
              className="text-rose-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <section className="mb-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <form onSubmit={handleLiveLookup} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-400"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>{t.searching}</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>{t.searchBtn}</span>
                </>
              )}
            </button>
          </form>

          <div className="flex flex-col justify-between gap-3 pt-1 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t.all}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('upcoming')}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                  statusFilter === 'upcoming'
                    ? 'bg-sky-400 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t.upcoming}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('reported')}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                  statusFilter === 'reported'
                    ? 'bg-emerald-400 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t.reported}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('watchlist')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                  statusFilter === 'watchlist'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                }`}
              >
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{t.watchlistTab(watchlist.length)}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Sector filter"
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 outline-none focus:border-emerald-400 sm:text-sm"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec === 'all' ? t.allSectors : sec}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  setEarnings(INITIAL_EARNINGS);
                  setStatusFilter('all');
                  setSectorFilter('all');
                  setSearchQuery('');
                  setErrorMsg('');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 sm:text-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>{t.refreshAll}</span>
              </button>
            </div>
          </div>
        </section>

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
            <p className="text-base font-medium text-slate-300">
              {statusFilter === 'watchlist' ? t.emptyWatchlist : t.noResults}
            </p>
            {statusFilter !== 'watchlist' && (
              <p className="mt-1 text-sm text-slate-500">{t.addTickerHint}</p>
            )}
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, idx) => {
              const isUpcoming = item.status === 'upcoming';
              const isSaved = watchlistSet.has(item.ticker.toUpperCase());
              return (
                <article
                  key={`${item.id}-${idx}`}
                  className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-slate-700"
                >
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{item.date}</span>
                        <span>·</span>
                        <span>{item.timing === 'BMO' ? t.timeBMO : t.timeAMC}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isUpcoming ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-semibold text-sky-300">
                            <Clock className="h-3 w-3" />
                            {t.statusUpcoming}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" />
                            {t.statusReported}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => toggleWatchlist(item)}
                          title={isSaved ? t.inWatchlist : t.addWatchlist}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                            isSaved
                              ? 'bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/40'
                              : 'bg-slate-800 text-slate-400 hover:text-amber-300'
                          }`}
                        >
                          <Star className={`h-3 w-3 ${isSaved ? 'fill-current' : ''}`} />
                          <span>{isSaved ? t.inWatchlist : t.addWatchlist}</span>
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-lg font-bold text-white">{item.ticker}</h2>
                        <span className="truncate text-sm text-slate-300">{item.company}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">{item.sector}</p>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-950/80 p-3 text-xs">
                      <div>
                        <span className="text-slate-400">{t.epsEst}</span>
                        <p className="mt-0.5 font-semibold text-slate-100">{item.epsEst}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">{t.epsAct}</span>
                        <p className="mt-0.5 font-semibold text-emerald-300">{item.epsAct}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">{t.revEst}</span>
                        <p className="mt-0.5 font-semibold text-slate-100">{item.revEst}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">{t.revAct}</span>
                        <p className="mt-0.5 font-semibold text-emerald-300">{item.revAct}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-slate-800 pt-3">
                    <div className="text-xs">
                      <span className="text-slate-400">{t.surprise}: </span>
                      <span className="font-semibold text-amber-300">{item.surprise}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenSummary(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{t.aiSummaryBtn}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <footer className="mt-8 text-center text-xs text-slate-500">{t.disclaimer}</footer>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">{t.aiSummaryTitle}</h3>
                </div>
                <p className="mt-0.5 text-sm text-slate-400">
                  {selectedItem.ticker} · {selectedItem.company} ({selectedItem.date})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-relaxed text-slate-200 whitespace-pre-line">
              {isSummarizing ? (
                <div className="flex items-center gap-2.5 py-6 text-slate-400">
                  <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
                  <span>{t.aiLoading}</span>
                </div>
              ) : summaryError ? (
                <div className="rounded-lg border border-rose-500/30 bg-rose-950/30 p-3 text-rose-200">
                  {summaryError}
                </div>
              ) : (
                summaryText
              )}
            </div>

            <div className="mt-5 flex items-center justify-between gap-2">
              <button
                type="button"
                disabled={isSummarizing}
                onClick={() => handleOpenSummary(selectedItem)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 disabled:opacity-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>{t.regenerate}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

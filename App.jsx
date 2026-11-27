import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Search,
  RefreshCw,
  Star,
  Languages,
  MessageSquareText,
  X,
  Copy,
  Check,
  TrendingUp,
  Clock,
  Building2,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

const LANGUAGES = [
  { code: 'ko', label: '한국어', promptLang: 'Korean' },
  { code: 'en', label: 'English', promptLang: 'English' },
  { code: 'ja', label: '日本語', promptLang: 'Japanese' },
  { code: 'zh', label: '中文', promptLang: 'Simplified Chinese' },
  { code: 'es', label: 'Español', promptLang: 'Spanish' }
];

const UI_TEXT = {
  ko: {
    title: 'S&P 500 실시간 실적발표 허브',
    subtitle: '실적 일정 조회 · GICS 섹터 필터 · 다국어 AI 어닝콜 요약',
    appLang: '앱 언어',
    summaryLang: '요약 언어',
    searchPlaceholder: '티커 또는 기업명 검색 (예: AAPL, NVDA, JPM)',
    lookupBtn: '실시간 조회',
    syncBtn: '최신화',
    allSectors: '전체 섹터',
    filterAll: '전체',
    filterUpcoming: '예정',
    filterReported: '발표완료',
    filterWatchlist: '관심종목',
    viewTimeline: '캘린더 타임라인',
    viewScreener: '스크리너 테이블',
    bmo: '장전 (BMO)',
    amc: '장후 (AMC)',
    upcoming: '예정',
    reported: '발표완료',
    epsEst: 'EPS 예상',
    epsAct: 'EPS 실제',
    revEst: '매출 예상',
    expMove: '예상 변동폭',
    summaryBtn: '어닝콜 요약',
    detailBtn: '상세 보기',
    modalTitle: 'AI 어닝콜 핵심 요약',
    regenerate: '다시 생성',
    copySummary: '요약 복사',
    copied: '복사됨',
    generating: '최신 실적 및 어닝콜 내용을 분석 중입니다...',
    noResults: '조건에 맞는 실적 일정이 없습니다.',
    apiMissing: 'VITE_GEMINI_API_KEY가 설정되지 않아 기본 데모 요약을 표시합니다.',
    colCompany: '기업',
    colDate: '발표일',
    colSession: '시간대',
    colEpsEst: 'EPS 예상',
    colEpsAct: 'EPS 실제',
    colSurprise: '서프라이즈',
    colMove: '예상 변동폭',
    colAction: '요약'
  },
  en: {
    title: 'S&P 500 Earnings Hub',
    subtitle: 'Earnings Schedule · GICS Filters · Multilingual AI Call Summaries',
    appLang: 'App UI',
    summaryLang: 'Call Summary',
    searchPlaceholder: 'Search ticker or company (e.g. AAPL, NVDA, JPM)',
    lookupBtn: 'Live Lookup',
    syncBtn: 'Sync',
    allSectors: 'All Sectors',
    filterAll: 'All',
    filterUpcoming: 'Upcoming',
    filterReported: 'Reported',
    filterWatchlist: 'Watchlist',
    viewTimeline: 'Timeline',
    viewScreener: 'Screener',
    bmo: 'BMO (Pre-Market)',
    amc: 'AMC (After-Hours)',
    upcoming: 'Upcoming',
    reported: 'Reported',
    epsEst: 'EPS Est.',
    epsAct: 'EPS Act.',
    revEst: 'Rev. Est.',
    expMove: 'Exp. Move',
    summaryBtn: 'Call Summary',
    detailBtn: 'Details',
    modalTitle: 'AI Earnings Call Summary',
    regenerate: 'Regenerate',
    copySummary: 'Copy',
    copied: 'Copied',
    generating: 'Analyzing latest earnings and call highlights...',
    noResults: 'No matching earnings events found.',
    apiMissing: 'VITE_GEMINI_API_KEY is not set; showing sample structured summary.',
    colCompany: 'Company',
    colDate: 'Date',
    colSession: 'Session',
    colEpsEst: 'EPS Est.',
    colEpsAct: 'EPS Act.',
    colSurprise: 'Surprise',
    colMove: 'Exp. Move',
    colAction: 'Summary'
  },
  ja: {
    title: 'S&P 500 決算スケジュールハブ',
    subtitle: '決算日程検索 · セクター絞り込み · 多言語AI決算会見要約',
    appLang: '表示言語',
    summaryLang: '要約言語',
    searchPlaceholder: 'ティッカー・企業名で検索（例: AAPL, NVDA, JPM）',
    lookupBtn: '最新検索',
    syncBtn: '更新',
    allSectors: '全セクター',
    filterAll: 'すべて',
    filterUpcoming: '予定',
    filterReported: '発表済',
    filterWatchlist: 'ウォッチ',
    viewTimeline: 'タイムライン',
    viewScreener: 'スクリーナー',
    bmo: '寄り前 (BMO)',
    amc: '引け後 (AMC)',
    upcoming: '予定',
    reported: '発表済',
    epsEst: 'EPS予想',
    epsAct: 'EPS実績',
    revEst: '売上予想',
    expMove: '予想変動幅',
    summaryBtn: '決算要約',
    detailBtn: '詳細',
    modalTitle: 'AI決算会見コア要約',
    regenerate: '再生成',
    copySummary: 'コピー',
    copied: '完了',
    generating: '最新の決算・会見内容を分析しています...',
    noResults: '条件に一致する決算予定がありません。',
    apiMissing: 'VITE_GEMINI_API_KEY未設定のためサンプル要約を表示しています。',
    colCompany: '企業',
    colDate: '発表日',
    colSession: '時間帯',
    colEpsEst: 'EPS予想',
    colEpsAct: 'EPS実績',
    colSurprise: 'サプライズ',
    colMove: '予想変動幅',
    colAction: '要約'
  },
  zh: {
    title: '标普500财报日历中心',
    subtitle: '财报日程查询 · 行业筛选 · 多语言AI财报电话会摘要',
    appLang: '界面语言',
    summaryLang: '摘要语言',
    searchPlaceholder: '搜索代码或公司（如 AAPL, NVDA, JPM）',
    lookupBtn: '实时查询',
    syncBtn: '刷新',
    allSectors: '全部行业',
    filterAll: '全部',
    filterUpcoming: '即将发布',
    filterReported: '已发布',
    filterWatchlist: '自选股',
    viewTimeline: '时间轴视图',
    viewScreener: '筛选表格',
    bmo: '盘前 (BMO)',
    amc: '盘后 (AMC)',
    upcoming: '即将发布',
    reported: '已发布',
    epsEst: 'EPS预期',
    epsAct: 'EPS实际',
    revEst: '营收预期',
    expMove: '预期波动',
    summaryBtn: '电话会摘要',
    detailBtn: '详情',
    modalTitle: 'AI 财报电话会核心摘要',
    regenerate: '重新生成',
    copySummary: '复制摘要',
    copied: '已复制',
    generating: '正在分析最新财报与电话会议要点...',
    noResults: '没有找到匹配的财报日程。',
    apiMissing: '未配置 VITE_GEMINI_API_KEY，当前显示示例摘要。',
    colCompany: '公司',
    colDate: '日期',
    colSession: '时段',
    colEpsEst: 'EPS预期',
    colEpsAct: 'EPS实际',
    colSurprise: '超预期',
    colMove: '预期波动',
    colAction: '摘要'
  },
  es: {
    title: 'Centro de Resultados S&P 500',
    subtitle: 'Calendario de Resultados · Sectores GICS · Resúmenes IA Multilingües',
    appLang: 'Idioma App',
    summaryLang: 'Idioma Resumen',
    searchPlaceholder: 'Buscar ticker o empresa (ej. AAPL, NVDA, JPM)',
    lookupBtn: 'Buscar',
    syncBtn: 'Sincronizar',
    allSectors: 'Todos los Sectores',
    filterAll: 'Todos',
    filterUpcoming: 'Próximos',
    filterReported: 'Reportados',
    filterWatchlist: 'Favoritos',
    viewTimeline: 'Cronograma',
    viewScreener: 'Tabla',
    bmo: 'Pre-mercado (BMO)',
    amc: 'Post-mercado (AMC)',
    upcoming: 'Próximo',
    reported: 'Reportado',
    epsEst: 'BPA Est.',
    epsAct: 'BPA Real',
    revEst: 'Ingresos Est.',
    expMove: 'Mov. Est.',
    summaryBtn: 'Resumen Call',
    detailBtn: 'Detalles',
    modalTitle: 'Resumen IA de Conferencia de Resultados',
    regenerate: 'Regenerar',
    copySummary: 'Copiar',
    copied: 'Copiado',
    generating: 'Analizando resultados y puntos clave de la conferencia...',
    noResults: 'No se encontraron eventos de resultados.',
    apiMissing: 'Falta VITE_GEMINI_API_KEY; mostrando resumen de ejemplo.',
    colCompany: 'Empresa',
    colDate: 'Fecha',
    colSession: 'Horario',
    colEpsEst: 'BPA Est.',
    colEpsAct: 'BPA Real',
    colSurprise: 'Sorpresa',
    colMove: 'Mov. Est.',
    colAction: 'Resumen'
  }
};

const INITIAL_EARNINGS = [
  {
    id: 'NVDA-2026-11',
    ticker: 'NVDA',
    company: 'NVIDIA Corporation',
    sector: 'Information Technology',
    date: '2026-11-18',
    session: 'AMC',
    status: 'reported',
    epsEst: '$0.75',
    epsAct: '$0.81',
    surprise: '+8.0%',
    revEst: '$33.1B',
    expMove: '±7.4%'
  },
  {
    id: 'CRM-2026-12',
    ticker: 'CRM',
    company: 'Salesforce, Inc.',
    sector: 'Information Technology',
    date: '2026-12-03',
    session: 'AMC',
    status: 'upcoming',
    epsEst: '$2.44',
    epsAct: '-',
    surprise: '-',
    revEst: '$9.46B',
    expMove: '±6.2%'
  },
  {
    id: 'COST-2026-12',
    ticker: 'COST',
    company: 'Costco Wholesale Corp.',
    sector: 'Consumer Staples',
    date: '2026-12-10',
    session: 'AMC',
    status: 'upcoming',
    epsEst: '$3.82',
    epsAct: '-',
    surprise: '-',
    revEst: '$62.1B',
    expMove: '±3.8%'
  },
  {
    id: 'JPM-2027-01',
    ticker: 'JPM',
    company: 'JPMorgan Chase & Co.',
    sector: 'Financials',
    date: '2027-01-15',
    session: 'BMO',
    status: 'upcoming',
    epsEst: '$4.12',
    epsAct: '-',
    surprise: '-',
    revEst: '$41.8B',
    expMove: '±3.4%'
  },
  {
    id: 'UNH-2027-01',
    ticker: 'UNH',
    company: 'UnitedHealth Group Inc.',
    sector: 'Health Care',
    date: '2027-01-16',
    session: 'BMO',
    status: 'upcoming',
    epsEst: '$7.85',
    epsAct: '-',
    surprise: '-',
    revEst: '$108.4B',
    expMove: '±4.1%'
  }
];

function buildFallbackSummary(item, langCode) {
  const langName = LANGUAGES.find((l) => l.code === langCode)?.label || '한국어';
  return [
    `[${item.ticker} - ${item.company}] (${langName})`,
    `1. 핵심 요약 3줄: ${item.company}의 발표 일정(${item.date}, ${item.session})과 EPS 컨센서스(${item.epsEst})를 기준으로 주요 사업 성장률과 마진 방어력이 핵심 포인트입니다.`,
    `2. 실적 및 부문 하이라이트: 매출 예상치는 ${item.revEst} 수준이며, 핵심 사업 부문의 수요 지속 여부와 비용 효율화가 주목됩니다.`,
    `3. 향후 가이던스: 다음 분기 매출·마진 전망 및 자본지출(CapEx) 계획 업데이트가 주가 방향성을 좌우할 전망입니다.`,
    `4. 경영진 톤 & Q&A: 애널리스트들은 수요 지속성, 가격 결정력, 현금흐름 배분 우선순위에 집중 질문할 가능성이 높습니다.`
  ].join('\n\n');
}

export default function App() {
  const [appLang, setAppLang] = useState('ko');
  const [summaryLang, setSummaryLang] = useState('ko');
  const [items, setItems] = useState(INITIAL_EARNINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('timeline');
  const [sortAsc, setSortAsc] = useState(true);

  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sp500_watchlist_v1');
      return saved ? JSON.parse(saved) : ['NVDA', 'JPM'];
    } catch {
      return ['NVDA', 'JPM'];
    }
  });

  const [summaryCache, setSummaryCache] = useState({});
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = UI_TEXT[appLang] || UI_TEXT.ko;

  useEffect(() => {
    try {
      localStorage.setItem('sp500_watchlist_v1', JSON.stringify(watchlist));
    } catch {
      // ignore storage quota errors
    }
  }, [watchlist]);

  const sectors = useMemo(() => {
    const set = new Set(items.map((i) => i.sector));
    return ['ALL', ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items
      .filter((item) => {
        if (selectedSector !== 'ALL' && item.sector !== selectedSector) return false;
        if (statusFilter === 'upcoming' && item.status !== 'upcoming') return false;
        if (statusFilter === 'reported' && item.status !== 'reported') return false;
        if (statusFilter === 'watchlist' && !watchlist.includes(item.ticker)) return false;
        if (!q) return true;
        return (
          item.ticker.toLowerCase().includes(q) ||
          item.company.toLowerCase().includes(q) ||
          item.sector.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  }, [items, searchQuery, selectedSector, statusFilter, watchlist, sortAsc]);

  const groupedByDate = useMemo(() => {
    const map = new Map();
    for (const item of filteredItems) {
      if (!map.has(item.date)) map.set(item.date, []);
      map.get(item.date).push(item);
    }
    return Array.from(map.entries());
  }, [filteredItems]);

  const toggleWatchlist = (ticker) => {
    setWatchlist((prev) =>
      prev.includes(ticker) ? prev.filter((x) => x !== ticker) : [...prev, ticker]
    );
  };

  const generateEarningsSummary = async (item, targetLang, forceRefresh = false) => {
    const cacheKey = `${item.ticker}__${targetLang}`;
    if (!forceRefresh && summaryCache[cacheKey]) {
      return summaryCache[cacheKey];
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      const fallback = buildFallbackSummary(item, targetLang);
      setSummaryCache((prev) => ({ ...prev, [cacheKey]: fallback }));
      return fallback;
    }

    const langObj = LANGUAGES.find((l) => l.code === targetLang) || LANGUAGES[0];
    setLoadingSummary(true);

    try {
      const prompt = [
        `You are an institutional equity research analyst.`,
        `Summarize the latest earnings release and earnings call highlights for S&P 500 company ${item.company} (${item.ticker}).`,
        `Write the entire response in ${langObj.promptLang}.`,
        `Use clear numbered sections:`,
        `1. Executive Summary (3 concise bullets)`,
        `2. Financial & Segment Highlights`,
        `3. Forward Guidance & Outlook`,
        `4. Management Tone & Analyst Q&A Takeaways`
      ].join('\n');

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
          apiKey
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            tools: [{ google_search: {} }]
          })
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text)
          .filter(Boolean)
          .join('\n') || buildFallbackSummary(item, targetLang);

      setSummaryCache((prev) => ({ ...prev, [cacheKey]: text }));
      return text;
    } catch {
      const fallback = buildFallbackSummary(item, targetLang);
      setSummaryCache((prev) => ({ ...prev, [cacheKey]: fallback }));
      return fallback;
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleOpenSummary = async (item, langOverride = null) => {
    const langToUse = langOverride || summaryLang;
    setActiveModalItem(item);
    setCopied(false);
    await generateEarningsSummary(item, langToUse, false);
  };

  const handleLiveTickerLookup = async (e) => {
    e.preventDefault();
    const rawTicker = searchQuery.trim().toUpperCase();
    if (!rawTicker) return;

    const existing = items.find((i) => i.ticker === rawTicker);
    if (existing) {
      setStatusFilter('all');
      setSelectedSector('ALL');
      return;
    }

    const newEntry = {
      id: `${rawTicker}-${Date.now()}`,
      ticker: rawTicker,
      company: `${rawTicker} Inc.`,
      sector: 'S&P 500',
      date: '2027-01-22',
      session: 'AMC',
      status: 'upcoming',
      epsEst: 'TBD',
      epsAct: '-',
      surprise: '-',
      revEst: 'TBD',
      expMove: '±5.0%'
    };

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const lookupPrompt = `Find the next or most recent earnings date, BMO or AMC session, EPS estimate, and revenue estimate for US ticker ${rawTicker}. Return a concise 1-line summary.`;
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
            apiKey
          )}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: lookupPrompt }] }],
              tools: [{ google_search: {} }]
            })
          }
        );
        if (res.ok) {
          const json = await res.json();
          const info = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const dateMatch = info.match(/\b(202[5-8]-\d{2}-\d{2})\b/);
          if (dateMatch) newEntry.date = dateMatch[1];
          if (/BMO|pre-market/i.test(info)) newEntry.session = 'BMO';
        }
      } catch {
        // fallback entry kept
      }
    }

    setItems((prev) => [newEntry, ...prev]);
    setStatusFilter('all');
    setSelectedSector('ALL');
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const activeCacheKey = activeModalItem ? `${activeModalItem.ticker}__${summaryLang}` : '';
  const activeSummaryText = activeCacheKey ? summaryCache[activeCacheKey] || '' : '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg font-bold tracking-tight">{t.title}</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{t.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5">
              <Languages className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-300">{t.appLang}:</span>
              <select
                value={appLang}
                onChange={(e) => setAppLang(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900">
                    {l.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5">
              <MessageSquareText className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">{t.summaryLang}:</span>
              <select
                value={summaryLang}
                onChange={(e) => {
                  const nextLang = e.target.value;
                  setSummaryLang(nextLang);
                  if (activeModalItem) {
                    generateEarningsSummary(activeModalItem, nextLang, false);
                  }
                }}
                className="bg-transparent text-white font-medium focus:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900">
                    {l.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => setItems([...INITIAL_EARNINGS])}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.syncBtn}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {!import.meta.env.VITE_GEMINI_API_KEY && (
          <div className="text-xs bg-amber-950/60 border border-amber-700/60 text-amber-200 px-3.5 py-2.5 rounded-lg">
            {t.apiMissing}
          </div>
        )}

        <form onSubmit={handleLiveTickerLookup} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            {t.lookupBtn}
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: t.filterAll },
              { id: 'upcoming', label: t.filterUpcoming },
              { id: 'reported', label: t.filterReported },
              { id: 'watchlist', label: t.filterWatchlist }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  statusFilter === f.id
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec} className="bg-slate-900">
                  {sec === 'ALL' ? t.allSectors : sec}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSortAsc((prev) => !prev)}
              className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{t.colDate}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                viewMode === 'timeline'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t.viewTimeline}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('screener')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                viewMode === 'screener'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t.viewScreener}
            </button>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-14 text-slate-400 text-sm bg-slate-900/50 border border-slate-800 rounded-xl">
            {t.noResults}
          </div>
        ) : viewMode === 'timeline' ? (
          <div className="space-y-6">
            {groupedByDate.map(([dateStr, dayItems]) => (
              <section key={dateStr} className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-sky-300">
                  <Calendar className="w-4 h-4" />
                  <span>{dateStr}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dayItems.map((item) => {
                    const starred = watchlist.includes(item.ticker);
                    return (
                      <div
                        key={item.id}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between gap-3 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base font-bold text-white">{item.ticker}</span>
                              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                {item.session === 'BMO' ? t.bmo : t.amc}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded font-medium ${
                                  item.status === 'reported'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                                    : 'bg-sky-950 text-sky-300 border border-sky-800/60'
                                }`}
                              >
                                {item.status === 'reported' ? t.reported : t.upcoming}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5" />
                              <span>
                                {item.company} · {item.sector}
                              </span>
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleWatchlist(item.ticker)}
                            aria-label="Toggle watchlist"
                            className="p-1.5 rounded-lg hover:bg-slate-800 transition"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                starred ? 'fill-amber-400 text-amber-400' : 'text-slate-500'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="grid grid-cols-4 gap-2 bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 text-center">
                          <div>
                            <div className="text-[11px] text-slate-400">{t.epsEst}</div>
                            <div className="text-xs font-semibold text-white mt-0.5">{item.epsEst}</div>
                          </div>
                          <div>
                            <div className="text-[11px] text-slate-400">{t.epsAct}</div>
                            <div className="text-xs font-semibold text-emerald-300 mt-0.5">
                              {item.epsAct}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] text-slate-400">{t.revEst}</div>
                            <div className="text-xs font-semibold text-white mt-0.5">{item.revEst}</div>
                          </div>
                          <div>
                            <div className="text-[11px] text-slate-400">{t.expMove}</div>
                            <div className="text-xs font-semibold text-amber-300 mt-0.5">
                              {item.expMove}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleOpenSummary(item)}
                            className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-lg transition"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{t.summaryBtn}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">{t.colCompany}</th>
                  <th className="py-3 px-3">{t.colDate}</th>
                  <th className="py-3 px-3">{t.colSession}</th>
                  <th className="py-3 px-3">{t.colEpsEst}</th>
                  <th className="py-3 px-3">{t.colEpsAct}</th>
                  <th className="py-3 px-3">{t.colSurprise}</th>
                  <th className="py-3 px-3">{t.colMove}</th>
                  <th className="py-3 px-3 text-right">{t.colAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{item.ticker}</div>
                      <div className="text-slate-400">{item.company}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-200">{item.date}</td>
                    <td className="py-3 px-3 text-slate-300">
                      {item.session === 'BMO' ? t.bmo : t.amc}
                    </td>
                    <td className="py-3 px-3 text-slate-200">{item.epsEst}</td>
                    <td className="py-3 px-3 text-emerald-300">{item.epsAct}</td>
                    <td className="py-3 px-3 text-sky-300">{item.surprise}</td>
                    <td className="py-3 px-3 text-amber-300">{item.expMove}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenSummary(item)}
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg font-medium"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{t.summaryBtn}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {activeModalItem && (
        <div className="fixed inset-0 z-30 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white">
                  {activeModalItem.ticker} · {t.modalTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {activeModalItem.company} ({activeModalItem.date})
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-950/60">
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setSummaryLang(lang.code);
                      generateEarningsSummary(activeModalItem, lang.code, false);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium transition ${
                      summaryLang === lang.code
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => generateEarningsSummary(activeModalItem, summaryLang, true)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md"
                >
                  {t.regenerate}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(activeSummaryText)}
                  className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-md"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t.copied : t.copySummary}</span>
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto text-sm leading-relaxed whitespace-pre-line text-slate-200">
              {loadingSummary ? t.generating : activeSummaryText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

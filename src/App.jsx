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
import { SP500_ALL_CONSTITUENTS } from './sp500All';
import { AUTO_EARNINGS_FEED } from './earningsFeed';

const WATCHLIST_STORAGE_KEY = 'sp500_earnings_watchlist_v1';
const LIMIT_PER_STATUS = 30;
const MAX_WATCHLIST = 50;
const INITIAL_EARNINGS = AUTO_EARNINGS_FEED;

const UI_TEXT = {
  ko: {
    title: 'S&P 500 실시간 실적발표 허브',
    subtitle: '실적 일정 조회 · GICS 섹터 필터 · 다국어 AI 어닝콜 심층 요약',
    searchPlaceholder: 'S&P 500 전 종목 즉시 검색 (예: INTC, LLY, XOM, PLTR, AAPL)',
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
    extraResultsTitle: 'S&P 500 전 종목 즉시 검색 결과 (기본 60개 외 · 자동동기화·기록보존)',
    emptyWatchlist: `관심목록이 비어 있습니다. 카드의 별 아이콘을 눌러 최대 ${MAX_WATCHLIST}개까지 추가해 보세요.`,
    addTickerHint: '상단 검색창에 S&P 500 티커나 기업명을 입력하면 즉시 검색됩니다.',
    statusUpcoming: '발표예정',
    statusReported: '발표완료',
    timeBMO: '장 시작 전 (BMO)',
    timeAMC: '장 마감 후 (AMC)',
    countBadge: (upCount, repCount, watchCount, todayStr, totalSp500) =>
      `기준 ${todayStr} · 예정 ${upCount}개 · 발표완료 ${repCount}개 · 관심 ${watchCount}/${MAX_WATCHLIST} · S&P500 ${totalSp500}종목`,
    disclaimer:
      '※ 본 앱의 일정 및 AI 요약은 참고용이며, 최종 공시 및 투자 판단의 책임은 이용자 본인에게 있습니다.',
  },
  en: {
    title: 'S&P 500 Earnings Hub',
    subtitle: 'Earnings Schedule · Sector Filter · Multilingual AI Call Summaries',
    searchPlaceholder: 'Instant search across S&P 500 (e.g. INTC, LLY, XOM, PLTR, AAPL)',
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
    extraResultsTitle: 'Instant S&P 500 Matches (Outside Core 60 · Auto-Synced)',
    emptyWatchlist: `Your watchlist is empty. Click the star button on any card to save up to ${MAX_WATCHLIST} stocks.`,
    addTickerHint: 'Type any S&P 500 ticker or company name above for instant search.',
    statusUpcoming: 'Upcoming',
    statusReported: 'Reported',
    timeBMO: 'Before Market Open',
    timeAMC: 'After Market Close',
    countBadge: (upCount, repCount, watchCount, todayStr, totalSp500) =>
      `As of ${todayStr} · Upcoming ${upCount} · Reported ${repCount} · Watch ${watchCount}/${MAX_WATCHLIST} · S&P500 ${totalSp500}`,
    disclaimer:
      '※ Earnings dates and AI summaries are for informational purposes only. Always verify official filings.',
  },
  ja: {
    title: 'S&P 500 決算スケジュールハブ',
    subtitle: '決算日程検索 · セクター絞り込み · 多言語AI決算コール詳細要約',
    searchPlaceholder: 'S&P 500 全銘柄を即時検索 (例: INTC, LLY, XOM, PLTR, AAPL)',
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
    extraResultsTitle: 'S&P 500 即時検索結果（基本60銘柄以外・自動同期・履歴保持）',
    emptyWatchlist: `ウォッチリストが空です。カードの星マークから最大${MAX_WATCHLIST}件まで追加できます。`,
    addTickerHint: '上の検索バーにS&P 500ティッカーまたは企業名を入力すると即座に表示されます。',
    statusUpcoming: '発表予定',
    statusReported: '発表済',
    timeBMO: '寄り付き前 (BMO)',
    timeAMC: '引け後 (AMC)',
    countBadge: (upCount, repCount, watchCount, todayStr, totalSp500) =>
      `${todayStr}基準 · 予定 ${upCount}件 · 発表済 ${repCount}件 · 注目 ${watchCount}/${MAX_WATCHLIST} · S&P500 ${totalSp500}社`,
    disclaimer:
      '※ 決算日程およびAI要約は参考情報です。最終的な投資判断はご自身の責任で行ってください。',
  },
  zh: {
    title: '标普500财报日历中心',
    subtitle: '财报日程查询 · 行业筛选 · 多语言AI电话会议深度摘要',
    searchPlaceholder: '即时搜索标普500全成分股（如 INTC, LLY, XOM, PLTR, AAPL）',
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
    extraResultsTitle: '标普500全成分股即时匹配（60只核心之外·自动同步·保留记录）',
    emptyWatchlist: `自选股为空。点击卡片上的星标最多可添加${MAX_WATCHLIST}只股票。`,
    addTickerHint: '在上方搜索框输入标普500代码或公司名称即可立即搜索。',
    statusUpcoming: '即将发布',
    statusReported: '已发布',
    timeBMO: '盘前 (BMO)',
    timeAMC: '盘后 (AMC)',
    countBadge: (upCount, repCount, watchCount, todayStr, totalSp500) =>
      `截至${todayStr} · 即将 ${upCount} · 已发 ${repCount} · 自选 ${watchCount}/${MAX_WATCHLIST} · 标普500 ${totalSp500}`,
    disclaimer:
      '※ 财报日期与 AI 摘要仅供参考，请以官方披露为准并审慎决策。',
  },
  es: {
    title: 'Centro de Resultados S&P 500',
    subtitle: 'Calendario de Ganancias · Filtros por Sector · Análisis IA Multilingüe',
    searchPlaceholder: 'Búsqueda instantánea en S&P 500 (ej. INTC, LLY, XOM, PLTR, AAPL)',
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
    extraResultsTitle: 'Coincidencias instantáneas S&P 500 (fuera de las 60 · sincronizado)',
    emptyWatchlist: `Tu lista de seguimiento está vacía. Toca la estrella en cualquier tarjeta para guardar hasta ${MAX_WATCHLIST}.`,
    addTickerHint: 'Escribe cualquier ticker o empresa del S&P 500 arriba para buscar al instante.',
    statusUpcoming: 'Próximo',
    statusReported: 'Reportado',
    timeBMO: 'Antes de apertura',
    timeAMC: 'Tras el cierre',
    countBadge: (upCount, repCount, watchCount, todayStr, totalSp500) =>
      `Al ${todayStr} · Próximos ${upCount} · Reportados ${repCount} · Seguimiento ${watchCount}/${MAX_WATCHLIST} · S&P500 ${totalSp500}`,
    disclaimer:
      '※ Las fechas y resúmenes generados por IA son informativos. Verifique siempre los comunicados oficiales.',
  },
};

function getTodayDateStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function resolveLiveStatus(item, todayStr) {
  if (!item?.date) return item.status === 'reported' ? 'reported' : 'upcoming';
  return item.date < todayStr ? 'reported' : 'upcoming';
}

function curateEarningsList(items, todayStr) {
  const dedupedMap = new Map();
  items.forEach((item) => {
    const ticker = (item.ticker || '').toUpperCase();
    const liveStatus = resolveLiveStatus(item, todayStr);
    const key = `${ticker}_${item.date}_${liveStatus}`;
    dedupedMap.set(key, {
      ...item,
      ticker,
      status: liveStatus,
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
  const [todayStr, setTodayStr] = useState(() => getTodayDateStr());
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
    const interval = setInterval(() => {
      const nextToday = getTodayDateStr();
      setTodayStr((prev) => (prev === nextToday ? prev : nextToday));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist.slice(0, MAX_WATCHLIST)));
    } catch {
      // ignore storage errors
    }
  }, [watchlist]);

  const curated = useMemo(() => curateEarningsList(earnings, todayStr), [earnings, todayStr]);

  const coreTickersSet = useMemo(
    () => new Set(curated.combined.map((item) => item.ticker.toUpperCase())),
    [curated.combined]
  );

  const preservedRecordsMap = useMemo(() => {
    const map = new Map();
    const initialSet = new Set(INITIAL_EARNINGS.map((i) => `${i.ticker}_${i.date}`));

    watchlist.forEach((wItem) => {
      const upper = (wItem.ticker || '').toUpperCase();
      if (!upper) return;
      map.set(upper, { ...wItem, ticker: upper });
    });

    earnings.forEach((item) => {
      const upper = (item.ticker || '').toUpperCase();
      if (!upper) return;
      const key = `${upper}_${item.date}`;
      if (!initialSet.has(key)) {
        const prev = map.get(upper) || {};
        map.set(upper, { ...prev, ...item, ticker: upper });
      }
    });

    return map;
  }, [earnings, watchlist]);

  const extraMatchedItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const combinedMasterMap = new Map();

    (SP500_ALL_CONSTITUENTS || []).forEach(([ticker, company, sector], idx) => {
      const upper = (ticker || '').toUpperCase();
      if (!upper) return;
      const monthOffset = (idx % 3) + 1;
      const dayNum = String((idx % 25) + 1).padStart(2, '0');
      const fallbackDate = monthOffset === 1 ? `2026-12-${dayNum}` : `2027-0${monthOffset}-${dayNum}`;
      combinedMasterMap.set(upper, {
        id: `sp500-${upper}`,
        ticker: upper,
        company: company || upper,
        sector: sector || 'Information Technology',
        date: fallbackDate,
        timing: idx % 2 === 0 ? 'AMC' : 'BMO',
        epsEst: '-',
        epsAct: '-',
        revEst: '-',
        revAct: '-',
        surprise: '-',
      });
    });

    preservedRecordsMap.forEach((rec, upper) => {
      const prev = combinedMasterMap.get(upper) || {};
      combinedMasterMap.set(upper, {
        ...prev,
        ...rec,
        id: rec.id || `preserved-${upper}`,
        ticker: upper,
      });
    });

    const matches = [];
    combinedMasterMap.forEach((entry, upper) => {
      if (coreTickersSet.has(upper)) return;
      const hit =
        upper.toLowerCase().includes(q) ||
        (entry.company || '').toLowerCase().includes(q) ||
        (entry.sector || '').toLowerCase().includes(q);
      if (hit) {
        matches.push({
          ...entry,
          status: resolveLiveStatus(entry, todayStr),
        });
      }
    });

    return matches.slice(0, 60);
  }, [searchQuery, coreTickersSet, preservedRecordsMap, todayStr]);

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
      const liveStatus = resolveLiveStatus(item, todayStr);
      return [
        {
          id: item.id || `watch-${tickerKey}-${Date.now()}`,
          ticker: tickerKey,
          company: item.company,
          sector: item.sector,
          date: item.date,
          timing: item.timing,
          status: liveStatus,
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
    const pool = [...curated.combined, ...extraMatchedItems, ...watchlist];
    const set = new Set(pool.map((item) => item.sector).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [curated.combined, extraMatchedItems, watchlist]);

  const filteredItems = useMemo(() => {
    let baseList = curated.combined;
    if (statusFilter === 'upcoming') {
      baseList = curated.upcoming;
    } else if (statusFilter === 'reported') {
      baseList = curated.reported;
    } else if (statusFilter === 'watchlist') {
      baseList = watchlist.slice(0, MAX_WATCHLIST).map((w) => ({
        ...w,
        status: resolveLiveStatus(w, todayStr),
      }));
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
  }, [curated, statusFilter, sectorFilter, searchQuery, watchlist, todayStr]);

  const filteredExtraItems = useMemo(() => {
    if (statusFilter === 'watchlist') return [];
    return extraMatchedItems.filter((item) => {
      const matchesSector = sectorFilter === 'all' || item.sector === sectorFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSector && matchesStatus;
    });
  }, [extraMatchedItems, sectorFilter, statusFilter]);

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
      const prompt = `Provide quarterly earnings schedule and consensus/reported figures for S&P 500 stock "${rawQuery}" relative to current date ${todayStr}.
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
      const parsedDate = parsed.date || todayStr;
      const liveStatus = resolveLiveStatus({ date: parsedDate, status: parsed.status }, todayStr);

      const newRecord = {
        id: `${parsed.ticker || rawQuery.toUpperCase()}-${parsedDate}-${Date.now()}`,
        ticker: (parsed.ticker || rawQuery).toUpperCase(),
        company: parsed.company || rawQuery.toUpperCase(),
        sector: parsed.sector || 'Information Technology',
        date: parsedDate,
        timing: parsed.timing === 'BMO' ? 'BMO' : 'AMC',
        status: liveStatus,
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
    const liveItem = {
      ...item,
      status: resolveLiveStatus(item, todayStr),
    };
    setSelectedItem(liveItem);
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

      const metricsContext = `Company: ${liveItem.company} (${liveItem.ticker}), GICS Sector: ${liveItem.sector}, Earnings Date: ${liveItem.date} (${liveItem.timing}), Reference Date: ${todayStr}, Status: ${liveItem.status}, EPS Est: ${liveItem.epsEst}, EPS Act: ${liveItem.epsAct}, Revenue Est: ${liveItem.revEst}, Revenue Act: ${liveItem.revAct}, Earnings Surprise: ${liveItem.surprise}.`;

      const prompt =
        liveItem.status === 'reported'
          ? `You are a senior Wall Street equity research analyst. Analyze the earnings release and earnings call takeaways for the following company using both the exact figures provided below and your institutional knowledge of the company's business segments, margin structure, and management strategy:
${metricsContext}

Write a detailed, well-structured earnings call analysis strictly in ${targetLang} covering these 5 sections with specific bullet points:
1. [실적 핵심 수치 및 서프라이즈 해석] (Analyze the reported EPS ${liveItem.epsAct} vs Est ${liveItem.epsEst}, Revenue ${liveItem.revAct} vs Est ${liveItem.revEst}, and surprise ${liveItem.surprise})
2. [핵심 사업부별 매출 동인 및 수요 흐름] (Break down key operating segments, pricing vs volume dynamics, and end-market demand)
3. [경영진 어닝콜 핵심 전략 및 마진 포인트] (Operating margin drivers, cost discipline, CapEx / AI / R&D capital allocation priorities)
4. [차기 분기 가이던스 및 중장기 체크포인트] (Key forward-looking indicators, backlog/order trends, and guidance sensitivity)
5. [월가 애널리스트 Q&A 핵심 쟁점 및 리스크] (Main institutional investor questions, competitive threats, macro/FX/tariff headwinds)`
          : `You are a senior Wall Street equity research analyst. Prepare a comprehensive earnings call preview for the following company using the consensus figures provided below and your institutional knowledge of the company's business segments and strategic catalysts:
${metricsContext}

Write a detailed, well-structured earnings preview strictly in ${targetLang} covering these 5 sections with specific bullet points:
1. [컨센서스 기대치 및 실적 눈높이 분석] (Evaluate EPS Est ${liveItem.epsEst} and Revenue Est ${liveItem.revEst} relative to seasonal and industry expectations)
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

  const renderCard = (item, keyPrefix) => {
    const liveStatus = resolveLiveStatus(item, todayStr);
    const isUpcoming = liveStatus === 'upcoming';
    const isSaved = watchlistSet.has(item.ticker.toUpperCase());

    return (
      <article
        key={keyPrefix}
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
                onClick={() => toggleWatchlist({ ...item, status: liveStatus })}
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
            onClick={() => handleOpenSummary({ ...item, status: liveStatus })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.aiSummaryBtn}</span>
          </button>
        </div>
      </article>
    );
  };

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
                  watchlist.length,
                  todayStr,
                  (SP500_ALL_CONSTITUENTS || []).length
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
                  setTodayStr(getTodayDateStr());
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

        {filteredItems.length === 0 && filteredExtraItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
            <p className="text-base font-medium text-slate-300">
              {statusFilter === 'watchlist' ? t.emptyWatchlist : t.noResults}
            </p>
            {statusFilter !== 'watchlist' && (
              <p className="mt-1 text-sm text-slate-500">{t.addTickerHint}</p>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredItems.length > 0 && (
              <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item, idx) =>
                  renderCard(item, `core-${item.id}-${idx}`)
                )}
              </section>
            )}

            {filteredExtraItems.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-emerald-300">
                  {t.extraResultsTitle} ({filteredExtraItems.length})
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredExtraItems.map((item, idx) =>
                    renderCard(item, `extra-${item.id}-${idx}`)
                  )}
                </div>
              </section>
            )}
          </div>
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

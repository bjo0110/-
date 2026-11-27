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
} from 'lucide-react';

const UI_TEXT = {
  ko: {
    title: 'S&P 500 실시간 실적발표 허브',
    subtitle: '실적 일정 조회 · GICS 섹터 필터 · 다국어 AI 어닝콜 요약',
    searchPlaceholder: '티커 또는 기업명 검색 (예: AAPL, NVDA, JPM)',
    searchBtn: '실시간 조회',
    searching: '조회 중...',
    all: '전체',
    upcoming: '예정 (빠른 순 최대 30개)',
    reported: '발표완료 (최근 순 최대 30개)',
    allSectors: '전체 섹터',
    refreshAll: '일정 새로고침',
    epsEst: 'EPS 예상',
    epsAct: 'EPS 실제',
    revEst: '매출 예상',
    revAct: '매출 실제',
    surprise: '어닝 서프라이즈',
    aiSummaryBtn: 'AI 어닝콜 요약',
    aiSummaryTitle: 'AI 어닝콜 핵심 요약',
    aiLoading: '실적 발표 및 컨퍼런스콜 내용을 분석 중입니다...',
    noApiKey:
      'VITE_GEMINI_API_KEY가 설정되지 않아 기본 데모 요약을 표시합니다. Vercel 환경변수에 키를 추가하면 실시간 AI 요약과 검색이 활성화됩니다.',
    close: '닫기',
    noResults: '조건에 맞는 실적 발표 일정이 없습니다.',
    addTickerHint: '상단 검색창에서 원하는 S&P 500 종목을 실시간으로 추가해 보세요.',
    statusUpcoming: '발표예정',
    statusReported: '발표완료',
    timeBMO: '장 시작 전 (BMO)',
    timeAMC: '장 마감 후 (AMC)',
    countBadge: (upCount, repCount) => `예정 ${upCount}개 · 발표완료 ${repCount}개`,
    disclaimer:
      '※ 본 앱의 일정 및 AI 요약은 참고용이며, 최종 공시 및 투자 판단의 책임은 이용자 본인에게 있습니다.',
  },
  en: {
    title: 'S&P 500 Earnings Hub',
    subtitle: 'Earnings Schedule · Sector Filter · Multilingual AI Call Summaries',
    searchPlaceholder: 'Search ticker or company (e.g. AAPL, NVDA, JPM)',
    searchBtn: 'Live Lookup',
    searching: 'Looking up...',
    all: 'All',
    upcoming: 'Upcoming (Earliest 30)',
    reported: 'Reported (Latest 30)',
    allSectors: 'All Sectors',
    refreshAll: 'Refresh Schedule',
    epsEst: 'EPS Est.',
    epsAct: 'EPS Act.',
    revEst: 'Rev. Est.',
    revAct: 'Rev. Act.',
    surprise: 'Surprise',
    aiSummaryBtn: 'AI Call Summary',
    aiSummaryTitle: 'AI Earnings Call Summary',
    aiLoading: 'Analyzing earnings release and call highlights...',
    noApiKey:
      'VITE_GEMINI_API_KEY is not set; showing sample summaries. Add VITE_GEMINI_API_KEY in Vercel Environment Variables to enable live AI summaries and lookup.',
    close: 'Close',
    noResults: 'No earnings events match your current filters.',
    addTickerHint: 'Use the search bar above to look up any S&P 500 ticker live.',
    statusUpcoming: 'Upcoming',
    statusReported: 'Reported',
    timeBMO: 'Before Market Open',
    timeAMC: 'After Market Close',
    countBadge: (upCount, repCount) => `Upcoming ${upCount} · Reported ${repCount}`,
    disclaimer:
      '※ Earnings dates and AI summaries are for informational purposes only. Always verify official filings.',
  },
  ja: {
    title: 'S&P 500 決算スケジュールハブ',
    subtitle: '決算日程検索 · セクター絞り込み · 多言語AI決算要約',
    searchPlaceholder: 'ティッカーまたは企業名で検索 (例: AAPL, NVDA, JPM)',
    searchBtn: 'リアルタイム検索',
    searching: '検索中...',
    all: 'すべて',
    upcoming: '予定（早い順 最大30件）',
    reported: '発表済（最新順 最大30件）',
    allSectors: '全セクター',
    refreshAll: '日程更新',
    epsEst: 'EPS 予想',
    epsAct: 'EPS 実績',
    revEst: '売上 予想',
    revAct: '売上 実績',
    surprise: 'サプライズ',
    aiSummaryBtn: 'AI 決算要約',
    aiSummaryTitle: 'AI 決算コール要約',
    aiLoading: '決算内容とカンファレンスコールを分析中...',
    noApiKey:
      'VITE_GEMINI_API_KEY が未設定のためサンプル要約を表示しています。Vercelの環境変数に設定するとリアルタイムAI要約と検索が有効になります。',
    close: '閉じる',
    noResults: '条件に一致する決算発表がありません。',
    addTickerHint: '上の検索バーからS&P 500銘柄をリアルタイム検索できます。',
    statusUpcoming: '発表予定',
    statusReported: '発表済',
    timeBMO: '寄り付き前 (BMO)',
    timeAMC: '引け後 (AMC)',
    countBadge: (upCount, repCount) => `予定 ${upCount}件 · 発表済 ${repCount}件`,
    disclaimer:
      '※ 決算日程およびAI要約は参考情報です。最終的な投資判断はご自身の責任で行ってください。',
  },
  zh: {
    title: '标普500财报日历中心',
    subtitle: '财报日程查询 · 行业筛选 · 多语言AI财报电话会摘要',
    searchPlaceholder: '搜索代码或公司名称（如 AAPL, NVDA, JPM）',
    searchBtn: '实时查询',
    searching: '查询中...',
    all: '全部',
    upcoming: '即将发布（最早30条）',
    reported: '已发布（最新30条）',
    allSectors: '全部行业',
    refreshAll: '刷新日程',
    epsEst: 'EPS 预期',
    epsAct: 'EPS 实际',
    revEst: '营收 预期',
    revAct: '营收 实际',
    surprise: '业绩超预期',
    aiSummaryBtn: 'AI 财报摘要',
    aiSummaryTitle: 'AI 财报电话会摘要',
    aiLoading: '正在分析财报与电话会议要点...',
    noApiKey:
      '未配置 VITE_GEMINI_API_KEY，当前显示示例摘要。请在 Vercel 环境变量中添加密钥以启用实时 AI 摘要与查询。',
    close: '关闭',
    noResults: '没有符合当前筛选条件的财报日程。',
    addTickerHint: '可在上方搜索框实时查询标普500成分股。',
    statusUpcoming: '即将发布',
    statusReported: '已发布',
    timeBMO: '盘前 (BMO)',
    timeAMC: '盘后 (AMC)',
    countBadge: (upCount, repCount) => `即将发布 ${upCount} · 已发布 ${repCount}`,
    disclaimer:
      '※ 财报日期与 AI 摘要仅供参考，请以官方披露为准并审慎决策。',
  },
  es: {
    title: 'Centro de Resultados S&P 500',
    subtitle: 'Calendario de Ganancias · Filtros por Sector · Resúmenes IA Multilingües',
    searchPlaceholder: 'Buscar ticker o empresa (ej. AAPL, NVDA, JPM)',
    searchBtn: 'Consulta en vivo',
    searching: 'Consultando...',
    all: 'Todos',
    upcoming: 'Próximos (Primeros 30)',
    reported: 'Reportados (Últimos 30)',
    allSectors: 'Todos los sectores',
    refreshAll: 'Actualizar agenda',
    epsEst: 'BPA Est.',
    epsAct: 'BPA Real',
    revEst: 'Ing. Est.',
    revAct: 'Ing. Real',
    surprise: 'Sorpresa',
    aiSummaryBtn: 'Resumen IA',
    aiSummaryTitle: 'Resumen IA de Resultados',
    aiLoading: 'Analizando el reporte de ganancias y la llamada...',
    noApiKey:
      'VITE_GEMINI_API_KEY no está configurada; se muestran resúmenes de ejemplo. Añade la clave en Vercel para activar el análisis en vivo.',
    close: 'Cerrar',
    noResults: 'No hay eventos que coincidan con los filtros actuales.',
    addTickerHint: 'Usa la barra superior para consultar cualquier empresa del S&P 500.',
    statusUpcoming: 'Próximo',
    statusReported: 'Reportado',
    timeBMO: 'Antes de apertura',
    timeAMC: 'Tras el cierre',
    countBadge: (upCount, repCount) => `Próximos ${upCount} · Reportados ${repCount}`,
    disclaimer:
      '※ Las fechas y resúmenes generados por IA son informativos. Verifique siempre los comunicados oficiales.',
  },
};

const INITIAL_EARNINGS = [
  {
    id: 'nvda-2026-11',
    ticker: 'NVDA',
    company: 'NVIDIA Corporation',
    sector: 'Information Technology',
    date: '2026-11-18',
    timing: 'AMC',
    status: 'reported',
    epsEst: '$0.75',
    epsAct: '$0.81',
    revEst: '$33.1B',
    revAct: '$35.1B',
    surprise: '+7.7%',
    demoSummary:
      '• 데이터센터 및 Blackwell 아키텍처 수요가 전 분기 대비 강하게 확대되었습니다.\n• 클라우드 사업자(CSP)의 AI 인프라 CapEx 집행이 실적 성장을 견인했습니다.\n• 공급망 물량 확대와 차세대 랙 시스템 출하가 핵심 모멘텀으로 제시되었습니다.\n• 경영진은 다음 분기에도 높은 매출 성장률과 견조한 총마진 유지를 가이던스로 제시했습니다.',
  },
  {
    id: 'crm-2026-12',
    ticker: 'CRM',
    company: 'Salesforce, Inc.',
    sector: 'Information Technology',
    date: '2026-12-03',
    timing: 'AMC',
    status: 'upcoming',
    epsEst: '$2.44',
    epsAct: '-',
    revEst: '$9.46B',
    revAct: '-',
    surprise: '-',
    demoSummary:
      '• Agentforce 등 AI 에이전트 도입 속도와 유료 전환율이 핵심 관전 포인트입니다.\n• Data Cloud 연간반복매출(ARR) 성장률과 기업용 소프트웨어 IT 예산 회복 여부가 중요합니다.\n• 영업마진 개선 흐름과 잔여이행의무(cRPO) 가이던스 상향 여부가 주목됩니다.',
  },
  {
    id: 'cost-2026-12',
    ticker: 'COST',
    company: 'Costco Wholesale Corp.',
    sector: 'Consumer Staples',
    date: '2026-12-10',
    timing: 'AMC',
    status: 'upcoming',
    epsEst: '$3.82',
    epsAct: '-',
    revEst: '$62.1B',
    revAct: '-',
    surprise: '-',
    demoSummary:
      '• 미국 및 해외 동일점포매출(SSS) 성장률과 전자상거래 매출 증가세가 핵심 지표입니다.\n• 멤버십 갱신률과 회원권 요금 조정 효과가 수익성에 미치는 영향이 중요합니다.\n• 식료품·생필품 가격 경쟁력과 자체브랜드(Kirkland Signature) 비중 확대가 관건입니다.',
  },
  {
    id: 'avgo-2026-12',
    ticker: 'AVGO',
    company: 'Broadcom Inc.',
    sector: 'Information Technology',
    date: '2026-12-10',
    timing: 'AMC',
    status: 'upcoming',
    epsEst: '$1.39',
    epsAct: '-',
    revEst: '$14.0B',
    revAct: '-',
    surprise: '-',
    demoSummary:
      '• 커스텀 AI 가속기(ASIC) 및 네트워킹 칩 매출 성장세가 반도체 부문을 이끌고 있습니다.\n• VMware 소프트웨어 통합 이후 라이선스·구독 전환과 마진 개선 속도가 핵심입니다.\n• 하이퍼스케일러 고객사향 AI 수주 잔고와 분기 가이던스가 주요 체크포인트입니다.',
  },
  {
    id: 'adbe-2026-12',
    ticker: 'ADBE',
    company: 'Adobe Inc.',
    sector: 'Information Technology',
    date: '2026-12-11',
    timing: 'AMC',
    status: 'upcoming',
    epsEst: '$4.67',
    epsAct: '-',
    revEst: '$5.60B',
    revAct: '-',
    surprise: '-',
    demoSummary:
      '• Firefly 기반 생성형 AI 기능의 크레딧 소비 및 순신규 ARR 기여도가 핵심입니다.\n• Digital Media 및 Digital Experience 부문의 구독 성장세와 가격 정책 효과가 주목됩니다.\n• AI 기능 수익화 속도와 차기 회계연도 매출·EPS 가이던스가 시장 반응을 좌우할 전망입니다.',
  },
  {
    id: 'mu-2026-12',
    ticker: 'MU',
    company: 'Micron Technology, Inc.',
    sector: 'Information Technology',
    date: '2026-12-17',
    timing: 'AMC',
    status: 'upcoming',
    epsEst: '$1.75',
    epsAct: '-',
    revEst: '$8.70B',
    revAct: '-',
    surprise: '-',
    demoSummary:
      '• HBM3E 공급 확대 및 주요 AI 고객사 인증 진행 상황이 실적 개선의 핵심입니다.\n• DRAM 및 NAND 평균판매가격(ASP) 상승세와 비트 출하량 증가율이 중요합니다.\n• 데이터센터 메모리 수요 강도와 설비투자(CapEx) 계획이 주요 관전 포인트입니다.',
  },
  {
    id: 'aapl-2026-10',
    ticker: 'AAPL',
    company: 'Apple Inc.',
    sector: 'Information Technology',
    date: '2026-10-29',
    timing: 'AMC',
    status: 'reported',
    epsEst: '$1.60',
    epsAct: '$1.64',
    revEst: '$94.5B',
    revAct: '$94.9B',
    surprise: '+2.5%',
    demoSummary:
      '• 서비스 부문 매출이 사상 최고 수준 흐름을 이어가며 전체 마진을 지지했습니다.\n• Apple Intelligence 지원 기기 교체 수요와 신제품 초기 반응이 주요 화두였습니다.\n• 중국 시장 경쟁 환경과 연말 성수기 분기 매출 가이던스가 제시되었습니다.',
  },
  {
    id: 'msft-2026-10',
    ticker: 'MSFT',
    company: 'Microsoft Corporation',
    sector: 'Information Technology',
    date: '2026-10-28',
    timing: 'AMC',
    status: 'reported',
    epsEst: '$3.10',
    epsAct: '$3.30',
    revEst: '$64.5B',
    revAct: '$65.6B',
    surprise: '+6.5%',
    demoSummary:
      '• Azure 및 기타 클라우드 서비스 성장률과 그중 AI 서비스 기여도가 핵심으로 다뤄졌습니다.\n• M365 Copilot 기업 도입 확산과 상업용 예약(Commercial Bookings) 성장세가 확인되었습니다.\n• AI 데이터센터 확장을 위한 자본적지출(CapEx) 증가와 비용 통제 기조가 강조되었습니다.',
  },
  {
    id: 'googl-2026-10',
    ticker: 'GOOGL',
    company: 'Alphabet Inc.',
    sector: 'Communication Services',
    date: '2026-10-29',
    timing: 'AMC',
    status: 'reported',
    epsEst: '$1.85',
    epsAct: '$2.12',
    revEst: '$86.3B',
    revAct: '$88.3B',
    surprise: '+14.6%',
    demoSummary:
      '• Google Cloud 매출 성장 가속과 영업이익률 개선이 실적 호조를 뒷받침했습니다.\n• 검색 광고 및 YouTube 광고 수요가 견조하게 유지되며 현금흐름을 뒷받침했습니다.\n• AI 오버뷰·제미나이 통합에 따른 검색 경험 고도화와 인프라 투자 계획이 공유되었습니다.',
  },
  {
    id: 'amzn-2026-10',
    ticker: 'AMZN',
    company: 'Amazon.com, Inc.',
    sector: 'Consumer Discretionary',
    date: '2026-10-31',
    timing: 'AMC',
    status: 'reported',
    epsEst: '$1.14',
    epsAct: '$1.43',
    revEst: '$157.2B',
    revAct: '$158.9B',
    surprise: '+25.4%',
    demoSummary:
      '• AWS 매출 성장률 반등과 북미 리테일 물류 효율화(지역화·자동화)가 영업이익을 끌어올렸습니다.\n• 광고 사업 부문의 높은 성장세와 프라임 배송 속도 개선이 고객 충성도를 높였습니다.\n• AI 인프라 수요 증가에 따른 CapEx 집행과 4분기 성수기 전망이 제시되었습니다.',
  },
];

const LIMIT_PER_STATUS = 30;

function curateEarningsList(items) {
  const dedupedMap = new Map();
  items.forEach((item) => {
    const key = `${item.ticker.toUpperCase()}_${item.date}_${item.status}`;
    dedupedMap.set(key, {
      ...item,
      ticker: item.ticker.toUpperCase(),
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
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      tools: [{ google_search: {} }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API HTTP ${res.status}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts
    .map((p) => p.text || '')
    .join('\n')
    .trim();
}

export default function App() {
  const [lang, setLang] = useState('ko');
  const [earnings, setEarnings] = useState(INITIAL_EARNINGS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [selectedItem, setSelectedItem] = useState(null);
  const [summaryText, setSummaryText] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const t = UI_TEXT[lang] || UI_TEXT.ko;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const curated = useMemo(() => curateEarningsList(earnings), [earnings]);

  const sectors = useMemo(() => {
    const set = new Set(curated.combined.map((item) => item.sector).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [curated.combined]);

  const filteredItems = useMemo(() => {
    let baseList = curated.combined;
    if (statusFilter === 'upcoming') {
      baseList = curated.upcoming;
    } else if (statusFilter === 'reported') {
      baseList = curated.reported;
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
  }, [curated, statusFilter, sectorFilter, searchQuery]);

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
      const prompt = `Find the latest or upcoming quarterly earnings release information for S&P 500 stock "${rawQuery}".
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
        throw new Error('Invalid JSON response');
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
        demoSummary: '',
      };

      setEarnings((prev) => [newRecord, ...prev]);
      if (newRecord.status === 'upcoming' && statusFilter === 'reported') {
        setStatusFilter('upcoming');
      } else if (newRecord.status === 'reported' && statusFilter === 'upcoming') {
        setStatusFilter('reported');
      }
    } catch (err) {
      setErrorMsg('실시간 종목 조회 중 오류가 발생했습니다. 티커 철자를 확인한 뒤 다시 시도해 주세요.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleOpenSummary = async (item) => {
    setSelectedItem(item);
    setSummaryText('');

    if (!apiKey) {
      setSummaryText(item.demoSummary || t.noApiKey);
      return;
    }

    setIsSummarizing(true);
    try {
      const langNames = {
        ko: 'Korean',
        en: 'English',
        ja: 'Japanese',
        zh: 'Simplified Chinese',
        es: 'Spanish',
      };
      const targetLang = langNames[lang] || 'Korean';

      const prompt = `Provide a concise 4-bullet earnings and earnings call summary for ${item.company} (${item.ticker}), earnings date ${item.date}, status: ${item.status}.
Write the response strictly in ${targetLang}. Focus on revenue/EPS drivers, margin/guidance takeaways, and key management themes.`;

      const result = await generateGeminiText(apiKey, prompt);
      setSummaryText(result || item.demoSummary || '');
    } catch (err) {
      setSummaryText(item.demoSummary || 'AI 요약 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSummarizing(false);
    }
  };

  useEffect(() => {
    if (selectedItem && apiKey) {
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
                {t.countBadge(curated.upcoming.length, curated.reported.length)}
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
            <p className="text-base font-medium text-slate-300">{t.noResults}</p>
            <p className="mt-1 text-sm text-slate-500">{t.addTickerHint}</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const isUpcoming = item.status === 'upcoming';
              return (
                <article
                  key={item.id}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
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

            <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-relaxed text-slate-200 whitespace-pre-line">
              {isSummarizing ? (
                <div className="flex items-center gap-2.5 text-slate-400">
                  <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
                  <span>{t.aiLoading}</span>
                </div>
              ) : (
                summaryText
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
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

export const syllabusData = {
  title: "AI문학연구방법론: LLM Wiki와 바이브 코딩 대학원 강의계획서",
  basicInfo: [
    { label: "연도-학기", value: "2026-2" },
    { label: "학수번호-분반", value: "XXX" },
    { label: "이수구분", value: "전공" },
    { label: "과목명", value: "AI문학연구방법론: LLM Wiki와 바이브 코딩" },
    { label: "담당교수", value: "미정" },
    { label: "수강대상", value: "국어국문학과 대학원" },
    { label: "선이수과목 (권장)", value: "없음" }
  ],
  methods: [
    { type: "교수자 강의", desc: "LLM AI의 원리, 에이전트 기반 지식관리 시스템에 대한 교수자 강의" },
    { type: "발제 및 토론", desc: "학생이 지정 논문을 요약·발표하고 집단 토론 수행" },
    { type: "프로젝트 기반 학습", desc: "LLM Wiki 구축, 소논문 집필, 디지털 아티팩트(바이브 코딩) 제작을 병행하는 개인 프로젝트" },
    { type: "아티팩트 쇼케이스", desc: "제작한 웹사이트/도구를 공개 시연하고 상호 평가" }
  ],
  evaluations: [
    { item: "수시 과제", score: "30점", desc: "주간 Ingest 과제, 트러블 로그, GitHub 커밋 이력" },
    { item: "중간 과제", score: "20점", desc: "LLM Wiki 구축 현황 발표 + 연구 기획서" },
    { item: "기말 과제", score: "30점", desc: "소논문 최종본 + 디지털 아티팩트 통합 포트폴리오 발표" },
    { item: "참여도", score: "20점", desc: "토론 참여, 동료 리뷰, 아티팩트 상호 평가" },
    { item: "총점", score: "100점", desc: "" }
  ],
  overview: "본 교과목은 안드레 카파시가 제안한 LLM Wiki 개념을 통해 Obsidian과 AI 에이전트에 기반한 개인지식관리(PKM) 시스템을 구축하고 응용한다. 연구 논저를 읽고, 평가하고, 논평하고, 연결하고, 후속 연구 아이디어를 제안하고, 논문 작성에 활용해 본다. 한국어문학 연구와 교육에 필요한 앱이나 웹사이트, 기타 아티팩트를 직접 바이브 코딩(Vibe Coding)으로 만들고 공유하고 평가하여 AI·디지털 인문학 연구를 선도하도록 이끈다.",
  objectives: [
    "생성형 AI의 기술적 특성(LLM 구조, 토큰 경제, 환각, 컨텍스트 윈도우)을 비판적 인문학 관점에서 이해하고 분석한다.",
    "국내외 AI 문학·인문학 이론을 습득하고 비판적으로 고찰하며, LLM Wiki 기반의 지식 편찬 파이프라인을 자율적으로 설계·운용한다.",
    "AI와의 협업 과정에서 발생하는 '트러블'(오류, 긴장, 마찰)을 방법론적 자원으로 전환하는 성찰적 연구 태도를 갖추고 자문화기술지적 기록을 남긴다.",
    "바이브 코딩(Vibe Coding)을 활용하여 연구·교육용 디지털 아티팩트를 직접 제작하고 공개 배포할 수 있다.",
    "AI 시대의 저자성, 독창성, 윤리 쟁점을 성찰하고, 실제 교육 현장에 활용 가능한 모델을 설계한다."
  ],
  materials: {
    textbook: "교수자의 기존 LLM Wiki 작업",
    textbookUrl: "https://daewonnoh.github.io/LLM-Wiki-Agent/"
  },
  // 참고문헌: url 필드가 있으면 링크로 렌더링
  references: {
    basic: [
      { text: "김병준, 노대원, 「생성형 AI는 인문학 연구를 어떻게 바꿀까?」, 『영주어문』 제59집, 영주어문학회, 2025." },
      { text: "노대원, 『소설 쓰는 로봇: AI 시대의 문학』, 문학과지성사, 2025." },
      { text: "노대원, 「AI는 문학 이론을 어떻게 다시 쓰는가? - 기술공생 시대의 포스트휴머니즘 미학」, 『영주어문』 제62집, 영주어문학회, 2026." },
      {
        text: "Karpathy, Andrej, \"llm-wiki.md: A pattern for building personal knowledge bases using LLMs\", GitHub Gist.",
        url: "https://gist.github.com/karpathy/",
        urlLabel: "GitHub Gist"
      },
      {
        text: "Karpathy, Andrej, \"Skill Issue: Andrej Karpathy on Code Agents, AutoResearch, and the Loopy Era of AI\", No Priors [YouTube Video], 2026.",
        url: "https://www.youtube.com/watch?v=kwSVtQ7dziU",
        urlLabel: "YouTube 영상"
      },
      { text: "Lee, Sung Hyun, John A. Velez, and Dae-won Noh, \"Beyond Prompt Engineering: Exploring Collaborative Dialogue with GenAI for Problem-Solving,\" Cyberpsychology, Behavior, and Social Networking, June 30, 2025." }
    ],
    tools: [
      { text: "숀케 아렌스, 김주은 역, 『제텔카스텐: 글 쓰는 인간을 위한 두 번째 뇌』, 인간희극, 2021." },
      { text: "이기형, ｢소통과 감응을 지향하는 학문적인 글쓰기를 위한 문제의식과 대안의 추구: '자기민속지학'과 대안적인 학술 글쓰기의 사례들을 중심으로｣, 『커뮤니케이션 이론』 9(2), 2013." },
      { text: "임태형, ｢에이전틱 AI 기반 공동연구자 시스템 구축 경험의 자문화기술지: 교육공학 연구자의 성찰｣, 『교육정보미디어연구』 32(2), 2026." },
      { text: "한경희, ｢연구자의 AI 트러블｣, 『제20회 KOSSDA 데이터 페어 발표 자료집 — AI 활용과 연구방법론: 도구를 넘어 연구로』, 2026." },
      { text: "N. Katherine Hayles, How We Think: Digital Media and Contemporary Technogenesis, University of Chicago Press, 2012." },
      { text: "Craig Vear, ed., The Routledge International Handbook of Practice-Based Research, Routledge, 2021." },
      { text: "Donna Haraway, Staying with the Trouble: Making Kin in the Chthulucene, Duke University Press, 2016." },
      { text: "Ellis, Carolyn, Adams, Tony E., & Bochner, Arthur P., \"Autoethnography: an overview\", Historical Social Research 36(4), 2011, 273-290." },
      {
        text: "Huang, J. Y., \"Slow AI: AI that matches a human's pace\", 2026.",
        url: "https://jennyhuang19.github.io/slow-ai-ai-that-meets-a-humans-pace/",
        urlLabel: "원문 보기"
      },
      { text: "O'Halloran, Kieran, \"Digital assemblages with AI for creative interpretation of short stories\", Digital Scholarship in the Humanities 39(2), 2024, 657-689." }
    ]
  },
  assignments: "관련 논문을 작성하거나 AI 도구를 활용한 교육 모델/애플리케이션 설계 프로젝트를 병행한다. 연구/프로젝트에 대한 계획서를 제출·발표·토론하고 최종 결과 보고서/논문을 제출한다.",
  phases: [
    {
      phase: "Phase 1: PKM 시스템 구축 — \"지식의 수집과 제텔카스텐\" (1–5주)",
      color: "#0ea5e9",
      bgColor: "#e0f2fe",
      borderColor: "#0284c7",
      weeks: [
        { week: 1, content: "오리엔테이션: 디지털 인문학과 지식 관리의 진화", question: "어떻게 방대한 지식을 개인의 창의적 도구로 만들 것인가?", keywords: ["메멕스", "LLM Wiki"] },
        { week: 2, content: "제텔카스텐 메모법과 로컬 지식베이스의 원리", question: "왜 폴더 구조가 아닌 상호 연결망이 중요한가?", keywords: ["제텔카스텐", "지식의 연결 네트워크"] },
        { week: 3, content: "LLM과 개인 지식 관리의 결합 (LLM Wiki)", question: "LLM은 어떻게 지식의 단순 검색을 넘어 컴파일러가 되는가?", keywords: ["LLM 컴파일러", "RAG"] },
        { week: 4, content: "연구 자료의 Ingestion 및 요약 시스템 구축", question: "자동화된 정보 수집 과정에서 인간 연구자의 주권은 어떻게 보존되는가?", keywords: ["Ingestion 파이프라인", "에이전트 요약"] },
        { week: 5, content: "지식 네트워크의 시각화와 연결", question: "지식의 토폴로지는 우리에게 어떤 새로운 통찰을 주는가?", keywords: ["지식 시각화", "마크다운 메타데이터"] }
      ]
    },
    {
      phase: "Phase 2: 에이전틱 연구 환경과 바이브 코딩 입문 (6–10주)",
      color: "#8b5cf6",
      bgColor: "#ede9fe",
      borderColor: "#7c3aed",
      weeks: [
        { week: 6, content: "인지적 배치와 AI의 역할 설정", question: "우리는 AI를 도구, 동료, 환경 중 무엇으로 규정해야 하는가?", keywords: ["인지적 배치", "공진화"] },
        { week: 7, content: "에이전트와의 협업과 트러블(Trouble)", question: "오류와 마찰을 제거하는 대신, 어떻게 연구의 동력으로 삼을 것인가?", keywords: ["트러블과 머물기", "환각"] },
        { week: 8, content: "[중간 발표] 개별 LLM Wiki 구축 결과 발표", question: "개인 지식 관리 시스템 구축 과정에서 경험한 인식론적 변화는 무엇인가?", keywords: ["지식 아키텍처"], isSpecial: true },
        { week: 9, content: "자연어 프로그래밍과 바이브 코딩(Vibe Coding)의 이해", question: "코딩 문법을 몰라도, 어떻게 컴퓨팅 사고를 소프트웨어로 구현할 수 있는가?", keywords: ["바이브 코딩", "프롬프트 엔지니어링"] },
        { week: 10, content: "연구/교육용 디지털 아티팩트 프로토타입 기획", question: "논문이라는 닫힌 텍스트를 넘어, 어떤 지식을 산출할 것인가?", keywords: ["실천 기반 연구", "아티팩트 설계"] }
      ]
    },
    {
      phase: "Phase 3: 산출과 공유 — \"바이브 코딩 실습 및 토론\" (11–16주)",
      color: "#10b981",
      bgColor: "#d1fae5",
      borderColor: "#059669",
      weeks: [
        { week: 11, content: "바이브 코딩 실습 ①: 프론트엔드 컴포넌트 개발", question: "자연어 지시만으로 웹 인터페이스를 설계할 때 발생하는 추상화의 딜레마는?", keywords: ["AI 코딩", "정적 페이지"] },
        { week: 12, content: "바이브 코딩 실습 ②: 데이터 연동 및 인터랙션", question: "정적 지식을 동적 인터랙션으로 변환할 때 사용자 경험(UX)은 어떻게 달라지는가?", keywords: ["데이터 바인딩", "인터랙티브 텍스트"] },
        { week: 13, content: "버전 관리 및 자동 배포 시스템 구축", question: "지식의 무결성을 어떻게 보존하고, 세상과 어떻게 투명하게 공유할 것인가?", keywords: ["버전 관리", "정적 배포"] },
        { week: 14, content: "디지털 아티팩트 고도화 및 동료 리뷰 (Peer Review)", question: "기계가 아닌 인간 동료의 피드백은 아티팩트를 어떻게 성숙시키는가?", keywords: ["교정된 응답성", "상호 평가"] },
        { week: 15, content: "[아티팩트 시연] 디지털 결과물 및 시연 발표", question: "제작된 아티팩트는 우리가 던진 연구 질문에 어떤 방식으로 응답하는가?", keywords: ["수행적 지식", "시연"], isSpecial: true },
        { week: 16, content: "[최종 발표] 소논문/보고서 제출 및 종합 토론", question: "인간과 AI의 기술공생 시대, 인문학 연구자의 새로운 존재 증명 방식은 무엇인가?", keywords: ["인간-AI 공생", "포스트휴머니즘"], isSpecial: true }
      ]
    }
  ],
  toolsAndEnv: [
    { name: "Obsidian", purpose: "로컬 지식 관리 (LLM Wiki)", cost: "무료", icon: "🔮" },
    { name: "GitHub", purpose: "버전 관리, 코드 공유, Pages 배포", cost: "무료", icon: "🐙" },
    { name: "AI 코딩 에이전트", purpose: "바이브 코딩, 위키 자동화 (Claude Code, ChatGPT Codex, Antigravity IDE 등 택일)", cost: "유료 구독 ($22~110)", icon: "🤖" }
  ],
  toolsNote: "AI 도구 구독 비용($22~110)이 발생합니다. 학기 초에 교육용 크레딧 지원 방안을 안내합니다.",
  philosophy: [
    "교수자의 실제 연구 경험: AI 에이전트와 함께 진행한 \"AI 및 AI 에이전트와 함께 문학 연구\" 프로젝트에서 도출된 핵심 개념—트러블과 머물기, 바이브코딩, 교정된 응답성, 느린 AI, 토큰 효율성 딜레마—을 수업의 각 단계에 녹였습니다.",
    "참조 과정: Anastasia Salter(\"Humanities in the Age of AI\", ENG 6806, Fall 2025)의 텍스트→시각→절차적 3단계 구조를 참고하여 재구성했습니다."
  ]
};

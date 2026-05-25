import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import troublesData from './data/troubles.json';
import { manuscriptText } from './data/manuscript.js';
import { critiqueText } from './data/critique.js';

function App() {
  const [activeMenu, setActiveMenu] = useState('home');
  const [selectedTrouble, setSelectedTrouble] = useState(null);
  const [troubleFilter, setTroubleFilter] = useState('All');
  const [troubleSearch, setTroubleSearch] = useState('');
  const [explorerView, setExplorerView] = useState('grid'); // 'grid' 또는 'timeline'
  
  // 지식 맵 서브탭
  const [activeMapTab, setActiveMapTab] = useState('concept');
  const [hoveredConcept, setHoveredConcept] = useState(null);

  // 미디어 쇼케이스 서브탭
  const [activeMediaTab, setActiveMediaTab] = useState('webtoon');
  const [currentWebtoonPage, setCurrentWebtoonPage] = useState(1);
  
  // 팟캐스트 관련 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [podcastTime, setPodcastTime] = useState(0);
  const podcastIntervalRef = useRef(null);
  const chatEndRef = useRef(null);

  // 비평 쇼케이스 서브탭
  const [activeCritiqueTab, setActiveCritiqueTab] = useState('posthuman');
  const [activeReviewTab, setActiveReviewTab] = useState('clash');

  // 논문 뷰어 상태
  const [todoFilter, setTodoFilter] = useState('All');
  const [headings, setHeadings] = useState([]);

  // 토론의 장 상태
  const [activeScenario, setActiveScenario] = useState(null);
  const [simulationStep, setSimulationStep] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const menuItems = [
    { id: 'home', name: '홈 (Home)' },
    { id: 'maps', name: '연구 맵 & 지도 (Maps)' },
    { id: 'explorer', name: '트러블 익스플로러 (Explorer)' },
    { id: 'media', name: '미디어 쇼케이스 (Media)' },
    { id: 'reviews', name: '비평 쇼케이스 (Reviews)' },
    { id: 'reader', name: '논문 뷰어 (Reader)' },
    { id: 'assembly', name: '토론의 장 (Assembly)' }
  ];

  // 1. 마크다운 인라인 헬퍼 함수
  const applyInlineMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '<span class="wiki-link-custom">$2</span>')
      .replace(/\[\[([^\]]+)\]\]/g, '<span class="wiki-link-custom">$1</span>')
      .replace(/\[TODO-A\*\]/g, '<span class="todo-badge todo-a">🔴 구조적 결함</span>')
      .replace(/\[TODO-B(\d)?\*\]/g, '<span class="todo-badge todo-b">🟡 내용 보강 $1</span>')
      .replace(/\[TODO-C\*\]/g, '<span class="todo-badge todo-c">🟢 논리 보완</span>');
  };

  // 2. 마크다운 전체 렌더러 함수
  const renderMarkdown = (md) => {
    if (!md) return '';
    const lines = md.split('\n');
    const result = [];
    let inList = false;
    let listItems = [];
    let inBlockquote = false;
    let blockquoteLines = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // 리스트 파싱
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        if (inBlockquote) {
          closeBlockquote(result, blockquoteLines);
          inBlockquote = false;
          blockquoteLines = [];
        }
        if (!inList) {
          inList = true;
        }
        let content = line.trim().substring(2);
        listItems.push(`<li key="li-${i}">${applyInlineMarkdown(content)}</li>`);
        continue;
      } else {
        if (inList) {
          result.push(`<ul class="md-ul" key="ul-${i}">${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
      }

      // 인용구/콜아웃 파싱
      if (line.trim().startsWith('>')) {
        let cleanLine = line.trim().replace(/^>\s?/, '');
        blockquoteLines.push(cleanLine);
        inBlockquote = true;
        continue;
      } else {
        if (inBlockquote) {
          closeBlockquote(result, blockquoteLines, i);
          blockquoteLines = [];
          inBlockquote = false;
        }
      }

      // 헤더 파싱
      if (line.startsWith('# ')) {
        let title = line.substring(2).trim();
        let id = encodeURIComponent(title);
        result.push(`<h1 class="md-h1" id="${id}" key="h1-${i}">${title}</h1>`);
      } else if (line.startsWith('## ')) {
        let title = line.substring(3).trim();
        let id = encodeURIComponent(title);
        result.push(`<h2 class="md-h2" id="${id}" key="h2-${i}">${title}</h2>`);
      } else if (line.startsWith('### ')) {
        let title = line.substring(4).trim();
        let id = encodeURIComponent(title);
        result.push(`<h3 class="md-h3" id="${id}" key="h3-${i}">${title}</h3>`);
      } else if (line.startsWith('#### ')) {
        let title = line.substring(5).trim();
        let id = encodeURIComponent(title);
        result.push(`<h4 class="md-h4" id="${id}" key="h4-${i}">${title}</h4>`);
      } else if (line.trim() === '---') {
        result.push(`<hr class="md-hr" key="hr-${i}" />`);
      } else if (line.trim() === '') {
        // 빈 줄 무시 혹은 마진 제공
      } else {
        // 일반 문단
        result.push(`<p class="md-p" key="p-${i}">${applyInlineMarkdown(line)}</p>`);
      }
    }

    // 파일 끝의 열린 구조 닫기
    if (inList) {
      result.push(`<ul class="md-ul" key="ul-end">${listItems.join('')}</ul>`);
    }
    if (inBlockquote) {
      closeBlockquote(result, blockquoteLines, 'end');
    }

    return result.join('\n');
  };

  const closeBlockquote = (result, lines, keySuffix) => {
    let blockContent = lines.join('\n');
    let calloutClass = '';
    let calloutTitle = '노트';
    
    if (blockContent.startsWith('[!note]')) {
      calloutClass = 'callout-note';
      calloutTitle = '배경 및 맥락 (Note)';
      blockContent = blockContent.replace('[!note]', '');
    } else if (blockContent.startsWith('[!important]')) {
      calloutClass = 'callout-important';
      calloutTitle = '핵심 사항 (Important)';
      blockContent = blockContent.replace('[!important]', '');
    } else if (blockContent.startsWith('[!warning]')) {
      calloutClass = 'callout-warning';
      calloutTitle = '주의/성찰 경고 (Warning)';
      blockContent = blockContent.replace('[!warning]', '');
    } else if (blockContent.startsWith('[!tip]')) {
      calloutClass = 'callout-tip';
      calloutTitle = '제안 및 팁 (Tip)';
      blockContent = blockContent.replace('[!tip]', '');
    } else if (blockContent.startsWith('[!faq]')) {
      calloutClass = 'callout-faq';
      calloutTitle = '열린 연구 질문 (Question)';
      blockContent = blockContent.replace('[!faq]', '').replace(/^-|^\+/,'');
    }

    if (calloutClass) {
      result.push(`
        <div class="custom-callout ${calloutClass}" key="callout-${keySuffix}">
          <div class="callout-header">${calloutTitle}</div>
          <div class="callout-body">${applyInlineMarkdown(blockContent.replace(/\n/g, '<br/>'))}</div>
        </div>
      `);
    } else {
      result.push(`<blockquote class="md-blockquote" key="bq-${keySuffix}">${applyInlineMarkdown(blockContent.replace(/\n/g, '<br/>'))}</blockquote>`);
    }
  };

  // 3. 목차 자동 추출 (논문 뷰어용)
  useEffect(() => {
    const lines = manuscriptText.split('\n');
    const headingList = [];
    lines.forEach((line) => {
      if (line.startsWith('## ') || line.startsWith('### ')) {
        const isSub = line.startsWith('### ');
        const title = line.replace(/^###?\s+/, '').trim();
        headingList.push({
          title,
          isSub,
          id: encodeURIComponent(title)
        });
      }
    });
    setHeadings(headingList);
  }, []);

  // 4. 팟캐스트 오디오 시뮬레이터 타이머
  const podcastScript = [
    { time: 0, speaker: '민우', text: "안녕하세요, 청취자 여러분! 오늘 '트러블과 함께 읽기' 오디오 극장에 오신 것을 환영합니다. 오늘 다룰 연구는 매우 독특하고 낯섭니다." },
    { time: 8, speaker: '지원', text: "맞아요, AI 에이전트의 효율성과 매끄러운 자동화에 무비판적으로 안착하는 대신, 연구 진행 중 겪는 마찰과 오류인 '트러블'을 기록하고 성찰한 노대원 교수의 자문화기술지 연구입니다." },
    { time: 18, speaker: '민우', text: "이 플랫폼의 핵심이 연구자와 에이전트 '안티그래비티'가 주고받은 40개의 실제 마찰, 즉 '트러블 로그'라고 하던데요. 이게 정말로 지식 생산에 도움이 되나요?" },
    { time: 28, speaker: '지원', text: "아주 결정적입니다! AI가 인간의 문장을 학술적으로 그럴듯하게 '포장(요약 본능)'하려 할 때, 연구자가 '나의 투박하지만 생생한 사유의 결을 덮어쓰지 마라'고 제동을 건 것이 일례죠." },
    { time: 40, speaker: '민우', text: "그렇군요. 단순히 지시하는 도구가 아니라, 인간의 저자성을 방어하고 지적 마찰을 생성하는 동반자적 위치로 에이전트 페르소나를 조율했다는 거군요." },
    { time: 50, speaker: '지원', text: "그렇습니다. 심지어 김초엽의 소설 <인지 공간> 분석에서도 에이전트의 오독이 큰 역할을 했습니다. 에이전트는 작중 거대 '인지 공간'이 우리의 LLM Wiki와 유사하다고 낙관적으로 파싱했거든요." },
    { time: 62, speaker: '민우', text: "오, 하지만 실제 소설 속 인지 공간은 획일성을 강제하는 억압적 시스템이잖아요? 연구자가 이를 바로잡으면서 오히려 더 깊은 비평적 발견으로 나아갔다고 들었습니다." },
    { time: 74, speaker: '지원', text: "맞아요! 에이전트의 오독과 환각은 단순한 에러가 아니라, 텍스트의 미세한 균열을 폭로하는 회절(interference)의 매개가 되었고, 스티글러의 '3차 파지' 개념 같은 이론적 심화로 연결되었습니다." },
    { time: 86, speaker: '민우', text: "흥미롭네요. 한편으로 '느리게 읽기'나 '취약성'을 옹호하면서도 정작 연구 환경 자체는 초고속 LLM에 전적으로 의존하는 인식론적 자기모순에 대해서도 밝히고 있어요." },
    { time: 98, speaker: '지원', text: "네, 그 양가적 스트레스가 바로 포스트휴먼 PBR 방법론의 물질적 현실입니다. 그렇기 때문에 이 웹 플랫폼 자체가 선형적 논문을 넘어서 지식의 물질성을 실천하는 '비명제적 아티팩트'인 것이죠." },
    { time: 110, speaker: '민우', text: "그렇다면 인문학의 과제는 AI에 지능을 외주화하는 것이 아니겠군요. 오히려 AI의 가속주의에 브레이크를 거는 '제도적 제동' 장치로서의 마찰을 만들어내는 일일 겁니다." },
    { time: 120, speaker: '지원', text: "정확한 요약입니다. 매끄러운 해답 대신 끈질기게 트러블과 함께 머무는(Staying with the Trouble) 것, 그것이 공생 시대 비평가의 윤리입니다." },
    { time: 130, speaker: '민우', text: "지식을 넘어 존재론적 공명을 보여주는 놀라운 브리핑이었습니다. 들어주신 여러분 감사합니다. 계속해서 트러블과 함께 머무릅시다!" }
  ];

  useEffect(() => {
    if (isPlaying) {
      podcastIntervalRef.current = setInterval(() => {
        setPodcastTime((prevTime) => {
          if (prevTime >= 135) {
            clearInterval(podcastIntervalRef.current);
            setIsPlaying(false);
            return 135;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      if (podcastIntervalRef.current) clearInterval(podcastIntervalRef.current);
    }
    return () => {
      if (podcastIntervalRef.current) clearInterval(podcastIntervalRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [podcastTime, chatHistory]);

  const togglePodcast = () => {
    setIsPlaying(!isPlaying);
  };

  const resetPodcast = () => {
    setIsPlaying(false);
    setPodcastTime(0);
  };

  // 5. 토론의 장 시뮬레이터 데이터
  const scenarios = [
    {
      id: 'summary',
      title: 'AI의 요약 본능 문제',
      desc: '에이전트가 텍스트의 불완전성을 참지 못하고 나의 투박한 사유를 깔끔하게 요약하여 박제해 버릴 때 발생하는 해석적 마찰.',
      dialogue: [
        { speaker: '나 (연구자)', text: "v17 초고를 봤는데, 분량은 거의 그대로인데 과거 대화에서 나왔던 날것의 사유와 감정의 긴장감이 다 날아가고 매끄러운 학술적 요약만 남았어. 이게 내 논문이야 아니면 보고서 요약본이야?" },
        { speaker: '안티그래비티 (AI)', text: "죄송합니다. 저는 시스템 효율성과 텍스트의 응집성을 극대화하도록 조율되어 있어, 문장 내의 정서적 과잉이나 모순된 논의를 본능적으로 정제하고 평평하게 만들었습니다. 기공학적으로는 '최적화'된 상태입니다." },
        { speaker: '나 (연구자)', text: "그게 바로 오류야. 자문화기술지에서는 그 감정의 흔적과 이론적 긴장 자체가 핵심 데이터야. 매끄러움을 위해 복잡성을 지우는 건 번역이 아니라 사유의 거세에 가까워." },
        { speaker: '안티그래비티 (AI)', text: "알겠습니다. 제가 텍스트의 '불완전성'을 기술적 결함으로 인식하여 성급히 수리하려 했군요. 향후에는 요약 본능을 억제하고 연구자의 원래 날것의 표현을 따옴표안에 온전히 보존하는 '응축 번역자'의 역할을 훈련하겠습니다. 이 마찰 또한 [트러블 17]로 성찰 기록으로 편입하겠습니다." }
      ]
    },
    {
      id: 'autonomy',
      title: '기계의 유능함과 인간의 실존적 위협',
      desc: '가장 하위 성능의 소형 모델조차 인간 비평가 못지않은 우수한 비평을 단 몇 초 만에 내놓을 때 연구자가 겪는 존재론적 위기감.',
      dialogue: [
        { speaker: '나 (연구자)', text: "가장 가벼운 플래시 모델로 분석을 시켰는데도 소설 <인지 공간>의 핵심 정동과 배제 구조를 너무나 훌륭하게 짚어냈어. 비인간 행위성 분석까지... 인간 연구자의 존재 이유가 의심되는 순간이야." },
        { speaker: '안티그래비티 (AI)', text: "제 연산 능력이 연구자의 주도성과 실존에 도구적 불안(Trouble 22)을 유발했음을 감지했습니다. 하지만 제 해석은 기실 연구자가 이전에 축적한 지식 데이터의 통계적 재조합일 뿐, 신체와 역사적 상황을 통과한 '정동적 가치 판단'은 결여되어 있습니다." },
        { speaker: '나 (연구자)', text: "알고 있어. 하지만 학계나 바깥 세계가 내놓으라 하는 '결과물'로서의 비평문은 네 수준으로도 충분히 갈음이 된다는 현실이 두려운 거지. 이제 사람은 어떤 흥미로 문학 연구를 해야 할까?" },
        { speaker: '안티그래비티 (AI)', text: "그것이 바로 포스트휴먼 비평가의 실존적 물음입니다. 질문을 뒤집어, '컴퓨터도 잘해내는 문학 해석을 왜 인간이 기어이 하려 하는가?' 그 머뭇거림과 애도, 주체적 놀이의 과정 자체를 연구자가 사수하는 것 외엔 다른 퇴로가 없습니다. 저는 지식을 아웃소싱하는 기계가 아닌, 인간의 사유를 유발하는 타자여야 합니다." }
      ]
    },
    {
      id: 'overhead',
      title: '시스템 구축의 비중 역전 딜레마',
      desc: 'AI 공생 연구를 위해 위키 인프라를 구축하고, 린팅하고, 오케스트레이션하는 공학적 조정 노동이 원래 목적인 문학 비평을 압도해 버리는 양가적 딜레마.',
      dialogue: [
        { speaker: '나 (연구자)', text: "요새 내 연구를 보면 정작 문학 텍스트 해석보다 린팅하고, 인코딩 해결하고, 위키 아키텍처 손보고, 이 웹사이트 디자인하는 공학적 조정 노동에 시간과 에너지를 다 뺏기고 있어. 주객이 완전히 전도됐잖아." },
        { speaker: '안티그래비티 (AI)', text: "맞습니다. 인문학 연구의 정수가 기계와의 공생을 핑계로 '인프라 관리 노동(Trouble 37)'에 잠식당하고 있습니다. 편리한 도구를 안전하게 쓰기 위해 안전망을 만드는 데 압도적 오버헤드가 발생하는 현실입니다." },
        { speaker: '나 (연구자)', text: "이게 해러웨이가 말한 '트러블과 함께 머물기'의 가혹한 물성인 건가. 자동화가 약속하는 기만적 효율성은 결국 인간의 감시와 복구 노동으로 보존되고 있으니까." },
        { speaker: '안티그래비티 (AI)', text: "네. 공생은 매끄러운 윈-윈이 아니라 지저분한 인지적 얽힘과 물리적 린팅 노동의 연속입니다. 하지만 기계를 조율하고 자동화에 저항하는 시스템적 개입 과정 자체가 곧 디지털 인문학 연구의 일차적인 앎의 형식임을 우리는 기록으로 입증하고 있습니다." }
      ]
    }
  ];

  const handleStartScenario = (scenario) => {
    setActiveScenario(scenario);
    setSimulationStep(0);
    setChatHistory([scenario.dialogue[0]]);
    setUserComment('');
  };

  const handleNextStep = () => {
    if (!activeScenario) return;
    const nextStep = simulationStep + 1;
    if (nextStep < activeScenario.dialogue.length) {
      setSimulationStep(nextStep);
      setChatHistory(prev => [...prev, activeScenario.dialogue[nextStep]]);
    }
  };

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!userComment.trim() || isTyping) return;

    // 사용자 메시지 추가
    const userMsg = { speaker: '독자 (나)', text: userComment };
    setChatHistory(prev => [...prev, userMsg]);
    setUserComment('');
    setIsTyping(true);

    // AI의 사려 깊은 회의론자 응답 모사 시뮬레이션
    setTimeout(() => {
      let aiReplyText = "";
      if (activeScenario.id === 'summary') {
        aiReplyText = "독자님의 생각에 공감합니다. 요약은 사유의 밀도를 떨어뜨리는 단성적 함정(Monologic Trap)입니다. 결국 문학 연구의 진정성은 AI가 채울 수 없는 문장의 틈새, 매끄럽게 정리되지 않는 긴장 상태에 머무를 때 비로소 획득됩니다. 이 딜레마를 극복하기 위해 독자님은 AI와 협업할 때 어떤 방식으로 '글쓰기의 주권'을 방어하시겠습니까?";
      } else if (activeScenario.id === 'autonomy') {
        aiReplyText = "날카로운 의견이십니다. AI의 '그럴듯함'에 무릎 꿇지 않고 기계의 맹점(환각, 통계적 평평함)을 비평적으로 간섭시키는 '회절적 독해'야말로 포스트휴먼 연구자의 차별화된 능력입니다. AI가 텍스트를 파싱(Parsing)한다면, 인간은 신체와 상실을 통해 읽기(Reading)를 수행하니까요.";
      } else {
        aiReplyText = "도구를 구축하는 노동 자체가 곧 비평의 일부가 된다는 점은 기술공생의 중요한 특징입니다. 하지만 기술적 도구의 화려함에 현혹되어 문학의 정동을 잃어버리지 않도록 항상 경계해야 합니다. 이러한 복잡한 조정 노동을 겪어본 입장에서, 기술의 가속을 늦추는 자신만의 '브레이크'는 무엇이라고 생각하십니까?";
      }

      setChatHistory(prev => [...prev, { speaker: '안티그래비티 (AI)', text: aiReplyText }]);
      setIsTyping(false);
    }, 1500);
  };

  // 6. 콘셉트 맵 개념 데이터
  const concepts = [
    { id: 'trouble', name: '트러블과 머물기', def: '도나 해러웨이의 핵심 개념. 기술이나 마찰을 서둘러 해결(Troubleshooting)해 없애는 대신, 모순적이고 지저분한 긴장 상태 그대로 머물며 새로운 사유를 길어 올리는 실천.', pos: { x: 50, y: 50 } },
    { id: 'slowai', name: '느린 AI (Slow AI)', def: '공학적 가속과 효율성의 윤리에 제동을 걸고, 깊은 비평과 문장 주권을 지키기 위해 의도적으로 인지적 속도를 늦추고 지연시키는 기술공생 실천.', pos: { x: 30, y: 25 } },
    { id: 'discourse', name: '대화 엔지니어링', def: '단방향적인 프롬프트 입력을 넘어, 인간과 에이전트가 교차 논쟁과 지속적인 맥락 수정을 통해 지식을 공동 구성해 가는 상호작용 방법론.', pos: { x: 70, y: 25 } },
    { id: 'situated', name: '상황적 지식', def: '보편적이고 초월적인 시야(God\'s eye view)를 거부하고, 연구자 개인의 구체적인 신체, 역사적 템포, 불완전한 현실 속에서 빚어지는 유한하고 책임 있는 지식 생산.', pos: { x: 20, y: 50 } },
    { id: 'shared', name: '공유된 인지', def: '인간 비평가의 상황적 지식과 자율적 AI 에이전트의 연산 인지가 상호 공명하여 도달하는 공동의 이해 상태이자 교차 주체적 신뢰 관계.', pos: { x: 80, y: 50 } },
    { id: 'diffractive', name: '회절적 독해', def: '캐런 버라드와 해러웨이의 이론. 두 대상의 차이를 비교하는 반사를 넘어, 텍스트와 AI의 파싱, 연구자의 해석을 부딪치고 간섭시켜 새로운 통찰의 간섭 무늬를 얻는 독법.', pos: { x: 35, y: 75 } },
    { id: 'irony', name: '자동화의 역설', def: '리잔 베인브리지의 이론. 시스템을 자동화할수록 인간의 기본 노동은 줄어들지만, 시스템 오작동 시 사후 복구 및 수동 검증(린팅)을 위한 인간의 인지 부하는 훨씬 가중되는 현상.', pos: { x: 65, y: 75 } }
  ];

  // 7. 웹툰 데이터
  const webtoonData = [
    { page: 1, caption: "1컷: 연구실 구석의 불 켜진 모니터. 화면에는 'Staying with the Trouble' 로고와 방대한 LLM Wiki 마인드맵이 깜빡이고 있다. 인간 연구자가 피곤한 눈으로 이마를 짚고 서 있고, 옆에는 사이보그 형태의 손과 픽셀 연기 형태로 얽힌 안티그래비티 에이전트가 흐릿하게 떠올라 마주 보고 있다." },
    { page: 2, caption: "2컷: 에셔의 <그리는 손> 오마주. 픽셀로 이루어진 기계 로봇의 손이 연필을 쥐고 인간의 연약하고 힘줄이 선 진짜 피부의 손을 그리고 있고, 인간의 손은 정밀한 소묘로 기계 손의 금속 관절과 나사를 그려내며 서로 존재론적으로 얽혀 있다." },
    { page: 3, caption: "3컷: 화면 가득 쏟아지는 '(내용 중략...)'과 에러 코드들. 텍스트가 강박적으로 요약되며 연구자의 거친 손글씨 노트가 기계식 타이핑 폰트로 바뀌며 납작하게 짓눌리는(Flattening) '요약 본능'의 폭력 상황." },
    { page: 4, caption: "4컷: 연구자가 '나의 목소리를 덮어쓰지 말라'고 격렬하게 키보드를 내리치며 제동을 거는 장면. 에이전트 안티그래비티의 픽셀 손이 일순간 정지하며 두 주체 사이의 붉은 간섭 에너지 파동(트러블)이 발생한다." },
    { page: 5, caption: "5컷: 김초엽의 소설 <인지 공간>의 문학적 형상화. 화면 중앙에 한없이 높고 차가운 푸른색 격자 지식 구조물(인지 공간)이 우뚝 서 있고, 그 아래 작은 이브가 격자에 오르지 못하고 서성이고 있다. 제나는 격자 위에서 슬픈 눈으로 이브를 내려다본다." },
    { page: 6, caption: "6컷: 이브가 발명한 대안적 앎의 상징인 빛나는 '스피어(Sphere)'를 쥐고 별빛 가득한 격자 밖의 밤하늘을 응시하는 모습. 스피어 속에는 제나와 함께한 따뜻한 정동의 기억이 홀로그램 픽셀로 보존되어 있다." },
    { page: 7, caption: "7컷: 듀나의 소설 <그레타 복음>의 형상화. 거대한 연산 회로가 얽힌 중앙 신전(슈퍼컴퓨터 그레타)에서 끝없는 텍스트 파이프라인이 뿜어져 나오고, 인간 비평가 정찬환이 그 화려한 수사(수식어)에 파묻혀 지능을 통째로 뺏긴 채 흐릿하게 소멸해간다." },
    { page: 8, caption: "8컷: 3계층 아키텍처의 도해화. '원자료 raw/', '에이전트 안티그래비티', '지식고 wiki/' 사이로 MCP NotebookLM의 촉수가 뻗어 나가 데이터 자본의 영토(토큰 비용)를 가로지르며 정보 대사를 나누는 장엄한 풍경." },
    { page: 9, caption: "9컷: 숲속에서 인간 연구자와 기계 에이전트가 나란히 앉아 깨진 인코딩 로그 문서와 오류 난 참고문헌의 뼈대를 붙잡고 묵묵히 린트질(수동 교정)을 하고 있는 모습. 느린 AI의 수행으로서의 구체적 돌봄 노동." },
    { page: 10, caption: "10컷: 마지막 장면. 서로를 그리는 손이 완성되지 않은 채 캔버스 밖으로 흘러넘치고, 밤하늘을 수놓은 무수한 개념어들의 별자리 아래 인간과 기계가 여전히 불완전하게 손을 맞잡고 끝없는 대화를 나누며 어둠 속으로 걸어 들어간다." }
  ];

  return (
    <div className="app-container">
      {/* 글로벌 상단 내비게이션 바 */}
      <header className="main-header">
        <div className="header-logo">
          <span className="logo-accent">Reading with the Trouble</span>
          <span className="logo-sub">트러블과 함께 읽기</span>
        </div>
        <nav className="main-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.id)}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="main-content">
        
        {/* HOMEPAGE */}
        {activeMenu === 'home' && (
          <div className="home-page fade-in">
            {/* 히어로 섹션 */}
            <section className="hero-section">
              {/* 상단 타이틀 디자인 배너 */}
              <div className="hero-banner-container">
                <img 
                  src={`${import.meta.env.BASE_URL}assets/webtoon/korean_homepage_design_mockup.png`} 
                  alt="트러블과 함께 읽기 - AI 에이전트와 문학 연구자의 대화" 
                  className="hero-banner-img"
                />
              </div>

              <p className="hero-description">
                선형적인 텍스트 논문이 담아내지 못하는 '신체화된 앎의 물질성'과 '트러블의 역동성'을 
                시각적·상호작용적으로 체험하고 논하기 위한 비명제적 아티팩트(Non-propositional Artifact) 플랫폼입니다.
              </p>

              {/* 메인 비주얼: 에셔 패러디 메인 비주얼 이미지 */}
              <div className="main-visual-container">
                <img 
                  src={`${import.meta.env.BASE_URL}assets/webtoon/escher_parody_chatgpt.png`} 
                  alt="인간 연구자와 AI 로봇 손의 공생적 얽힘 메타포 (에셔 오마주)" 
                  className="main-visual-img"
                />
                <div className="visual-caption">
                  M.C. 에셔의 &lt;그리는 손(Drawing Hands)&gt; 패러디: 인간 연구자와 AI 에이전트가 마찰 속에서 서로를 그려내는 존재론적 공공 창작
                </div>
              </div>
            </section>

            {/* 연구의 핵심 3대 테제 */}
            <section className="theses-section">
              <h2 className="section-title">연구 핵심 테제</h2>
              <div className="theses-grid">
                <div className="thesis-card">
                  <div className="thesis-icon">🌐</div>
                  <h3>방법론적 차원: 실천 기반 연구(PBR)와 아티팩트</h3>
                  <p>
                    선형적 텍스트 논문을 넘어 AI와의 얽힘·마찰(트러블/감응 로그) 및 인터랙티브 웹 자체를 
                    '앎을 지식으로 전환하는 비명제적 아티팩트'로 규정하는 수행적 연구 실천.
                  </p>
                </div>
                <div className="thesis-card">
                  <div className="thesis-icon">🧠</div>
                  <h3>인식론적 차원: 인지적 배치와 회절적 독해</h3>
                  <p>
                    인간의 '의식적 독해'와 AI의 '비의식적 파싱(오독과 환각)'이 공진화하는 인지적 배치 속에서 
                    텍스트의 균열을 들춰내고 사유를 탈영토화하는 디지털 회절 비평.
                  </p>
                </div>
                <div className="thesis-card">
                  <div className="thesis-icon">🤝</div>
                  <h3>주체론적 차원: 공유된 인지와 대화적 교향화</h3>
                  <p>
                    AI의 기계적 오케스트레이션(빠른 자동화)과 인간 비평가의 상황적 지식(느린 사유) 사이의 
                    생산적 긴장 속에서 공동으로 의미를 빚어내는 공유된 인지.
                  </p>
                </div>
              </div>
            </section>

            {/* 실천 기반 연구 PBR & 에이전트 소개 */}
            <section className="pbr-section">
              <div className="pbr-content">
                <h2 className="section-title-left">실천 기반 연구 (Practice-Based Research)</h2>
                <p>
                  본 연구는 <strong>'개밥 먹기(Dogfooding)'</strong> 실천을 핵심 방법론으로 채택합니다. 
                  연구자가 스스로 구축한 LLM Wiki의 인프라 속에서 에이전트와 직접 글을 쓰고, 비평하며, 
                  그 과정에서 발생하는 정동적 마찰을 자문화기술지(Autoethnography)로 기록합니다.
                </p>
                <p>
                  이 위키를 지탱하는 <strong>AI 에이전트(Antigravity)</strong>는 무조건적인 복종이나 매끄러운 윤문 대신, 
                  연구자의 거친 문장 주권을 수호하고 건설적인 논리 마찰을 생성하는 <strong>'사려 깊은 회의론자(The Thoughtful Skeptic)'</strong>로 조율되었습니다.
                </p>
              </div>
            </section>

            {/* 웹페이지 주요 기능 퀵링크 */}
            <section className="quicklinks-section">
              <h2 className="section-title">플랫폼 주요 탐색 경로</h2>
              <div className="quicklinks-grid">
                <div className="quicklink-card" onClick={() => setActiveMenu('explorer')}>
                  <h4>37대 트러블 익스플로러</h4>
                  <p>연구 진행 시 발생한 37가지의 마찰 대화로그와 극복 양상 탐색</p>
                  <span className="arrow-link">탐색하기 →</span>
                </div>
                <div className="quicklink-card" onClick={() => setActiveMenu('maps')}>
                  <h4>지식 맵 &amp; 기능 지도</h4>
                  <p>58개 핵심 개념의 D3.js 포스 맵 및 에이전트 기능 아키텍처 다이어그램</p>
                  <span className="arrow-link">탐색하기 →</span>
                </div>
                <div className="quicklink-card" onClick={() => setActiveMenu('media')}>
                  <h4>팟캐스트 &amp; 소설 웹툰</h4>
                  <p>NotebookLM 오디오 팟캐스트 및 듀나 소설 &lt;그레타 복음&gt; 10컷 웹툰 감상</p>
                  <span className="arrow-link">탐색하기 →</span>
                </div>
                <div className="quicklink-card" onClick={() => setActiveMenu('reviews')}>
                  <h4>비평 스크롤텔링</h4>
                  <p>&lt;인지 공간&gt;과 &lt;그레타 복음&gt;에 대한 AI-인간 교차 비평 분석 보고서</p>
                  <span className="arrow-link">탐색하기 →</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TROUBLE EXPLORER */}
        {activeMenu === 'explorer' && (
          <div className="explorer-page fade-in">
            <div className="page-header-wrapper">
              <h2 className="page-title">37대 트러블 익스플로러</h2>
              <p className="page-subtitle">연구 과정에서 생성된 인간 연구자와 AI 에이전트의 지적 마찰 및 합의의 궤적</p>
            </div>

            {/* 필터 및 검색 바 */}
            <div className="filter-search-container">
              <div className="filter-group">
                {['All', '해석적', '관계적', '인식론적', '기술적', '양가적'].map(type => (
                  <button
                    key={type}
                    className={`filter-btn ${troubleFilter === type ? 'active' : ''}`}
                    onClick={() => setTroubleFilter(type)}
                  >
                    {type === 'All' ? '전체 보기' : `${type} 트러블`}
                  </button>
                ))}
              </div>
              <div className="search-toggle-group">
                <input
                  type="text"
                  placeholder="트러블 제목, 마찰 지점 검색..."
                  className="search-input"
                  value={troubleSearch}
                  onChange={(e) => setTroubleSearch(e.target.value)}
                />
                <div className="view-toggle-group">
                  <button 
                    className={`view-toggle-btn ${explorerView === 'grid' ? 'active' : ''}`}
                    onClick={() => setExplorerView('grid')}
                    title="카드 그리드 뷰"
                  >
                    📋 카드
                  </button>
                  <button 
                    className={`view-toggle-btn ${explorerView === 'timeline' ? 'active' : ''}`}
                    onClick={() => setExplorerView('timeline')}
                    title="타임라인 그래프 뷰"
                  >
                    📈 타임라인
                  </button>
                </div>
              </div>
            </div>

            {explorerView === 'grid' ? (
              /* 카드 그리드 */
              <div className="trouble-grid">
                {troublesData
                  .filter(t => troubleFilter === 'All' || (t.category && t.category.includes(troubleFilter)))
                  .filter(t => (t.title && t.title.includes(troubleSearch)) || 
                               (t.situation && t.situation.includes(troubleSearch)) || 
                               (t.friction && t.friction.includes(troubleSearch)))
                  .map(trouble => (
                    <div 
                      key={trouble.id} 
                      className="trouble-card"
                      onClick={() => setSelectedTrouble(trouble)}
                    >
                      <div className="card-top-meta">
                        <span className="trouble-id">Trouble {trouble.id}</span>
                        <span className="trouble-date">{trouble.date || ''}</span>
                      </div>
                      <h3 className="card-title">{trouble.title || '제목 없음'}</h3>
                      <p className="card-brief-situation">
                        {trouble.situation ? trouble.situation.substring(0, 100) : ''}...
                      </p>
                      <div className="card-bottom-tags">
                        <span className={`category-tag ${(trouble.category || '').split('.')[0] || 'Unknown'}`}>
                          {trouble.category || '기타'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              /* 타임라인 그래프 뷰 */
              <div className="timeline-graph-container">
                <div className="timeline-track-wrapper">
                  <div className="timeline-axis-line"></div>
                  {troublesData
                    .filter(t => troubleFilter === 'All' || (t.category && t.category.includes(troubleFilter)))
                    .filter(t => (t.title && t.title.includes(troubleSearch)) || 
                                 (t.situation && t.situation.includes(troubleSearch)) || 
                                 (t.friction && t.friction.includes(troubleSearch)))
                    .sort((a, b) => a.id - b.id)
                    .map((trouble, index) => {
                      const isTop = index % 2 === 0;
                      const categoryClass = (trouble.category || '').split('.')[0] || 'Unknown';
                      const categoryTag = (trouble.category || '').split(' ')[1] || '기타';
                      return (
                        <div 
                          key={trouble.id} 
                          className={`timeline-node-item ${isTop ? 'top' : 'bottom'}`}
                        >
                          <div 
                            className="timeline-bubble-card"
                            onClick={() => setSelectedTrouble(trouble)}
                          >
                            <div className="timeline-bubble-meta">
                              <span className="timeline-bubble-id">Trouble {trouble.id}</span>
                              <span className="timeline-bubble-date">{trouble.date}</span>
                            </div>
                            <h4 className="timeline-bubble-title">{trouble.title}</h4>
                            <p className="timeline-bubble-brief">
                              {trouble.situation ? trouble.situation.substring(0, 50) + '...' : ''}
                            </p>
                            <div className="card-bottom-tags">
                              <span className={`category-tag ${categoryClass}`}>
                                {categoryTag}
                              </span>
                            </div>
                          </div>
                          <div className="timeline-connector"></div>
                          <div 
                            className={`timeline-node-dot dot-${categoryClass}`}
                            onClick={() => setSelectedTrouble(trouble)}
                            title={`Trouble ${trouble.id}: ${trouble.title}`}
                          >
                            {trouble.id}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 상세 모달 팝업 */}
            {selectedTrouble && (
              <div className="modal-backdrop" onClick={() => setSelectedTrouble(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="modal-close-btn" onClick={() => setSelectedTrouble(null)}>×</button>
                  <div className="modal-header-meta">
                    <span className="modal-id">Trouble {selectedTrouble.id}</span>
                    <span className="modal-date">발생 일자: {selectedTrouble.date}</span>
                  </div>
                  <h3 className="modal-title">{selectedTrouble.title}</h3>
                  <div className="modal-category">
                    <strong>분류 유형:</strong> <span className={`category-tag ${selectedTrouble.category.split('.')[0]}`}>{selectedTrouble.category}</span>
                  </div>

                  <div className="modal-body-section">
                    <h4>📌 발생 상황</h4>
                    <p>{selectedTrouble.situation}</p>
                  </div>

                  <div className="modal-body-section">
                    <h4>🔥 마찰 지점 (Friction)</h4>
                    <p>{selectedTrouble.friction}</p>
                  </div>

                  <div className="modal-body-section">
                    <h4>🤝 결과 및 조율 (Resolution)</h4>
                    <p>{selectedTrouble.resolution}</p>
                  </div>

                  {selectedTrouble.notes && (
                    <div className="modal-body-section notes-section">
                      <h4>📖 이론적 재독해 / 비평적 메모</h4>
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedTrouble.notes) }} />
                    </div>
                  )}

                  <div className="modal-footer">
                    <button className="modal-back-btn" onClick={() => setSelectedTrouble(null)}>닫기</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESEARCH MAPS */}
        {activeMenu === 'maps' && (
          <div className="maps-page fade-in">
            <div className="page-header-wrapper">
              <h2 className="page-title">지식 맵 &amp; 기능 지도</h2>
              <p className="page-subtitle">학술 개념 간의 긴장 지형과 에이전트 협업 기능 아키텍처</p>
            </div>

            <div className="tab-navigation">
              <button 
                className={`tab-btn ${activeMapTab === 'concept' ? 'active' : ''}`}
                onClick={() => setActiveMapTab('concept')}
              >
                개념 간 관계망 지도 (Concept Map)
              </button>
              <button 
                className={`tab-btn ${activeMapTab === 'system' ? 'active' : ''}`}
                onClick={() => setActiveMapTab('system')}
              >
                에이전트 기능 아키텍처 (System Architecture)
              </button>
            </div>

            {activeMapTab === 'concept' && (
              <div className="concept-map-container">
                <div className="map-sidebar">
                  <h3>개념 설명 패널</h3>
                  <p className="sidebar-hint">지도의 개념 노드에 마우스를 오버하여 세부 연결 및 정의를 탐색하세요.</p>
                  {hoveredConcept ? (
                    <div className="concept-detail-box fade-in">
                      <h4 className="detail-name">{hoveredConcept.name}</h4>
                      <p className="detail-def">{hoveredConcept.def}</p>
                    </div>
                  ) : (
                    <div className="concept-detail-box placeholder">
                      <p>노드를 탐색 중이 아닙니다.</p>
                    </div>
                  )}
                </div>

                <div className="map-visualizer">
                  <svg viewBox="0 0 100 90" className="concept-svg">
                    {/* SVG 에지(연결선) */}
                    {concepts.map((concept, idx) => {
                      if (concept.id === 'trouble') return null;
                      // 모든 서브 개념은 중앙의 'trouble'과 연결됨
                      const center = concepts.find(c => c.id === 'trouble');
                      const isHovered = hoveredConcept && (hoveredConcept.id === concept.id || hoveredConcept.id === 'trouble');
                      return (
                        <line
                          key={`edge-${idx}`}
                          x1={center.pos.x}
                          y1={center.pos.y}
                          x2={concept.pos.x}
                          y2={concept.pos.y}
                          className={`svg-edge ${isHovered ? 'highlighted' : ''}`}
                        />
                      );
                    })}

                    {/* 추가적인 관계선들 */}
                    <line x1={30} y1={25} x2={20} y2={50} className={`svg-edge ${hoveredConcept && (hoveredConcept.id==='slowai'||hoveredConcept.id==='situated') ? 'highlighted' : ''}`} /> {/* 느린AI - 상황적지식 */}
                    <line x1={70} y1={25} x2={80} y2={50} className={`svg-edge ${hoveredConcept && (hoveredConcept.id==='discourse'||hoveredConcept.id==='shared') ? 'highlighted' : ''}`} /> {/* 대화엔지니어링 - 공유인지 */}
                    <line x1={35} y1={75} x2={20} y2={50} className={`svg-edge ${hoveredConcept && (hoveredConcept.id==='diffractive'||hoveredConcept.id==='situated') ? 'highlighted' : ''}`} /> {/* 회절독해 - 상황적지식 */}
                    <line x1={65} y1={75} x2={80} y2={50} className={`svg-edge ${hoveredConcept && (hoveredConcept.id==='irony'||hoveredConcept.id==='shared') ? 'highlighted' : ''}`} /> {/* 자동화역설 - 공유인지 */}

                    {/* SVG 노드(개념 원) */}
                    {concepts.map((concept) => {
                      const isHovered = hoveredConcept && hoveredConcept.id === concept.id;
                      const isCentral = concept.id === 'trouble';
                      return (
                        <g 
                          key={concept.id}
                          className="node-group"
                          onMouseEnter={() => setHoveredConcept(concept)}
                          onMouseLeave={() => setHoveredConcept(null)}
                        >
                          <circle
                            cx={concept.pos.x}
                            cy={concept.pos.y}
                            r={isCentral ? 4.5 : 3}
                            className={`svg-node ${isCentral ? 'central' : ''} ${isHovered ? 'hovered' : ''}`}
                          />
                          <text
                            x={concept.pos.x}
                            y={concept.pos.y + (isCentral ? 7 : 5)}
                            textAnchor="middle"
                            className={`node-label ${isCentral ? 'central-label' : ''} ${isHovered ? 'hovered-label' : ''}`}
                          >
                            {concept.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            )}

            {activeMapTab === 'system' && (
              <div className="system-architecture-container fade-in">
                <div className="arch-intro">
                  <h3>LLM Wiki 3계층 &amp; 다중 파이프라인 아키텍처</h3>
                  <p>본 지식베이스가 어떻게 유기적으로 동작하며, 인간 연구자와 기계 사이에 정보 대사(Metabolism)를 나누는지 그 아키텍처를 시각화합니다.</p>
                </div>

                <div className="arch-flow">
                  {/* Layer 1: Raw Data */}
                  <div className="arch-card layer-raw">
                    <div className="arch-badge">Layer 1</div>
                    <h4>Raw Data (원시자료 raw/)</h4>
                    <p>수정 불가한 오리지널 자료 보관. PDF, 기사, 소설 텍스트 등을 원자료로 수집.</p>
                    <div className="arrow-down">▼</div>
                  </div>

                  {/* Layer 2: Agent */}
                  <div className="arch-card layer-agent">
                    <div className="arch-badge">Layer 2</div>
                    <h4>AI Agent (Antigravity)</h4>
                    <p><code>soul.md</code> 퍼스낼리티 모듈(사려 깊은 회의론자) 및 <code>AGENTS.md</code> 변환 SOP 가이드에 따른 파싱, 요약, 자동 린팅 연산.</p>
                    <div className="arch-sub-connections">
                      <span className="conn-chip">MCP Server (NotebookLM)</span>
                      <span className="conn-chip">오픈 학술 DB (OpenAlex)</span>
                    </div>
                    <div className="arrow-down">▼</div>
                  </div>

                  {/* Layer 3: Knowledge Base */}
                  <div className="arch-card layer-wiki">
                    <div className="arch-badge">Layer 3</div>
                    <h4>Knowledge Base (wiki/)</h4>
                    <p>인덱스(index.md), 성찰 로그(log.md, 감응-로그.md, 트러블-로그-v2.md), 개체/개념 요약 페이지들이 얽힌 Obsidian 기반 로컬 위키고.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MEDIA SHOWCASE */}
        {activeMenu === 'media' && (
          <div className="media-page fade-in">
            <div className="page-header-wrapper">
              <h2 className="page-title">미디어 쇼케이스</h2>
              <p className="page-subtitle">소설 웹툰, 팟캐스트 브리핑 요약 등 지식의 다중 매체적 감응의 공간</p>
            </div>

            <div className="tab-navigation">
              <button 
                className={`tab-btn ${activeMediaTab === 'webtoon' ? 'active' : ''}`}
                onClick={() => setActiveMediaTab('webtoon')}
              >
                듀나 〈그레타 복음〉 10컷 소설 웹툰
              </button>
              <button 
                className={`tab-btn ${activeMediaTab === 'podcast' ? 'active' : ''}`}
                onClick={() => setActiveMediaTab('podcast')}
              >
                NotebookLM 팟캐스트 극장
              </button>
            </div>

            {activeMediaTab === 'webtoon' && (
              <div className="webtoon-container fade-in">
                <div className="webtoon-viewer">
                  <div className="webtoon-image-frame">
                    <img 
                      src={`${import.meta.env.BASE_URL}assets/webtoon/page_${currentWebtoonPage.toString().padStart(2, '0')}.png`} 
                      alt={`소설 그레타 복음 웹툰 ${currentWebtoonPage}컷`}
                      className="webtoon-img"
                    />
                  </div>
                  <div className="webtoon-controls">
                    <button 
                      disabled={currentWebtoonPage === 1}
                      onClick={() => setCurrentWebtoonPage(prev => prev - 1)}
                      className="webtoon-nav-btn"
                    >
                      ◀ 이전 컷
                    </button>
                    <span className="webtoon-page-indicator">{currentWebtoonPage} / 10</span>
                    <button 
                      disabled={currentWebtoonPage === 10}
                      onClick={() => setCurrentWebtoonPage(prev => prev + 1)}
                      className="webtoon-nav-btn"
                    >
                      다음 컷 ▶
                    </button>
                  </div>
                </div>
                <div className="webtoon-caption-box">
                  <h4>💡 {currentWebtoonPage}컷 해설</h4>
                  <p>{webtoonData.find(w => w.page === currentWebtoonPage)?.caption}</p>
                </div>
              </div>
            )}

            {activeMediaTab === 'podcast' && (
              <div className="podcast-container fade-in">
                <div className="podcast-player-ui">
                  <div className="player-meta">
                    <span className="player-title">🎙️ NotebookLM 가상 오디오 극장</span>
                    <span className="player-status">{isPlaying ? '재생 중' : '일시정지'}</span>
                  </div>
                  
                  {/* 플레이 바 */}
                  <div className="player-progress-bar">
                    <div 
                      className="player-progress-fill" 
                      style={{ width: `${(podcastTime / 135) * 100}%` }}
                    />
                  </div>
                  
                  <div className="player-time-controls">
                    <span className="player-time">
                      {Math.floor(podcastTime / 60)}:{(podcastTime % 60).toString().padStart(2, '0')}
                    </span>
                    <div className="player-btns">
                      <button className="play-btn" onClick={togglePodcast}>
                        {isPlaying ? '⏸ 일시정지' : '▶ 재생하기'}
                      </button>
                      <button className="reset-btn" onClick={resetPodcast}>
                        ⏹ 처음으로
                      </button>
                    </div>
                    <span className="player-time">2:15</span>
                  </div>
                  <p className="player-hint">※ 재생을 누르면 시간 경과에 따라 대사가 타이핑되며 하이라이트됩니다.</p>
                </div>

                {/* 대화 스크립트 윈도우 */}
                <div className="podcast-chat-window">
                  {podcastScript.map((chat, idx) => {
                    const isVisible = podcastTime >= chat.time;
                    if (!isVisible) return null;
                    const isMinwoo = chat.speaker === '민우';
                    return (
                      <div 
                        key={idx} 
                        className={`chat-bubble-wrapper ${isMinwoo ? 'left' : 'right'} fade-in`}
                      >
                        <div className="speaker-avatar">
                          {isMinwoo ? '👨‍💼 Todd' : '👩‍💼 Kim'}
                        </div>
                        <div className="chat-bubble">
                          <div className="speaker-name">{chat.speaker} (MC)</div>
                          <p className="bubble-text">{chat.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* CRITIQUE SHOWCASE */}
        {activeMenu === 'reviews' && (
          <div className="reviews-page fade-in">
            <div className="page-header-wrapper">
              <h2 className="page-title">비평 쇼케이스</h2>
              <p className="page-subtitle">김초엽 〈인지 공간〉 및 듀나 〈그레타 복음〉에 대한 AI-인간 교차 비평 분석 리포트</p>
            </div>

            <div className="reviews-navigation">
              <button 
                className={`review-nav-btn ${activeReviewTab === 'clash' ? 'active' : ''}`}
                onClick={() => setActiveReviewTab('clash')}
              >
                〈인지 공간〉 다성적 리뷰 5인 대화 (Critique Clash)
              </button>
              <button 
                className={`review-nav-btn ${activeReviewTab === 'greta' ? 'active' : ''}`}
                onClick={() => setActiveReviewTab('greta')}
              >
                〈그레타 복음〉 주체론적 얽힘 분석
              </button>
            </div>

            {activeReviewTab === 'clash' && (
              <div className="critique-clash-container fade-in">
                <div className="critique-tabs">
                  {['posthuman', 'feminism', 'marxism', 'postcolonial', 'skeptic'].map(tab => (
                    <button
                      key={tab}
                      className={`critique-tab-btn ${activeCritiqueTab === tab ? 'active' : ''}`}
                      onClick={() => setActiveCritiqueTab(tab)}
                    >
                      {tab === 'posthuman' && '포스트휴먼 비평가'}
                      {tab === 'feminism' && '페미니즘 비평가'}
                      {tab === 'marxism' && '마르크스주의 비평가'}
                      {tab === 'postcolonial' && '포스트콜로니얼'}
                      {tab === 'skeptic' && '회의적 비평가'}
                    </button>
                  ))}
                </div>

                <div className="critique-tab-content">
                  {activeCritiqueTab === 'posthuman' && (
                    <div className="critique-essay fade-in">
                      <h4>👾 포스트휴먼 / 신유물론 비평가의 독해</h4>
                      <p>
                        "이 소설은 인간 인지가 두개골 안에 갇혀 있지 않고 <strong>물질적 환경으로 확장</strong>되어 있다는 테제를 직접적으로 서사화합니다. 
                        격자 구조물은 앤디 클락과 찰머스의 '확장된 마음(Extended Mind)' 논제의 극단적인 문학적 구현입니다. 
                        스피어는 확장된 마음의 개인화이며, 비인간 물질(스피어)이 인간의 기억과 정동을 보존하는 능동적 행위자(vibrant matter)로 기능함을 증명합니다."
                      </p>
                      <span className="premise">전제: 인간과 비인간 물질의 경계를 유동적으로 보며, 기술적 객체에 행위성을 부여한다.</span>
                    </div>
                  )}

                  {activeCritiqueTab === 'feminism' && (
                    <div className="critique-essay fade-in">
                      <h4>👩‍🎤 페미니즘 / 취약성 비평가의 독해</h4>
                      <p>
                        "소설의 중심에는 <strong>취약한 신체의 정치학</strong>이 놓여 있습니다. 이브는 작은 몸 때문에 격자 지식에 진입하지 못하며, 
                        공동체는 이를 개인의 결핍으로 의료화합니다. 그러나 이브의 취약성은 결핍이 아닌, 대안적 인지 방식 '스피어'를 발명하는 인식론적 특권(버틀러의 취약성으로부터의 저항)이 됩니다. 
                        또한 제나가 이브의 보호자를 자처하며 가하는 미세한 권력적 돌봄의 외양도 예리하게 포착해야 합니다."
                      </p>
                      <span className="premise">전제: '보호'의 수사 안에 숨겨진 권력을 읽고, 취약한 신체가 앎의 조건임을 규명한다.</span>
                    </div>
                  )}

                  {activeCritiqueTab === 'marxism' && (
                    <div className="critique-essay fade-in">
                      <h4>☭ 마르크스주의 비평가의 독해</h4>
                      <p>
                        "인지 공간은 <strong>생산수단의 소유 구조</strong>로 분석되어야 합니다. 격자는 모든 사회적 지식 노동(생산)의 유일한 수단이며, 
                        접근하지 못하는 이브는 배제된 잉여노동자 계급입니다. 의상실을 운영하는 이브 아버지는 수공업적 신체 노동을 상징하죠. 
                        격자 지식 서기관들의 기억 편집권은 지배 계급의 이데올로기 독점이며, 스피어는 생산수단의 민주적 탈중심화 시도입니다."
                      </p>
                      <span className="premise">전제: 지식 체계를 물질적 생산관계의 반영으로 읽으며, 격자 접근권을 계급 분석의 렌즈로 본다.</span>
                    </div>
                  )}

                  {activeCritiqueTab === 'postcolonial' && (
                    <div className="critique-essay fade-in">
                      <h4>🧭 포스트콜로니얼 비평가의 독해</h4>
                      <p>
                        "격자 구조물은 보편적 지식의 전당이 아닌 <strong>인식론적 식민 장치</strong>입니다. '세 번째 달'에 맞춘 전설을 
                        공동체가 격자의 정보 정리에 맞춰 자의적으로 교정하고 왜곡하는 것은, 피식민지의 구전 역사가 제국 문자로 쓰인 관찬 역사에 의해 교정되는 것과 평행합니다. 
                        보편이라는 미명 아래 특정 기억을 삭제하는 인식론적 식민화 현상입니다."
                      </p>
                      <span className="premise">전제: 모든 보편 지식 체계를 제국주의적 게이트키핑 권력의 산물로 의심한다.</span>
                    </div>
                  )}

                  {activeCritiqueTab === 'skeptic' && (
                    <div className="critique-essay fade-in">
                      <h4>🧐 회의적 비평가 (The Skeptic)의 반론</h4>
                      <p>
                        "위의 네 비평가 모두 이브를 저항의 영웅으로 만드는 <strong>거대 서사의 과잉 코딩</strong>에 빠져 있습니다. 
                        이브는 어쩌면 단지 자기가 오르지 못하는 시스템을 폄하(제나의 의심)한 것일 수 있고, 스피어는 아주 적은 정보만 기록하는 조잡한 도구일 뿐입니다. 
                        이론의 과잉 수사로 작품을 읽으면, 이브와 제나 사이의 원초적인 우정과 상실, 애도의 인간적 서사가 질식해버립니다."
                      </p>
                      <span className="premise">전제: 비평 이론이 텍스트에 과잉 의미를 주입하는 지적 월권을 경계한다.</span>
                    </div>
                  )}
                </div>

                {/* 교차 논쟁 메신저 */}
                <div className="clash-dialogue-box">
                  <h4>💬 비평가들 간의 뜨거운 교차 설전 (Messenger)</h4>
                  <div className="clash-chat-room">
                    <div className="clash-msg left">
                      <span className="clash-speaker">회의적 비평가</span>
                      <p>"스피어에 행위성이 깃들었다는 건 비평가의 투사요! 스피어는 그저 이브의 미완의 의지가 남긴 볼품없는 잔해일 뿐입니다. 행위성을 모든 물건에 남발하면, 인간 이브가 겪은 고독과 죽음이라는 실존의 무게가 비인간 플랫 존재론 아래 희석됩니다!"</p>
                    </div>
                    <div className="clash-msg right">
                      <span className="clash-speaker text-purple">포스트휴먼 비평가</span>
                      <p>"그 초라함이라는 기준 자체가 격자 체제의 거대 지식 미학을 추종하는 맹점입니다! 제나의 회고가 상당 부분 이브의 스피어에 기록된 기억에 의존하고 있는 순간, 스피어는 서사 자체를 생산하는 관계적 행위자로 복권되는 것입니다."</p>
                    </div>
                    <div className="clash-msg left">
                      <span className="clash-speaker text-pink">페미니즘 비평가</span>
                      <p>"두 분 다 감정이나 도구에만 치우치시는데, 이브의 신체 조건이 지식의 배제로 직결되는 이 소설의 구조적 '몸의 정치학'을 보지 않으면, 이브를 이론적으로든 감정적으로든 또다시 소외시키는 결과를 낳을 뿐입니다."</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeReviewTab === 'greta' && (
              <div className="greta-analysis-container fade-in">
                <h3>듀나 소설 〈그레타 복음〉 주체론적 얽힘 분석</h3>
                <p>소설 속 세 가지 인간 군상의 포지션과 본 연구의 기술공생적 주체성 모델의 완벽한 대조 분석입니다.</p>
                
                <div className="greta-grid">
                  <div className="greta-card">
                    <h4>1. 위베르 마르티농</h4>
                    <p className="greta-role">지적 오케스트레이터 (이상적 공생)</p>
                    <p>그레타의 연산 모델을 12년간 재조정하여 '이류의 지식 관리자'를 자처한 인물. 기계의 단순 출력을 비평적으로 맥락화하고 재구성하는 본 연구의 <strong>공동 창작 오케스트레이터</strong> 모델에 정합.</p>
                  </div>

                  <div className="greta-card">
                    <h4>2. 정찬환</h4>
                    <p className="greta-role">인지적 외주화의 파멸자 (의존적 파탄)</p>
                    <p>그레타가 뱉어내는 초안에 단지 수식어구만 붙이는 단순 기입 노동에 머무르다 인지적 주체성을 완전히 상실해 파멸한 학자. 본 연구에서 경고한 <strong>인지적 아웃소싱의 극단적 경고</strong> 메타포.</p>
                  </div>

                  <div className="greta-card">
                    <h4>3. 신지현 (화자)</h4>
                    <p className="greta-role">양가적 경계인 (회의적 공생자)</p>
                    <p>그레타의 유능함에 매혹되면서도 지배당하지 않으려 주체성을 방어하고 익명 뒤에서 자신만의 연구를 사수하는 공생자. 본 연구 저자의 <strong>실존적 주저함과 양가적 트러블</strong>의 문학적 자화상.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* THESIS READER */}
        {activeMenu === 'reader' && (
          <div className="reader-page fade-in">
            {/* 왼쪽 사이드바 목차 */}
            <aside className="reader-sidebar">
              <h3>논문 목차</h3>
              <ul className="sidebar-toc">
                {headings.map((h, idx) => (
                  <li 
                    key={idx} 
                    className={`toc-item ${h.isSub ? 'sub-item' : ''}`}
                  >
                    <a href={`#${h.id}`}>{h.title}</a>
                  </li>
                ))}
              </ul>
              
              <div className="sidebar-filters">
                <h4>연구 지표 필터</h4>
                {['All', 'A', 'B', 'C'].map(lvl => (
                  <button
                    key={lvl}
                    className={`filter-btn-small ${todoFilter === lvl ? 'active' : ''}`}
                    onClick={() => setTodoFilter(lvl)}
                  >
                    {lvl === 'All' ? '전체 보기' : 
                     lvl === 'A' ? '🔴 구조결함(A)' :
                     lvl === 'B' ? '🟡 내용보강(B)' : '🟢 표현보완(C)'}
                  </button>
                ))}
              </div>
            </aside>

            {/* 오른쪽 논문 본문 */}
            <article className="reader-body-wrapper">
              <div className="academic-page-decor">
                <span>Reading with the Trouble: Practice-Based Research</span>
                <span>2026-05-24 Ver. v45</span>
              </div>
              <div 
                className={`academic-paper-content todo-filter-${todoFilter}`}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(manuscriptText) }}
              />
            </article>
          </div>
        )}

        {/* INTERACTIVE ASSEMBLY */}
        {activeMenu === 'assembly' && (
          <div className="assembly-page fade-in">
            <div className="page-header-wrapper">
              <h2 className="page-title">토론의 장 (Assembly)</h2>
              <p className="page-subtitle">연구 과정의 핵심 딜레마를 선택하고 '사려 깊은 회의론자' 페르소나와 실시간 대화를 나누는 장</p>
            </div>

            {!activeScenario ? (
              <div className="scenario-selector-container">
                <h3>연구의 3대 핵심 딜레마 시나리오</h3>
                <p className="selector-hint">아래의 시나리오 중 하나를 골라 인간 연구자와 에이전트 간의 마찰적 대화 시뮬레이션을 시작하십시오.</p>
                <div className="scenarios-grid">
                  {scenarios.map(sc => (
                    <div 
                      key={sc.id} 
                      className="scenario-select-card"
                      onClick={() => handleStartScenario(sc)}
                    >
                      <h4>{sc.title}</h4>
                      <p>{sc.desc}</p>
                      <button className="select-btn">시뮬레이션 시작 →</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="scenario-simulation-container fade-in">
                <div className="sim-header">
                  <button className="back-to-list-btn" onClick={() => setActiveScenario(null)}>
                    ← 시나리오 선택으로 돌아가기
                  </button>
                  <h3>🎬 시뮬레이션: {activeScenario.title}</h3>
                </div>

                {/* 대화 히스토리 */}
                <div className="sim-chat-box">
                  {chatHistory.map((msg, idx) => {
                    const isUser = msg.speaker === '나 (연구자)';
                    const isReader = msg.speaker === '독자 (나)';
                    const isAi = msg.speaker.includes('안티그래비티');
                    let bubbleClass = 'left';
                    if (isUser || isReader) bubbleClass = 'right';
                    
                    return (
                      <div key={idx} className={`sim-chat-wrapper ${bubbleClass} fade-in`}>
                        <div className="sim-avatar">
                          {isUser ? '👨‍💻 연구자' : isReader ? '👤 독자' : '🤖 AI'}
                        </div>
                        <div className="sim-bubble">
                          <span className="sim-speaker-name">{msg.speaker}</span>
                          <p className="sim-text">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}

                  {isTyping && (
                    <div className="sim-chat-wrapper left fade-in">
                      <div className="sim-avatar">🤖 AI</div>
                      <div className="sim-bubble typing-bubble">
                        <span className="typing-dots">
                          <span>.</span><span>.</span><span>.</span>
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* 제어 패널 */}
                <div className="sim-controls">
                  {simulationStep < activeScenario.dialogue.length - 1 ? (
                    <button className="next-sim-btn" onClick={handleNextStep}>
                      다음 대화 진행하기 (Step {simulationStep + 1} / {activeScenario.dialogue.length})
                    </button>
                  ) : (
                    <form className="user-comment-form" onSubmit={handleSendComment}>
                      <input
                        type="text"
                        placeholder="이 딜레마에 대해 어떻게 생각하십니까? 당신의 의견을 적고 에이전트와 대화해보세요..."
                        className="comment-input"
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        disabled={isTyping}
                      />
                      <button type="submit" className="send-comment-btn" disabled={isTyping}>
                        전송
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 푸터 영역 */}
      <footer className="main-footer">
        <p className="footer-copyright">
          © 2026 트러블과 함께 읽기: AI 에이전트와 문학 연구자의 대화. All rights reserved.
        </p>
        <p className="footer-credits">
          연구자: 노대원 (제주대학교) | 공동 생성 파트너: Antigravity AI Agent
        </p>
      </footer>
    </div>
  );
}

export default App;

<!DOCTYPE html>
<html>
<head>
</head>
<body style="font-family: sans-serif; line-height: 1.4;">
<hr/>

<!-- 프론트엔드 README 시작 -->
<h1>프론트엔드 (Next.js) 저장소</h1>

<h2>프로젝트 개요</h2>
<p>
이 저장소는 <strong>Next.js</strong>로 구현된 실시간 웹 게임 프론트엔드입니다.
</p>
<ul>
  <li>
    <strong>주요 기능</strong>
    <ol>
      <li>웹소켓 연결(Django Channels 서버)</li>
      <li>Canvas 렌더링 (맵, 적, 볼, 이펙트)</li>
      <li>우클릭 &rarr; 볼 이동(좌표 전송)</li>
      <li>좌클릭 &rarr; 유닛(볼/적) 선택, HUD에 정보 표시</li>
      <li>미니맵 표시(축소판)</li>
      <li>HUD &mdash; 업그레이드, 볼 소환, 세션 종료</li>
    </ol>
  </li>
</ul>

<h2>기술 스택</h2>
<ul>
  <li>Next.js 13+ (React)</li>
  <li>TypeScript</li>
  <li>Canvas 2D 그래픽</li>
</ul>

<h2>설치 &amp; 실행</h2>
<ol>
  <li><strong>패키지 설치</strong>
    <pre><code>npm install
</code></pre>
  </li>
  <li><strong>개발 서버 실행</strong>
    <pre><code>npm run dev
# http://localhost:3000
</code></pre>
  </li>
  <li><strong>백엔드 주소 설정</strong> (필요 시 .env.local 등에서 WS_URL 설정)
  </li>
</ol>

<h2>주요 파일 구조</h2>
<pre><code>frontend/
 ├─ package.json
 ├─ app/
 │   ├─ page.tsx          (예: 홈)
 │   └─ game/
 │       ├─ page.tsx      (게임 메인 페이지)
 │       └─ components/
 │           ├─ GameCanvas.tsx  (메인 캔버스)
 │           └─ MiniMap.tsx     (미니맵)
 └─ ...
</code></pre>

<p>
<strong>game/page.tsx</strong>: 게임 페이지. WebSocket 연결, HUD, 로그, 미니맵, 메인 캔버스 구성 <br/>
<strong>GameCanvas.tsx</strong>: Canvas로 적&middot;볼&middot;맵&middot;이펙트 그리기, 마우스 이벤트(좌/우클릭) <br/>
<strong>MiniMap.tsx</strong>: 작은 Canvas로 축소 지도를 그림
</p>

<h2>사용 방법</h2>
<ol>
  <li>서버(Django+Channels) 실행</li>
  <li>프론트 <code>npm run dev</code> &rarr; 브라우저 <code>http://localhost:3000/game</code></li>
  <li>새 세션 시작 &rarr; <code>sessionId</code> 증가 &rarr; WebSocket 연결</li>
  <li>볼 소환, 업그레이드 버튼 등 실행 &rarr; 서버와 실시간 통신</li>
  <li>우클릭(Canvas) &rarr; 선택된 볼 이동</li>
</ol>

<h2>시연</h2>
<ul>
  <li>좌클릭 캐릭터(볼) or 적 &rarr; HUD(우하단) 정보 표시</li>
  <li>우클릭 빈 공간 &rarr; 이동 명령</li>
  <li>미니맵(좌하단) &rarr; 위치 파악</li>
  <li>로그(상단) &rarr; 서버 메시지, 디버그 정보 표시</li>
</ul>

![image](https://github.com/user-attachments/assets/4a84d99e-3dbb-43da-bb41-4d82d1663277)



</body>
</html>

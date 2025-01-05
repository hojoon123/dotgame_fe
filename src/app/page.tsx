// app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ padding: 30 }}>
      <h1>메인 페이지</h1>
      <p>간단한 데모를 위해 아래 페이지를 이동해보세요.</p>
      <div style={{ marginTop: 20 }}>
        <Link href="/register" style={{ marginRight: 10 }}>
          회원가입
        </Link>
        <Link href="/login" style={{ marginRight: 10 }}>
          로그인
        </Link>
        <Link href="/game">
          게임 페이지
        </Link>
      </div>
    </div>
  );
}

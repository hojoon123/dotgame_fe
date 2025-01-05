// services/api/types.ts

// 회원가입/로그인
export interface RegisterResponse {
  detail: string;
}

export interface LoginResponse {
  refresh: string;
  access: string;
  user_id: number;
  username: string;
}

// 세션 시작/종료
export interface StartSessionResponse {
  message: string;
  session_id: number;
}
export interface EndSessionResponse {
  message: string;
}
export interface SummonBallResponse {
  message: string;
  ball_count?: number;
}
export interface SpawnEnemyResponse {
  message: string;
  enemies: string[];
}
export interface UpgradeColorResponse {
  message: string;
}
export interface AttackResponse {
  message: string;
  attacked_enemies?: string[];
  killed_enemies?: string[];
}

// services/api/gameApi.ts
import apiClient from "./client";
import {
  AttackResponse,
  EndSessionResponse,
  SpawnEnemyResponse,
  StartSessionResponse,
  SummonBallResponse,
  UpgradeColorResponse,
} from "./types";

// 1) 게임 세션 시작
export async function startGameSession(userId: number): Promise<StartSessionResponse> {
  const resp = await apiClient.post("/game/start_game_session/", { user_id: userId });
  return resp.data; // { message, session_id }
}

// 2) 게임 세션 종료
export async function endGameSession(sessionId: number): Promise<EndSessionResponse> {
  const resp = await apiClient.post("/game/end_game_session/", { session_id: sessionId });
  return resp.data; // { message: "..."}
}

// 3) 볼 소환
//  - 바디: { session_id }
//  - 서버가 color/rarity를 랜덤 pick
export async function summonBall(sessionId: number): Promise<SummonBallResponse> {
  const resp = await apiClient.post("/game/summon_ball/", { session_id: sessionId });
  return resp.data; // { message, ball_count }
}

// 4) 적 소환
//  - 바디: { session_id, stage }
export async function spawnEnemy(sessionId: number, stage: number): Promise<SpawnEnemyResponse> {
  const resp = await apiClient.post("/game/spawn_enemy/", {
    session_id: sessionId,
    stage,
  });
  return resp.data; // { message, enemies }
}

// 5) 업그레이드
//  - 바디: { session_id, color }
export async function upgradeColor(sessionId: number, color: string): Promise<UpgradeColorResponse> {
  const resp = await apiClient.post("/game/upgrade_color/", { session_id: sessionId, color });
  return resp.data; // { message }
}

// 6) 공격
//  - 바디: { session_id }
export async function attack(sessionId: number): Promise<AttackResponse> {
  const resp = await apiClient.post("/game/attack/", { session_id: sessionId });
  return resp.data; // { message, attacked_enemies, killed_enemies }
}
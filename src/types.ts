/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'admin' | 'player';

export interface Player {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  joinedAt: string;
}

export type MatchStatus = 'open' | 'closed' | 'finished';
export type BetChoice = 'home' | 'draw' | 'away';

export interface Match {
  id: string;
  index: number;
  group: string; // e.g. "Bảng A"
  date: string; // e.g. "09:00 Th 6, 12/06"
  teamHome: string;
  teamAway: string;
  teamHomeCode: string; // for flag display
  teamAwayCode: string; // for flag display
  stadium: string;
  status: MatchStatus;
  rateValue: number; // e.g., 5000
  rateUnit: string; // e.g., "đ / trận thua"
  handicapTitle: string; // e.g., "Canada chấp 1 bàn"
  handicapDesc: string; // e.g., "Canada phải thắng hơn 1 bàn để..."
  isAboutToPlay?: boolean; // Label "Sắp đá"
  scoreHome?: number;
  scoreAway?: number;
  result?: BetChoice; // 'home', 'draw', or 'away'
}

export interface PlayerBet {
  id: string;
  matchId: string;
  playerId: string;
  choice: BetChoice;
  timestamp: string;
}

export interface DepartmentNotification {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'update';
}

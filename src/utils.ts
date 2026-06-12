/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match, Player, PlayerBet } from './types';

export const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return '🏳️';
  }
};

// Specialized flag lookup for teams in the image helper
export const getTeamFlag = (teamName: string, countryCode: string): string => {
  const lowerName = teamName.toLowerCase().trim();
  if (lowerName.includes('south korea') || lowerName.includes('hàn quốc')) return '🇰🇷';
  if (lowerName.includes('czechia') || lowerName.includes('séc')) return '🇨🇿';
  if (lowerName.includes('canada')) return '🇨🇦';
  if (lowerName.includes('bosnia')) return '🇧🇦';
  if (lowerName.includes('united states') || lowerName.includes('mỹ') || lowerName.includes('america')) return '🇺🇸';
  if (lowerName.includes('paraguay')) return '🇵🇾';
  if (lowerName.includes('haiti')) return '🇭🇹';
  if (lowerName.includes('scotland')) return '🏴󠁧󠁢󠁳󠁣󠁴󠁿';
  if (lowerName.includes('australia') || lowerName.includes('úc')) return '🇦🇺';
  if (lowerName.includes('turkiye') || lowerName.includes('thổ nhĩ kỳ') || lowerName.includes('turkey')) return '🇹🇷';
  if (lowerName.includes('vietnam') || lowerName.includes('việt nam')) return '🇻🇳';
  if (lowerName.includes('indonesia')) return '🇮🇩';
  if (lowerName.includes('ecuador')) return '🇪🇨';
  if (lowerName.includes('qatar')) return '🇶🇦';
  return getFlagEmoji(countryCode || 'UN');
};

export interface BalanceSummary {
  playerId: string;
  playerName: string;
  avatar: string;
  totalBets: number;
  correctBets: number;
  incorrectBets: number;
  pendingBets: number;
  points: number; // calculated as correctBets * 1
}

/**
 * Calculates current standing statistics and points for each player based on finalized matches
 */
export const calculatePlayerStandings = (
  players: Player[],
  matches: Match[],
  bets: PlayerBet[]
): BalanceSummary[] => {
  const finishedMatches = matches.filter(m => m.status === 'finished');
  const pendingMatches = matches.filter(m => m.status !== 'finished');

  return players.map(player => {
    // Collect bets for this player
    const playerBets = bets.filter(b => b.playerId === player.id);

    let correct = 0;
    let incorrect = 0;
    let pending = 0;

    playerBets.forEach(bet => {
      const match = matches.find(m => m.id === bet.matchId);
      if (!match) return;

      if (match.status === 'finished') {
        if (match.result === bet.choice) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        pending++;
      }
    });

    const points = correct * 1;

    return {
      playerId: player.id,
      playerName: player.name,
      avatar: player.avatar,
      totalBets: playerBets.length,
      correctBets: correct,
      incorrectBets: incorrect,
      pendingBets: pending,
      points
    };
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(amount)
    .replace('₫', 'đ');
};

export const formatPoints = (points: number): string => {
  return `${points} điểm`;
};

export interface WeekInfo {
  weekNum: number;
  label: string;
}

/**
 * Maps a match date string to the corresponding betting week chốt vào thứ 6 hàng tuần
 */
export const getMatchWeek = (dateStr: string): WeekInfo => {
  const match = dateStr.match(/(\d{2})\/(\d{2})/);
  if (!match) {
    return { weekNum: 1, label: 'Tuần 1 (Chốt Thứ 6, 12/06)' };
  }
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);

  // In Year 2026:
  // Week 1: Up to 12/06 (Friday)
  // Week 2: 13/06 (Saturday) to 19/06 (Friday)
  // Week 3: 20/06 (Saturday) to 26/06 (Friday)
  // Week 4: 27/06 (Saturday) to 03/07 (Friday)
  // Week 5: 04/07 (Saturday) to 10/07 (Friday)
  // Week 6: 11/07 (Saturday) to 17/07 (Friday)
  
  if (month === 6) {
    if (day <= 12) {
      return { weekNum: 1, label: 'Tuần 1 (Chốt Thứ 6, 12/06)' };
    } else if (day <= 19) {
      return { weekNum: 2, label: 'Tuần 2 (Chốt Thứ 6, 19/06)' };
    } else if (day <= 26) {
      return { weekNum: 3, label: 'Tuần 3 (Chốt Thứ 6, 26/06)' };
    } else {
      return { weekNum: 4, label: 'Tuần 4 (Chốt Thứ 6, 03/07)' };
    }
  } else if (month === 7) {
    if (day <= 3) {
      return { weekNum: 4, label: 'Tuần 4 (Chốt Thứ 6, 03/07)' };
    } else if (day <= 10) {
      return { weekNum: 5, label: 'Tuần 5 (Chốt Thứ 6, 10/07)' };
    } else if (day <= 17) {
      return { weekNum: 6, label: 'Tuần 6 (Chốt Thứ 6, 17/07)' };
    } else {
      return { weekNum: 7, label: 'Tuần 7 (Chốt Thứ 6, 24/07)' };
    }
  }

  return { weekNum: 1, label: 'Tuần 1 (Chốt Thứ 6, 12/06)' };
};


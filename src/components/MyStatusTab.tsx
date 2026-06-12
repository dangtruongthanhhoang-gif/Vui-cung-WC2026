/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Player, Match, PlayerBet } from '../types';
import { calculatePlayerStandings, getTeamFlag, formatCurrency } from '../utils';
import { Award, ShieldAlert, BadgeCheck, HelpCircle, CalendarDays, Coins } from 'lucide-react';

interface MyStatusTabProps {
  currentPlayer: Player;
  matches: Match[];
  bets: PlayerBet[];
  players: Player[];
}

export const MyStatusTab: React.FC<MyStatusTabProps> = ({
  currentPlayer,
  matches,
  bets,
  players,
}) => {
  // Get active user standings
  const standings = calculatePlayerStandings(players, matches, bets);
  const myStanding = standings.find(s => s.playerId === currentPlayer.id) || {
    playerId: currentPlayer.id,
    playerName: currentPlayer.name,
    avatar: currentPlayer.avatar,
    totalBets: 0,
    correctBets: 0,
    incorrectBets: 0,
    pendingBets: 0,
    points: 0,
  };

  // Filter my active bets
  const myBets = bets.filter(b => b.playerId === currentPlayer.id);

  const getResultBadge = (match: Match, choice: string) => {
    if (match.status !== 'finished') {
      return (
        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200/55 px-2 py-1 rounded-md text-[11px] font-bold">
          <HelpCircle size={12} className="text-amber-500" />
          Đợi kết quả
        </span>
      );
    }

    const isCorrect = match.result === choice;

    if (isCorrect) {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md text-[11px] font-extrabold">
          <BadgeCheck size={12} className="text-[#0e723c]" />
          Đoán đúng (+1 điểm)
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 border border-rose-100 px-2 py-1 rounded-md text-[11px] font-extrabold">
          <ShieldAlert size={12} className="text-rose-600" />
          Đoán sai (+0 điểm)
        </span>
      );
    }
  };

  const choiceToName = (match: Match, choice: string) => {
    if (choice === 'home') return match.teamHome;
    if (choice === 'away') return match.teamAway;
    return 'Hòa';
  };

  return (
    <div id="mystatus-tab" className="space-y-6">
      {/* Individual Hero Card */}
      <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <div className="relative">
          <img
            src={currentPlayer.avatar}
            alt={currentPlayer.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
          />
          <span className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-1 border border-white">
            <Coins size={10} />
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <h3 className="text-base sm:text-lg font-extrabold text-gray-800 flex items-center justify-center sm:justify-start gap-1.5 leading-none">
            {currentPlayer.name}
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${currentPlayer.role === 'admin' ? 'bg-[#0e723c] text-white' : 'bg-gray-100 text-gray-600'}`}>
              {currentPlayer.role === 'admin' ? 'Nhà Cái' : 'Thành viên'}
            </span>
          </h3>
          <p className="text-xs text-gray-400 font-medium inline-flex items-center gap-1">
            <CalendarDays size={12} /> Gia nhập ngày {currentPlayer.joinedAt}
          </p>

          <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-1.5">
            <span className="text-xs font-semibold px-2 py-1 bg-[#f0f9f4] text-emerald-800 border border-emerald-100/60 rounded-md">
              Đúng <strong>{myStanding.correctBets}</strong> trận
            </span>
            <span className="text-xs font-semibold px-2 py-1 bg-rose-50 text-rose-800 border border-rose-100/60 rounded-md">
              Sai <strong>{myStanding.incorrectBets}</strong> trận
            </span>
            <span className="text-xs font-semibold px-2 py-1 bg-amber-50 text-amber-800 border border-amber-100/50 rounded-md">
              Chờ cược <strong>{myStanding.pendingBets}</strong> trận
            </span>
          </div>
        </div>

        {/* Points display */}
        <div className="w-full sm:w-auto p-4 bg-gradient-to-br from-emerald-55 to-emerald-100/60 border border-emerald-200/60 rounded-xl text-center">
          <span className="text-[11px] text-emerald-850 uppercase font-black tracking-wider">Tổng Điểm Tích Lũy</span>
          <div className="text-xl sm:text-2xl font-black text-[#0e723c] tracking-tight font-mono leading-none mt-1">
            {myStanding.points} điểm
          </div>
          <span className="text-[10px] text-emerald-700/80 font-medium font-sans block mt-1">
            ({myStanding.correctBets} trận thắng x 1 điểm)
          </span>
        </div>
      </div>

      {/* Bets History list */}
      <div>
        <h3 className="text-xs sm:text-sm font-extrabold text-[#0e723c] uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
          <Award size={16} /> LỊCH SỬ DỰ ĐOÁN CỦA TÔI ({myBets.length})
        </h3>

        {myBets.length === 0 ? (
          <div className="text-center py-10 text-gray-400 font-medium text-xs bg-gray-50 rounded-2xl border border-gray-100/70">
            Bạn chưa đặt cược trận nào. Hãy quay lại thẻ <strong className="text-[#0e723c] font-black">Đặt Cược</strong> để lựa chọn!
          </div>
        ) : (
          <div className="space-y-3">
            {myBets.map(bet => {
              const match = matches.find(m => m.id === bet.matchId);
              if (!match) return null;

              return (
                <div key={bet.id} className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl select-none leading-none">
                        {getTeamFlag(match.teamHome, match.teamHomeCode)}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 mt-1">vs</span>
                      <span className="text-2xl select-none leading-none">
                        {getTeamFlag(match.teamAway, match.teamAwayCode)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                        <span>#{match.index} | {match.group}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-800">
                        {match.teamHome} vs {match.teamAway}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Bạn chọn:{' '}
                        <strong className={bet.choice === 'draw' ? 'text-amber-700 font-black' : 'text-emerald-800 font-black'}>
                          {choiceToName(match, bet.choice)}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end sm:flex-col gap-2 border-t sm:border-t-0 border-gray-50 pt-2 sm:pt-0">
                    <span className="text-[10px] text-gray-400 font-mono font-medium">
                      {bet.timestamp}
                    </span>
                    {getResultBadge(match, bet.choice)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

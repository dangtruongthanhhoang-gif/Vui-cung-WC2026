/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, Match, PlayerBet } from '../types';
import { calculatePlayerStandings, formatPoints, getMatchWeek, WeekInfo } from '../utils';
import { Trophy, Copy, Check, Users, Landmark, Calendar, Lock, Award, ChevronDown } from 'lucide-react';

interface SummaryTabProps {
  players: Player[];
  matches: Match[];
  bets: PlayerBet[];
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ players, matches, bets }) => {
  const [copied, setCopied] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');

  // Dynamically extract all available weeks from the current matches list
  const availableWeeks = Array.from(
    new Map<number, WeekInfo>(
      matches.map(m => {
        const info = getMatchWeek(m.date);
        return [info.weekNum, info];
      })
    ).values()
  ).sort((a, b) => a.weekNum - b.weekNum);

  // Filter matches depending on selected scope
  const filteredMatches = selectedWeek === 'all'
    ? matches
    : matches.filter(m => getMatchWeek(m.date).weekNum === selectedWeek);

  // Compute standings under the active filter scope
  const standings = calculatePlayerStandings(players, filteredMatches, bets);

  // Sort by points DESC, then incorrect ASC
  const rankedStandings = [...standings].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return a.incorrectBets - b.incorrectBets;
  });

  // Calculate total points within the active scope
  const totalPointsPool = standings.reduce((sum, item) => sum + item.points, 0);

  // Completed matches count within active scope
  const completedMatchesCount = filteredMatches.filter(m => m.status === 'finished').length;

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <span className="text-xl shrink-0" role="img" aria-label="First">🥇</span>;
      case 1:
        return <span className="text-xl shrink-0" role="img" aria-label="Second">🥈</span>;
      case 2:
        return <span className="text-xl shrink-0" role="img" aria-label="Third">🥉</span>;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full text-[11px] text-gray-400 font-mono font-bold shrink-0">
            {index + 1}
          </span>
        );
    }
  };

  // Helper to check if a week is locked (finalized) based on current local date (2026-06-11)
  // Week 1 (Chốt Thứ 6, 12/06/2026).
  // Current time is 11/06/2026. Therefore, Week 1 is currently "In progress". Any week with weekNum < current is locked.
  const getWeekLockStatus = (weekNum: number) => {
    // Current active testing week is Week 1
    const currentWeekNum = 1; 
    if (weekNum < currentWeekNum) {
      return { isLocked: true, statusText: 'Đã chốt điểm 🔒', colorClass: 'bg-gray-100 text-gray-500 border-gray-200' };
    } else if (weekNum === currentWeekNum) {
      return { isLocked: false, statusText: 'Đang diễn ra (Chốt thứ 6 tuần này) ⚡', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    } else {
      return { isLocked: false, statusText: 'Sắp diễn ra ⏳', colorClass: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  const handleCopySummaryList = () => {
    let reportText = '';
    
    if (selectedWeek === 'all') {
      reportText += `🏆 VUI CÙNG WORLD CUP 2026 - BẢNG ĐIỂM CHUNG CUỘC TOÀN GIẢI 🏆\n`;
      reportText += `📊 Tổng điểm tích lũy cả phòng: ${totalPointsPool} điểm\n`;
      reportText += `📅 Cập nhật sau ${completedMatchesCount} trận hoàn thành\n`;
    } else {
      const activeWeekLabel = availableWeeks.find(w => w.weekNum === selectedWeek)?.label || `Tuần ${selectedWeek}`;
      reportText += `🏆 BẢNG ĐIỂM TUẦN DỰ ĐOÁN WORLD CUP 2026 🏆\n`;
      reportText += `📅 ${activeWeekLabel}\n`;
      reportText += `📊 Tổng điểm tích lũy trong tuần: ${totalPointsPool} điểm (${completedMatchesCount} trận đã kết thúc)\n`;
    }
    
    reportText += `--------------------------------------\n`;

    rankedStandings.forEach((player, idx) => {
      const medal = idx === 0 ? '👑 ' : idx === 1 ? '🥈 ' : idx === 2 ? '🥉 ' : '⚽ ';
      reportText += `${medal}${idx + 1}. ${player.playerName}: ${formatPoints(player.points)} (${player.correctBets} Đúng / ${player.incorrectBets} Sai)\n`;
    });

    reportText += `--------------------------------------\n`;
    reportText += `🔥 Tranh tài sôi nổi, chốt điểm vào thứ 6 hàng tuần! 🏅`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="summary-tab" className="space-y-6">
      {/* Category selector slider */}
      <div className="flex flex-col gap-3 bg-[#f8faf9] border border-gray-150 p-4 rounded-2xl shadow-2xs">
        <label className="text-[11px] text-[#0e723c] uppercase font-black tracking-wider flex items-center gap-1.5">
          <Calendar size={13} className="text-[#0e723c]" />
          Bộ lọc Bảng xếp hạng điểm số
        </label>
        
        <div className="flex flex-wrap gap-1.5">
          {/* All matches button */}
          <button
            onClick={() => setSelectedWeek('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
              selectedWeek === 'all'
                ? 'bg-[#0e723c] text-white border-transparent shadow-xs'
                : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200 shadow-2xs'
            }`}
          >
            Chung cuộc (Toàn giải)
          </button>

          {/* Dynamic weekly buttons */}
          {availableWeeks.map(w => (
            <button
              key={w.weekNum}
              onClick={() => setSelectedWeek(w.weekNum)}
              className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                selectedWeek === w.weekNum
                  ? 'bg-[#0e723c] text-white border-transparent shadow-xs'
                  : 'bg-white hover:bg-gray-50 text-gray-650 border-gray-200 shadow-2xs'
              }`}
            >
              Tuần {w.weekNum}
            </button>
          ))}
        </div>

        {/* Selected View Info Alert */}
        <div className="text-[11px] border-t border-gray-200/60 pt-2.5 mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <span className="text-gray-500 font-medium">
            Phạm vi đang xem:{' '}
            <strong className="text-gray-800 font-extrabold font-sans">
              {selectedWeek === 'all' ? 'Toàn bộ các trận trong giải đấu' : availableWeeks.find(w => w.weekNum === selectedWeek)?.label}
            </strong>
          </span>

          {selectedWeek !== 'all' && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${getWeekLockStatus(selectedWeek).colorClass}`}>
              {getWeekLockStatus(selectedWeek).isLocked ? <Lock size={10} /> : <Award size={10} />}
              {getWeekLockStatus(selectedWeek).statusText}
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Summary Cards Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Total Points accumulated */}
        <div className="bg-gradient-to-br from-emerald-600 to-[#0e723c] p-4 rounded-2xl text-white shadow-md border border-emerald-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs text-emerald-100 font-black uppercase tracking-wider">
              {selectedWeek === 'all' ? 'Tổng Điểm Tích Lũy 🏆' : `Điểm Tuần ${selectedWeek} ⚡`}
            </span>
            <Landmark size={18} className="text-emerald-200" />
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black font-mono">
              {totalPointsPool} điểm
            </div>
            <p className="text-[9px] sm:text-[10px] text-emerald-100/80 font-medium mt-1 leading-snug">
              {selectedWeek === 'all' 
                ? '(Tổng điểm dự đoán đúng hiện tại của cả phòng)'
                : `(Điểm chốt thứ 6 của tuần ${selectedWeek})`
              }
            </p>
          </div>
        </div>

        {/* Total Pool Betting Participants */}
        <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs text-gray-400 font-black uppercase tracking-wider">
              Số trận đấu {selectedWeek !== 'all' ? `tuần ${selectedWeek}` : ''}
            </span>
            <Users size={18} className="text-[#0e723c]" />
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-gray-800 font-mono">
              {completedMatchesCount} / {filteredMatches.length} trận
            </div>
            <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-1 leading-snug">
              {filteredMatches.length - completedMatchesCount} trận đang chờ thi đấu
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Area */}
      <div className="bg-white border border-gray-150 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <h2 className="text-xs sm:text-sm font-extrabold text-gray-800 flex items-center gap-1.5 uppercase font-sans">
            <Trophy size={16} className="text-[#0e723c]" />
            {selectedWeek === 'all' 
              ? 'XẾP HẠNG CHI BỘ CHAMPIONSHIP (CHUNG CUỘC)'
              : `BẢNG XẾP HẠNG ĐIỂM SỐ TUẦN ${selectedWeek}`
            }
          </h2>

          <button
            onClick={handleCopySummaryList}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-bold font-sans cursor-pointer shadow-2xs transition-all"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            {copied ? 'Đã sao chép!' : 'Chia sẻ Zalo/Teams'}
          </button>
        </div>

        {/* Players List */}
        <div className="divide-y divide-gray-100">
          {rankedStandings.map((player, index) => {
            const isTop1 = index === 0;

            return (
              <div
                key={player.playerId}
                className="flex items-center py-3 gap-3 first:pt-0 last:pb-0"
              >
                {/* Ranking */}
                <div className="w-8 flex justify-center">
                  {getRankBadge(index)}
                </div>

                {/* Avatar */}
                <img
                  src={player.avatar}
                  alt={player.playerName}
                  className={`w-9 h-9 rounded-full object-cover border-2 ${isTop1 ? 'border-amber-400 ring-2 ring-amber-100' : 'border-gray-100'}`}
                />

                {/* Name and accuracy ratio */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h4 className={`text-xs sm:text-sm font-bold truncate ${isTop1 ? 'text-amber-950 font-extrabold' : 'text-gray-800'}`}>
                    {player.playerName}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                    <span>Đúng: <strong className="text-emerald-700 font-extrabold">{player.correctBets}</strong></span>
                    <span>•</span>
                    <span>Sai: <strong className="text-rose-600 font-bold">{player.incorrectBets}</strong></span>
                    {player.pendingBets > 0 && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-0.5 text-amber-600 font-semibold">
                          Chờ: {player.pendingBets}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Points Earned */}
                <div className="text-right flex flex-col shrink-0 items-end">
                  <span className={`text-xs font-black font-mono leading-tight ${player.points > 0 ? 'text-[#0e723c]' : 'text-gray-400'}`}>
                    {player.points > 0 ? `+${player.points} điểm` : '0 điểm'}
                  </span>
                  <span className="text-[9px] text-gray-400 font-medium font-sans">
                    {player.points > 0 ? (index === 0 ? 'Dẫn đầu 👑' : 'Tuyệt vời 👍') : 'Cố lên! ✨'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

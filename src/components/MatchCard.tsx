/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Match, PlayerBet, Player, BetChoice } from '../types';
import { getTeamFlag, formatCurrency } from '../utils';
import { MapPin, Users, Info, Lock, Award, Clock } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  bets: PlayerBet[];
  players: Player[];
  currentPlayer: Player;
  onMakeBet: (matchId: string, choice: BetChoice) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  bets,
  players,
  currentPlayer,
  onMakeBet,
}) => {
  const [showVoters, setShowVoters] = useState<BetChoice | null>(null);

  // Filter bets specifically for this match
  const matchBets = bets.filter(b => b.matchId === match.id);

  // My bet choice on this match
  const myBet = matchBets.find(b => b.playerId === currentPlayer.id);

  // Count distribution
  const homeBets = matchBets.filter(b => b.choice === 'home');
  const drawBets = matchBets.filter(b => b.choice === 'draw');
  const awayBets = matchBets.filter(b => b.choice === 'away');

  // Helper to list names who made a specific selection
  const getBettersNames = (choice: BetChoice): string => {
    const list = matchBets
      .filter(b => b.choice === choice)
      .map(b => {
        const p = players.find(player => player.id === b.playerId);
        return p ? p.name : 'Người chơi khác';
      });
    return list.length > 0 ? list.join(', ') : 'Chưa có ai chọn';
  };

  const isClosed = match.status === 'closed' || match.status === 'finished';

  return (
    <div
      id={`match-card-${match.id}`}
      className={`relative overflow-hidden bg-white border rounded-2xl transition-all duration-300 ${
        isClosed
          ? 'border-gray-200 opacity-95 shadow-xs'
          : 'border-amber-200 ring-1 ring-amber-100/50 shadow-md hover:shadow-lg'
      }`}
    >
      {/* Background Subtle Accent */}
      <div
        className={`absolute top-0 left-0 w-full h-[6px] ${
          match.status === 'finished'
            ? 'bg-blue-500'
            : match.status === 'closed'
            ? 'bg-red-500'
            : 'bg-emerald-600'
        }`}
      />

      {/* Card Header Info */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
          <div className="flex items-center gap-1.5 font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
            <span>#{match.index}</span>
            <span className="text-gray-300">|</span>
            <span>{match.group}</span>
          </div>
          <div className="flex items-center gap-2">
            {match.isAboutToPlay && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse border border-amber-300">
                <Clock size={10} className="text-amber-600" />
                Sắp đá
              </span>
            )}
            <span className="font-medium text-gray-600 font-mono">{match.date}</span>
          </div>
        </div>

        {/* Team Versus Layout */}
        <div className="flex items-center justify-between my-4 gap-2">
          {/* Home Team */}
          <div className="flex flex-col items-center flex-1 text-center">
            <span className="text-4xl filter drop-shadow-sm mb-1.5 select-none" role="img" aria-label={match.teamHome}>
              {getTeamFlag(match.teamHome, match.teamHomeCode)}
            </span>
            <span id={`match-${match.id}-home-name`} className="text-sm sm:text-base font-bold text-gray-800 line-clamp-1 leading-tight">
              {match.teamHome}
            </span>
          </div>

          {/* VS Divider or Finished Score */}
          <div className="flex flex-col items-center px-4">
            {match.status === 'finished' ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-xl font-extrabold text-blue-800 font-mono">
                    {match.scoreHome}
                  </span>
                  <span className="text-xs text-blue-400 font-medium font-mono">:</span>
                  <span className="text-xl font-extrabold text-blue-800 font-mono">
                    {match.scoreAway}
                  </span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-sm font-semibold mt-1">
                  Kết thúc
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shadow-2xs">
                  <span className="text-xs font-bold text-gray-400 font-serif lowercase italic">vs</span>
                </div>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center flex-1 text-center">
            <span className="text-4xl filter drop-shadow-sm mb-1.5 select-none" role="img" aria-label={match.teamAway}>
              {getTeamFlag(match.teamAway, match.teamAwayCode)}
            </span>
            <span id={`match-${match.id}-away-name`} className="text-sm sm:text-base font-bold text-gray-800 line-clamp-1 leading-tight">
              {match.teamAway}
            </span>
          </div>
        </div>

        {/* Stadium details */}
        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium justify-center mt-2 border-b border-gray-50 pb-3">
          <MapPin size={12} className="text-gray-300" />
          <span className="truncate max-w-[250px]">{match.stadium}</span>
        </div>

        {/* Status Line */}
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold">
            {match.status === 'finished' ? (
              <span className="text-blue-600 flex items-center gap-1">
                <Award size={13} />
                Hoàn thành
              </span>
            ) : isClosed ? (
              <span className="text-rose-600 flex items-center gap-1">
                <Lock size={13} />
                Đã đóng kèo
              </span>
            ) : (
              <span className="text-[#0e723c] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0e723c] animate-pulse" />
                Đang mở
              </span>
            )}
          </div>
          <span className="text-gray-500 font-mono font-bold text-[#0e723c]">
            +{match.rateValue} {match.rateUnit} khi đoán đúng
          </span>
        </div>

        {/* Handicap Box */}
        <div className="mt-3.5 p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100/40">
          <h4 id={`match-${match.id}-handicap-title`} className="text-xs sm:text-sm font-bold text-amber-900 flex items-center gap-1">
            <Info size={13} className="text-amber-600 shrink-0" />
            {match.handicapTitle}
          </h4>
          <p className="text-xs text-amber-800/90 mt-1 pb-0.5 leading-relaxed font-normal">
            {match.handicapDesc}
          </p>
        </div>

        {/* Interactive Wagering Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {/* Home Option */}
          <button
            id={`btn-bet-home-${match.id}`}
            disabled={isClosed}
            onClick={() => onMakeBet(match.id, 'home')}
            onMouseEnter={() => setShowVoters('home')}
            onMouseLeave={() => setShowVoters(null)}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
              myBet?.choice === 'home'
                ? 'bg-[#0e723c] border-[#0e723c] text-white shadow-sm'
                : isClosed
                ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/20 text-gray-800'
            }`}
          >
            <span className="text-[11px] sm:text-xs font-bold leading-snug truncate w-full">
              Chọn {match.teamHome}
            </span>
            <span className={`text-[10px] sm:text-[11px] font-medium mt-1 inline-flex items-center gap-0.5 ${myBet?.choice === 'home' ? 'text-emerald-100' : 'text-gray-500'}`}>
              <Users size={10} className="shrink-0" />
              {homeBets.length} người
            </span>
          </button>

          {/* Draw Option */}
          <button
            id={`btn-bet-draw-${match.id}`}
            disabled={isClosed}
            onClick={() => onMakeBet(match.id, 'draw')}
            onMouseEnter={() => setShowVoters('draw')}
            onMouseLeave={() => setShowVoters(null)}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
              myBet?.choice === 'draw'
                ? 'bg-[#b38827] border-[#b38827] text-white shadow-sm'
                : isClosed
                ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white border-gray-200 hover:border-amber-500 hover:bg-amber-50/20 text-gray-800'
            }`}
          >
            <span className="text-[11px] sm:text-xs font-bold leading-snug">
              Hòa
            </span>
            <span className={`text-[10px] sm:text-[11px] font-medium mt-1 inline-flex items-center gap-0.5 ${myBet?.choice === 'draw' ? 'text-amber-100' : 'text-gray-500'}`}>
              <Users size={10} className="shrink-0" />
              {drawBets.length} người
            </span>
          </button>

          {/* Away Option */}
          <button
            id={`btn-bet-away-${match.id}`}
            disabled={isClosed}
            onClick={() => onMakeBet(match.id, 'away')}
            onMouseEnter={() => setShowVoters('away')}
            onMouseLeave={() => setShowVoters(null)}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
              myBet?.choice === 'away'
                ? 'bg-[#0e723c] border-[#0e723c] text-white shadow-sm'
                : isClosed
                ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/20 text-gray-800'
            }`}
          >
            <span className="text-[11px] sm:text-xs font-bold leading-snug truncate w-full">
              Chọn {match.teamAway}
            </span>
            <span className={`text-[10px] sm:text-[11px] font-medium mt-1 inline-flex items-center gap-0.5 ${myBet?.choice === 'away' ? 'text-emerald-100' : 'text-gray-500'}`}>
              <Users size={10} className="shrink-0" />
              {awayBets.length} người
            </span>
          </button>
        </div>

        {/* Tooltip Voter Names Area */}
        <div className="h-6 mt-1 flex items-center justify-center text-center">
          {showVoters && (
            <p className="text-[10px] text-gray-500 italic bg-gray-50 font-medium px-2 py-0.5 rounded-full border border-gray-100/50 truncate max-w-full animate-fadeIn">
              👉 {showVoters === 'home' ? `Lựa chọn ${match.teamHome}` : showVoters === 'draw' ? 'Lựa chọn Hòa' : `Lựa chọn ${match.teamAway}`}: <span className="text-gray-600 font-semibold">{getBettersNames(showVoters)}</span>
            </p>
          )}
        </div>

        {/* Selected Highlight Text Below */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-2.5 mt-1.5 text-xs text-gray-500 font-medium">
          <div>
            {myBet ? (
              <span id={`choice-text-${match.id}`} className="text-gray-600 font-semibold bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                Bạn đã chọn:{' '}
                <span className={myBet.choice === 'draw' ? 'text-amber-700' : 'text-emerald-700'}>
                  {myBet.choice === 'home'
                    ? match.teamHome
                    : myBet.choice === 'draw'
                    ? 'Hòa'
                    : match.teamAway}
                </span>
              </span>
            ) : (
              <span className="text-[#c13030] font-semibold bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-md animate-pulse">
                Bạn chưa đặt cược
              </span>
            )}
          </div>

          {/* Winning Choice Info */}
          {match.status === 'finished' && (
            <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md font-bold">
              🎖️ Thắng:{' '}
              {match.result === 'home'
                ? match.teamHome
                : match.result === 'draw'
                ? 'Hòa'
                : match.teamAway}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

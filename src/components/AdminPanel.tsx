/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Match, Player, PlayerBet, BetChoice, MatchStatus } from '../types';
import { Plus, ToggleLeft, ToggleRight, Check, X, Shield, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../utils';

interface AdminPanelProps {
  matches: Match[];
  players: Player[];
  bets: PlayerBet[];
  onAddMatch: (newMatch: Omit<Match, 'id' | 'index'>) => void;
  onUpdateMatchStatus: (matchId: string, status: MatchStatus, scoreHome?: number, scoreAway?: number, result?: BetChoice) => void;
  onResetAllData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  matches,
  players,
  bets,
  onAddMatch,
  onUpdateMatchStatus,
  onResetAllData,
}) => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [customHome, setCustomHome] = useState('');
  const [customAway, setCustomAway] = useState('');
  const [customGroup, setCustomGroup] = useState('Bảng A');
  const [customDate, setCustomDate] = useState('08:00 Th 2, 15/06');
  const [customHandicap, setCustomHandicap] = useState('Kèo đồng banh');
  const [customHandicapDesc, setCustomHandicapDesc] = useState('Chọn đội thắng hoặc Hòa. Ai chọn đúng kết quả sẽ thắng cược.');
  const [customStadium, setCustomStadium] = useState('Estadio Azteca, Mexico City');

  // Score management state
  const [scoreHomeMap, setScoreHomeMap] = useState<Record<string, number>>({});
  const [scoreAwayMap, setScoreAwayMap] = useState<Record<string, number>>({});
  const [resultMap, setResultMap] = useState<Record<string, BetChoice>>({});

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHome || !customAway) return;

    onAddMatch({
      group: customGroup,
      date: customDate,
      teamHome: customHome,
      teamAway: customAway,
      teamHomeCode: customHome.slice(0, 2).toUpperCase(),
      teamAwayCode: customAway.slice(0, 2).toUpperCase(),
      stadium: customStadium,
      status: 'open',
      rateValue: 1,
      rateUnit: 'điểm',
      handicapTitle: customHandicap,
      handicapDesc: customHandicapDesc,
    });

    // Reset fields
    setCustomHome('');
    setCustomAway('');
    setShowAddNew(false);
  };

  const handleScoreChange = (matchId: string, value: number, isHome: boolean) => {
    if (isHome) {
      setScoreHomeMap(prev => ({ ...prev, [matchId]: value }));
    } else {
      setScoreAwayMap(prev => ({ ...prev, [matchId]: value }));
    }
  };

  const handleResultChange = (matchId: string, val: BetChoice) => {
    setResultMap(prev => ({ ...prev, [matchId]: val }));
  };

  const handleFinalizeMatch = (match: Match) => {
    const sHome = scoreHomeMap[match.id] ?? 0;
    const sAway = scoreAwayMap[match.id] ?? 0;
    const res = resultMap[match.id] ?? 'draw';

    onUpdateMatchStatus(match.id, 'finished', sHome, sAway, res);
  };

  const activeBetsCount = (matchId: string) => {
    return bets.filter(b => b.matchId === matchId).length;
  };

  return (
    <div id="admin-panel" className="bg-[#f0f9f4] border border-emerald-100 rounded-2xl p-4 sm:p-5 shadow-inner">
      <div className="flex items-center justify-between border-b border-emerald-100 pb-3 mb-4">
        <h3 className="text-sm sm:text-base font-extrabold text-[#0e723c] flex items-center gap-2">
          <Shield size={18} className="text-[#0e723c]" />
          BÀN ĐIỀU HÀNH NHÀ CÁI (ADMIN)
        </h3>
        <button
          onClick={onResetAllData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold border border-rose-200 cursor-pointer transition-colors"
        >
          <RefreshCw size={13} />
          Đặt lại dữ liệu gốc
        </button>
      </div>

      {/* Accordion or Add Match Panel */}
      <div className="mb-5">
        {!showAddNew ? (
          <button
            onClick={() => setShowAddNew(true)}
            className="w-full py-2 px-4 bg-[#0e723c] hover:bg-[#0c5e31] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <Plus size={15} />
            Thêm trận đấu mới
          </button>
        ) : (
          <form onSubmit={handleAddSubmit} className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Thông tin trận đấu mới</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Đội nhà</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Vietnam"
                  value={customHome}
                  onChange={e => setCustomHome(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Đội khách</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Indonesia"
                  value={customAway}
                  onChange={e => setCustomAway(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Bảng đấu / Vòng đấu</label>
                <input
                  type="text"
                  required
                  value={customGroup}
                  onChange={e => setCustomGroup(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Thời gian thi đấu (VN)</label>
                <input
                  type="text"
                  required
                  value={customDate}
                  onChange={e => setCustomDate(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Sân vận động</label>
                <input
                  type="text"
                  required
                  value={customStadium}
                  onChange={e => setCustomStadium(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Kèo Chấp</label>
                <input
                  type="text"
                  required
                  value={customHandicap}
                  onChange={e => setCustomHandicap(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Giải thích chi tiết kèo chấp</label>
              <textarea
                required
                rows={2}
                value={customHandicapDesc}
                onChange={e => setCustomHandicapDesc(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-gray-800"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddNew(false)}
                className="px-3 py-1.5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#0e723c] text-white hover:bg-emerald-800 rounded-lg text-xs font-bold cursor-pointer"
              >
                Xác nhận thêm
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Match Management List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-[#0e723c] uppercase tracking-wider">Danh sách trận đấu cần điều phối</h4>
        
        {matches.map(match => {
          const isFinished = match.status === 'finished';
          const isClosed = match.status === 'closed';

          return (
            <div key={match.id} className="bg-white rounded-xl border border-emerald-100 p-3 sm:p-4 text-xs shadow-2xs">
              <div className="flex items-center justify-between font-bold text-gray-700">
                <span className="font-mono">#{match.index} | {match.group}</span>
                <span className="text-gray-500">{match.teamHome} vs {match.teamAway}</span>
              </div>

              {/* Status control buttons */}
              <div className="flex items-center justify-between mt-3 text-[11px] text-gray-500">
                <span>Trạng thái: 
                  <span className={`font-bold ml-1 ${isFinished ? 'text-blue-600' : isClosed ? 'text-red-600' : 'text-emerald-700'}`}>
                    {isFinished ? 'Đã hoàn thành' : isClosed ? 'Đóng đặt kèo' : 'Đang mở cược'}
                  </span>
                </span>
                <span className="font-semibold bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{activeBetsCount(match.id)} phiếu cược</span>
              </div>

              {/* Operations row */}
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
                {/* Lock/Unlock Toggle buttons */}
                {!isFinished && (
                  <button
                    onClick={() => onUpdateMatchStatus(match.id, isClosed ? 'open' : 'closed')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold border text-[11px] cursor-pointer ${
                      isClosed 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {isClosed ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
                    {isClosed ? 'Mở lại cược' : 'Khóa đặt kèo'}
                  </button>
                )}

                {/* Score inputs & Result chooser */}
                {!isFinished ? (
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 ml-auto select-none">
                    <span className="font-semibold text-gray-500 mr-1 text-[10px] uppercase">Điểm</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={scoreHomeMap[match.id] ?? ''}
                      onChange={e => handleScoreChange(match.id, parseInt(e.target.value) || 0, true)}
                      className="w-8 p-1 text-center bg-white border border-gray-200 rounded text-xs select-auto focus:ring-1 focus:ring-emerald-500 outline-none text-gray-800"
                    />
                    <span className="text-gray-300">:</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={scoreAwayMap[match.id] ?? ''}
                      onChange={e => handleScoreChange(match.id, parseInt(e.target.value) || 0, false)}
                      className="w-8 p-1 text-center bg-white border border-gray-200 rounded text-xs select-auto focus:ring-1 focus:ring-emerald-500 outline-none text-gray-800"
                    />

                    {/* Result selector */}
                    <select
                      value={resultMap[match.id] ?? 'draw'}
                      onChange={e => handleResultChange(match.id, e.target.value as BetChoice)}
                      className="text-xs p-1 bg-white border border-gray-200 rounded outline-none ml-1.5 text-gray-800"
                    >
                      <option value="home">Thắng ({match.teamHome})</option>
                      <option value="draw">Hòa</option>
                      <option value="away">Thắng ({match.teamAway})</option>
                    </select>

                    <button
                      onClick={() => handleFinalizeMatch(match)}
                      className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 cursor-pointer text-[10px] font-bold inline-flex items-center justify-center gap-0.5 ml-1"
                      title="Xác nhận kết quả & Thanh toán"
                    >
                      <Check size={12} />
                      Tính kèo
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                      <span>Điểm số: <strong className="text-gray-800">{match.scoreHome} - {match.scoreAway}</strong></span>
                      <span className="text-gray-300">•</span>
                      <span>Kết quả: <strong className="text-[#0e723c] uppercase">{match.result === 'home' ? match.teamHome : match.result === 'draw' ? 'Hòa' : match.teamAway}</strong></span>
                    </div>

                    <button
                      onClick={() => onUpdateMatchStatus(match.id, 'open')}
                      className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-md cursor-pointer ml-auto flex items-center gap-1 border border-gray-200 font-semibold"
                    >
                      <RefreshCw size={10} />
                      Đổi kết quả
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

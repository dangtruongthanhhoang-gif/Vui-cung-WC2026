/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Match } from '../types';
import { getTeamFlag } from '../utils';
import { Calendar, MapPin, Search, Filter } from 'lucide-react';

interface ScheduleTabProps {
  matches: Match[];
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ matches }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');

  // Filter groups dynamically found in matches
  const groupsToFilter = ['All', ...Array.from(new Set(matches.map(m => m.group))).sort()];

  const filteredMatches = matches.filter(match => {
    const matchesGroup = selectedGroup === 'All' || match.group === selectedGroup;
    const matchesSearch =
      match.teamHome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.teamAway.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.stadium.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div id="schedule-tab" className="space-y-5">
      {/* Search and Filters Layout */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm đội bóng hoặc sân vận động..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-150 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-800"
          />
        </div>

        {/* Group Selector Tags Row */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none items-center">
          <Filter size={14} className="text-gray-400 shrink-0 mr-1" />
          {groupsToFilter.map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedGroup === group
                  ? 'bg-[#0e723c] text-white'
                  : 'bg-white text-gray-650 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {group === 'All' ? 'Tất cả bảng' : group}
            </button>
          ))}
        </div>
      </div>

      {/* Fixture Timeline List */}
      <div className="space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs bg-gray-50 rounded-2xl border border-gray-100/60 font-medium">
            Không tìm thấy trận đấu nào khớp với bộ lọc.
          </div>
        ) : (
          filteredMatches.map(match => {
            const isFinished = match.status === 'finished';

            return (
              <div
                key={match.id}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Match Identity & Time */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-center min-w-[56px] flex flex-col justify-center shrink-0">
                    <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 leading-none">Trận</span>
                    <span className="text-base font-black font-mono text-gray-850 mt-1 leading-none">#{match.index}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-[#0e723c] font-black font-mono px-2 py-0.5 rounded text-[10px]">
                        {match.group}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                        <Calendar size={11} /> {match.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                      <MapPin size={11} className="shrink-0" />
                      <span className="truncate max-w-[200px]">{match.stadium}</span>
                    </div>
                  </div>
                </div>

                {/* Main Match Matchup with Score */}
                <div className="flex items-center justify-center gap-5 flex-1 max-w-sm mx-auto md:mx-0">
                  {/* Team Home */}
                  <div className="flex items-center gap-2 justify-end flex-1 text-right">
                    <span className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                      {match.teamHome}
                    </span>
                    <span className="text-2xl select-none leading-none">
                      {getTeamFlag(match.teamHome, match.teamHomeCode)}
                    </span>
                  </div>

                  {/* Versus or Score */}
                  <div className="px-3 py-1 bg-gray-50 border border-gray-200/60 rounded-lg text-center font-mono">
                    {isFinished ? (
                      <span className="text-sm font-black text-blue-600">
                        {match.scoreHome} : {match.scoreAway}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-semibold italic lowercase">vs</span>
                    )}
                  </div>

                  {/* Team Away */}
                  <div className="flex items-center gap-2 justify-start flex-1 text-left">
                    <span className="text-2xl select-none leading-none">
                      {getTeamFlag(match.teamAway, match.teamAwayCode)}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                      {match.teamAway}
                    </span>
                  </div>
                </div>

                {/* Match Handicap Details / Button Status */}
                <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-gray-50 pt-3 md:pt-0">
                  <div className="text-left md:text-right space-y-0.5">
                    <span className="text-[10px] text-amber-850 bg-amber-50 border border-amber-100/50 px-2 py-0.5 rounded font-black uppercase tracking-wider font-sans inline-block">
                      {match.handicapTitle}
                    </span>
                    <p className="text-[10px] text-gray-400 font-medium md:max-w-[150px] truncate">
                      {match.handicapDesc}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg ${
                      isFinished
                        ? 'bg-blue-50 text-blue-800 border border-blue-100'
                        : match.status === 'closed'
                        ? 'bg-rose-50 text-rose-800 border border-rose-100'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                    }`}
                  >
                    {isFinished ? 'Hết giờ' : match.status === 'closed' ? 'Đã khóa' : 'Hòa mạng'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

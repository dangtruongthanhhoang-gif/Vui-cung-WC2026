/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Player, Match, PlayerBet, DepartmentNotification, BetChoice, MatchStatus } from './types';
import {
  INITIAL_PLAYERS,
  INITIAL_MATCHES,
  INITIAL_BETS,
  INITIAL_NOTIFICATIONS,
} from './initialData';
import { calculatePlayerStandings, formatCurrency } from './utils';
import { MatchCard } from './components/MatchCard';
import { AdminPanel } from './components/AdminPanel';
import { NotificationTab } from './components/NotificationTab';
import { MyStatusTab } from './components/MyStatusTab';
import { SummaryTab } from './components/SummaryTab';
import { ScheduleTab } from './components/ScheduleTab';
import {
  Calendar,
  Coins,
  Bell,
  User,
  Trophy,
  Shield,
  X,
  UserPlus,
  RefreshCw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  // 1. Core Persistent States
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [bets, setBets] = useState<PlayerBet[]>([]);
  const [notifications, setNotifications] = useState<DepartmentNotification[]>([]);

  // 2. Navigation and Utility States
  const [activeTab, setActiveTab] = useState<'schedule' | 'bet' | 'notifications' | 'mystatus' | 'summary'>('bet');
  const [marketFilter, setMarketFilter] = useState<'open' | 'closed'>('open');
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('dang_hoang'); // Default: Thành Hoàng as shown in image
  const [showProfileSwitcher, setShowProfileSwitcher] = useState<boolean>(false);
  const [adminMode, setAdminMode] = useState<boolean>(false);

  // Form states for creating a new player
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);

  // 3. Load state from localStorage on Mount
  useEffect(() => {
    const localPlayers = localStorage.getItem('wc_players');
    const localMatches = localStorage.getItem('wc_matches');
    const localBets = localStorage.getItem('wc_bets');
    const localNotifications = localStorage.getItem('wc_notifications');
    const localCurrentPlayer = localStorage.getItem('wc_current_player');

    if (localPlayers && localMatches && localBets && localNotifications) {
      setPlayers(JSON.parse(localPlayers));
      setMatches(JSON.parse(localMatches));
      setBets(JSON.parse(localBets));
      setNotifications(JSON.parse(localNotifications));
    } else {
      // Seed initial mock database
      setPlayers(INITIAL_PLAYERS);
      setMatches(INITIAL_MATCHES);
      setBets(INITIAL_BETS);
      setNotifications(INITIAL_NOTIFICATIONS);

      localStorage.setItem('wc_players', JSON.stringify(INITIAL_PLAYERS));
      localStorage.setItem('wc_matches', JSON.stringify(INITIAL_MATCHES));
      localStorage.setItem('wc_bets', JSON.stringify(INITIAL_BETS));
      localStorage.setItem('wc_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    }

    if (localCurrentPlayer) {
      setCurrentPlayerId(localCurrentPlayer);
    } else {
      setCurrentPlayerId('dang_hoang'); // Default to "Thành Hoàng"
      localStorage.setItem('wc_current_player', 'dang_hoang');
    }
  }, []);

  // Sync state helpers
  const savePlayers = (update: Player[]) => {
    setPlayers(update);
    localStorage.setItem('wc_players', JSON.stringify(update));
  };

  const saveMatches = (update: Match[]) => {
    setMatches(update);
    localStorage.setItem('wc_matches', JSON.stringify(update));
  };

  const saveBets = (update: PlayerBet[]) => {
    setBets(update);
    localStorage.setItem('wc_bets', JSON.stringify(update));
  };

  const saveNotifications = (update: DepartmentNotification[]) => {
    setNotifications(update);
    localStorage.setItem('wc_notifications', JSON.stringify(update));
  };

  // Find currently active player
  const currentPlayer = useMemo(() => {
    return players.find(p => p.id === currentPlayerId) || players[0] || INITIAL_PLAYERS[1];
  }, [players, currentPlayerId]);

  // Compute estimate outstanding balance or points for active user
  const currentPlayerStanding = useMemo(() => {
    const standings = calculatePlayerStandings(players, matches, bets);
    return standings.find(s => s.playerId === currentPlayer.id) || { points: 0 };
  }, [players, matches, bets, currentPlayer]);

  // 4. Bet Prediction Selector Handler
  const handleMakeBet = (matchId: string, choice: BetChoice) => {
    const now = new Date();
    const formattedTime = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const existingBetIndex = bets.findIndex(
      b => b.matchId === matchId && b.playerId === currentPlayer.id
    );

    let updatedBets = [...bets];

    if (existingBetIndex >= 0) {
      // Modify choice
      updatedBets[existingBetIndex] = {
        ...updatedBets[existingBetIndex],
        choice,
        timestamp: formattedTime,
      };
    } else {
      // Insert new prediction
      const newBetItem: PlayerBet = {
        id: `bet_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        matchId,
        playerId: currentPlayer.id,
        choice,
        timestamp: formattedTime,
      };
      updatedBets.push(newBetItem);
    }

    saveBets(updatedBets);
  };

  // 5. Admin Actions Handlers
  const handleAddMatch = (newMatchDetails: Omit<Match, 'id' | 'index'>) => {
    const lastIndex = matches.reduce((max, m) => (m.index > max ? m.index : max), 0);
    const newMatch: Match = {
      ...newMatchDetails,
      id: `match_${Date.now()}`,
      index: lastIndex + 1,
    };

    const updatedMatches = [...matches, newMatch];
    saveMatches(updatedMatches);

    // Track admin activity
    const now = new Date();
    const formattedTime = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newNotification: DepartmentNotification = {
      id: `notif_${Date.now()}`,
      title: 'Nhà cái mở trận cược mới ⚽',
      content: `${currentPlayer.name} đã cập nhật lịch đấu mới: Trận #${newMatch.index} giữa ${newMatch.teamHome} và ${newMatch.teamAway} (${newMatch.handicapTitle}). Anh em mau vào bắt kèo!`,
      timestamp: formattedTime,
      type: 'info',
    };

    saveNotifications([newNotification, ...notifications]);
  };

  const handleUpdateMatchStatus = (
    matchId: string,
    status: MatchStatus,
    scoreHome?: number,
    scoreAway?: number,
    result?: BetChoice
  ) => {
    const updatedMatches = matches.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          status,
          scoreHome: scoreHome !== undefined ? scoreHome : m.scoreHome,
          scoreAway: scoreAway !== undefined ? scoreAway : m.scoreAway,
          result: result !== undefined ? result : m.result,
        };
      }
      return m;
    });

    saveMatches(updatedMatches);

    // Post notification feed if a match is finalized
    if (status === 'finished') {
      const targetMatch = matches.find(m => m.id === matchId);
      if (!targetMatch) return;

      const flagHome = targetMatch.teamHome;
      const flagAway = targetMatch.teamAway;

      const now = new Date();
      const formattedTime = `${String(now.getDate()).padStart(2, '0')}/${String(
        now.getMonth() + 1
      ).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;

      // Construct funny recap names
      const winningPrediction =
        result === 'home'
          ? targetMatch.teamHome
          : result === 'draw'
          ? 'Hòa'
          : targetMatch.teamAway;

      const newNotification: DepartmentNotification = {
        id: `notif_${Date.now()}`,
        title: `Có kết quả Trận #${targetMatch.index}: ${flagHome} v ${flagAway} 🏁`,
        content: `Tỷ số chung cuộc: ${scoreHome} - ${scoreAway}. Kèo trúng thưởng: [${winningPrediction}]. Điểm số tích lũy của anh em đã được hệ thống cập nhật tự động!`,
        timestamp: formattedTime,
        type: 'update',
      };

      saveNotifications([newNotification, ...notifications]);
    }
  };

  const handleResetAllData = () => {
    if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu cược về mặc định để thử nghiệm không?')) {
      setPlayers(INITIAL_PLAYERS);
      setMatches(INITIAL_MATCHES);
      setBets(INITIAL_BETS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setCurrentPlayerId('dang_hoang');

      localStorage.setItem('wc_players', JSON.stringify(INITIAL_PLAYERS));
      localStorage.setItem('wc_matches', JSON.stringify(INITIAL_MATCHES));
      localStorage.setItem('wc_bets', JSON.stringify(INITIAL_BETS));
      localStorage.setItem('wc_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
      localStorage.setItem('wc_current_player', 'dang_hoang');
      setAdminMode(false);
      alert('Đã khôi phục dữ liệu ban đầu thành công!');
    }
  };

  // 6. User Account Switching & Registering Handlers
  const handleAddNewPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const avatars = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop'
    ];
    const chosenAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;

    const newPlayer: Player = {
      id: `p_${Date.now()}`,
      name: newPlayerName.trim(),
      role: 'player',
      avatar: chosenAvatar,
      joinedAt: formattedDate,
    };

    const updatedPlayers = [...players, newPlayer];
    savePlayers(updatedPlayers);
    setCurrentPlayerId(newPlayer.id);
    localStorage.setItem('wc_current_player', newPlayer.id);

    setNewPlayerName('');
    setShowAddPlayerForm(false);
    setShowProfileSwitcher(false);
  };

  const handleSelectPlayer = (id: string) => {
    setCurrentPlayerId(id);
    localStorage.setItem('wc_current_player', id);
    setShowProfileSwitcher(false);
  };

  // 7. Filtering Match Cards inside betting tab
  const tabFilterMatches = useMemo(() => {
    return matches.filter(match => {
      if (marketFilter === 'open') {
        return match.status === 'open';
      } else {
        return match.status === 'closed' || match.status === 'finished';
      }
    });
  }, [matches, marketFilter]);

  const matchesOpenCount = matches.filter(m => m.status === 'open').length;
  const matchesClosedCount = matches.filter(m => m.status !== 'open').length;

  return (
    <div className="min-h-screen bg-[#f4f8f5] font-sans antialiased text-gray-800 flex flex-col justify-between">
      {/* 1. Header Profile & App Identity */}
      <header className="bg-white border-b border-gray-150 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#0e723c] block">
              VUI CÙNG WORLD CUP 2026
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight leading-none">
              Đặt cược
            </h1>
          </div>

          {/* User selector button */}
          <button
            onClick={() => setShowProfileSwitcher(true)}
            className="px-3.5 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-650 cursor-pointer flex items-center gap-1.5 transition-colors shrink-0 bg-white shadow-3xs"
          >
            <User size={14} className="text-[#0e723c]" />
            Thoát / Đổi tài khoản
          </button>
        </div>

        {/* 2. Active User Wallet Summary area */}
        <div className="bg-[#f0f9f4] border-t border-b border-emerald-100/50">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={currentPlayer.avatar}
                alt={currentPlayer.name}
                className="w-10 h-10 rounded-full object-cover border border-emerald-300"
              />
              <div className="space-y-0.5">
                <h2 className="font-extrabold text-gray-800 flex items-center gap-1.5">
                  {currentPlayer.name}
                  {currentPlayer.role === 'admin' ? (
                    <span className="text-[8px] font-black uppercase tracking-wider bg-[#0e723c] text-white px-1 rounded-sm">
                      Admin
                    </span>
                  ) : (
                    <span className="text-[8px] font-bold bg-emerald-100 text-emerald-850 px-1 rounded-sm">
                      Người chơi
                    </span>
                  )}
                </h2>
                <span className="text-[10px] text-gray-400 font-medium">Chi bộ văn phòng</span>
              </div>
            </div>

            {/* Balances standing */}
            <div className="text-right">
              <span className="text-[10px] text-emerald-700 block font-bold uppercase tracking-wider">
                Điểm tích lũy
              </span>
              <span id="estimated-penalty-balance" className="text-sm font-black text-emerald-700 font-mono tracking-tight">
                {currentPlayerStanding.points} điểm
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-5 space-y-5">
        {/* Toggle Switch Admin panel */}
        {currentPlayer.role === 'admin' && (
          <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-2xl shadow-3xs">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-emerald-50 rounded-lg text-[#0e723c]">
                <Shield size={16} />
              </span>
              <div>
                <h4 className="text-xs font-black text-gray-850 leading-tight">Chế độ Nhà Cái</h4>
                <p className="text-[10px] text-gray-400 font-medium">Bật panel điều phối, cập nhật tỷ số trận đấu</p>
              </div>
            </div>
            <button
              onClick={() => setAdminMode(!adminMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                adminMode
                  ? 'bg-rose-600 text-white shadow-3xs'
                  : 'bg-[#f0f9f4] text-[#0e723c] border border-emerald-100/60 font-black'
              }`}
            >
              {adminMode ? 'Tắt panel Admin' : 'Bật panel Admin'}
            </button>
          </div>
        )}

        {/* Render Admin Dashboard if toggled */}
        {adminMode && currentPlayer.role === 'admin' && (
          <AdminPanel
            matches={matches}
            players={players}
            bets={bets}
            onAddMatch={handleAddMatch}
            onUpdateMatchStatus={handleUpdateMatchStatus}
            onResetAllData={handleResetAllData}
          />
        )}

        {/* App Main Tabs Content Routing */}
        {activeTab === 'bet' && (
          <div className="space-y-4">
            {/* Subsection filters: Đang mở (5) vs Đã đóng (1) */}
            <div className="grid grid-cols-2 gap-2 bg-gray-100/80 p-1 rounded-2xl border border-gray-200/50">
              <button
                id="tab-open-matches"
                onClick={() => setMarketFilter('open')}
                className={`py-2 px-4 rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                  marketFilter === 'open'
                    ? 'bg-[#0e723c] text-white shadow-2xs'
                    : 'text-gray-500 hover:text-gray-850'
                }`}
              >
                <span>Đang mở</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${marketFilter === 'open' ? 'bg-emerald-800 text-emerald-100' : 'bg-gray-200 text-gray-500'}`}>
                  {matchesOpenCount}
                </span>
              </button>
              <button
                id="tab-closed-matches"
                onClick={() => setMarketFilter('closed')}
                className={`py-2 px-4 rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                  marketFilter === 'closed'
                    ? 'bg-[#0e723c] text-white shadow-2xs'
                    : 'text-gray-500 hover:text-gray-850'
                }`}
              >
                <span>Đã đóng</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${marketFilter === 'closed' ? 'bg-emerald-800 text-emerald-100' : 'bg-gray-200 text-gray-500'}`}>
                  {matchesClosedCount}
                </span>
              </button>
            </div>

            {/* Render Match Card Grid List */}
            {tabFilterMatches.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-150 rounded-2xl text-gray-400 font-medium text-xs shadow-3xs">
                {marketFilter === 'open'
                  ? 'Hiện thời hết sạch kèo. Chờ Nhà Cái mở đợt trận mới nhé!'
                  : 'Hiện thời chưa có trận nào đã đóng/hoàn thành.'}
              </div>
            ) : (
              <div className="space-y-4">
                {tabFilterMatches.map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    bets={bets}
                    players={players}
                    currentPlayer={currentPlayer}
                    onMakeBet={handleMakeBet}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'schedule' && <ScheduleTab matches={matches} />}

        {activeTab === 'notifications' && <NotificationTab notifications={notifications} />}

        {activeTab === 'mystatus' && (
          <MyStatusTab
            currentPlayer={currentPlayer}
            matches={matches}
            bets={bets}
            players={players}
          />
        )}

        {activeTab === 'summary' && (
          <SummaryTab players={players} matches={matches} bets={bets} />
        )}
      </main>

      {/* 4. Bottom Tab Navigation Bar */}
      <nav className="bg-white border-t border-gray-150 sticky bottom-0 z-40 pb-safe shadow-md">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          {/* Lịch Tab Button */}
          <button
            id="nav-tab-schedule"
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 flex flex-col items-center justify-center py-3.5 px-1 cursor-pointer transition-all text-center space-y-1 ${
              activeTab === 'schedule' ? 'text-[#0e723c]' : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            <Calendar size={18} />
            <span className="text-[10px] font-bold tracking-tight">Lịch</span>
          </button>

          {/* Cược Tab Button -> Main matching the active screen */}
          <button
            id="nav-tab-bet"
            onClick={() => setActiveTab('bet')}
            className={`flex-1 flex flex-col items-center justify-center py-3.5 px-1 cursor-pointer transition-all text-center space-y-1 ${
              activeTab === 'bet' ? 'text-[#0e723c]' : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            <Coins size={18} />
            <span className="text-[10px] font-bold tracking-tight">Cược</span>
          </button>

          {/* Thông báo tab */}
          <button
            id="nav-tab-notifications"
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 flex flex-col items-center justify-center py-3.5 px-1 cursor-pointer transition-all text-center space-y-1 ${
              activeTab === 'notifications' ? 'text-[#0e723c]' : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            <Bell size={18} />
            <span className="text-[10px] font-bold tracking-tight">Thông báo</span>
          </button>

          {/* Của tôi tab */}
          <button
            id="nav-tab-mystatus"
            onClick={() => setActiveTab('mystatus')}
            className={`flex-1 flex flex-col items-center justify-center py-3.5 px-1 cursor-pointer transition-all text-center space-y-1 ${
              activeTab === 'mystatus' ? 'text-[#0e723c]' : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            <User size={18} />
            <span className="text-[10px] font-bold tracking-tight">Của tôi</span>
          </button>

          {/* Tổng kết tab */}
          <button
            id="nav-tab-summary"
            onClick={() => setActiveTab('summary')}
            className={`flex-1 flex flex-col items-center justify-center py-3.5 px-1 cursor-pointer transition-all text-center space-y-1 ${
              activeTab === 'summary' ? 'text-[#0e723c]' : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            <Trophy size={18} />
            <span className="text-[10px] font-bold tracking-tight">Tổng kết</span>
          </button>
        </div>
      </nav>

      {/* Profile switcher dialog modal */}
      {showProfileSwitcher && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border rounded-2xl max-w-sm w-full shadow-xl overflow-hidden animate-slideIn flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#f0f9f4]">
              <h3 className="text-sm font-black text-[#0e723c] uppercase flex items-center gap-1.5">
                <Sparkles size={16} /> Chọn tài khoản người chơi
              </h3>
              <button
                onClick={() => {
                  setShowProfileSwitcher(false);
                  setShowAddPlayerForm(false);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
              {!showAddPlayerForm ? (
                <div className="space-y-2">
                  {players.map(player => (
                    <button
                      key={player.id}
                      onClick={() => handleSelectPlayer(player.id)}
                      className={`w-full p-2.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                        currentPlayer.id === player.id
                          ? 'border-[#0e723c] bg-[#f0f9f4]'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="w-9 h-9 rounded-full object-cover border"
                      />
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                          {player.name}
                          {player.id === 'dang_hoang' && (
                            <span className="text-[9px] bg-[#0e723c] text-white px-1.5 rounded-sm">
                              Bạn
                            </span>
                          )}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-medium font-mono">
                          {player.role === 'admin' ? 'Chủ sòng (Nhà Cái)' : 'Người chơi'}
                        </span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300" />
                    </button>
                  ))}

                  <button
                    onClick={() => setShowAddPlayerForm(true)}
                    className="w-full mt-3 py-2.5 border border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-[#0e723c] bg-emerald-50/10 hover:bg-emerald-50/40 cursor-pointer transition-all"
                  >
                    <UserPlus size={15} /> Thêm thành viên mới
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAddNewPlayerSubmit} className="space-y-3.5 py-1">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-gray-400 mb-1.5">
                      Tên thành viên mới
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="Ví dụ: Hoàng Hải, Chị Vân..."
                      value={newPlayerName}
                      onChange={e => setNewPlayerName(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-gray-800"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddPlayerForm(false)}
                      className="px-3 py-1.5 border border-gray-200 text-gray-500 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#0e723c] text-white hover:bg-emerald-800 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Gia nhập cược
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

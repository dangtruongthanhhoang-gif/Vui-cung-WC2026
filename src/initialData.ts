/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Player, Match, PlayerBet, DepartmentNotification } from './types';

export const INITIAL_PLAYERS: Player[] = [
  { id: 'khanh_nhacai', name: 'Khánh Nhà Cái', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', joinedAt: '10/06/2026' },
  { id: 'dang_hoang', name: 'Thành Hoàng', role: 'player', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', joinedAt: '11/06/2026' },
  { id: 'anh_minh', name: 'Anh Minh', role: 'player', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', joinedAt: '11/06/2026' },
  { id: 'chi_hong', name: 'Chị Hồng', role: 'player', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', joinedAt: '11/06/2026' },
  { id: 'thanh_nam', name: 'Thanh Nam', role: 'player', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop', joinedAt: '11/06/2026' },
  { id: 'van_bao', name: 'Văn Bảo', role: 'player', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop', joinedAt: '11/06/2026' },
  { id: 'thuy_van', name: 'Thúy Vân', role: 'player', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', joinedAt: '11/06/2026' },
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match_1',
    index: 1,
    group: 'Bảng A',
    date: '02:00 Th 5, 11/06',
    teamHome: 'Ecuador',
    teamAway: 'Qatar',
    teamHomeCode: 'EC',
    teamAwayCode: 'QA',
    stadium: 'Estadio Azteca, Mexico City',
    status: 'finished',
    rateValue: 1,
    rateUnit: 'điểm',
    handicapTitle: 'Kèo đồng banh',
    handicapDesc: 'Chọn đội thắng hoặc Hòa. Ai chọn đúng kết quả sẽ thắng cược.',
    scoreHome: 2,
    scoreAway: 0,
    result: 'home',
  },
  {
    id: 'match_2',
    index: 2,
    group: 'Bảng A',
    date: '09:00 Th 6, 12/06',
    teamHome: 'South Korea',
    teamAway: 'Czechia',
    teamHomeCode: 'KR',
    teamAwayCode: 'CZ',
    stadium: 'Estadio Akron, Guadalajara',
    status: 'open',
    rateValue: 1,
    rateUnit: 'điểm',
    handicapTitle: 'Kèo đồng banh',
    handicapDesc: 'Chọn đội thắng hoặc Hòa. Ai chọn đúng kết quả sẽ thắng cược.',
  },
  {
    id: 'match_3',
    index: 3,
    group: 'Bảng B',
    date: '02:00 Th 7, 13/06',
    teamHome: 'Canada',
    teamAway: 'Bosnia and Herzegovina',
    teamHomeCode: 'CA',
    teamAwayCode: 'BA',
    stadium: 'BMO Field, Toronto',
    status: 'open',
    rateValue: 1,
    rateUnit: 'điểm',
    handicapTitle: 'Canada chấp 1 bàn',
    handicapDesc: 'Canada phải thắng hơn 1 bàn để người chọn Canada thắng. Bosnia and Herzegovina thắng kèo nếu Canada không đạt mốc đó. Thắng đúng 1 bàn → ai chọn Hòa sẽ thắng.',
    isAboutToPlay: true,
  },
  {
    id: 'match_4',
    index: 4,
    group: 'Bảng D',
    date: '08:00 Th 7, 13/06',
    teamHome: 'United States',
    teamAway: 'Paraguay',
    teamHomeCode: 'US',
    teamAwayCode: 'PY',
    stadium: 'SoFi Stadium, Los Angeles',
    status: 'open',
    rateValue: 1,
    rateUnit: 'điểm',
    handicapTitle: 'United States chấp 1 bàn',
    handicapDesc: 'United States phải thắng hơn 1 bàn để người chọn United States thắng. Paraguay thắng kèo nếu United States không đạt mốc đó. Thắng đúng 1 bàn → ai chọn Hòa sẽ thắng.',
    isAboutToPlay: true,
  },
  {
    id: 'match_5',
    index: 5,
    group: 'Bảng C',
    date: '08:00 CN, 14/06',
    teamHome: 'Haiti',
    teamAway: 'Scotland',
    teamHomeCode: 'HT',
    teamAwayCode: 'GB-SCT',
    stadium: 'Gillette Stadium, Boston',
    status: 'open',
    rateValue: 1,
    rateUnit: 'điểm',
    handicapTitle: 'Scotland chấp 2 bàn',
    handicapDesc: 'Scotland phải thắng hơn 2 bàn để người chọn Scotland thắng. Haiti thắng kèo nếu Scotland không đạt mốc đó. Thắng đúng 2 bàn → ai chọn Hòa sẽ thắng.',
    isAboutToPlay: true,
  },
  {
    id: 'match_6',
    index: 6,
    group: 'Bảng D',
    date: '11:00 CN, 14/06',
    teamHome: 'Australia',
    teamAway: 'Turkiye',
    teamHomeCode: 'AU',
    teamAwayCode: 'TR',
    stadium: 'Estadio Azteca, Mexico City',
    status: 'open',
    rateValue: 1,
    rateUnit: 'điểm',
    handicapTitle: 'Kèo đồng banh',
    handicapDesc: 'Chọn đội thắng hoặc Hòa. Ai chọn đúng kết quả sẽ thắng cược.',
  },
];

// We generate the appropriate mock bets to match the player distributions shown in the card options:
// #2 South Korea vs Czechia (Total: 7 home, 5 draw, 3 away)
// #3 Canada vs Bosnia (Total: 3 home, 1 draw, 2 away)
// #4 United States vs Paraguay (Total: 0 home, 1 draw, 5 away)
// #5 Haiti vs Scotland (Total: 1 home, 1 draw, 1 away)
// #1 Ecuador vs Qatar (All finished bets)
export const INITIAL_BETS: PlayerBet[] = [
  // #1 - Ecuador vs Qatar (finished, Ecuador won)
  { id: 'b_1_1', matchId: 'match_1', playerId: 'khanh_nhacai', choice: 'home', timestamp: '10/06/2026 18:30' }, // Correct
  { id: 'b_1_2', matchId: 'match_1', playerId: 'dang_hoang', choice: 'home', timestamp: '10/06/2026 19:15' }, // Correct
  { id: 'b_1_3', matchId: 'match_1', playerId: 'anh_minh', choice: 'draw', timestamp: '10/06/2026 19:20' }, // Incorrect (loss)
  { id: 'b_1_4', matchId: 'match_1', playerId: 'chi_hong', choice: 'home', timestamp: '10/06/2026 21:00' }, // Correct
  { id: 'b_1_5', matchId: 'match_1', playerId: 'thanh_nam', choice: 'away', timestamp: '10/06/2026 21:30' }, // Incorrect (loss)

  // #2 - South Korea vs Czechia (7 home, 5 draw, 3 away)
  // Let's attribute bets to match these totals:
  // - Choose South Korea: Anh Minh, Thúy Vân, Văn Bảo + 4 simulated other mock profiles
  { id: 'b_2_1', matchId: 'match_2', playerId: 'anh_minh', choice: 'home', timestamp: '11/06/2026 09:15' },
  { id: 'b_2_2', matchId: 'match_2', playerId: 'thuy_van', choice: 'home', timestamp: '11/06/2026 09:16' },
  { id: 'b_2_3', matchId: 'match_2', playerId: 'van_bao', choice: 'home', timestamp: '11/06/2026 09:17' },
  // Let's represent extra simulated bets by inventing IDs
  { id: 'b_2_x1', matchId: 'match_2', playerId: 'sim_user_1', choice: 'home', timestamp: '11/06/2026 09:18' },
  { id: 'b_2_x2', matchId: 'match_2', playerId: 'sim_user_2', choice: 'home', timestamp: '11/06/2026 09:19' },
  { id: 'b_2_x3', matchId: 'match_2', playerId: 'sim_user_3', choice: 'home', timestamp: '11/06/2026 09:20' },
  { id: 'b_2_x4', matchId: 'match_2', playerId: 'sim_user_4', choice: 'home', timestamp: '11/06/2026 09:21' },

  // - Choose Hòa: Khánh Nhà Cái, Thành Hoàng (active player), Chị Hồng + 2 simulated
  { id: 'b_2_4', matchId: 'match_2', playerId: 'khanh_nhacai', choice: 'draw', timestamp: '11/06/2026 10:00' },
  { id: 'b_2_5', matchId: 'match_2', playerId: 'dang_hoang', choice: 'draw', timestamp: '11/06/2026 10:15' }, // Active user selection shown as "Bạn đã chọn: Hòa"
  { id: 'b_2_6', matchId: 'match_2', playerId: 'chi_hong', choice: 'draw', timestamp: '11/06/2026 10:20' },
  { id: 'b_2_x5', matchId: 'match_2', playerId: 'sim_user_5', choice: 'draw', timestamp: '11/06/2026 10:25' },
  { id: 'b_2_x6', matchId: 'match_2', playerId: 'sim_user_6', choice: 'draw', timestamp: '11/06/2026 10:26' },

  // - Choose Czechia: Thanh Nam + 2 simulated
  { id: 'b_2_7', matchId: 'match_2', playerId: 'thanh_nam', choice: 'away', timestamp: '11/06/2026 11:00' },
  { id: 'b_2_x7', matchId: 'match_2', playerId: 'sim_user_7', choice: 'away', timestamp: '11/06/2026 11:05' },
  { id: 'b_2_x8', matchId: 'match_2', playerId: 'sim_user_8', choice: 'away', timestamp: '11/06/2026 11:10' },

  // #3 - Canada vs Bosnia & Herzegovina (3 home, 1 draw, 2 away)
  // Active selection: "Bạn đã chọn: Canada"
  { id: 'b_3_1', matchId: 'match_3', playerId: 'dang_hoang', choice: 'home', timestamp: '11/06/2026 12:00' }, // Active player selected Canada
  { id: 'b_3_2', matchId: 'match_3', playerId: 'chi_hong', choice: 'home', timestamp: '11/06/2026 12:05' },
  { id: 'b_3_x1', matchId: 'match_3', playerId: 'sim_user_1', choice: 'home', timestamp: '11/06/2026 12:10' },

  { id: 'b_3_3', matchId: 'match_3', playerId: 'thanh_nam', choice: 'draw', timestamp: '11/06/2026 12:15' },

  { id: 'b_3_4', matchId: 'match_3', playerId: 'anh_minh', choice: 'away', timestamp: '11/06/2026 12:20' },
  { id: 'b_3_5', matchId: 'match_3', playerId: 'khanh_nhacai', choice: 'away', timestamp: '11/06/2026 12:25' },

  // #4 - United States vs Paraguay (0 home, 1 draw, 5 away)
  { id: 'b_4_1', matchId: 'match_4', playerId: 'chi_hong', choice: 'draw', timestamp: '11/06/2026 14:00' },

  { id: 'b_4_2', matchId: 'match_4', playerId: 'dang_hoang', choice: 'away', timestamp: '11/06/2026 14:05' },
  { id: 'b_4_3', matchId: 'match_4', playerId: 'khanh_nhacai', choice: 'away', timestamp: '11/06/2026 14:10' },
  { id: 'b_4_4', matchId: 'match_4', playerId: 'thanh_nam', choice: 'away', timestamp: '11/06/2026 14:15' },
  { id: 'b_4_5', matchId: 'match_4', playerId: 'anh_minh', choice: 'away', timestamp: '11/06/2026 14:20' },
  { id: 'b_4_6', matchId: 'match_4', playerId: 'thuy_van', choice: 'away', timestamp: '11/06/2026 14:25' },

  // #5 - Haiti vs Scotland (1 home, 1 draw, 1 away)
  { id: 'b_5_1', matchId: 'match_5', playerId: 'van_bao', choice: 'home', timestamp: '11/06/2026 15:00' },
  { id: 'b_5_2', matchId: 'match_5', playerId: 'dang_hoang', choice: 'draw', timestamp: '11/06/2026 15:05' },
  { id: 'b_5_3', matchId: 'match_5', playerId: 'khanh_nhacai', choice: 'away', timestamp: '11/06/2026 15:10' },
];

export const INITIAL_NOTIFICATIONS: DepartmentNotification[] = [
  {
    id: 'n_1',
    title: 'Chào đón giải đấu Vui Cùng World Cup 2026 🏆',
    content: 'Ứng dụng chính thức đi vào hoạt động nội bộ phòng ban! Thể lệ cực vui: Đoán đúng mỗi trận nhận được 1 điểm. Đoán sai hoặc không đoán không được điểm. Ai tích lũy nhiều điểm nhất cuối giải sẽ giành chức vô địch vô song!',
    timestamp: '11/06/2026 08:00',
    type: 'success',
  },
  {
    id: 'n_2',
    title: 'Khánh Nhà Cái mở kèo siêu hấp dẫn',
    content: 'Đã lên sóng toàn bộ kèo vòng bảng đầu tiên bao gồm trận cầu vô bổ giữa Haiti và Scotland chấp tận 2 trái! Anh em vào xem chi tiết để đặt cược nhé.',
    timestamp: '11/06/2026 08:30',
    type: 'info',
  },
  {
    id: 'n_3',
    title: 'Kết quả trận #1: Ecuador (2) - (0) Qatar',
    content: 'Trận khai màn đã kết thúc! Ecuador chiến thắng giòn giã 2-0. Chúc mừng Thành Hoàng, Khánh Nhà Cái, Chị Hồng đã ăn kèo nhận ngay 1 điểm đầu tay cực oách nhé! 🐽',
    timestamp: '11/06/2026 10:00',
    type: 'update',
  },
];

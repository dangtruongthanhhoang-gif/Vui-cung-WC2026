/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DepartmentNotification } from '../types';
import { Bell, Info, AlertTriangle, CheckCircle2, Megaphone } from 'lucide-react';

interface NotificationTabProps {
  notifications: DepartmentNotification[];
}

export const NotificationTab: React.FC<NotificationTabProps> = ({ notifications }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-[#0e723c]" />;
      case 'warn':
        return <AlertTriangle size={16} className="text-amber-600" />;
      case 'update':
        return <Bell size={16} className="text-blue-600" />;
      default:
        return <Info size={16} className="text-sky-600" />;
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-[#f0f9f4] border-emerald-100';
      case 'warn':
        return 'bg-amber-50 border-amber-100';
      case 'update':
        return 'bg-blue-50/50 border-blue-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Rules Notice */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm sm:text-base font-extrabold text-[#0e723c] flex items-center gap-1.5 mb-3.5">
          <Megaphone size={18} />
          LUẬT CHƠI & ĐIỀU LỆ PHÒNG BAN 🏆
        </h3>
        <ul className="text-xs space-y-2.5 text-gray-700 leading-relaxed font-medium">
          <li className="flex items-start gap-2">
            <span className="text-base select-none leading-none">🏆</span>
            <p>
              <strong className="text-gray-900 font-bold">Mục đích:</strong> Hoạt động vui chơi tích điểm gắn kết phòng ban dịp World Cup 2026. Tranh tài dự đoán nhận điểm để tìm ra nhà quán quân oanh liệt của chi bộ văn phòng.
            </p>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-base select-none leading-none">🎖️</span>
            <p>
              <strong className="text-gray-900 font-bold">Mức độ tích lũy:</strong> Đoán đúng mỗi trận nhận được <strong className="text-[#0e723c] font-extrabold">1 điểm</strong>. Đoán sai hoặc không đoán không được điểm (0 điểm).
            </p>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-base select-none leading-none">⏱️</span>
            <p>
              <strong className="text-gray-900 font-bold">Hạn đóng cược:</strong> Cổng dự đoán sẽ được tự động/Nhà Cái khóa đúng thời điểm trận đấu bắt đầu. Sau khi khóa, không thể sửa đổi ý kiến.
            </p>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-base select-none leading-none">📊</span>
            <p>
              <strong className="text-gray-900 font-bold">Tổng kết & Vinh danh:</strong> Cuối mùa giải, app sẽ tự động tổng hợp ai tích lũy được điểm số cao nhất để vinh danh danh hiệu "Vua Kèo" vĩ đại lãnh nhận phần thưởng chi bộ đặc biệt!
            </p>
          </li>
        </ul>
      </div>

      {/* Notifications feed */}
      <div>
        <h3 className="text-xs sm:text-sm font-extrabold text-[#0e723c] uppercase tracking-wider mb-3.5 flex items-center gap-1">
          <Bell size={16} />
          BẢN TIN HOẠT ĐỘNG ({notifications.length})
        </h3>

        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-400 font-medium text-xs bg-gray-50/50 rounded-2xl border border-gray-100">
            Hộp tin trống. Nhà Cái chưa đăng thông báo mới.
          </div>
        ) : (
          <div className="space-y-3.5">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border-l-4 border shadow-2xs flex gap-3 transition-colors ${getBgClass(notif.type)}`}
              >
                <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-extrabold text-gray-800 leading-tight">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-mono font-medium whitespace-nowrap">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {notif.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { userService } from '../../../services';
import type { User } from '../../../types';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await userService.getAllUsers({ limit: 50 });
        if (res.success) {
          const mapped = (res.data?.users || []).map((u): User => ({
            _id: u._id,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
            userName: u.userName,
            email: u.email,
            gender: u.gender,
            address: u.address,
            role: u.role,
            avatar: u.avatar,
            userDescription: u.userDescription,
            points: u.points,
            itemId: (u.itemId || []).map(i => i._id),
            houseDecorId: (u.houseDecorId || []).map(h => h._id),
            gameChallengeId: (u.gameChallengeId || []).map(g => g._id),
            matchId: (u.matchId || []).map(m => m._id),
            certId: (u.certId || []).map(c => c._id),
            stats: u.stats,
            listFriend: (u.listFriend || []).map(f => f._id),
            isVerified: u.isVerified,
          }));
          setUsers(mapped);
        } else {
          setError(res.message || 'Không thể tải người dùng');
        }
      } catch {
        setError('Không thể tải người dùng');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AdminLayout title="Người dùng">
      {loading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(u => (
            <div key={u._id} className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {u.userName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{u.userName}</div>
                  <div className="text-sm opacity-70">{u.email}</div>
                  <div className="text-sm text-primary">{u.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default UsersPage;



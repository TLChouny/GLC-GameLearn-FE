import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { rankingService } from '../../../services';

const RankingsPage: React.FC = () => {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await rankingService.getAllRankings();
        if (res.success) setRankings(res.data?.rankings || []);
        else setError(res.message || 'Không thể tải xếp hạng');
      } catch {
        setError('Không thể tải xếp hạng');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AdminLayout title="Xếp hạng">
      {loading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : (
        <div className="space-y-2">
          {rankings.map((r, idx) => (
            <div key={r._id || idx} className="bg-card p-3 rounded border flex justify-between">
              <div>#{idx + 1}</div>
              <div className="font-bold">{r.user?.userName || r.userName || 'N/A'}</div>
              <div className="text-primary">{r.points || r.score || 0} điểm</div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default RankingsPage;



import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { tradeService } from '../../../services';

const TradesPage: React.FC = () => {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await tradeService.getAllTrades();
        if (res.success) setTrades(res.data?.trades || []);
        else setError(res.message || 'Không thể tải giao dịch');
      } catch {
        setError('Không thể tải giao dịch');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AdminLayout title="Giao dịch">
      {loading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : (
        <div className="space-y-2">
          {trades.map((t) => (
            <div key={t._id} className="bg-card p-3 rounded border flex justify-between">
              <div className="font-bold">{t.type || 'N/A'}</div>
              <div>{t.item?.itemName || t.itemName || '—'}</div>
              <div className="text-primary">{t.amount || t.price || 0}</div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default TradesPage;



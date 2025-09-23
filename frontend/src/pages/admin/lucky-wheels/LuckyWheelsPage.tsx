import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { luckyWheelService } from '../../../services';

const LuckyWheelsPage: React.FC = () => {
  const [wheels, setWheels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await luckyWheelService.getAllLuckyWheels();
        if (res.success) setWheels(res.data?.luckyWheels || []);
        else setError(res.message || 'Không thể tải vòng quay');
      } catch {
        setError('Không thể tải vòng quay');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AdminLayout title="Vòng quay">
      {loading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : (
        <div className="space-y-2">
          {wheels.map((w) => (
            <div key={w._id} className="bg-card p-3 rounded border">
              <div className="font-bold">{w.wheelTitle}</div>
              <div className="text-sm opacity-70">{w.wheelDescription}</div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default LuckyWheelsPage;



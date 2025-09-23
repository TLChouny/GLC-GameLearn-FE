import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { certificateService } from '../../../services';

const CertificatesPage: React.FC = () => {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await certificateService.getAllCertificates();
        if (res.success) setCerts(res.data?.certificates || []);
        else setError(res.message || 'Không thể tải chứng chỉ');
      } catch {
        setError('Không thể tải chứng chỉ');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AdminLayout title="Chứng chỉ">
      {loading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((c) => (
            <div key={c._id} className="bg-card p-4 rounded border">
              <div className="font-bold">{c.certName}</div>
              <div className="text-sm opacity-70">{c.certDescription}</div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default CertificatesPage;



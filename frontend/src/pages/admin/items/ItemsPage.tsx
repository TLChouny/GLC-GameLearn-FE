import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { itemService } from '../../../services';
import type { Item } from '../../../types';

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await itemService.getAllItems({ limit: 50 });
        if (res.success) {
          setItems(res.data?.items || []);
        } else {
          setError(res.message || 'Không thể tải vật phẩm');
        }
      } catch {
        setError('Không thể tải vật phẩm');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AdminLayout title="Vật phẩm">
      {loading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(i => (
            <div key={i._id} className="bg-card p-4 rounded-lg border text-center">
              <div className="text-4xl mb-2">🎁</div>
              <div className="font-bold">{i.itemName}</div>
              <div className="text-sm opacity-70 mb-1">{i.itemType}</div>
              <div className="text-sm text-primary">Giá: {i.itemPrice}</div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default ItemsPage;



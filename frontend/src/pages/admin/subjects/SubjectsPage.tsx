import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { subjectService } from '../../../services';

const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await subjectService.getAllSubjects();
        if (res.success) setSubjects(res.data?.subjects || []);
        else setError(res.message || 'Không thể tải môn học');
      } catch {
        setError('Không thể tải môn học');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AdminLayout title="Môn học">
      {loading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s) => (
            <div key={s._id} className="bg-card p-4 rounded border">
              <div className="font-bold">{s.subjectName}</div>
              <div className="text-sm opacity-70">{s.subjectDescription}</div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default SubjectsPage;



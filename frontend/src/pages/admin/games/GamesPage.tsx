import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { gameService } from '../../../services';
import type { GameChallenge, GameChallengeWithSubject } from '../../../types';

const GamesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<GameChallenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await gameService.getAllGameChallenges({ limit: 50 });
        if (res.success) {
          const mapped = (res.data?.gameChallenges || []).map((gc: GameChallengeWithSubject): GameChallenge => ({
            _id: gc._id,
            createdAt: gc.createdAt,
            updatedAt: gc.updatedAt,
            title: gc.title,
            difficulty: gc.difficulty,
            rewardPoints: gc.rewardPoints,
            subjectId: gc.subjectId._id,
          }));
          setChallenges(mapped);
        } else {
          setError(res.message || 'Không thể tải thử thách');
        }
      } catch {
        setError('Không thể tải thử thách');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AdminLayout title="Trò chơi">
      {loading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map(c => (
            <div key={c._id} className="bg-card p-4 rounded-lg border">
              <div className="font-bold mb-1">{c.title}</div>
              <div className="text-sm mb-1">Độ khó: {c.difficulty}</div>
              <div className="text-sm text-primary">Điểm thưởng: {c.rewardPoints}</div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default GamesPage;



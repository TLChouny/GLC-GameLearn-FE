import React, { useMemo, useRef, useState } from 'react';

export interface WheelSegment {
  id: string;
  text: string;
  color: string;
  icon: string;
}

interface WorkingLuckyWheelProps {
  onSpinComplete?: (segment: WheelSegment) => void;
  onSpinStart?: () => void;
  isSpinning?: boolean;
  disabled?: boolean;
  /**
   * Cung cấp danh sách segment động (ưu tiên nếu có)
   */
  segments?: WheelSegment[];
  /**
   * Callback để yêu cầu mục tiêu quay (prizeId) từ API trước khi bắt đầu animate
   * Trả về id segment thắng (map 1-1 với prizeId từ BE)
   */
  onSpinRequest?: () => Promise<string>;
  /**
   * Độ lệch tinh chỉnh (đơn vị độ) giữa mũi tên và ranh giới segment.
   * Dùng khi thiết kế mũi tên/viền tạo sai khác nhỏ (±3–6 độ).
   */
  pointerOffsetDeg?: number;
  /**
   * Vị trí mũi tên: top (12h), right (3h), bottom (6h), left (9h)
   */
  pointerPosition?: 'top' | 'right' | 'bottom' | 'left';
}

const WorkingLuckyWheel: React.FC<WorkingLuckyWheelProps> = ({
  onSpinComplete,
  onSpinStart,
  // isSpinning = false,
  disabled = false,
  segments: propSegments,
  onSpinRequest,
  pointerOffsetDeg = 0,
  pointerPosition = 'top'
}) => {
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const pendingTargetIdRef = useRef<string | null>(null);

  // Dữ liệu mặc định 18 phần (sử dụng khi không truyền propSegments)
  const defaultSegments: WheelSegment[] = useMemo(() => ([
    { id: '1', text: '1.000 VND', color: '#FF4444', icon: '📱' },
    { id: '2', text: '2.000 VND', color: '#CC0000', icon: '📞' },
    { id: '3', text: '5.000 VND', color: '#FF8800', icon: '🌐' },
    { id: '4', text: '10.000 VND', color: '#FFDD00', icon: '☁️' },
    { id: '5', text: '20.000 VND', color: '#88FF88', icon: '💰' },
    { id: '6', text: '50.000 VND', color: '#4488FF', icon: '💎' },
    { id: '7', text: 'THÊM LƯỢT', color: '#AA44FF', icon: '🔄' },
    { id: '8', text: 'x1 mảnh quần áo', color: '#0044AA', icon: '🔗' }, // 4 mảnh
    { id: '9', text: 'x1 mảnh quần áo', color: '#006600', icon: '😄' }, // 4 mảnh
    { id: '10', text: 'x1 mảnh túi xách', color: '#4488FF', icon: '🍀' }, // 4 mảnh
    { id: '11', text: 'x1 mảnh túi xách', color: '#AA44FF', icon: '📧' }, // 4 mảnh
    { id: '12', text: 'x1 mảnh dây chuyền', color: '#CC8844', icon: '✉️' }, // 4 mảnh
    { id: '13', text: 'x1 mảnh dây chuyền', color: '#FF6B6B', icon: '📲' }, // 4 mảnh
    { id: '14', text: 'x1 mảnh vòng tay', color: '#4ECDC4', icon: '📶' }, // 4 mảnh
    { id: '15', text: 'x1 mảnh vòng tay', color: '#45B7D1', icon: '💵' }, // 4 mảnh
    { id: '16', text: 'x1 mảnh 100.000 VND', color: '#F7DC6F', icon: '🏆' },// 3 mảnh
    { id: '17', text: 'x1 mảnh 200.000 VND', color: '#BB8FCE', icon: '💌' },// 4 mảnh
    { id: '18', text: 'x1 mảnh 500.000 VND', color: '#85C1E9', icon: '🎁' } //5 mảnh
  ]), []);

  const segments: WheelSegment[] = useMemo(() => {
    return (propSegments && propSegments.length > 0) ? propSegments : defaultSegments;
  }, [propSegments, defaultSegments]);

  // Tính góc đích để trỏ mũi tên vào segment mong muốn
  const calculateFinalRotationForTarget = (currentRotation: number, targetSegmentIndex: number): number => {
    const segmentAngle = 360 / segments.length;
    // Căn theo hướng mũi tên như logic cũ đã đúng
    const pointerBaseAngle = (
      pointerPosition === 'top' ? 90 :
      pointerPosition === 'right' ? 0 :
      pointerPosition === 'bottom' ? 270 :
      180
    );
    const targetCenterFromZero = targetSegmentIndex * segmentAngle + segmentAngle / 2;
    const desiredAngleFromPointer = targetCenterFromZero; // muốn mũi tên nằm giữa segment
    const finalWheelAngle = (pointerBaseAngle + pointerOffsetDeg - desiredAngleFromPointer + 360) % 360;
    const fullRotations = 5 * 360; // số vòng quay trước khi dừng
    // Loại bỏ phần góc hiện tại (mod 360) để tránh lệch sau các lần quay
    const currentMod = ((currentRotation % 360) + 360) % 360;
    const deltaToTarget = (finalWheelAngle - currentMod + 360) % 360;
    return currentRotation + fullRotations + deltaToTarget;
  };

  const handleSpin = async () => {
    if (disabled || isAnimating) return;

    setIsAnimating(true);
    
    if (onSpinStart) {
      onSpinStart();
    }
    try {
      let finalRotation = rotation;
      if (onSpinRequest) {
        // Lấy targetId từ API
        const targetId = await onSpinRequest();
        pendingTargetIdRef.current = targetId;
        const targetIndex = Math.max(0, segments.findIndex(s => s.id === targetId));
        finalRotation = calculateFinalRotationForTarget(rotation, targetIndex);
      } else {
        // Fallback: random nếu không truyền onSpinRequest
        const randomAngle = Math.random() * 360;
        const fullRotations = 5 * 360;
        finalRotation = rotation + fullRotations + randomAngle;
      }

      setRotation(finalRotation);

      setTimeout(() => {
        setIsAnimating(false);
        const finalWheelAngle = (finalRotation % 360 + 360) % 360; // 0..359
        const segmentAngle = 360 / segments.length;
        const pointerBaseAngle = (
          pointerPosition === 'top' ? 90 :
          pointerPosition === 'right' ? 0 :
          pointerPosition === 'bottom' ? 270 :
          180
        );
        const angleFromPointer = (pointerBaseAngle + pointerOffsetDeg - finalWheelAngle + 360) % 360;
        const winningSegmentIndex = Math.floor((angleFromPointer + segmentAngle / 2) / segmentAngle) % segments.length;
        const winningSegment = segments[winningSegmentIndex];
        if (onSpinComplete) {
          onSpinComplete(winningSegment);
        }
        pendingTargetIdRef.current = null;
      }, 3000);
    } catch {
      setIsAnimating(false);
      pendingTargetIdRef.current = null;
    }
  };

  return (
    <div className="relative mx-auto w-[92vw] max-w-[500px] aspect-square">
      {/* Vòng quay chính */}
      <div
        className={`relative w-full h-full rounded-full border-4 sm:border-8 border-white shadow-2xl transition-transform duration-3000 ease-out`}
        style={{
          transform: `rotate(${rotation}deg)`,
          background: `conic-gradient(from 0deg, ${segments.map((segment, index) => 
            `${segment.color} ${index * (360 / segments.length)}deg ${(index + 1) * (360 / segments.length)}deg`
          ).join(', ')})`
        }}
      >
        {/* Text cho các phần - sử dụng SVG để hiển thị text tốt hơn */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
          {segments.map((segment, index) => {
            const angle = (360 / segments.length) * index;
            const textAngle = angle + (360 / segments.length) / 2;
            const radius = 180; // Bán kính để đặt text
            const x = 250 + radius * Math.cos((textAngle - 90) * Math.PI / 180);
            const y = 250 + radius * Math.sin((textAngle - 90) * Math.PI / 180);
            
            return (
              <g key={segment.id}>
                {/* Icon */}
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="20"
                  fill="white"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    transform: `rotate(${-textAngle}deg)`,
                    transformOrigin: `${x}px ${y}px`
                  }}
                >
                  {segment.icon}
                </text>
                {/* Text */}
                <text
                  x={x}
                  y={y + 15}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="white"
                  fontWeight="bold"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    transform: `rotate(${-textAngle}deg)`,
                    transformOrigin: `${x}px ${y}px`
                  }}
                >
                  {segment.text}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mũi tên chỉ thị - đặt chính giữa phía trên, chạm mép trong của vòng */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2 z-20 pointer-events-none">
        <div className="relative">
          {/* thân mũi tên (xoay ngược lại) */}
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] sm:border-l-[14px] sm:border-r-[14px] sm:border-b-[26px] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-md rotate-180"></div>
          {/* chấm nhọn */}
          <div className="absolute top-[17px] sm:top-[22px] left-1/2 -translate-x-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-600 rounded-full"></div>
          {/* gờ trắng để tạo cảm giác chạm mép */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-2.5 sm:h-3 bg-white rounded-b-full opacity-80"></div>
        </div>
      </div>

      {/* Nút quay ở giữa */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <button
          onClick={handleSpin}
          disabled={disabled || isAnimating}
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-2xl transition-all duration-200 ${
            disabled || isAnimating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 hover:scale-105 active:scale-95'
          }`}
        >
          <div className="text-white font-bold">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-xl sm:text-2xl mb-1">🎯</div>
                <div className="text-[10px] sm:text-sm font-bold">QUAY</div>
                <div className="text-[10px] sm:text-sm font-bold">NGAY</div>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Hiệu ứng quay */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-ping z-5 pointer-events-none"></div>
      )}
    </div>
  );
};

export default WorkingLuckyWheel;

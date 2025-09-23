import React, { useState } from 'react';

interface WheelSegment {
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
  pointerOffsetDeg = 0,
  pointerPosition = 'top'
}) => {
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Dữ liệu 18 phần với text ngắn gọn
  const segments: WheelSegment[] = [
    { id: '1', text: '1.000 VND', color: '#FF4444', icon: '📱' },
    { id: '2', text: '2.000 VND', color: '#CC0000', icon: '📞' },
    { id: '3', text: '5.000 VND', color: '#FF8800', icon: '🌐' },
    { id: '4', text: '10.000 VND', color: '#FFDD00', icon: '☁️' },
    { id: '5', text: '20.000 VND', color: '#88FF88', icon: '💰' },
    { id: '6', text: '50.000 VND', color: '#4488FF', icon: '💎' },
    { id: '7', text: 'THÊM LƯỢT', color: '#AA44FF', icon: '🔄' },
    { id: '8', text: 'x1 mảnh quần áo', color: '#0044AA', icon: '🔗' },
    { id: '9', text: 'x1 mảnh quần áo', color: '#006600', icon: '😄' },
    { id: '10', text: 'x1 mảnh túi xách', color: '#4488FF', icon: '🍀' },
    { id: '11', text: 'x1 mảnh túi xách', color: '#AA44FF', icon: '📧' },
    { id: '12', text: 'x1 mảnh dây chuyền', color: '#CC8844', icon: '✉️' },
    { id: '13', text: 'x1 mảnh dây chuyền', color: '#FF6B6B', icon: '📲' },
    { id: '14', text: 'x1 mảnh vòng tay', color: '#4ECDC4', icon: '📶' },
    { id: '15', text: 'x1 mảnh vòng tay', color: '#45B7D1', icon: '💵' },
    { id: '16', text: 'x1 mảnh 100.000 VND', color: '#F7DC6F', icon: '🏆' },
    { id: '17', text: 'x1 mảnh 200.000 VND', color: '#BB8FCE', icon: '💌' },
    { id: '18', text: 'x1 mảnh 500.000 VND', color: '#85C1E9', icon: '🎁' }
  ];

  const handleSpin = () => {
    if (disabled || isAnimating) return;

    setIsAnimating(true);
    
    if (onSpinStart) {
      onSpinStart();
    }
    
    // Tạo góc quay ngẫu nhiên
    const randomAngle = Math.random() * 360;
    const fullRotations = 5 * 360;
    const finalRotation = rotation + fullRotations + randomAngle;
    
    // Đặt transform tới góc đích bằng CSS transition (không dùng thêm animation lớp)
    setRotation(finalRotation);

    setTimeout(() => {
      setIsAnimating(false);
      // Tính góc thực tế của bánh xe sau khi dừng
      const finalWheelAngle = (finalRotation % 360 + 360) % 360; // 0..359
      const segmentAngle = 360 / segments.length;
      // Góc mũi tên theo vị trí
      const pointerBaseAngle = (
        pointerPosition === 'top' ? 90 :
        pointerPosition === 'right' ? 0 :
        pointerPosition === 'bottom' ? 270 :
        180
      );
      // Màu dưới mũi tên sau khi quay góc A là tại (pointerBaseAngle - A)
      const angleFromPointer = (pointerBaseAngle + pointerOffsetDeg - finalWheelAngle + 360) % 360;
      // Chọn ô gần nhất theo tâm để tránh lệch do viền/mũi tên
      const winningSegmentIndex = Math.floor((angleFromPointer + segmentAngle / 2) / segmentAngle) % segments.length;
      const winningSegment = segments[winningSegmentIndex];
      
      if (onSpinComplete) {
        onSpinComplete(winningSegment);
      }
    }, 3000);
  };

  return (
    <div className="relative w-[500px] h-[500px] mx-auto">
      {/* Vòng quay chính */}
      <div
        className={`relative w-full h-full rounded-full border-8 border-white shadow-2xl transition-transform duration-3000 ease-out`}
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
                  fontSize="24"
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
                  fontSize="12"
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
          <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-b-[26px] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-md rotate-180"></div>
          {/* chấm nhọn */}
          <div className="absolute top-[22px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-red-600 rounded-full"></div>
          {/* gờ trắng để tạo cảm giác chạm mép */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-3 bg-white rounded-b-full opacity-80"></div>
        </div>
      </div>

      {/* Nút quay ở giữa */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <button
          onClick={handleSpin}
          disabled={disabled || isAnimating}
          className={`w-24 h-24 rounded-full border-4 border-white shadow-2xl transition-all duration-200 ${
            disabled || isAnimating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 hover:scale-105 active:scale-95'
          }`}
        >
          <div className="text-white font-bold">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-sm font-bold">QUAY</div>
                <div className="text-sm font-bold">NGAY</div>
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

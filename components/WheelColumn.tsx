
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Item {
  value: number;
  label: string;
}

interface WheelColumnProps {
  items: Item[];
  value: number;
  onValueChange: (val: number) => void;
}

const ITEM_HEIGHT = 40; // px
const VISIBLE_ITEMS = 5;

export const WheelColumn: React.FC<WheelColumnProps> = ({ items, value, onValueChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelTime = useRef(0);
  const isScrollingByWheel = useRef(false);
  const [isReady, setIsReady] = useState(false);

  // スクロール位置の同期関数
  const syncScroll = useCallback(() => {
    if (containerRef.current) {
      const index = items.findIndex((item) => item.value === value);
      if (index !== -1) {
        containerRef.current.scrollTop = index * ITEM_HEIGHT;
      }
    }
  }, [items, value]);

  // マウント時および値変更時の同期
  useEffect(() => {
    syncScroll();
    
    // 初回マウント時、レンダリング直後に再実行して位置を確実にする
    if (!isReady) {
      const timer = setTimeout(() => {
        syncScroll();
        setIsReady(true);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [syncScroll, isReady]);

  // マウスホイールの厳密制御
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelManual = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime.current < 150) return;
      lastWheelTime.current = now;

      isScrollingByWheel.current = true;
      const direction = Math.sign(e.deltaY); 
      const currentIndex = items.findIndex(item => item.value === value);
      
      let nextIndex = currentIndex;
      if (direction > 0 && currentIndex < items.length - 1) {
        nextIndex = currentIndex + 1;
      } else if (direction < 0 && currentIndex > 0) {
        nextIndex = currentIndex - 1;
      }

      if (nextIndex !== currentIndex) {
        onValueChange(items[nextIndex].value);
      }

      setTimeout(() => {
        isScrollingByWheel.current = false;
      }, 200);
    };

    container.addEventListener('wheel', handleWheelManual, { passive: false });
    return () => container.removeEventListener('wheel', handleWheelManual);
  }, [items, value, onValueChange]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isScrollingByWheel.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const selectedItem = items[index];
    if (selectedItem && selectedItem.value !== value) {
      onValueChange(selectedItem.value);
    }
  }, [items, value, onValueChange]);

  const paddingHeight = (VISIBLE_ITEMS - 1) * ITEM_HEIGHT / 2;

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto no-scrollbar relative w-full flex flex-col items-center"
      style={{ 
        height: `${VISIBLE_ITEMS * ITEM_HEIGHT}px`,
        scrollSnapType: isScrollingByWheel.current ? 'none' : 'y mandatory',
        overscrollBehavior: 'none',
        perspective: '1000px' // インラインで指定して確実に適用
      }}
    >
      <div style={{ height: `${paddingHeight}px`, flexShrink: 0 }} />
      {items.map((item, idx) => (
        <WheelItem 
          key={item.value} 
          label={item.label} 
          isSelected={item.value === value}
          containerRef={containerRef}
          index={idx}
        />
      ))}
      <div style={{ height: `${paddingHeight}px`, flexShrink: 0 }} />
    </div>
  );
};

interface WheelItemProps {
  label: string;
  isSelected: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  index: number;
}

const WheelItem: React.FC<WheelItemProps> = ({ label, isSelected, containerRef, index }) => {
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotateX, setRotateX] = useState(0);

  useEffect(() => {
    const updateStyles = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const itemTop = index * ITEM_HEIGHT;
      const distanceFromCenter = itemTop - container.scrollTop;
      const absDistance = Math.abs(distanceFromCenter);
      const maxDistance = ITEM_HEIGHT * 2.5;
      
      setOpacity(Math.max(0.2, 1 - (absDistance / maxDistance)));
      setScale(Math.max(0.8, 1.05 - (absDistance / (maxDistance * 3))));
      setRotateX((distanceFromCenter / ITEM_HEIGHT) * -18);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateStyles, { passive: true });
      updateStyles();
    }
    return () => container?.removeEventListener('scroll', updateStyles);
  }, [index, containerRef]);

  return (
    <div 
      className={`flex items-center justify-center w-full cursor-pointer select-none transition-colors duration-200 ${
        isSelected ? 'text-blue-600 font-bold' : 'text-gray-400 font-medium'
      }`}
      style={{ 
        height: `${ITEM_HEIGHT}px`,
        opacity,
        transform: `scale(${scale}) rotateX(${rotateX}deg)`,
        scrollSnapAlign: 'center',
        flexShrink: 0
      }}
    >
      <span className="text-lg leading-none whitespace-nowrap">{label}</span>
    </div>
  );
};

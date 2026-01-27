import React, { useEffect, useRef } from "react";

interface LeafConfig {
  maxLeaves: number;
  leafInterval: number;
  minSize: number;
  maxSize: number;
  minDuration: number;
  maxDuration: number;
  leafLifetime: number;
}

const defaultConfig: LeafConfig = {
  maxLeaves: 15,
  leafInterval: 300,
  minSize: 8,
  maxSize: 16,
  minDuration: 2,
  maxDuration: 5,
  leafLifetime: 5000,
};

const FallingLeaves: React.FC<{ config?: Partial<LeafConfig> }> = ({
  config = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leafCountRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const finalConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    const createLeaf = () => {
      if (!containerRef.current || leafCountRef.current >= finalConfig.maxLeaves) {
        return;
      }

      const leaf = document.createElement("div");
      leaf.className = "falling-leaf";

      const left = Math.random() * 100;
      const duration = Math.random() * (finalConfig.maxDuration - finalConfig.minDuration) + finalConfig.minDuration;
      const delay = Math.random() * 2;
      const size = Math.random() * (finalConfig.maxSize - finalConfig.minSize) + finalConfig.minSize;
      const startY = -50 - Math.random() * 50; 

      leaf.style.cssText = `
        left: ${left}%;
        top: ${startY}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        width: ${size}px;
        height: ${size}px;
      `;

      if (Math.random() > 0.5) {
        leaf.classList.add("leaf-variant-1");
      }
      if (Math.random() > 0.66) {
        leaf.classList.add("leaf-variant-2");
      }

      containerRef.current.appendChild(leaf);
      leafCountRef.current++;

      setTimeout(() => {
        if (leaf.parentNode) {
          leaf.parentNode.removeChild(leaf);
          leafCountRef.current--;
        }
      }, (duration + delay) * 1000);
    };

    for (let i = 0; i < Math.min(10, finalConfig.maxLeaves); i++) {
      setTimeout(createLeaf, i * 200);
    }

    intervalRef.current = window.setInterval(createLeaf, finalConfig.leafInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [finalConfig.maxLeaves, finalConfig.leafInterval, finalConfig.minDuration, finalConfig.maxDuration, finalConfig.minSize, finalConfig.maxSize]);

  return (
    <>
      <style>{`
        .falling-leaves-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .falling-leaf {
          position: absolute;
          width: 12px;
          height: 12px;
          background: #4ade80;
          border-radius: 0 100% 0 100%;
          animation: leaf-fall linear forwards;
          opacity: 0.8;
          box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
          will-change: transform;
        }

        .falling-leaf::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 2px;
          height: 8px;
          background: #22c55e;
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .falling-leaf.leaf-variant-1 {
          background: #22c55e;
          border-radius: 100% 0 100% 0;
        }

        .falling-leaf.leaf-variant-2 {
          background: #16a34a;
        }

        @keyframes leaf-fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      <div className="falling-leaves-container" ref={containerRef} />
    </>
  );
};

export default FallingLeaves;
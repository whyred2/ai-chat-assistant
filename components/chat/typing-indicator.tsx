"use client";

import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div
      className={cn("flex items-center gap-3 px-2", className)}
      aria-label="typing"
      role="status"
    >
      <style jsx>{`
        /* Анимация дыхания для главной звезды */
        @keyframes star-breathe {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
            filter: drop-shadow(0 0 5px currentColor);
          }
        }

        @keyframes sparkle-spin {
          0% {
            transform: rotate(0deg) scale(0.8);
            opacity: 0.7;
          }
          50% {
            transform: rotate(180deg) scale(1.3);
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) scale(0.8);
            opacity: 0.7;
          }
        }

        @keyframes dot-pulse {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }

        .animate-main-star {
          transform-origin: center;
          animation: star-breathe 2.5s ease-in-out infinite;
        }

        .animate-top-sparkle {
          transform-origin: 20px 4px;
          animation: sparkle-spin 4s linear infinite;
        }

        .animate-bottom-dot {
          transform-origin: 4px 20px;
          animation: dot-pulse 2s ease-in-out infinite alternate;
        }
      `}</style>

      <div className="text-primary relative size-6 shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-sparkles h-full w-full overflow-visible"
        >
          {/* Главная большая звезда */}
          <path
            d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
            className="animate-main-star"
          />

          {/* Верхняя искра */}
          <g className="animate-top-sparkle">
            <path d="M20 2v4" />
            <path d="M22 4h-4" />
          </g>

          {/* Нижняя точка */}
          <circle cx="4" cy="20" r="2" className="animate-bottom-dot" />
        </svg>
      </div>

      <span className="animate-pulse text-base font-medium">Typing...</span>
    </div>
  );
}

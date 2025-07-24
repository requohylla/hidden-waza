"use client";

import React, { useState, useEffect } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

type Props = {
  markdown: string;
  Demo: React.ComponentType;
};

export default function ResponsiveProjectPage({ markdown, Demo }: Props) {
  const [showDesc, setShowDesc] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    setShowPopup(true);
    const timer = setTimeout(() => setShowPopup(false), 2500);
    return () => clearTimeout(timer);
  }, [isMobile]);

  if (isMobile) {
    // スマホ：機能メイン＋説明ボタンのみ（説明欄は完全非表示）
    return (
      <div className="relative">
        <Demo />
        <button
          className="fixed bottom-6 right-6 z-20 bg-blue-600 text-white p-3 rounded-full shadow flex items-center justify-center"
          onClick={() => setShowDesc(true)}
          aria-label="説明を見る"
        >
          <InformationCircleIcon className="w-7 h-7" />
        </button>
        {/* ポップアップ（説明見れます） */}
        {showPopup && !showDesc && (
          <div
            className={`fixed bottom-20 right-6 z-20 bg-white text-blue-600 px-4 py-2 rounded-lg shadow text-xs flex items-center gap-2 transition-all duration-500 ${
              showPopup ? 'animate-popup-in opacity-100 scale-100' : 'animate-popup-out opacity-0 scale-80'
            }`}
          >
            <span className="inline-block w-3 h-3 bg-white border-b border-r border-blue-600 rotate-45 -ml-2 mr-1"></span>
            <InformationCircleIcon className="w-5 h-5 mr-1" />
            <span>タップで説明を表示</span>
            <style>
              {`
                @keyframes popup-in {
                  0% {
                    opacity: 0;
                    transform: scale(0.8) translateY(20px);
                  }
                  60% {
                    opacity: 1;
                    transform: scale(1.05) translateY(-4px);
                  }
                  100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                  }
                }
                @keyframes popup-out {
                  0% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                  }
                  100% {
                    opacity: 0;
                    transform: scale(0.8) translateY(20px);
                  }
                }
                .animate-popup-in {
                  animation: popup-in 0.5s cubic-bezier(.4,0,.2,1);
                }
                .animate-popup-out {
                  animation: popup-out 0.5s cubic-bezier(.4,0,.2,1);
                }
              `}
            </style>
          </div>
        )}
        {/* 説明オーバーレイ */}
        {showDesc && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-30 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg max-w-[90vw] max-h-[80vh] overflow-auto p-4 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                onClick={() => setShowDesc(false)}
                aria-label="閉じる"
              >
                ×
              </button>
              <pre className="whitespace-pre-wrap text-sm">
                <code>{markdown}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    );
  }

  // PC表示のみ左右分割で説明欄を表示
  return (
    <div className="split-view grid md:grid-cols-2">
      <section className="code-view">
        <pre>
          <code>{markdown}</code>
        </pre>
      </section>
      <section className="demo-view">
        <Demo />
      </section>
    </div>
  );
}
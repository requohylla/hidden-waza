"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

type Props = {
  markdown: string;
  Demo: React.ComponentType;
};

export default function ResponsiveProjectPage({ markdown, Demo }: Props) {
  const [showDesc, setShowDesc] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [splitRatio, setSplitRatio] = useState(70); // デフォルト7:3
  const [isResizing, setIsResizing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false); // 1画面表示モード
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // クライアントマウント後にのみ実行
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!mounted || !isMobile) return;
    setShowPopup(true);
    const timer = setTimeout(() => setShowPopup(false), 2500);
    return () => clearTimeout(timer);
  }, [isMobile, mounted]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const newRatio = Math.max(20, Math.min(80, ((e.clientX - rect.left) / rect.width) * 100));
    setSplitRatio(newRatio);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleResizerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // マウント前は最小限の表示
  if (!mounted) {
    return (
      <div className="relative">
        <Demo />
      </div>
    );
  }

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
            <style jsx>{`
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
            `}</style>
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

  // PC表示：リサイズ可能な分割ビューまたは1画面表示
  if (isFullScreen) {
    return (
      <div className="relative w-full h-screen">
        <Demo />
        <button
          className="absolute top-4 right-4 z-10 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-lg transition-colors"
          onClick={toggleFullScreen}
        >
          2画面表示
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-screen relative"
      style={{ 
        display: 'flex',
        flexDirection: 'row',
        cursor: isResizing ? 'ew-resize' : 'default'
      }}
    >
      {/* 左側：説明欄 */}
      <div
        className="bg-gray-50 border-r border-gray-200 overflow-auto"
        style={{ 
          width: `${splitRatio}%`, 
          minWidth: '200px',
          flexShrink: 0
        }}
      >
        <div className="p-4">
          <pre className="whitespace-pre-wrap text-sm">
            <code>{markdown}</code>
          </pre>
        </div>
      </div>

      {/* リサイザー */}
      <div
        className="bg-gray-300 hover:bg-gray-400 cursor-ew-resize transition-colors"
        style={{
          width: '4px',
          flexShrink: 0
        }}
        onMouseDown={handleResizerMouseDown}
      />

      {/* 右側：デモ画面 */}
      <div
        className="relative overflow-auto"
        style={{ 
          width: `${100 - splitRatio}%`,
          minWidth: '200px',
          flexShrink: 0
        }}
      >
        <Demo />
        <button
          className="absolute top-4 right-4 z-10 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-lg transition-colors"
          onClick={toggleFullScreen}
        >
          1画面表示
        </button>
      </div>
    </div>
  );
}
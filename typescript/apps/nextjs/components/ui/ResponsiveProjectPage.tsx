"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { InformationCircleIcon, ArrowsPointingOutIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

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

  // ローディング画面
  if (!mounted) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-sm">読み込み中...</p>
        </div>
      </div>
    );
  }

  // ツールバーコンポーネント
  const Toolbar = ({ children }: { children: React.ReactNode }) => (
    <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 flex-shrink-0">
      {children}
    </div>
  );

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
          <div className="fixed inset-0 bg-black bg-opacity-60 z-30 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full h-full max-w-none max-h-none overflow-hidden relative flex flex-col">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl z-40"
                onClick={() => setShowDesc(false)}
                aria-label="閉じる"
              >
                ×
              </button>
              <div className="flex-1 overflow-hidden pt-8">
                <TabSection markdown={markdown} isMobile={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // PC表示：リサイズ可能な分割ビューまたは1画面表示
  if (isFullScreen) {
    return (
      <div className="w-full h-screen flex flex-col">
        <Toolbar>
          <button
            className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-md shadow-sm border border-gray-200 transition-all duration-200 flex items-center gap-2"
            onClick={toggleFullScreen}
            aria-label="2画面表示に戻る"
            title="2画面表示に戻る"
          >
            <Squares2X2Icon className="w-4 h-4" />
            <span className="text-sm">2画面表示</span>
          </button>
        </Toolbar>
        <div className="flex-1 bg-white overflow-auto">
          <Demo />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <Toolbar>
        <button
          className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-md shadow-sm border border-gray-200 transition-all duration-200 flex items-center gap-2"
          onClick={toggleFullScreen}
          aria-label="1画面表示に切り替え"
          title="1画面表示に切り替え"
        >
          <ArrowsPointingOutIcon className="w-4 h-4" />
          <span className="text-sm">1画面表示</span>
        </button>
      </Toolbar>
      {/* メインコンテンツ領域 */}
      <div
        ref={containerRef}
        className="flex-1 flex"
        style={{
          cursor: isResizing ? 'ew-resize' : 'default'
        }}
      >
        {/* 左側：デモ画面 */}
        <div
          className="bg-white overflow-auto"
          style={{
            width: `${splitRatio}%`,
            minWidth: '200px',
            flexShrink: 0
          }}
        >
          <Demo />
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
        {/* 右側：説明欄（タブUI） */}
        <div
          className="bg-white border-l border-gray-200 overflow-auto"
          style={{
            width: `${100 - splitRatio}%`,
            minWidth: '200px',
            flexShrink: 0
          }}
        >
          <TabSection markdown={markdown} />
        </div>
      </div>
    </div>
  );
}

// --- タブ切り替え説明欄 ---
function TabSection({ markdown, isMobile = false }: { markdown: string; isMobile?: boolean }) {
  // 見出し抽出
  const headings = markdown
    .split('\n')
    .map(line => {
      const match = line.match(/^(#{1,3})\s+(.*)/);
      if (match) {
        return {
          level: match[1].length,
          text: match[2].trim(),
          id: encodeURIComponent(match[2].trim().replace(/\s+/g, '-').replace(/[^\w\-ぁ-んァ-ン一-龥]/g, '')),
        };
      }
      return null;
    })
    .filter(Boolean) as { level: number; text: string; id: string }[];

  const [activeTab, setActiveTab] = React.useState(headings[0]?.id ?? '');

  // 指定見出しのみ抽出
  function extractSection(id: string) {
    const lines = markdown.split('\n');
    let found = false;
    let section: string[] = [];
    let currentLevel = 0;
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/^(#{1,3})\s+(.*)/);
      if (match) {
        const thisId = encodeURIComponent(match[2].trim().replace(/\s+/g, '-').replace(/[^\w\-ぁ-んァ-ン一-龥]/g, ''));
        if (thisId === id) {
          found = true;
          currentLevel = match[1].length;
          section.push(lines[i]);
          continue;
        }
        if (found && match[1].length <= currentLevel) {
          break;
        }
      }
      if (found) section.push(lines[i]);
    }
    return section.join('\n');
  }

  return (
    <div className="h-full flex flex-col">
      {/* ブラウザタブ風のタブバー */}
      <div className="relative bg-gray-200 border-b border-gray-300">
        <div className="flex overflow-x-auto scrollbar-hide">
          {headings.map(h => (
            <button
              key={h.id}
              className={`relative flex-shrink-0 transition-all duration-200 border-r border-gray-300 min-w-max ${
                isMobile
                  ? 'px-3 py-3 text-xs'
                  : 'px-4 py-2 text-sm'
              } font-medium ${
                activeTab === h.id
                  ? 'bg-white text-gray-900 border-t-2 border-t-blue-500'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab(h.id)}
            >
              <span className={`flex items-center whitespace-nowrap ${
                isMobile ? 'gap-1' : 'gap-2'
              }`}>
                {/* アクティブタブのアイコン */}
                {activeTab === h.id && (
                  <span className={`bg-blue-500 rounded-full ${
                    isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'
                  }`} />
                )}
                {h.text}
                {/* 閉じるボタン風の装飾 */}
                {!isMobile && (
                  <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center transition-colors ${
                    activeTab === h.id
                      ? 'hover:bg-gray-200 text-gray-500'
                      : 'opacity-0'
                  }`}>
                    ×
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
        {/* カスタムスクロールバースタイル */}
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
      
      {/* コンテンツエリア */}
      <div className={`flex-1 prose prose-sm max-w-none bg-white overflow-auto ${
        isMobile ? 'p-4' : 'p-6'
      }`}>
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-6" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4" {...props} />,
            p: ({node, ...props}) => <p className="text-gray-600 mb-3 leading-relaxed" {...props} />,
            code: ({node, ...props}: any) =>
              props.inline
                ? <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                : <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono" {...props} />,
            pre: ({node, ...props}) => <pre className="bg-gray-900 rounded-lg overflow-x-auto mb-4" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-600 mb-3 space-y-1" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-600 mb-3 space-y-1" {...props} />,
            li: ({node, ...props}) => <li className="ml-2" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4" {...props} />,
            a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,
            strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
            em: ({node, ...props}) => <em className="italic text-gray-700" {...props} />,
          }}
        >
          {extractSection(activeTab)}
        </ReactMarkdown>
      </div>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import { getProjects, ProjectCardProps } from '../../data/projects';
import { ProjectCard } from './ProjectCard';
// Heroicons例: https://heroicons.com/
import { InformationCircleIcon } from '@heroicons/react/24/outline';
// デバッグ用: アイコン表示テスト

interface ProjectCardListProps {
  locale: string;
  category?: string;
}

export const ProjectCardList: React.FC<ProjectCardListProps> = ({ locale, category }) => {
  const projectsByCategory = getProjects(locale);

  // category指定時はそのカテゴリのみ表示
  const entries = category
    ? Object.entries(projectsByCategory).filter(([cat]) => cat === category)
    : Object.entries(projectsByCategory);

  return (
    <div>
      {entries.map(([category, { categoryCommon, items }]) => {
        return (
          <section key={category} className="mb-12">
            <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">{category}</h2>
              {categoryCommon?.description ? (
                <Tooltip text={categoryCommon.description}>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 transition"
                    aria-label="説明を表示"
                    tabIndex={0}
                  >
                    <InformationCircleIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </Tooltip>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-7 h-7 rounded bg-gray-50"
                  aria-label="説明アイコン"
                  tabIndex={0}
                  disabled
                >
                  <InformationCircleIcon className="w-5 h-5 text-gray-300" />
                </button>
              )}
            </div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ProjectCard key={item.slug} {...item} />
              ))}
            </div>
            <hr className="mt-10 border-t-2 border-blue-200" />
          </section>
        );
      })}
    </div>
  );
};

// シンプルなTooltipコンポーネント
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({
  text,
  children,
}) => {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      style={{ cursor: 'pointer' }}
    >
      {children}
      {show && (
        <span className="absolute right-0 top-full mt-2 px-2 py-1 bg-black text-white text-xs rounded z-10 whitespace-nowrap">
          {text}
        </span>
      )}
    </span>
  );
};
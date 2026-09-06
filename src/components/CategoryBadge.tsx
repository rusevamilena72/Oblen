import React from 'react';
import { Cat, Sofa, Gem, LucideIcon } from 'lucide-react';

type CategoryKey = 'cat-climbers' | 'for-home' | 'jewelry';

const CATEGORY_META: Record<CategoryKey, { label: string; icon: LucideIcon }> = {
  'cat-climbers': { label: 'Катерушки за котки', icon: Cat },
  'for-home': { label: 'Декорации за дома', icon: Sofa },
  jewelry: { label: 'Накити', icon: Gem },
};

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

// Едно и също оформление за всички категории — разграничението е по
// икона и текст, не по различен цвят, за да остане брандът единен.
const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className = '' }) => {
  const meta = CATEGORY_META[category as CategoryKey];
  const Icon = meta?.icon ?? Sofa;
  const label = meta?.label ?? category;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-wood-100 px-3 py-1 text-xs font-medium text-wood-700 ${className}`}
    >
      <Icon size={13} />
      <span>{label}</span>
    </span>
  );
};

export default CategoryBadge;

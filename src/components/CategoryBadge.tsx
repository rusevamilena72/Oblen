import React from 'react';
import { Link } from 'react-router-dom';
import { Cat, Sofa, Gem, LucideIcon } from 'lucide-react';

type CategoryKey = 'cat-climbers' | 'for-home' | 'jewelry';

const CATEGORY_META: Record<CategoryKey, { label: string; icon: LucideIcon }> = {
  'cat-climbers': { label: 'Катерушки за котки', icon: Cat },
  'for-home': { label: 'Декорации за дома', icon: Sofa },
  jewelry: { label: 'Накити', icon: Gem },
};

interface CategoryBadgeProps {
  category: string;
  /** Ако е зададено, етикетът става истински бутон-връзка към страницата на категорията. */
  to?: string;
  className?: string;
}

// Едно и също оформление за всички категории — разграничението е по
// икона и текст, не по различен цвят, за да остане брандът единен.
const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, to, className = '' }) => {
  const meta = CATEGORY_META[category as CategoryKey];
  const Icon = meta?.icon ?? Sofa;
  const label = meta?.label ?? category;

  const baseClasses = `inline-flex items-center gap-1.5 rounded-full bg-wood-100 px-3 py-1 text-xs font-medium text-wood-700 ${className}`;

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseClasses} hover:bg-wood-200 hover:text-wood-800 transition-colors`}
      >
        <Icon size={13} />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <span className={baseClasses}>
      <Icon size={13} />
      <span>{label}</span>
    </span>
  );
};

export default CategoryBadge;

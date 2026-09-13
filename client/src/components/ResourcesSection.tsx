import React, { useState, useMemo } from 'react';
import type { ResourceItem } from '../types';
import { Search, ExternalLink, BookOpen, Code2, FileText, Compass, Sparkles, HelpCircle } from 'lucide-react';

interface ResourcesSectionProps {
  resources: ResourceItem[];
}

const CATEGORIES = [
  'All',
  'Roadmaps',
  'Interview Questions',
  'Company PYQs',
  'Guides & Articles',
  'Resume & Profile Tools',
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Roadmaps':
      return <Compass style={{ width: '14px', height: '14px' }} />;
    case 'Interview Questions':
      return <HelpCircle style={{ width: '14px', height: '14px' }} />;
    case 'Company PYQs':
      return <Code2 style={{ width: '14px', height: '14px' }} />;
    case 'Guides & Articles':
      return <BookOpen style={{ width: '14px', height: '14px' }} />;
    case 'Resume & Profile Tools':
      return <FileText style={{ width: '14px', height: '14px' }} />;
    default:
      return <Sparkles style={{ width: '14px', height: '14px' }} />;
  }
};

const getCategoryBadgeColor = (category: string) => {
  switch (category) {
    case 'Roadmaps':
      return { bg: 'rgba(10, 132, 255, 0.12)', text: 'var(--accent-blue)', border: 'rgba(10, 132, 255, 0.28)' };
    case 'Interview Questions':
      return { bg: 'rgba(191, 90, 242, 0.12)', text: 'var(--accent-purple)', border: 'rgba(191, 90, 242, 0.28)' };
    case 'Company PYQs':
      return { bg: 'rgba(255, 159, 10, 0.12)', text: 'var(--accent-orange)', border: 'rgba(255, 159, 10, 0.28)' };
    case 'Guides & Articles':
      return { bg: 'rgba(48, 209, 88, 0.12)', text: 'var(--accent-green)', border: 'rgba(48, 209, 88, 0.28)' };
    case 'Resume & Profile Tools':
      return { bg: 'rgba(255, 55, 95, 0.12)', text: 'var(--accent-pink)', border: 'rgba(255, 55, 95, 0.28)' };
    default:
      return { bg: 'var(--nav-track-bg)', text: 'var(--text-primary)', border: 'var(--border-subtle)' };
  }
};

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ resources }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        res.title.toLowerCase().includes(q) ||
        res.category.toLowerCase().includes(q) ||
        (res.description && res.description.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [resources, selectedCategory, searchQuery]);

  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      {/* Top Glass Control Bar */}
      <div
        style={{
          padding: '24px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--accent-blue)',
                boxShadow: '0 0 10px var(--accent-blue)',
              }}
            />
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '20px',
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}
            >
              Career & Interview Preparation Resources
            </h2>
            <span
              style={{
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                background: 'var(--nav-track-bg)',
                color: 'var(--text-secondary)',
                padding: '3px 10px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {filteredResources.length} resources
            </span>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '14px',
                height: '14px',
                color: 'var(--text-tertiary)',
              }}
            />
            <input
              type="text"
              placeholder="Search roadmaps, PYQs, guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '36px',
                paddingRight: '14px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: '13px',
                borderRadius: '980px',
              }}
            />
          </div>
        </div>

        {/* Category Pills Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All' ? resources.length : resources.filter((r) => r.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="btn-glass"
                style={{
                  fontSize: '12px',
                  padding: '6px 16px',
                  borderRadius: '980px',
                  background: isSelected ? 'var(--tab-active-bg)' : 'var(--nav-track-bg)',
                  borderColor: isSelected ? 'var(--tab-active-border)' : 'var(--border-subtle)',
                  color: isSelected ? 'var(--tab-active-text)' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 700 : 500,
                  boxShadow: isSelected ? 'var(--tab-active-shadow)' : 'none',
                  transition: 'all 0.18s ease',
                }}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    opacity: 0.7,
                    marginLeft: '2px',
                  }}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div
        style={{
          padding: '28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          maxHeight: '72vh',
          overflowY: 'auto',
        }}
      >
        {filteredResources.map((item) => {
          const badge = getCategoryBadgeColor(item.category);

          return (
            <div
              key={item.id}
              className="glass-surface"
              style={{
                padding: '20px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                cursor: 'pointer',
              }}
              onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-display)',
                      background: badge.bg,
                      color: badge.text,
                      border: `1px solid ${badge.border}`,
                      padding: '3px 10px',
                      borderRadius: '980px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {getCategoryIcon(item.category)}
                    <span>{item.category}</span>
                  </span>

                  <ExternalLink style={{ width: '14px', height: '14px', color: 'var(--text-tertiary)', opacity: 0.8 }} />
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '16px',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.35,
                    marginBottom: '6px',
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {item.description}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--accent-blue)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Open Resource ↗
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

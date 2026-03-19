import React from 'react';
import Link from '@docusaurus/Link';
import styles from './ModuleCard.module.css';
import { renderIcon } from '@site/src/utils/iconMap';
import modulesData from '@site/src/data/modules.json';

export interface ModuleFeature {
  icon: string;
  name: string;
  description: string;
}

export interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  color: string;
  logo: string;
  coverImage?: string;
  badge?: 'free' | 'pro' | 'coming-soon' | 'beta' | 'new';
  href: string;
  features?: ModuleFeature[];
  dependencies?: string[];
}

const BADGE_LABELS: Record<string, string> = {
  free: 'Free',
  pro: 'Pro',
  'coming-soon': 'Coming Soon',
  beta: 'Beta',
  new: 'New',
};

const BADGE_CLASSES: Record<string, string> = {
  free: styles.badge_free,
  pro: styles.badge_pro,
  'coming-soon': styles.badge_coming_soon,
  beta: styles.badge_beta,
  new: styles.badge_new,
};

function resolveDependencyTitle(id: string): string {
  const mod = modulesData.modules.find(m => m.id === id);
  return mod ? mod.title : id;
}

export default function ModuleCard({
  title,
  description,
  color,
  logo,
  coverImage,
  badge,
  href,
  features = [],
  dependencies = [],
}: ModuleCardProps): JSX.Element {
  const coverStyle = !coverImage
    ? { background: `linear-gradient(135deg, ${color}88, ${color}33)` }
    : undefined;

  return (
    <div className={styles.moduleCard}>
      {/* Cover — overflow:hidden clips the image; logo lives outside */}
      <div className={styles.cover} style={coverStyle}>
        {coverImage && (
          <img src={coverImage} alt={`${title} cover`} className={styles.coverImage} />
        )}
        {badge && (
          <div className={`${styles.badge} ${BADGE_CLASSES[badge] ?? ''}`}>
            {BADGE_LABELS[badge]}
          </div>
        )}
      </div>

      {/* Logo outside cover so it isn't clipped */}
      <div className={styles.logo} style={{ borderColor: `${color}55` }}>
        {renderIcon(logo, 28, color)}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        {features.length > 0 && (
          <div className={styles.featuresRow}>
            {features.map(feature => (
              <button
                key={feature.name}
                className={styles.featureIcon}
                aria-label={feature.name}
              >
                {renderIcon(feature.icon, 16)}
                <div className={styles.popover}>
                  <div className={styles.popoverName}>{feature.name}</div>
                  <div className={styles.popoverDesc}>{feature.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          {dependencies.length > 0 && (
            <span className={styles.dependencies}>
              Requires: {dependencies.map(resolveDependencyTitle).join(', ')}
            </span>
          )}
          <Link to={href} className={styles.link}>
            View docs →
          </Link>
        </div>
      </div>
    </div>
  );
}

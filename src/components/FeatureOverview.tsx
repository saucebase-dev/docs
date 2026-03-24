import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import styles from './FeatureOverview.module.css';
import { renderIcon } from '@site/src/utils/iconMap';
import modulesData from '@site/src/data/modules.json';

const COLLAPSE_AT = 7;


interface Feature {
  icon: string;
  name: string;
  description: string;
  details: string;
}

function FeatureGroup({
  title,
  href,
  color,
  logo,
  features,
}: {
  title: string;
  href?: string;
  color: string;
  logo: string;
  features: Feature[];
}): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = expanded ? features : features.slice(0, COLLAPSE_AT);
  const hasMore = features.length > COLLAPSE_AT;

  function toggleFeature(i: number) {
    setOpenIndex(prev => (prev === i ? null : i));
  }

  return (
    <div className={styles.group}>
      <div className={styles.groupHeader} style={{ background: color }}>
        <span className={styles.groupLogo}>{renderIcon(logo, 18, color)}</span>
        {href ? (
          <Link to={href} className={styles.groupTitle}>{title}</Link>
        ) : (
          <span className={styles.groupTitle}>{title}</span>
        )}
      </div>

      <ul className={styles.featureList}>
        {visible.map((f, i) => (
          <li key={f.name}>
            <button
              className={styles.featureRow}
              onClick={() => toggleFeature(i)}
              aria-expanded={openIndex === i}
            >
              <span className={styles.featureIcon}>{renderIcon(f.icon, 13)}</span>
              <span className={styles.featureName}>{f.name}</span>
              <span className={`${styles.chevron} ${openIndex === i ? styles.chevronOpen : ''}`}>
                {renderIcon('lucide:chevron-down', 13)}
              </span>
            </button>
            {openIndex === i && (
              <p className={styles.featureDesc}>{f.details}</p>
            )}
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          className={styles.seeMore}
          style={{ color }}
          onClick={() => {
            setExpanded(e => !e);
            setOpenIndex(null);
          }}
        >
          {expanded
            ? `Show less`
            : `+${features.length - COLLAPSE_AT} more`}
        </button>
      )}
    </div>
  );
}

export default function FeatureOverview(): JSX.Element {
  const availableModules = modulesData.modules.filter(m => m.badge !== 'coming-soon');

  return (
    <div className={styles.grid}>
      <FeatureGroup
        title="Core"
        color="#334155"
        logo="lucide:box"
        features={modulesData.core}
      />
      {availableModules.map(mod => (
        <FeatureGroup
          key={mod.id}
          title={mod.title}
          href={mod.href}
          color={mod.color}
          logo={mod.logo}
          features={mod.features}
        />
      ))}
    </div>
  );
}

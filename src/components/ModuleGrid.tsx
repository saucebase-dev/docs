import React from 'react';
import styles from './ModuleGrid.module.css';
import ModuleCard from './ModuleCard';
import modulesData from '@site/src/data/modules.json';

export interface ModuleGridProps {
  title?: string;
  subtitle?: string;
}

export default function ModuleGrid({
  title = 'Available Modules',
  subtitle,
}: ModuleGridProps): JSX.Element {
  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>{title}</h2>
        {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
      </div>
      <div className={styles.moduleGrid}>
        {modulesData.modules.map(module => (
          <ModuleCard key={module.id} {...module} />
        ))}
      </div>
    </div>
  );
}

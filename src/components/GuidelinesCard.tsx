import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import React, { JSX } from 'react';
import styles from './GuidelinesCard.module.css';

export interface GuidelinesCardProps {
    title: string;
    tagline: string;
    logo: string;
    href: string;
}

export default function GuidelinesCard({ title, tagline, logo, href }: GuidelinesCardProps): JSX.Element {
    return (
        <Link to={href} className={styles.card}>
            <div className={styles.logo}>
                <img src={useBaseUrl(logo)} alt={title} />
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.tagline}>{tagline}</p>
            <span className={styles.link}>
                Read guidelines
                <svg className={styles.linkArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </span>
        </Link>
    );
}

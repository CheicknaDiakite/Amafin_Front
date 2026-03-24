import { ReactNode } from 'react';

export interface IconsGridProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  link: string;
}

export interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export interface ChartSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
} 
import { ReactNode, ElementType } from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: any;
  tags: string[];
}

export interface CaseStudy {
  id: string;
  client: string;
  title: string;
  metrics: { label: string; value: string }[];
  image: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: any;
}

export interface Insight {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
}

export enum ConsultationStep {
  OBJECTIVE,
  IDENTITY
}
import { NavItem, Service, CaseStudy, ProcessStep, Insight } from './types';
import { Cloud, Cpu, Shield, Zap, Globe, Database, Search, Layers, GitBranch, Radio } from 'lucide-react';
import React from 'react';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Work', href: '#work' },
  { label: 'Insights', href: '#insights' },
];

export const SERVICES: Service[] = [
  {
    id: 'cloud-arch',
    title: 'Cloud Architecture',
    description: 'Scalable, fault-tolerant infrastructure design using multi-cloud strategies.',
    icon: Cloud,
    tags: ['AWS', 'Azure', 'Kubernetes']
  },
  {
    id: 'ai-integration',
    title: 'AI & Neural Systems',
    description: 'Integrating LLMs and predictive models into enterprise workflows.',
    icon: Cpu,
    tags: ['Gemini', 'TensorFlow', 'RAG']
  },
  {
    id: 'security',
    title: 'Zero-Trust Security',
    description: 'Future-proof security protocols embedded into the CI/CD pipeline.',
    icon: Shield,
    tags: ['OAuth2', 'Pen-Testing', 'Compliance']
  },
  {
    id: 'devops',
    title: 'DevOps Velocity',
    description: 'Automated deployment pipelines ensuring zero-downtime releases.',
    icon: Zap,
    tags: ['GitHub Actions', 'Terraform', 'Docker']
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: '01',
    title: 'Deep Audit',
    description: 'We disassemble legacy monoliths to identify latency bottlenecks and security gaps.',
    icon: Search
  },
  {
    id: '02',
    title: 'Neural Topology',
    description: 'Designing a decentralized graph architecture optimized for high-concurrency data flow.',
    icon: Layers
  },
  {
    id: '03',
    title: 'Atomic Synthesis',
    description: 'Rapid component development using isolation testing and micro-frontend protocols.',
    icon: GitBranch
  },
  {
    id: '04',
    title: 'Global Broadcast',
    description: 'Edge-cached deployment with geo-redundancy and automated failover systems.',
    icon: Radio
  }
];

export const INSIGHTS: Insight[] = [
  {
    id: 'ins-1',
    title: 'The End of Monolithic State',
    category: 'Architecture',
    date: 'OCT 12, 2024',
    readTime: '5 MIN READ',
    excerpt: 'Why distributed state management is the only viable path for next-gen enterprise apps.'
  },
  {
    id: 'ins-2',
    title: 'AI Agents in Production',
    category: 'Intelligence',
    date: 'NOV 08, 2024',
    readTime: '7 MIN READ',
    excerpt: 'Moving beyond chatbots: Autonomous agents that manage infrastructure.'
  },
  {
    id: 'ins-3',
    title: 'Zero-Trust at Scale',
    category: 'Security',
    date: 'DEC 01, 2024',
    readTime: '4 MIN READ',
    excerpt: 'Implementing identity-aware proxies without sacrificing latency.'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'fintech-core',
    client: 'Apex Finance',
    title: 'Real-time Ledger Migration',
    metrics: [
      { label: 'Latency', value: '-400ms' },
      { label: 'Throughput', value: '50k TPS' }
    ],
    image: 'https://picsum.photos/800/600?grayscale'
  },
  {
    id: 'health-ai',
    client: 'MediSynth',
    title: 'Diagnostic AI Pipeline',
    metrics: [
      { label: 'Accuracy', value: '99.8%' },
      { label: 'Processing', value: 'Real-time' }
    ],
    image: 'https://picsum.photos/800/601?grayscale'
  }
];
import { NavItem, Service, CaseStudy, ProcessStep, Insight } from './types';
import { Cloud, Shield, Zap, Search, Layers, GitBranch, Radio, Cpu } from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Services', href: '#solutions' },
  { label: 'Our Approach', href: '#capabilities' },
  { label: 'Our Work', href: '#work' },
  { label: 'Insights', href: '#insights' },
];

export const SERVICES: Service[] = [
  {
    id: 'it-consulting',
    title: 'IT Consulting & Transformation',
    description: 'End-to-end digital transformation — from cloud migration and infrastructure modernization to ERP/CRM implementation and business process automation.',
    icon: Cloud,
    tags: ['AWS', 'Azure', 'GCP', 'ERP/CRM']
  },
  {
    id: 'custom-software',
    title: 'Custom Software & Products',
    description: 'We design and build scalable software products including web applications, SaaS platforms, and specialized tools like our algorithmic trading systems.',
    icon: Zap,
    tags: ['Web Apps', 'SaaS', 'Algo Trading', 'APIs']
  },
  {
    id: 'security',
    title: 'Cybersecurity & Compliance',
    description: 'Enterprise-grade security architecture, zero-trust implementation, penetration testing, and regulatory compliance consulting for the Middle East market.',
    icon: Shield,
    tags: ['Zero-Trust', 'Pen-Testing', 'ISO 27001', 'GDPR']
  },
  {
    id: 'managed-it',
    title: 'Managed IT Services',
    description: 'Reliable infrastructure management with annual maintenance contracts, 24/7 remote support, server administration, and disaster recovery planning.',
    icon: Cpu,
    tags: ['AMC', '24/7 Support', 'Backup', 'DR']
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: '01',
    title: 'Analyze',
    description: 'We begin with deep discovery — understanding your business requirements, infrastructure gaps, and growth objectives through technical assessment and stakeholder interviews.',
    icon: Search
  },
  {
    id: '02',
    title: 'Architect',
    description: 'Design scalable, secure system frameworks tailored to your performance targets, compliance requirements, and long-term technology roadmap.',
    icon: Layers
  },
  {
    id: '03',
    title: 'Build',
    description: 'Develop and deploy customized solutions using agile methodology, rigorous testing protocols, and industry best practices for rapid, reliable delivery.',
    icon: GitBranch
  },
  {
    id: '04',
    title: 'Optimize',
    description: 'Continuously monitor, test, and refine system performance through data-driven optimization — ensuring maximum uptime, efficiency, and ROI.',
    icon: Radio
  }
];

export const INSIGHTS: Insight[] = [
  {
    id: 'ins-1',
    title: 'Cloud Migration: A Strategic Imperative for UAE Businesses',
    category: 'IT Strategy',
    date: 'JAN 15, 2026',
    readTime: '5 MIN READ',
    excerpt: 'Why enterprises across the Middle East are accelerating cloud adoption and how to plan a seamless migration strategy with zero downtime.',
    body: 'The UAE is rapidly becoming one of the most cloud-forward regions globally. With government-backed digital transformation initiatives and increasing demand for scalable infrastructure, enterprises can no longer afford to rely on legacy on-premise systems.\n\nA successful cloud migration requires more than just moving servers. It demands a comprehensive strategy covering workload assessment, security compliance (including UAE data residency requirements), cost optimization, and a phased rollout plan that ensures zero business disruption.\n\nAt Neuralink Infotech, we have guided multiple enterprises through multi-cloud migrations across AWS and Azure, achieving an average of 40% cost reduction while improving system reliability to 99.99% uptime. Our approach prioritizes business continuity — every migration we execute maintains full operational capability throughout the transition.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop&auto=format&q=80&sat=-100'
  },
  {
    id: 'ins-2',
    title: 'How We Built a Sub-5ms Algorithmic Trading Platform',
    category: 'Product Spotlight',
    date: 'FEB 01, 2026',
    readTime: '7 MIN READ',
    excerpt: 'A deep dive into the infrastructure, API integrations, and low-latency architecture behind our flagship trading technology product.',
    body: 'Building an algorithmic trading platform that executes in under 5 milliseconds requires obsessive attention to every layer of the stack — from network topology to memory management.\n\nOur platform connects directly to broker APIs including MT4, MT5, and Interactive Brokers via custom FIX protocol adapters. We eliminated traditional REST overhead by implementing WebSocket-based real-time data feeds with binary serialization, reducing payload processing time by 80%.\n\nThe backtesting engine processes 10 years of tick-level data in under 30 seconds using parallel computation across distributed cloud nodes. Risk management operates as an independent microservice with sub-millisecond circuit breakers that can halt trading across all connected accounts simultaneously.\n\nEvery component runs on geo-redundant infrastructure with automatic failover, ensuring 99.99% uptime even during exchange outages or cloud provider incidents.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop&auto=format&q=80&sat=-100'
  },
  {
    id: 'ins-3',
    title: 'Enterprise Cybersecurity: Building Zero-Trust at Scale',
    category: 'Security',
    date: 'FEB 10, 2026',
    readTime: '4 MIN READ',
    excerpt: 'Implementing enterprise-grade security protocols that protect your infrastructure without compromising performance or user experience.',
    body: 'The traditional perimeter-based security model is dead. With distributed workforces, cloud infrastructure, and increasingly sophisticated attack vectors, enterprises need a fundamentally different approach.\n\nZero-trust architecture operates on a simple principle: never trust, always verify. Every request — whether from inside or outside the network — must be authenticated, authorized, and encrypted before access is granted.\n\nOur implementation strategy covers identity-aware proxies, micro-segmentation of network traffic, continuous device posture assessment, and real-time threat detection using behavioral analytics. We integrate these controls directly into CI/CD pipelines so security is baked into every deployment.\n\nThe result: enterprise-grade protection that adds less than 2ms of latency per request while meeting ISO 27001, SOC 2, and UAE regulatory compliance requirements.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&h=500&fit=crop&auto=format&q=80&sat=-100'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'trading-product',
    client: 'Flagship Product',
    title: 'Algorithmic Trading Platform',
    description: 'We designed and built a full-stack algorithmic trading platform with low-latency execution, broker API integrations (MT4/MT5, IBKR), automated strategy backtesting, and real-time performance dashboards — all running on secure, geo-redundant cloud infrastructure.',
    detail: 'This platform was built from the ground up to serve professional traders who demand institutional-grade execution speed and reliability. The architecture features a microservices-based backend with dedicated services for order routing, risk management, strategy execution, and real-time analytics.\n\nBroker connectivity supports MT4, MT5, and Interactive Brokers through custom FIX protocol adapters and WebSocket feeds. The backtesting engine can process a decade of tick-level market data in under 30 seconds using parallel cloud computation.\n\nA custom-built React dashboard provides real-time P&L tracking, drawdown monitoring, and strategy performance attribution — all updating at sub-second intervals. The entire system runs across geographically distributed cloud nodes with automatic failover.',
    techStack: ['Node.js', 'React', 'PostgreSQL', 'Redis', 'AWS', 'WebSocket', 'FIX Protocol', 'Docker'],
    metrics: [
      { label: 'Execution Latency', value: '<5ms' },
      { label: 'System Uptime', value: '99.99%' }
    ],
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=500&fit=crop&auto=format&q=80&sat=-100'
  },
  {
    id: 'enterprise-it',
    client: 'Gulf Enterprise Group',
    title: 'Cloud Infrastructure Migration',
    description: 'End-to-end migration of legacy on-premise infrastructure to a multi-cloud environment across AWS and Azure. Included ERP/CRM integration, zero-trust security implementation, automated disaster recovery, and 24/7 managed support — with zero downtime during the transition.',
    detail: 'Gulf Enterprise Group operated on aging on-premise servers with fragmented systems across 12 departments. Frequent outages, manual processes, and escalating maintenance costs were impacting their bottom line.\n\nWe designed a phased migration strategy that moved 140+ workloads to a hybrid AWS/Azure environment over 16 weeks — without a single minute of downtime. Each phase was tested in a staging environment that mirrored production, with automated rollback procedures ready at every step.\n\nThe project included deploying a unified ERP/CRM system, implementing zero-trust network architecture, setting up automated backup with 15-minute recovery point objectives, and establishing a 24/7 managed support desk. Post-migration, the client saw immediate improvements in system response times and a dramatic reduction in IT operational costs.',
    techStack: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'SAP', 'Salesforce', 'Cloudflare', 'Datadog'],
    metrics: [
      { label: 'Efficiency Gain', value: '+340%' },
      { label: 'Cost Reduction', value: '42%' }
    ],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop&auto=format&q=80&sat=-100'
  }
];

import { UserProfile, Job } from './types';

export const MOCK_FREELANCERS: UserProfile[] = [
  {
    uid: 'f1',
    name: 'Liam O\'Connor',
    email: 'liam@example.com',
    role: 'freelancer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200',
    bio: 'Visual Artist specialized in brand identity and motion graphics.',
    skills: ['Things', 'Figma', 'Motion'],
    hourlyRate: 99,
    rating: 5.0,
    reviewCount: 12,
    createdAt: new Date().toISOString()
  },
  {
    uid: 'f2',
    name: 'Alex Turner',
    email: 'alex@example.com',
    role: 'freelancer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200',
    bio: 'Creative Director at Turner Studios.',
    skills: ['Sketch', 'Product Design'],
    hourlyRate: 150,
    rating: 5.0,
    reviewCount: 24,
    createdAt: new Date().toISOString()
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    clientId: 'c1',
    title: 'Mobile App UI Design',
    description: 'Looking for a high-end designer to create a freelance portal UI.',
    budget: 2500,
    category: 'Design',
    skillsRequired: ['Figma', 'React'],
    status: 'open',
    proposalCount: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: 'j2',
    clientId: 'c1',
    title: 'Backend Integration for Real-time Chat',
    description: 'Need help with Firebase Firestore rules and real-time listeners.',
    budget: 1200,
    category: 'Development',
    skillsRequired: ['Firebase', 'Express'],
    status: 'in-progress',
    freelancerId: 'f1',
    proposalCount: 5,
    createdAt: new Date().toISOString()
  }
];

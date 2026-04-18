export type UserRole = 'client' | 'freelancer' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  banner?: string;
  role: UserRole;
  skills?: string[];
  bio?: string;
  hourlyRate?: number;
  rating?: number;
  reviewCount?: number;
  location?: string;
  website?: string;
  github?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  clientId: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  skillsRequired: string[];
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  freelancerId?: string;
  hasReview?: boolean;
  proposalCount: number;
  createdAt: string;
}

export interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  clientId: string;
  bidAmount: number;
  coverLetter: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  participantIds: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  jobId?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Review {
  id: string;
  jobId: string;
  fromId: string;
  toId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

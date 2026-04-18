import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  getDoc,
  updateDoc,
  setDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { Job, Proposal, Review } from '../types';

export const JobService = {
  async getJobs() {
    try {
      const q = query(collection(db, 'jobs'), where('status', '==', 'open'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
    } catch (error) {
      handleFirestoreError(error, 'list', 'jobs');
    }
  },

  async getMyJobs(clientId: string) {
    try {
      const q = query(collection(db, 'jobs'), where('clientId', '==', clientId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
    } catch (error) {
      handleFirestoreError(error, 'list', 'jobs');
    }
  },

  async createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'proposalCount'>) {
    try {
      const docRef = await addDoc(collection(db, 'jobs'), {
        ...jobData,
        proposalCount: 0,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, 'create', 'jobs');
    }
  },

  async submitProposal(proposalData: Omit<Proposal, 'id' | 'status' | 'createdAt'>) {
    try {
      const jobRef = doc(db, 'jobs', proposalData.jobId);
      const jobSnap = await getDoc(jobRef);
      if (!jobSnap.exists()) throw new Error('Job not found');

      const docRef = await addDoc(collection(db, 'proposals'), {
        ...proposalData,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      // Increment proposal count
      await updateDoc(jobRef, {
        proposalCount: (jobSnap.data().proposalCount || 0) + 1
      });

      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, 'create', 'proposals');
    }
  },

  async getMyProposals(freelancerId: string) {
    try {
      const q = query(collection(db, 'proposals'), where('freelancerId', '==', freelancerId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const proposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Proposal));
      
      // Fetch job details for each proposal to show titles
      const proposalsWithJobs = await Promise.all(proposals.map(async (p) => {
        const jobSnap = await getDoc(doc(db, 'jobs', p.jobId));
        return {
          ...p,
          jobTitle: jobSnap.exists() ? jobSnap.data().title : 'Unknown Project'
        };
      }));

      return proposalsWithJobs;
    } catch (error) {
      handleFirestoreError(error, 'list', 'proposals');
    }
  },

  async getJobById(jobId: string) {
    try {
      const jobSnap = await getDoc(doc(db, 'jobs', jobId));
      if (jobSnap.exists()) return { id: jobSnap.id, ...jobSnap.data() } as Job;
      return null;
    } catch (error) {
      handleFirestoreError(error, 'get', 'jobs');
    }
  },

  async completeJob(jobId: string) {
    try {
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, { status: 'completed' });
    } catch (error) {
      handleFirestoreError(error, 'update', 'jobs');
    }
  },

  async submitReview(reviewData: Omit<Review, 'id' | 'createdAt'>) {
    try {
      // Create review document with jobId as UID to ensure one review per job
      const reviewRef = doc(db, 'reviews', reviewData.jobId);
      const reviewSnap = await getDoc(reviewRef);
      if (reviewSnap.exists()) throw new Error('Review already exists for this mission');

      const review = {
        ...reviewData,
        createdAt: new Date().toISOString()
      };

      await setDoc(reviewRef, review);

      // Update job to mark as reviewed
      const jobRef = doc(db, 'jobs', reviewData.jobId);
      await updateDoc(jobRef, { hasReview: true });

      // Update freelancer rating
      const freelancerRef = doc(db, 'users', reviewData.toId);
      const freelancerSnap = await getDoc(freelancerRef);
      if (freelancerSnap.exists()) {
        const data = freelancerSnap.data();
        const currentRating = data.rating || 0;
        const currentCount = data.reviewCount || 0;
        const newCount = currentCount + 1;
        const newRating = ((currentRating * currentCount) + reviewData.rating) / newCount;
        
        await updateDoc(freelancerRef, {
          rating: Number(newRating.toFixed(1)),
          reviewCount: newCount
        });
      }

      return true;
    } catch (error) {
      handleFirestoreError(error, 'create', 'reviews');
    }
  },

  async getFreelancerReviews(freelancerId: string) {
    try {
      const q = query(collection(db, 'reviews'), where('toId', '==', freelancerId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    } catch (error) {
      handleFirestoreError(error, 'list', 'reviews');
    }
  }
};

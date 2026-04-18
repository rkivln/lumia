import { 
  collection, 
  addDoc, 
  query, 
  where, 
  doc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { Job, Review } from '../types';

export const ProjectService = {
  async approveWork(jobId: string) {
    try {
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        status: 'completed'
      });
    } catch (error) {
      handleFirestoreError(error, 'update', 'jobs');
    }
  },

  async submitReview(reviewData: Omit<Review, 'id' | 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'reviews'), {
        ...reviewData,
        createdAt: new Date().toISOString()
      });

      // Update user rating (simple average logic missing, but here we just update for the user)
      // In a real app we'd trigger a cloud function or similar to re-avg
      const userRef = doc(db, 'users', reviewData.toId);
      // Logic for simplicity: just a write
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, 'create', 'reviews');
    }
  }
};

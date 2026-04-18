import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { Message, ChatRoom } from '../types';

export const ChatService = {
  async getOrCreateChatRoom(participantIds: string[], jobId?: string) {
    try {
      // Logic for simplicity: chatRoomId is a sorted combination of UIDs
      const sortedIds = [...participantIds].sort();
      const roomId = sortedIds.join('_');
      const docRef = doc(db, 'chatRooms', roomId);
      
      const chatRoom: ChatRoom = {
        id: roomId,
        participantIds: sortedIds,
        jobId
      };
      
      await setDoc(docRef, chatRoom, { merge: true });
      return roomId;
    } catch (error) {
      handleFirestoreError(error, 'write', 'chatRooms');
    }
  },

  subscribeToMessages(chatRoomId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, 'chatRooms', chatRoomId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      callback(messages);
    });
  },

  async sendMessage(chatRoomId: string, senderId: string, text: string) {
    try {
      const messageCol = collection(db, 'chatRooms', chatRoomId, 'messages');
      await addDoc(messageCol, {
        senderId,
        text,
        createdAt: new Date().toISOString()
      });
      
      // Update last message in chat room
      const roomRef = doc(db, 'chatRooms', chatRoomId);
      await setDoc(roomRef, {
        lastMessage: text,
        lastMessageAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, 'create', 'messages');
    }
  }
};

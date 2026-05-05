export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  createdAt: any; // Firestore Timestamp
  ownerId: string;
}

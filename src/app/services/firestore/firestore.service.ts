import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);

  constructor() {
    console.log('FirestoreService constructor');
  }

  async createDocument(collectionName: string, data: any) {
    const collectionRef = collection(this.firestore, collectionName);
    await addDoc(collectionRef, data);
  }
  async getDocumentByQuery(collectionName: string, field: string, value: any) {
    const collectionRef = collection(this.firestore, collectionName);
    const queryFilter = where(field, '==', value);
    const querySnapshot = await getDocs(query(collectionRef, queryFilter));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data[0];
  }
}

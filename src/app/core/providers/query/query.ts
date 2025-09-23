import { Injectable } from '@angular/core';
import { collection, Firestore, addDoc, query as fsQuery, where, getDocs, doc, updateDoc, limit } from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class Query {
 constructor(private readonly fireSt: Firestore){}

 //CRUD
 async create(collectionName: string, data: any){
    try {
      const reference = collection(this.fireSt, collectionName);
    const res = await addDoc(reference, data);
    // Devuelve el id creado para uso del llamador
    return res.id;

    } catch (error) {
      throw error;
    }
  }

  // Lee un único documento por un campo (por ejemplo, users donde uid == actual)
  async readOneByField(collectionName: string, field: string, value: any): Promise<{ id: string, data: any } | null> {
    try {
      const ref = collection(this.fireSt, collectionName);
      const q = fsQuery(ref, where(field, '==', value), limit(1));
      const snap = await getDocs(q);
      if (snap.empty) return null;
      const d = snap.docs[0];
      return { id: d.id, data: d.data() };
    } catch (error) {
      throw error;
    }
  }

  // Actualiza un documento por id
  async update(collectionName: string, id: string, data: any): Promise<void> {
    try {
      const ref = doc(this.fireSt, collectionName, id);
      await updateDoc(ref, data);
    } catch (error) {
      throw error;
    }
  }

}

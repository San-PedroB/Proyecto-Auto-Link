import { inject, Injectable } from '@angular/core';
import { Firestore, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);

  constructor() {
    console.log('FirestoreService constructor');
  }

  // Método para crear un documento en una colección
  async createDocument(collectionName: string, data: any) {
    const collectionRef = collection(this.firestore, collectionName);
    await addDoc(collectionRef, data);
  }

  // Método para obtener el primer documento que coincida con la consulta
  async getDocumentByQuery(collectionName: string, field: string, value: any) {
    const collectionRef = collection(this.firestore, collectionName);
    const queryFilter = where(field, '==', value);
    const querySnapshot = await getDocs(query(collectionRef, queryFilter));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data[0];
  }

  // Método para actualizar el estado del viaje basado en el correo del conductor
  async actualizarEstadoViajePorCorreo(
    correoConductor: string,
    nuevoEstado: string
  ): Promise<void> {
    const collectionRef = collection(this.firestore, 'viajes');
    const queryFilter = query(
      collectionRef,
      where('conductorCorreo', '==', correoConductor)
    );
    const querySnapshot = await getDocs(queryFilter);

    if (!querySnapshot.empty) {
      const viajeDoc = querySnapshot.docs[0];
      const viajeRef = doc(this.firestore, 'viajes', viajeDoc.id);

      // Actualiza el estado del viaje
      await updateDoc(viajeRef, { estado: nuevoEstado });
      console.log(
        `Estado del viaje con correo ${correoConductor} actualizado a ${nuevoEstado}`
      );
    }
  }

  async obtenerViajesAceptados(correoConductor: string): Promise<any[]> {
    const coleccionRef = collection(this.firestore, 'viajes');
    const filtroConsulta = query(
      coleccionRef,
      where('estado', '==', 'aceptado'),
      where('conductorCorreo', '==', correoConductor)
    );
    const consultaSnapshot = await getDocs(filtroConsulta);

    // Devuelve un arreglo con todos los documentos en estado "aceptado" y del conductor logueado
    return consultaSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Método para eliminar un viaje basado en el correo del conductor
  async eliminarViaje(conductorCorreo: string): Promise<void> {
    const collectionRef = collection(this.firestore, 'viajes');
    const queryFilter = query(
      collectionRef,
      where('conductorCorreo', '==', conductorCorreo)
    );
    const querySnapshot = await getDocs(queryFilter);

    console.log(
      `Documentos encontrados para el correo ${conductorCorreo}:`,
      querySnapshot.docs.length
    );

    if (!querySnapshot.empty) {
      const viajeDoc = querySnapshot.docs[0];
      console.log('Datos del documento antes de eliminar:', viajeDoc.data());

      // Elimina el documento
      await deleteDoc(viajeDoc.ref);
      console.log(
        `Documento del viaje eliminado para el correo: ${conductorCorreo}`
      );
    } else {
      console.warn('No se encontró un viaje activo para este conductor.');
    }
  }

  // Método para obtener todos los documentos que estén en estado 'pendiente'
  async getPendingViajes(collectionName: string): Promise<any[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const queryFilter = where('estado', '==', 'pendiente');
    const querySnapshot = await getDocs(query(collectionRef, queryFilter));

    // Devuelve un arreglo con todos los documentos encontrados
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}

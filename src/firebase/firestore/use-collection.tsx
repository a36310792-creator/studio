
'use client';

import { useState, useEffect } from 'react';
import { 
  Query, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData, 
  QueryDocumentSnapshot 
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        const items = snapshot.docs.map((doc: QueryDocumentSnapshot<T>) => {
          const docData = doc.data();
          return {
            ...docData,
            id: doc.id,
          } as T & { id: string };
        });
        
        console.log(`[Firestore] Sync complete: ${items.length} documents fetched.`);
        setData(items as any);
        setLoading(false);
      },
      async (err) => {
        console.error("[Firestore] Collection listener error:", err);
        const permissionError = new FirestorePermissionError({
          path: (query as any)._query?.path?.segments?.join('/') || 'unknown',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, limit, QueryConstraint } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export function useFirestore(collectionName: string, options?: { 
  where?: [string, any, any], 
  orderBy?: [string, any], 
  limit?: number 
}) {
  const [data, setData] = useState<{id: string; [key: string]: any}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const constraints: QueryConstraint[] = [];
        
        if (options?.where) {
          constraints.push(where(options.where[0], options.where[1], options.where[2]));
        }
        if (options?.orderBy) {
          constraints.push(orderBy(options.orderBy[0], options.orderBy[1]));
        }
        if (options?.limit) {
          constraints.push(limit(options.limit));
        }

        const q = query(collection(db, collectionName), ...constraints);
        const snapshot = await getDocs(q);
        setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [collectionName, options?.where, options?.orderBy, options?.limit]);

  return { data, loading, error };
}
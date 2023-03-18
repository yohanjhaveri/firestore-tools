import { firestore } from "../initialize";
import { LocalDocument, Strategy } from "../types";

const writeBatch = (
  collectionRef: FirebaseFirestore.CollectionReference,
  data: LocalDocument[],
  merge: boolean
) => {
  const writer = firestore.batch();

  data.forEach(({ id, ...rest }) => {
    if (id) {
      writer.set(collectionRef.doc(id.toString()), rest, { merge });
    } else {
      writer.create(collectionRef.doc(), rest);
    }
  });

  return writer.commit();
};

const writeBulk = (
  collectionRef: FirebaseFirestore.CollectionReference,
  data: LocalDocument[],
  merge: boolean
) =>
  new Promise((resolve, reject) => {
    const writer = firestore.bulkWriter();

    data.forEach(({ id, ...rest }) => {
      if (id) {
        writer.set(collectionRef.doc(id.toString()), rest, { merge });
      } else {
        writer.create(collectionRef.doc(), rest);
      }
    });

    writer.onWriteError((error) => {
      reject(error);
      return false;
    });

    return writer.close().then(resolve);
  });

export const write = (
  collectionPath: string,
  data: LocalDocument[],
  strategy: Strategy
) => {
  const writer = strategy.ATOMIC ? writeBatch : writeBulk;
  const collectionRef = firestore.collection(collectionPath);

  return writer(collectionRef, data, strategy.MERGE || false);
};

export const read = <T extends { id?: string }>(collectionPath: string) => {
  const collectionRef = firestore.collection(collectionPath);

  return collectionRef.get().then(
    (snapshot) =>
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[]
  );
};

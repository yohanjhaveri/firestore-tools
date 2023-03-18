import fs from "fs";

export const readDataFromJsonFile = <T>(path: string): T[] => {
  const json = fs.readFileSync(path, "utf-8");
  const data = JSON.parse(json);

  if (!Array.isArray(data)) {
    throw new Error("The json file must contain an array of objects");
  }

  return data;
};

export const writeDataToJsonFile = <T>(path: string, data: T[]) => {
  const json = JSON.stringify(data);

  fs.writeFileSync(path, json, "utf-8");
};

export const writeBatch = <T extends { id?: string }>(
  firestore: FirebaseFirestore.Firestore,
  collectionPath: string,
  data: T[],
  merge: boolean
) => {
  const writer = firestore.batch();
  const collectionRef = firestore.collection(collectionPath);

  // Enqueue the documents to be written
  data.forEach(({ id, ...rest }) => {
    writer.set(collectionRef.doc(id.toString()), rest, { merge });
  });

  // Execute the update
  return writer.commit();
};

export const writeBulk = <T extends { id?: string }>(
  firestore: FirebaseFirestore.Firestore,
  collectionPath: string,
  data: T[],
  merge: boolean
) =>
  new Promise((resolve, reject) => {
    const writer = firestore.bulkWriter();
    const collectionRef = firestore.collection(collectionPath);

    // Enqueue the documents to be written
    data.forEach(({ id, ...rest }) => {
      writer.set(collectionRef.doc(id.toString()), rest, { merge });
    });

    // Handle errors
    writer.onWriteError((error) => {
      resolve(error);
      return false;
    });

    // Execute the update
    return writer.close().then(resolve);
  });

export const read = <T extends { id?: string }>(
  firestore: FirebaseFirestore.Firestore,
  collectionPath: string
) => {
  const collectionRef = firestore.collection(collectionPath);

  return collectionRef.get().then(
    (snapshot) =>
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[]
  );
};

import fs from "fs";

import { firestore } from "./initialize";
import { Enqueue, Execute, Strategy } from "./types";

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

class Writer {
  public enqueue: Enqueue;
  public execute: Execute;

  constructor(type: "BULK" | "BATCH") {
    if (type === "BULK") {
      const writer = firestore.bulkWriter();

      this.enqueue = writer.set;
      this.execute = () =>
        new Promise((resolve, reject) => {
          if (reject) {
            writer.onWriteError(() => {
              reject();
              return false;
            });
          }

          writer.close().then(resolve);
        });
    }

    if (type === "BATCH") {
      const writer = firestore.batch();

      this.enqueue = writer.set;
      this.execute = writer.commit;
    }
  }
}

export const write = <T extends { id?: string }>(
  firestore: FirebaseFirestore.Firestore,
  collectionPath: string,
  data: T[],
  strategy: Strategy
) => {
  const writer = new Writer(strategy.allOrNothing ? "BATCH" : "BULK");
  const collectionRef = firestore.collection(collectionPath);

  console.log((firestore as any)._isClosed);

  // Enqueue the documents to be written
  data.forEach(({ id, ...rest }) => {
    writer.enqueue(collectionRef.doc(id.toString()), rest, {
      merge: strategy.merge,
      mergeFields: strategy.mergeFields,
    });
  });

  // Execute the update
  return writer.execute();
};

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

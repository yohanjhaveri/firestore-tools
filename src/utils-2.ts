// import fs from "fs";

// export const getDataFromJsonFile = (path: string) => {
//   const json = fs.readFileSync(path, "utf-8");
//   const data = JSON.parse(json);

//   if (!Array.isArray(data)) {
//     throw new Error("The json file must contain an array of objects");
//   }

//   return data;
// };

// export const batchUpdate = <T extends { id?: string }>(
//   firestore: FirebaseFirestore.Firestore,
//   collectionPath: string,
//   merge: boolean,
//   mergeFields: string[],
//   data: T[]
// ) => {
//   const batchWriter = firestore.batch();
//   const collectionRef = firestore.collection(collectionPath);

//   // Add the documents to the bulkWriter to be written
//   data.forEach(({ id, ...rest }) => {
//     batchWriter.set(collectionRef.doc(id.toString()), rest, {
//       merge,
//       mergeFields,
//     });
//   });

//   // Commit the batch
//   return batchWriter.commit();
// };

// export const bulkUpdate = <T extends { id?: string }>(
//   firestore: FirebaseFirestore.Firestore,
//   collectionPath: string,
//   merge: boolean,
//   mergeFields: string[],
//   data: T[]
// ) => {
//   const bulkWriter = firestore.bulkWriter();
//   const collectionRef = firestore.collection(collectionPath);

//   // Add the documents to the bulkWriter to be written
//   data.forEach(({ id, ...rest }) => {
//     bulkWriter.set(collectionRef.doc(id.toString()), rest, {
//       merge,
//       mergeFields,
//     });
//   });

//   // Commit the batch
//   return bulkWriter.close();
// };

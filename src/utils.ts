import fs from "fs";
import chalk from "chalk";

export const readFile = (path: string) => {
  try {
    return fs.readFileSync(path, "utf-8");
  } catch (error) {
    handleError(
      "The data file does not exist or you have provided an incorrect file path in DATA_FILE_PATH"
    );
  }
};

export const parseJson = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    handleError("The data file is not in valid JSON format");
  }
};

export const readDataFromJsonFile = <T>(path: string): T[] => {
  const json = readFile(path);
  const data = parseJson(json);

  if (!Array.isArray(data)) {
    handleError("The data file must contain an array of objects");
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

  data.forEach(({ id, ...rest }) => {
    if (id) {
      writer.set(collectionRef.doc(id.toString()), rest, { merge });
    } else {
      writer.create(collectionRef.doc(), rest);
    }
  });

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

// export const write = <T extends { id?: string }>(
//   firestore: FirebaseFirestore.Firestore,
//   collectionPath: string,
//   data: T[],
//   merge: boolean,
//   allOrNothing: boolean
// ) => {
//   const collectionRef = firestore.collection(collectionPath);
//   const write = allOrNothing ? writeBatch : writeBulk;

export const handleSuccess = (message: string) => {
  console.log(chalk.green("[SUCCESS]", message));
  process.exit(0);
};

export const handleError = (message: string) => {
  console.log(chalk.red("[ERROR]", message));
  process.exit(1);
};

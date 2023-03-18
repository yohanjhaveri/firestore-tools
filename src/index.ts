import { config } from "./config";
import { firestore } from "./initialize";
import {
  readDataFromJsonFile,
  read,
  writeDataToJsonFile,
  writeBatch,
  writeBulk,
} from "./utils";

const push = () => {
  if (!config.COLLECTION_PATH) {
    throw new Error("Please specify a collection path in src/config.ts");
  }

  if (!config.DATA_FILE_PATH) {
    throw new Error("Please specify a json file path in src/config.ts");
  }

  const data = readDataFromJsonFile(config.DATA_FILE_PATH);

  const allOrNothing = config.STRATEGY.ALL_OR_NOTHING;
  const collectionPath = config.COLLECTION_PATH;
  const merge = config.STRATEGY.MERGE_EXISTING;

  const write = allOrNothing ? writeBatch : writeBulk;

  write(firestore, collectionPath, data, merge)
    .then(() => {
      console.log("Done!");
    })
    .catch((error) => {
      console.error(error);
    });
};

const pull = () => {
  const collectionPath = config.COLLECTION_PATH;

  read(firestore, collectionPath)
    .then((data) => {
      writeDataToJsonFile("./src/data.json", data);
    })
    .catch((error) => {
      console.error(error);
    });
};

const main = () => {
  const operation = {
    push: push,
    pull: pull,
  }[config.OPERATION_TYPE];

  if (!operation) {
    throw new Error(
      "Please specify a valid operation type in src/config.ts. The value must be either 'push' or 'pull'."
    );
  }

  operation();
};

main();

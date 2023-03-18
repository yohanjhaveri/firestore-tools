import { config } from "./config";
import { read, write } from "./utils/mutate";
import { handleConfigErrors } from "./utils/validate";
import { handleSuccess, handleError } from "./utils/output";
import { writeDataToJsonFile, readDataFromJsonFile } from "./utils/files";
import { LocalDocument, Strategy } from "./types";

const push = async () => {
  try {
    handleConfigErrors(config);

    const data = readDataFromJsonFile(config.DATA_FILE_PATH) as LocalDocument[];

    const collectionPath = config.COLLECTION_PATH;

    const strategy: Strategy = {
      ATOMIC: config.STRATEGY?.ATOMIC || false,
      MERGE: config.STRATEGY?.MERGE || false,
    };

    await write(collectionPath, data, strategy);

    handleSuccess("Documents pushed to firestore!");
  } catch (error) {
    handleError(error.message);
  }
};

const pull = async () => {
  try {
    handleConfigErrors(config);

    const collectionPath = config.COLLECTION_PATH;

    const data = await read(collectionPath);
    writeDataToJsonFile(config.DATA_FILE_PATH, data);
    handleSuccess("Documents pulled from firestore!");
  } catch (error) {
    handleError(error.message);
  }
};

const main = () => {
  handleConfigErrors(config);

  const operation = {
    push: push,
    pull: pull,
  }[config.OPERATION_TYPE];

  operation();
};

main();

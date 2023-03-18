import { config } from "./config";
import { read, write } from "./utils/mutate";
import { handleConfigErrors } from "./utils/validate";
import { handleSuccess, handleError } from "./utils/output";
import { writeDataToJsonFile, readDataFromJsonFile } from "./utils/files";
import { Strategy } from "./types";

const push = () => {
  handleConfigErrors(config);

  const data = readDataFromJsonFile(config.DATA_FILE_PATH);

  const collectionPath = config.COLLECTION_PATH;

  const strategy: Strategy = {
    ATOMIC: config.STRATEGY?.ATOMIC || false,
    MERGE: config.STRATEGY?.MERGE || false,
  };

  write(collectionPath, data, strategy)
    .then(() => handleSuccess("Documents pushed to firestore!"))
    .catch((error) => handleError(error.message));
};

const pull = () => {
  handleConfigErrors(config);

  const collectionPath = config.COLLECTION_PATH;

  read(collectionPath)
    .then((data) => {
      writeDataToJsonFile(config.DATA_FILE_PATH, data);
      handleSuccess("Documents pulled from firestore!");
    })
    .catch((error) => handleError(error.message));
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

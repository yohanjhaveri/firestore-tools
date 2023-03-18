import { config } from "./config";
import { firestore } from "./initialize";
import {
  readDataFromJsonFile,
  read,
  writeDataToJsonFile,
  writeBatch,
  writeBulk,
  handleSuccess,
  handleError,
} from "./utils";

const VALID_OPERATION_TYPE_REGEX = /push|pull/;
const VALID_COLLECTION_PATH_REGEX =
  /^\/?[A-Za-z0-9_]+(\/[A-Za-z0-9_]+\/[A-Za-z0-9_]+)*\/?$/;
const VALID_DATA_FILE_PATH_REGEX = /^(\.\/)?(?:[\w-]+\/)*[\w-]+\.\w+$/;

const handleConfigErrors = () => {
  if (!VALID_OPERATION_TYPE_REGEX.test(config.OPERATION_TYPE)) {
    handleError("Please specify a valid OPERATION_TYPE in src/config.ts");
  }

  if (!VALID_COLLECTION_PATH_REGEX.test(config.COLLECTION_PATH)) {
    handleError("Please specify a valid COLLECTION_PATH in src/config.ts");
  }

  if (!VALID_DATA_FILE_PATH_REGEX.test(config.DATA_FILE_PATH)) {
    handleError("Please specify a valid DATA_FILE_PATH in src/config.ts");
  }
};

const push = () => {
  handleConfigErrors();

  const data = readDataFromJsonFile(config.DATA_FILE_PATH);

  const collectionPath = config.COLLECTION_PATH;
  const allOrNothing = config.STRATEGY?.ATOMIC || false;
  const merge = config.STRATEGY?.MERGE || false;

  const write = allOrNothing ? writeBatch : writeBulk;

  write(firestore, collectionPath, data, merge)
    .then(() => handleSuccess("Documents pushed to firestore!"))
    .catch((error) => handleError(error.message));
};

const pull = () => {
  handleConfigErrors();

  const collectionPath = config.COLLECTION_PATH;

  read(firestore, collectionPath)
    .then((data) => {
      writeDataToJsonFile(config.DATA_FILE_PATH, data);
      handleSuccess("Documents pulled from firestore!");
    })
    .catch((error) => handleError(error.message));
};

const main = () => {
  handleConfigErrors();

  const operation = {
    push: push,
    pull: pull,
  }[config.OPERATION_TYPE];

  if (!operation) {
    throw new Error(
      "Please specify a valid OPERATION_TYPE in src/config.ts. The value must be either 'push' or 'pull'."
    );
  }

  operation();
};

main();

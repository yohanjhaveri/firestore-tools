import { Config } from "../types";

const VALID_OPERATION_TYPE_REGEX = /push|pull/;
const VALID_COLLECTION_PATH_REGEX =
  /^\/?[A-Za-z0-9_]+(\/[A-Za-z0-9_]+\/[A-Za-z0-9_]+)*\/?$/;
const VALID_DATA_FILE_PATH_REGEX =
  /^((\.{1,2}\/)+|(\.\/)?)(?:[\w\s-]+\/)*[\w\s-]+(?:\.\w+)?$/i;

const validateOperationType = (operationType: string) => {
  if (!VALID_OPERATION_TYPE_REGEX.test(operationType)) {
    throw new Error("Please specify a valid OPERATION_TYPE in src/config.ts");
  }
};

const validateCollectionPath = (collectionPath: string) => {
  if (!VALID_COLLECTION_PATH_REGEX.test(collectionPath)) {
    throw new Error("Please specify a valid COLLECTION_PATH in src/config.ts");
  }
};

const validateDataFilePath = (dataFilePath: string) => {
  if (!VALID_DATA_FILE_PATH_REGEX.test(dataFilePath)) {
    throw new Error("Please specify a valid DATA_FILE_PATH in src/config.ts");
  }
};

export const handleConfigErrors = (config: Config) => {
  validateOperationType(config.OPERATION_TYPE);
  validateCollectionPath(config.COLLECTION_PATH);
  validateDataFilePath(config.DATA_FILE_PATH);
};

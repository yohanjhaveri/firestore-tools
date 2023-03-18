import { Config } from "./types";

// TODO: Fill in the config object below
export const config: Config = {
  OPERATION_TYPE: "push", // must be "push" or "pull" depending on whether you want to read from or write to firestore
  COLLECTION_PATH: "users", // name of the collection you want to write to
  DATA_FILE_PATH: "./src/data.json", // path to the json file where the data is stored
  STRATEGY: {
    ALL_OR_NOTHING: false, // if true, all documents must be written successfully or none will be written
    MERGE_EXISTING: false, // if true, existing documents will be merged with the data in the json file
    MERGE_FIELDS: [], // if "MERGE_EXISTING" is true, this array will be used to specify which fields to merge
  },
};

import { Config } from "./types";

// TODO: configure to suit your needs
export const config: Config = {
  OPERATION_TYPE: "push",
  COLLECTION_PATH: "nfweo",
  DATA_FILE_PATH: "./src/data.json",

  // push-only configuration
  STRATEGY: {
    ATOMIC: false,
    MERGE: false,
  },
};

/*

===============================================
==================== USAGE ====================
===============================================

1. `OPERATION_TYPE`
  - Set the value to `"pull"` if you want to read from the database
  - Set the value to `"push"` if you want to write to the database

2. `COLLECTION_PATH`
  - This will be the path to the collection in firestore you want to perform `"pull"` or `"push"` on
  - If you want to reference a collection at the root, you may simply write the collection name
  - If you want to reference a sub-collection, you may write the path to the collection in the `collection/document/collection...`
  - Ensure that the last segment of your path is a collection name

3. `DATA_FILE_PATH`
  - This is a relative path from the repository root directory to your data file
  - For a `"pull"` operation, this will be the path to the file the data will be written to
  - For a `"push"` operation, this will be the path to the file the data will be read from
  - NOTE: This file does not need to exist if you are performing a `"pull"` operation, however if there is a file with the same name at the specified location, it will be overwritten if the tool executes the `"pull"` successfully

4. `STRATEGY.ALL_OR_NOTHING`
  - Optional
  - Defaults to `false`
  - Only needs to be configured for `"push"` operations
  - If set to `true`, it will cancel all writes if a single write fails
  - If set to `false`, it will perform all writes independent of whether others fail or not

4. `STRATEGY.MERGE_EXISTING`
  - Optional
  - Defaults to `false`
  - Only needs to be configured for `"push"` operations
  - If set to `true`, firebase will perform a document merge for any existing documents in the provided data
  - If set to `false`, firebase will perform a document overwrite any existing documents in the provided data

*/

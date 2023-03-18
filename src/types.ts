export type Config = {
  OPERATION_TYPE: "pull" | "push";
  COLLECTION_PATH: string;
  DATA_FILE_PATH: string;

  // push-only configuration
  STRATEGY?: {
    ATOMIC: boolean;
    MERGE: boolean;
  };
};

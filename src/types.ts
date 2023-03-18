export type Strategy = {
  ATOMIC?: boolean;
  MERGE?: boolean;
};

export type Config = {
  OPERATION_TYPE: "pull" | "push";
  COLLECTION_PATH: string;
  DATA_FILE_PATH: string;
  STRATEGY?: Strategy;
};

export type LocalDocument = {
  id?: string;
  [key: string]: any;
};

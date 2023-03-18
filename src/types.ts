export type Enqueue = (
  documentRef: FirebaseFirestore.DocumentReference,
  data: any,
  options?: FirebaseFirestore.SetOptions
) => void;

export type Execute = () => Promise<any>;

export type Strategy = {
  merge: boolean;
  allOrNothing: boolean;
};

export type Config = {
  OPERATION_TYPE: "push" | "pull";
  COLLECTION_PATH: string;
  DATA_FILE_PATH: string;
  STRATEGY: {
    ALL_OR_NOTHING: boolean;
    MERGE_EXISTING: boolean;
  };
};

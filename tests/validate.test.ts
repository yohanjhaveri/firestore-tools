import { Config } from "../src/types";
import { handleConfigErrors } from "../src/utils/validate";
import { expectError } from "./utils";

const constructConfig = (config: Partial<Config>): Config => ({
  OPERATION_TYPE: config.OPERATION_TYPE || "push",
  COLLECTION_PATH: config.COLLECTION_PATH || "test",
  DATA_FILE_PATH: config.DATA_FILE_PATH || "test.json",
});

const testConfigValid = (config: Partial<Config>) => {
  expect(() => handleConfigErrors(constructConfig(config))).not.toThrowError();
};

const testConfigInvalid = (config: Partial<Config>, message: string) => {
  console.log(config.DATA_FILE_PATH);
  expectError(() => handleConfigErrors(constructConfig(config)), message);
};

const testCollectionPathValidWithLeadingAndTrailingSlashes = (collectionPath: string) => {
  testConfigValid({ COLLECTION_PATH: `${collectionPath}` });
  testConfigValid({ COLLECTION_PATH: `${collectionPath}/` });
  testConfigValid({ COLLECTION_PATH: `/${collectionPath}` });
  testConfigValid({ COLLECTION_PATH: `/${collectionPath}/` });
};

const testCollectionPathInvalidWithLeadingAndTrailingSlashes = (collectionPath: string) => {
  const message = "Please specify a valid COLLECTION_PATH in src/config.ts";

  testConfigInvalid({ COLLECTION_PATH: `${collectionPath}` }, message);
  testConfigInvalid({ COLLECTION_PATH: `${collectionPath}/` }, message);
  testConfigInvalid({ COLLECTION_PATH: `/${collectionPath}` }, message);
  testConfigInvalid({ COLLECTION_PATH: `/${collectionPath}/` }, message);
};

describe("handleConfigErrors(config: Config)", () => {
  // OPERATION_TYPE
  it("should throw an error if the OPERATION_TYPE is not valid", () => {
    const message = "Please specify a valid OPERATION_TYPE in src/config.ts";

    testConfigInvalid({ OPERATION_TYPE: "" as "push" | "pull" }, message);
    testConfigInvalid({ OPERATION_TYPE: "invalid" as "push" | "pull" }, message);
  });

  it("should not throw an error if the OPERATION_TYPE is valid", () => {
    testConfigValid({ OPERATION_TYPE: "push" });
    testConfigValid({ OPERATION_TYPE: "pull" });
  });

  // COLLECTION_PATH
  it("should throw an error if the COLLECTION_PATH is not valid", () => {
    const collectionName = "_c0Ll3cTiOn_";
    const documentName = "_d0cUm3nt_";

    testCollectionPathInvalidWithLeadingAndTrailingSlashes("");
    testCollectionPathInvalidWithLeadingAndTrailingSlashes("/");

    // double slashes should fail
    testCollectionPathInvalidWithLeadingAndTrailingSlashes(`/${collectionName}`);
    testCollectionPathInvalidWithLeadingAndTrailingSlashes(`${collectionName}/`);
    testCollectionPathInvalidWithLeadingAndTrailingSlashes(`/${collectionName}/`);
    testCollectionPathInvalidWithLeadingAndTrailingSlashes(
      `/${collectionName}//${documentName}/${collectionName}`
    );

    // document path should fail
    testCollectionPathInvalidWithLeadingAndTrailingSlashes(`${collectionName}/${documentName}`);

    testCollectionPathInvalidWithLeadingAndTrailingSlashes(
      `${collectionName}/${documentName}/${collectionName}/${documentName}`
    );

    testCollectionPathInvalidWithLeadingAndTrailingSlashes(
      `${collectionName}/${documentName}/${collectionName}/${documentName}/${collectionName}/${documentName}`
    );
  });

  it("should not throw an error if the COLLECTION_PATH is valid", () => {
    const collectionName = "_c0Ll3cTiOn_";
    const documentName = "_d0cUm3nt_";

    // root collection path
    testCollectionPathValidWithLeadingAndTrailingSlashes(collectionName);

    // nested collection path (L1)
    testCollectionPathValidWithLeadingAndTrailingSlashes(
      `${collectionName}/${documentName}/${collectionName}`
    );

    // nested collection path (L2)
    testCollectionPathValidWithLeadingAndTrailingSlashes(
      `${collectionName}/${documentName}/${collectionName}/${documentName}/${collectionName}`
    );
  });

  it("should throw an error if the DATA_FILE_PATH is not valid", () => {
    const message = "Please specify a valid DATA_FILE_PATH in src/config.ts";

    // INVALID CHARACTERS
    testConfigInvalid({ DATA_FILE_PATH: "./my-folder/my-file!.txt" }, message);
    testConfigInvalid({ DATA_FILE_PATH: "./my folder/my_file.txt" }, message);
    testConfigInvalid({ DATA_FILE_PATH: "./../my-folder/my-file#.txt" }, message);
    testConfigInvalid({ DATA_FILE_PATH: "../my folder/my.file.txt" }, message);

    // INVALID FORMAT
    testConfigInvalid({ DATA_FILE_PATH: "./my-folder/.txt" }, message);
    testConfigInvalid({ DATA_FILE_PATH: "./my folder/" }, message);
    testConfigInvalid({ DATA_FILE_PATH: "./my-folder/" }, message);
    testConfigInvalid({ DATA_FILE_PATH: "./my-file.txt" }, message);
    testConfigInvalid({ DATA_FILE_PATH: "./.txt" }, message);
    testConfigInvalid({ DATA_FILE_PATH: "./../my-file.txt" }, message);
    testConfigInvalid({ DATA_FILE_PATH: "./.." }, message);
  });

  it("should not throw an error if the DATA_FILE_PATH is valid", () => {
    // WITH EXTENSION
    testConfigValid({ DATA_FILE_PATH: "./my-folder/my-file.txt" });
    testConfigValid({ DATA_FILE_PATH: "./my folder/my file.txt" });
    testConfigValid({ DATA_FILE_PATH: "./../my-folder/my-file.txt" });
    testConfigValid({ DATA_FILE_PATH: "../my folder/my file.txt" });
    testConfigValid({ DATA_FILE_PATH: "./../../../my-file.txt" });

    // WITHOUT EXTENSION
    testConfigValid({ DATA_FILE_PATH: "./my-folder/my-file" });
    testConfigValid({ DATA_FILE_PATH: "./my folder/my file" });
    testConfigValid({ DATA_FILE_PATH: "./../my-folder/my-file" });
    testConfigValid({ DATA_FILE_PATH: "../my folder/my file" });
    testConfigValid({ DATA_FILE_PATH: "./my-folder/my-file.TEST" });
    testConfigValid({ DATA_FILE_PATH: "./../../../my-file" });

    // WITHOUT LEADING "./"
    testConfigValid({ DATA_FILE_PATH: "my-file.txt" });
    testConfigValid({ DATA_FILE_PATH: "my-folder/my-file.txt" });
    testConfigValid({ DATA_FILE_PATH: "my folder/my file.txt" });
    testConfigValid({ DATA_FILE_PATH: "../my-folder/my-file.txt" });
    testConfigValid({ DATA_FILE_PATH: "../my folder/my file.txt" });
    testConfigValid({ DATA_FILE_PATH: "../../../my-file.txt" });
  });
});

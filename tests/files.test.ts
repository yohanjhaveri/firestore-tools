import { readDataFromJsonFile } from "../src/utils/files";
import { expectError } from "./utils";

describe("readDataFromJsonFile(path: string)", () => {
  it("should exit if file is not found at path", () => {
    const execute = () => readDataFromJsonFile("./tests/random-file");
    const message =
      "The data file does not exist or you have provided an incorrect file path in DATA_FILE_PATH";

    expectError(execute, message);
  });

  it("should exit if data in file is not in JSON format", () => {
    const execute = () => readDataFromJsonFile("./tests/json-file-invalid-format");
    const message = "The data file is not in valid JSON format";

    expectError(execute, message);
  });

  it("should exit if data in file is not an array of objects", () => {
    const execute = () => readDataFromJsonFile("./tests/json-file-not-array");
    const message = "The data file must contain an array of objects";

    expectError(execute, message);
  });

  it("should read data from file if it exists and is in valid JSON format", () => {
    const execute = () => readDataFromJsonFile("./tests/json-file-valid");
    const message = "The data file must contain an array of objects";

    expectError(execute, message);
  });
});

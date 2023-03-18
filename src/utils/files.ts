import fs from "fs";
import { handleError } from "./output";

const readFile = (path: string) => {
  try {
    return fs.readFileSync(path, "utf-8");
  } catch (error) {
    handleError(
      "The data file does not exist or you have provided an incorrect file path in DATA_FILE_PATH"
    );
  }
};

const parseJson = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    handleError("The data file is not in valid JSON format");
  }
};

export const readDataFromJsonFile = <T>(path: string): T[] => {
  const json = readFile(path);
  const data = parseJson(json);

  if (!Array.isArray(data)) {
    handleError("The data file must contain an array of objects");
  }

  return data;
};

export const writeDataToJsonFile = <T>(path: string, data: T[]) => {
  const json = JSON.stringify(data);
  fs.writeFileSync(path, json, "utf-8");
};

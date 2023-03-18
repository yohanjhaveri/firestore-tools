import { handleError, handleSuccess } from "../src/utils/output";
import { expectError } from "./utils";

jest.spyOn(process, "exit").mockImplementation((number) => {
  throw new Error("process.exit: " + number);
});

describe("handleError(message: string)", () => {
  it("should exit with code 1", () => {
    const execute = () => handleError("This is an error message");
    const message = "process.exit: 1";

    expectError(execute, message);
  });
});

describe("handleSuccess(message: string)", () => {
  it("should exit with code 0", () => {
    const execute = () => handleSuccess("This is an success message");
    const message = "process.exit: 0";

    expectError(execute, message);
  });
});

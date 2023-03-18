export const expectError = (execute: () => void, message: string) => {
  try {
    execute();
  } catch (error) {
    expect(error.message).toBe(message);
  }
};

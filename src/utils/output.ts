import chalk from "chalk";

export const handleSuccess = (message: string) => {
  console.log(chalk.green("[SUCCESS]", message));
  process.exit(0);
};

export const handleError = (message: string) => {
  console.log(chalk.red("[ERROR]", message));
  process.exit(1);
};

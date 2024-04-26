const testPath = process.env.TEST_PATH || "test/**/*.ts";

module.exports = {
  spec: [testPath],
  require: ["ts-node/register", "./test/_mocha-fixtures.ts"],
  recursive: true,
  extension: ["ts"],
  parallel: false,
};

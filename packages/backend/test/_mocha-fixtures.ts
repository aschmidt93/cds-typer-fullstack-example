import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { config } from "dotenv";

config();

export function mochaGlobalSetup() {
  chai.use(chaiAsPromised);
}

import toRandomCapital from "../utils/to-random-capital";
import { BasicStrategy } from "./basic-strategy";

class CryptoStrategy extends BasicStrategy {
  generatePassword = (length: number): string => {
    let password = require("crypto").randomBytes(length).toString("hex");
    return toRandomCapital(password);
  };
}

export default CryptoStrategy;

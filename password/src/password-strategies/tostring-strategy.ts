import toRandomCapital from "../utils/to-random-capital";
import { BasicStrategy } from "./basic-strategy";

class ToStringStrategy extends BasicStrategy {
  generatePassword = (length: number): string => {
    let password = Date.now().toString(36).substr(4, 13);
    const passwordComponentLength = Math.random().toString(36).slice(2, 16)
      .length;

    for (let i = 0; i <= Math.ceil(length / passwordComponentLength); i++) {
      password += Math.random().toString(36).slice(2, 16);
    }
    return toRandomCapital(password.slice(0, length));
  };
}

export default ToStringStrategy;

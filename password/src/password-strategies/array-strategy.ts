import { BasicStrategy } from "./basic-strategy";

class ArrayStrategy extends BasicStrategy {
  generatePassword = (length: number): string => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const characters = [...(uppercase + lowercase + numbers)];

    var password = "";
    for (let i = 0; i < length; i++) {
      let character_index = Math.floor(Math.random() * characters.length);
      password += characters[character_index];
    }
    return password;
  };
}

export default ArrayStrategy;

import { BasicStrategy } from "./basic-strategy";

export class Generator {
  public strategy: BasicStrategy;
  
  constructor(strategy: BasicStrategy){
    this.strategy = strategy;
  }

  public setStrategy(strategy: BasicStrategy) {
    this.strategy = strategy;
  }

  public generatePassword(length: number): string {
    return this.strategy.generatePassword(length);
  }
}

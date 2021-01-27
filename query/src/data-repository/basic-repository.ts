import UserEntity from "./entities/user";
import PasswordEntity from "./entities/password";

export abstract class BasicRepository<U, P> {
  public abstract connect(): Promise<void>;
  public abstract initializeDB(): Promise<void>;

  public abstract createUser(user: UserEntity): Promise<void>;
  public abstract getUser(user: UserEntity): Promise<U>;
  public abstract getPasswords(user: UserEntity): Promise<P[]>;
  public abstract getPassword(
    user: UserEntity,
    password: PasswordEntity
  ): Promise<P>;
  public abstract insertPassword(
    user: UserEntity,
    password: PasswordEntity
  ): Promise<void>;
  public abstract updatePassword(
    user: UserEntity,
    password: PasswordEntity
  ): Promise<void>;
  public abstract deletePassword(
    user: UserEntity,
    password: PasswordEntity
  ): Promise<void>;
}

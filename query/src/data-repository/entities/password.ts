import BasicEntity from "./basic-entity";
export default interface Password extends BasicEntity {
  id: string;
  userId?: string;
  domain?: string;
  password?: string;
  updatedAt?: Date;
  version?: number;
}

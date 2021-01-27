import BasicEntity from "./basic-entity";
export default interface User extends BasicEntity {
  id: string;
  email?: string;
  password?: string;
  version?: number;
}

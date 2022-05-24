import { RoleType } from "../constants";

export interface Member {
  id: number;
  name?: string;
  email?: string;
  role?: RoleType;
}

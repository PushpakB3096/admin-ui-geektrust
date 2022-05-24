import { RoleType } from "../constants";

export interface Member {
  id: number;
  name?: string;
  email?: string;
  role?: RoleType;
}

export interface TableCellMember extends Member {
  checked?: boolean;
}

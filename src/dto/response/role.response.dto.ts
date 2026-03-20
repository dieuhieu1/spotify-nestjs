import { PermissionResponse } from './permission.response.dto';

export class RoleResponse {
  id: number;
  name: string;
  description: string;
  permissions: PermissionResponse[];
}

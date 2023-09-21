export interface UserAdmin {
  id: string;
  lastAccess?: Date;
  password?: string;
  active?: boolean;
  centerId?: number;
  centerName?: string;
}

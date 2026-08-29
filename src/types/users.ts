export interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string | null;
}

export interface UsersResponse {
  status: boolean;
  message: string;
  count: number;
  data: UserItem[];
}

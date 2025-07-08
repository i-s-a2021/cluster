export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string; // base64 or URL
  roles: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserFilter {
  searchTerm?: string;
  role?: string;
  isActive?: boolean;
}

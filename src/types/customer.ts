export interface TCustomer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string | undefined,
  status: "active" | "inactive";
  createdAt: string;
}

export interface ICreateCustomerDTO {
  name : string ,
  phone : string ,
  email? : string,
  address?: string,
  totalOrders: number,
  totalSpent : number, 
  lastOrderAt?: string ,
  status : "active" | "inactive",
  createdAt : string,
}

export interface RawMaterial {
  id: number;
  category_id: number;
  name: string;
  unit: string;
  current_stock: string;
  current_unit_price: string;
  minimum_stock_level: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CategoryData {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
  raw_materials: RawMaterial[];
}

export interface ApiResponse {
  message: string;
  data: CategoryData;
}

export interface IAddPaymentDTO {
  raw_material_id : number , 
  quantity : number ,
  unit_price : number , 
}

export interface IDisplayPayment{
  id: number | string,
  quantity: string, 
  unit_price : string,
  total_cost: string, 
  created_at: string,

}

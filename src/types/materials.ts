export interface HandlerMaterialsItem {
  id: number;
  raw_material_name: string;
  handler_name: string;
  withdrawn_quantity: string;
  used_quantity: string;
  remaining: number;
}

export interface HandlerMaterialsResponse {
  status: boolean;
  message: string;
  data: HandlerMaterialsItem[];
}
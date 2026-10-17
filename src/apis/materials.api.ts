import { api } from "@/lib/api";
import { HandlerMaterialsResponse } from "@/types/materials";


export async function fetchHandlerCustody(): Promise<HandlerMaterialsResponse> {
    
  const response = await api.get(`/api/inventory/handler/item`);
  return response.data;
}

export async function updateUsedQuantity({ id, used_quantity }: { id: number; used_quantity: number }) {
  const response = await api.post(`/api/inventory/handler/update-used/${id}`, {
    used_quantity,
  });
  return response.data;
}
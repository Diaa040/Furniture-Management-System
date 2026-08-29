import { api } from "@/lib/api";
import { IAddPaymentDTO, IDisplayPayment, RawMaterial } from "@/types/inventory";



export async function AddInventoryPayment(categoryId: number | string  , paymentData:IAddPaymentDTO): Promise<RawMaterial> {
  const response = await api.post(`/api/inventory/add/${categoryId}`, paymentData);
  return response.data.data;
}


export async function DisplayInventoryPayment(categoryId: number | string , raw_material_id: number | string ): Promise<IDisplayPayment[]> {
    
  const response = await api.get(`/api/purchases/item/${categoryId}/item/${raw_material_id}`);
  return response.data.purchases || [];
}


export async function DeleteInventoryPayment(
  categoryId: number, 
  raw_material_id: number, 
  paymentId: number
) {
  const response = await api.delete(`/api/purchases/item/${categoryId}/item/${raw_material_id}/item/${paymentId}`);
  return response.data;
}


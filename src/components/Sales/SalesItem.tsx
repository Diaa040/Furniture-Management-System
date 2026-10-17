import { Sale } from "@/types/materials";

interface SalesItemProps {
  sale: Sale;
}

export default function SalesItem({sale}:SalesItemProps) {
  return (
    <div className="p-4 border rounded shadow-sm">
      <h3>فاتورة رقم: {sale.invoiceNumber}</h3>
      <p>العميل: {sale.customerName}</p>
      <p>الإجمالي: {sale.total}</p>
    </div>
  )
}

import { showAlert } from "@/lib/controller/alertsController";


interface ItemEntry {
    item_id: number;
    name: string;
    unit: string;
    quantity: number;
    limit_quantity: number;
    lubally: string[];
    capacity:number;
    product_id: string;
}

function ValidateQuantities(items: ItemEntry[]): boolean {
    const grouped = items.reduce<Record<string, { total: number; limit: number, name:string}>>(
      (acc, item) => {
        const limit = Number(item.limit_quantity); // garante número
        const pid = item.product_id;               // garante chave certa
        if (!acc[pid]) {
          acc[pid] = { total: 0, limit , name:item.name};
        }
        acc[pid].total += Number(item.quantity)*item.capacity;
        return acc;
      },
      {}
    );
  
    for (const [productId, { total, limit, name }] of Object.entries(grouped)) {
      console.log(`Produto:${productId} total:${total} limite:${limit}`);
      if (limit !== undefined && total > limit) {
        showAlert(`Produto:  ${name} excedeu o limite: ${total}/${limit}`);
        return false;
      }
    }
    return true;

}
  
export default ValidateQuantities
import { useState } from "react";
import { useStageActions } from "@/hooks/use-stage-actions";

export function useAddDetailForm(
  orderId: number,
  itemId: number,
  stageName: string,
) {
  const {
    addDetailItem,
    isAddingDetail,
    addDetailError,
    deleteDetailItem,
    isDeletingDetail,
  } = useStageActions(orderId, itemId);

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addDetailItem(
      { stageName, item: name, cost: Number(cost) },
      {
        onSuccess: () => {
          setIsOpen(false);
          setName("");
          setCost("");
        },
      },
    );
  };

  const remove = (itemName: string, itemCost: number) => {
    deleteDetailItem({ stageName, itemName, itemCost });
  };

  return {
    isOpen,
    setIsOpen,
    name,
    setName,
    cost,
    setCost,
    submit,
    remove,
    isAddingDetail,
    addDetailError,
    isDeletingDetail,
  };
}
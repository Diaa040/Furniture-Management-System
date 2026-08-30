import { DEFAULT_STAGES } from "@/lib/stage-constants";
import type {
  OrderItemStage,
  RawMaterialItem,
  StageDetailItem,
} from "@/types/order";

export type StageViewModel = {
  id: number;
  name: string;
  order: number;
  status: string;
  workshopName: string;
  agreedCost: number;
  totalPaid: number;
  remainingAmount: number;
  stageCost: number;
  rawMaterialsCost: number;
  detailsCost: number;
  rawExecutionType: string | null;
  executionTypeLabel: string;
  rawMaterials: RawMaterialItem[];
  detailsItems: StageDetailItem[];
  hasStarted: boolean;
};

// بيدمج المراحل الثابتة (DEFAULT_STAGES) مع بيانات الباك إند (fetchedStages)
export function buildAllStages(
  fetchedStages: OrderItemStage[],
): StageViewModel[] {
  return DEFAULT_STAGES.map((defStage) => {
    const found = fetchedStages.find(
      (s) =>
        s.stage_name === defStage.name ||
        Number(s.stage_order) === defStage.id,
    );

    const sData = found || ({} as Partial<OrderItemStage>);
    const rawExecutionType = sData.execution_type
      ? String(sData.execution_type)
      : null;

    let executionTypeLabel = "غير محدد";
    if (rawExecutionType === "external") executionTypeLabel = "خارجي";
    if (rawExecutionType === "internal") executionTypeLabel = "داخلي";

    const detailsItems: StageDetailItem[] =
      sData.details?.details?.items || [];

    return {
      id: Number(sData.id) || defStage.id,
      name: defStage.name,
      order: defStage.id,
      status: String(sData.status || (found ? "not_started" : "not_started")),
      workshopName:
        sData.handler_name ||
        sData.workshop_name ||
        sData.workshop ||
        "غير محدد",
      agreedCost: Number(sData.agreed_cost || 0),
      totalPaid: Number(sData.total_paid || 0),
      remainingAmount: Number(sData.remaining_amount || 0),
      stageCost: Number(sData.stage_cost || 0),
      rawMaterialsCost: Number(sData.raw_materials_cost || 0),
      detailsCost: Number(sData.details_cost || 0),
      rawExecutionType,
      executionTypeLabel,
      rawMaterials: sData.raw_materials || [],
      detailsItems,
      hasStarted: Boolean(found && rawExecutionType),
    };
  });
}

// بيحسب التبويب النشط: من الـ URL أولاً، وإلا من أول مرحلة راجعة من الباك إند، وإلا 0
export function getActiveStageIndex(
  currentStageFromUrl: string | undefined,
  firstReturnedStageName: string | undefined,
): number {
  if (currentStageFromUrl) {
    const foundIdx = DEFAULT_STAGES.findIndex(
      (s) => s.name === currentStageFromUrl,
    );
    if (foundIdx !== -1) return foundIdx;
  }
  if (firstReturnedStageName) {
    const foundIdx = DEFAULT_STAGES.findIndex(
      (s) => s.name === firstReturnedStageName,
    );
    if (foundIdx !== -1) return foundIdx;
  }
  return 0;
}

// بيحدد الـ category id النهائي المستخدم في مودال صرف الخامة
export function getCurrentCategoryId(
  currentStage: StageViewModel | undefined,
): number {
  const matchedDefaultStage = DEFAULT_STAGES.find(
    (s) => s.name === currentStage?.name,
  );
  return matchedDefaultStage?.id || currentStage?.id || 1;
}
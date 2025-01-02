import { FinanceCalculator } from "@/components/finance-calculator";
import getTitle from "@/utils/get-title";
import { useMetadata } from "vike-metadata-solid";

export default function Page() {
  useMetadata({
    title: getTitle("Home"),
  });

  return (
    <div class="px-1 py-10">
      <FinanceCalculator />
    </div>
  );
}

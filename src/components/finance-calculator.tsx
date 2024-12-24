import {
  FinancingDetails,
  calculateDownPaymentFromPercent,
  calculateTotalCost,
} from "@/utils/calculate-financing";
import { formatCurrency } from "@/utils/format-currency";
import { createMemo, createSignal } from "solid-js";

export default function FinanceCalculator() {
  const [details, setDetails] = createSignal<FinancingDetails>({
    carPrice: 0,
    downPayment: 0,
    monthlyPayment: 0,
    loanTermMonths: 60,
  });
  const [downPaymentPercent, setDownPaymentPercent] = createSignal<number>(20);
  const [usePercentage, setUsePercentage] = createSignal<boolean>(true);

  const handleCarPriceChange = (value: number) => {
    const newDetails = { ...details(), carPrice: value };
    if (usePercentage()) {
      newDetails.downPayment = calculateDownPaymentFromPercent(value, downPaymentPercent());
    }
    setDetails(newDetails);
  };

  const handleDownPaymentPercentChange = (value: number) => {
    setDownPaymentPercent(value);
    setDetails({
      ...details(),
      downPayment: calculateDownPaymentFromPercent(details().carPrice, value),
    });
  };

  const totalCost = createMemo(() => calculateTotalCost(details()));
  const totalInterest = createMemo(() => totalCost() - details().carPrice);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Car Finance Calculator</h2>

      <NumberInput
        label="Car Price"
        value={details.carPrice}
        onChange={handleCarPriceChange}
        prefix="₱ "
      />

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={usePercentage}
            onChange={(e) => setUsePercentage(e.target.checked)}
            className="rounded"
          />
          <label>Use percentage for down payment</label>
        </div>

        {usePercentage ? (
          <NumberInput
            label="Down Payment (%)"
            value={downPaymentPercent}
            onChange={handleDownPaymentPercentChange}
            max={100}
            suffix="%"
          />
        ) : (
          <NumberInput
            label="Down Payment"
            value={details.downPayment}
            onChange={(value) => setDetails({ ...details, downPayment: value })}
            prefix="₱ "
          />
        )}
      </div>

      <NumberInput
        label="Monthly Payment"
        value={details.monthlyPayment}
        onChange={(value) => setDetails({ ...details, monthlyPayment: value })}
        prefix="₱ "
      />

      <NumberInput
        label="Loan Term (months)"
        value={details.loanTermMonths}
        onChange={(value) => setDetails({ ...details, loanTermMonths: value })}
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold mb-2">Summary:</h3>
        <div className="space-y-2">
          <p>Down Payment: {formatCurrency(details.downPayment)}</p>
          <p>Total Cost: {formatCurrency(totalCost)}</p>
          <p>Total Interest: {formatCurrency(totalInterest)}</p>
        </div>
      </div>
    </div>
  );
}

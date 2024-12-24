export interface FinancingDetails {
  carPrice: number;
  downPayment: number;
  monthlyPayment: number;
  loanTermMonths: number;
}

export const calculateTotalCost = (details: FinancingDetails): number => {
  const totalPayments = details.monthlyPayment * details.loanTermMonths;
  return totalPayments + details.downPayment;
};

export const calculateDownPaymentFromPercent = (
  carPrice: number,
  downPaymentPercent: number
): number => {
  return (carPrice * downPaymentPercent) / 100;
};

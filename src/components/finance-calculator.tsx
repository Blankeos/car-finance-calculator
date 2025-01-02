import { useLocalStorageStore } from "@/hooks/use-local-storage-store";
import { IconCalendar, IconClose, IconPaperMoney } from "@/icons";
import IconPaperMoneyRemove from "@/icons/paper-money-remove";
import IconPlus from "@/icons/plus";
import { calculateDownPaymentFromPercent } from "@/utils/calculate-financing";
import { formatCurrency } from "@/utils/format-currency";
import { formatDateWithTime } from "@/utils/format-date";
import { NumberFormatStyle } from "intl-number-input";
import { nanoid } from "nanoid";
import { createMemo, FlowProps, For, JSX, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { NumberFormat } from "./number-format";
import { Tippy } from "./Tippy";

export function FinanceCalculator() {
  // ===========================================================================
  // States
  // ===========================================================================
  const [formData, setFormData] = createStore<{
    id: string;
    carPrice: number;
    downPaymentInput: number;
    downPaymentIsPercent: boolean;
    monthlyPayment: number;
    loanTermMonths: number;
    quickNote: string;
  }>({
    id: nanoid(),
    carPrice: 0,
    downPaymentInput: 20,
    downPaymentIsPercent: true,
    monthlyPayment: 0,
    loanTermMonths: 0,
    quickNote: "",
  });

  // ===========================================================================
  // Derived States
  // ===========================================================================
  const downPayment = createMemo(() => {
    if (formData.downPaymentIsPercent)
      return calculateDownPaymentFromPercent(formData.carPrice, formData.downPaymentInput);

    return formData.downPaymentInput;
  });
  const totalCost = createMemo(() => {
    const totalPayments = formData.monthlyPayment * formData.loanTermMonths;
    return totalPayments;
  });
  const totalInterest = createMemo(() => totalCost() - formData.carPrice);

  // Local Storage Saved Data
  type SavedSummaries = {
    id: string;
    quickNote: string;
    carPrice: number;
    downPaymentPercent?: number;
    monthlyPayment: number;
    loanTermMonths: number;
    createdAt: string;

    // Calulcated
    downPayment: number;
    totalCost: number;
    totalInterest: number;
  }[];

  const [savedSummaries, setSavedSummaries] = useLocalStorageStore<SavedSummaries>({
    key: "car-finance-summaries",
    defaultValue: [],
  });

  function handleSave() {
    setSavedSummaries(
      produce((_savedSummaries) => {
        const foundIdx = _savedSummaries.findIndex((_summary) => _summary.id === formData.id);
        if (foundIdx === -1) {
          _savedSummaries.push({
            id: formData.id,
            carPrice: formData.carPrice,
            downPayment: downPayment(),
            downPaymentPercent: formData.downPaymentIsPercent
              ? formData.downPaymentInput
              : undefined,
            loanTermMonths: formData.loanTermMonths,
            monthlyPayment: formData.monthlyPayment,
            quickNote: formData.quickNote,
            totalCost: totalCost(),
            totalInterest: totalInterest(),
            createdAt: new Date().toISOString(),
          });
        } else {
          _savedSummaries[foundIdx] = {
            ..._savedSummaries[foundIdx],
            carPrice: formData.carPrice,
            downPayment: downPayment(),
            loanTermMonths: formData.loanTermMonths,
            monthlyPayment: formData.monthlyPayment,
            quickNote: formData.quickNote,
            totalCost: totalCost(),
            totalInterest: totalInterest(),
            downPaymentPercent: formData.downPaymentIsPercent
              ? formData.downPaymentInput
              : undefined,
          };
        }
      })
    );
  }

  function handleNew() {
    const newId = nanoid();

    setSavedSummaries(
      produce((_savedSummaries) => {
        _savedSummaries.push({
          id: newId,
          carPrice: formData.carPrice,
          downPayment: downPayment(),
          loanTermMonths: formData.loanTermMonths,
          monthlyPayment: formData.monthlyPayment,
          quickNote: formData.quickNote,
          totalCost: totalCost(),
          totalInterest: totalInterest(),
          createdAt: new Date().toISOString(),
        });
      })
    );
    setFormData("id", newId);
  }

  function handleDelete(idToDelete: string) {
    setSavedSummaries(
      produce((_savedSummaries) => {
        const foundIdx = _savedSummaries.findIndex((_summary) => _summary.id === idToDelete);
        if (foundIdx !== -1) {
          _savedSummaries.splice(foundIdx, 1);
        }
      })
    );
  }

  function handleViewClick(idToView: string) {
    const found = savedSummaries.find((summary) => summary.id === idToView);
    if (!found) return;

    setFormData({
      id: found.id,
      quickNote: found.quickNote,
      carPrice: found.carPrice,
      downPaymentInput: found.downPaymentPercent ?? found.downPayment,
      downPaymentIsPercent: found.downPaymentPercent ? true : false,
      loanTermMonths: found.loanTermMonths,
      monthlyPayment: found.monthlyPayment,
    });
  }

  const isNotNew = createMemo(() => {
    const found = savedSummaries.find((s) => s.id === formData.id);
    return Boolean(found);
  });

  return (
    <div class="mx-auto max-w-md rounded-lg border bg-white p-6 shadow-lg">
      <h2 class="mb-6 text-2xl font-bold">🚙 Car Financing Calculator</h2>
      <div class="flex flex-col gap-y-2">
        <NumberFormat
          label="Car Price"
          value={formData.carPrice}
          onChange={(val) => {
            setFormData("carPrice", val);
          }}
        />

        <div>
          {formData.downPaymentIsPercent ? (
            <NumberFormat
              label="Down Payment (%)"
              value={formData.downPaymentInput}
              onChange={(val) => setFormData("downPaymentInput", val)}
              max={100}
              options={{
                formatStyle: NumberFormatStyle.Percent,
              }}
            />
          ) : (
            <NumberFormat
              label="Down Payment"
              value={formData.downPaymentInput}
              onChange={(val) => setFormData("downPaymentInput", val)}
            />
          )}
          <div class="mt-2 flex items-center gap-2 text-sm text-neutral-500">
            <input
              id="percentage-checkbox"
              type="checkbox"
              checked={formData.downPaymentIsPercent}
              onChange={(e) => setFormData("downPaymentIsPercent", e.target.checked)}
              class="rounded"
            />
            <label for="percentage-checkbox" class="select-none">
              Use percentage for down payment
            </label>
          </div>
        </div>

        <NumberFormat
          label="Monthly Payment"
          value={formData.monthlyPayment}
          onChange={(val) => setFormData("monthlyPayment", val)}
        />

        <NumberFormat
          label="Loan Term (months)"
          value={formData.loanTermMonths}
          onChange={(val) => setFormData("loanTermMonths", val)}
          options={{
            formatStyle: NumberFormatStyle.Decimal,
          }}
        />
      </div>

      <div class="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <h3 class="mb-2 font-semibold text-neutral-700">🚗 Summary:</h3>
        <div class="space-y-2 text-sm text-neutral-700">
          <p>Down Payment: {formatCurrency(downPayment())}</p>
          <p>Total Cost: {formatCurrency(totalCost())}</p>
          <p>Total Interest: {formatCurrency(totalInterest())}</p>
        </div>
      </div>

      <hr class="mt-5" />

      <div class="mt-4 flex gap-x-1 text-sm">
        <input
          type="text"
          value={formData.quickNote}
          placeholder="Quick Note"
          onInput={(e) => setFormData("quickNote", e.target.value)}
          class="w-full rounded-md border p-2"
        />

        <Show when={isNotNew()}>
          <button
            class="rounded-md border border-blue-600 bg-blue-500 p-2 px-5 text-white"
            onClick={handleSave}
          >
            Save
          </button>
        </Show>
        <button
          class="flex items-center gap-x-0.5 rounded-md border border-blue-600 bg-blue-100 p-2 px-3 text-blue-600"
          onClick={handleNew}
        >
          New <IconPlus class="h-3 w-3" />
        </button>
      </div>

      <div class="mt-4 flex flex-col gap-y-2">
        <For each={savedSummaries}>
          {(summary) => (
            <div
              class={`flex cursor-pointer justify-between gap-x-1 rounded-md border p-2 ${summary.id === formData.id ? "border-blue-500 bg-blue-100" : "border-gray-200"}`}
              onClick={(_) => {
                _.stopPropagation();
                handleViewClick(summary.id);
              }}
            >
              <div>
                <div class="mb-2">{summary.quickNote}</div>
                <div class="flex flex-wrap items-center gap-x-3 text-xs">
                  <IconWithTooltip icon={<IconPaperMoney class="h-4 w-4" />} tooltip="Total Cost">
                    {formatCurrency(summary.totalCost)}
                  </IconWithTooltip>
                  <IconWithTooltip
                    icon={<IconCalendar class="h-4 w-4" />}
                    tooltip="Monthly Payment"
                  >
                    {formatCurrency(summary.monthlyPayment)} for {summary.loanTermMonths} mos
                  </IconWithTooltip>

                  <IconWithTooltip
                    class="text-red-700"
                    icon={<IconPaperMoneyRemove class="h-4 w-4" />}
                    tooltip="Total Interest (Money you'll pay more because of financing)"
                  >
                    {formatCurrency(summary.totalInterest)}
                  </IconWithTooltip>
                </div>
                <div class="mt-1 text-xs text-gray-400">
                  {formatDateWithTime(summary.createdAt)}
                </div>
              </div>

              <button
                class="place-self-start text-red-500 transition active:scale-95"
                onClick={(_) => handleDelete(summary.id)}
              >
                <IconClose class="h-4 w-4" />
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

function IconWithTooltip(
  props: FlowProps<{
    class?: string;
    tooltip: string;
    icon: JSX.Element;
  }>
) {
  return (
    <div class={`flex items-center gap-x-1 ${props.class}`}>
      <Tippy
        hidden
        props={{
          content: props.tooltip,
        }}
      >
        {props.icon}
      </Tippy>
      {props.children}
    </div>
  );
}

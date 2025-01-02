import {
  CurrencyDisplay,
  NumberFormatStyle,
  NumberInput,
  NumberInputOptions,
  UnitDisplay,
} from "intl-number-input";
import { createEffect, createUniqueId, onMount } from "solid-js";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  options?: NumberInputOptions;
}

// Define the component
export const NumberFormat = (props: NumberInputProps) => {
  let ref!: HTMLInputElement;
  let numberInputInstance: NumberInput;

  onMount(() => {
    numberInputInstance = new NumberInput({
      el: ref,
      options: {
        hideGroupingSeparatorOnFocus: false,
        hidePrefixOrSuffixOnFocus: false,
        formatStyle: NumberFormatStyle.Currency,
        unitDisplay: UnitDisplay.Short,
        currency: "PHP",
        currencyDisplay: CurrencyDisplay.Symbol,
        ...props.options,
      },
      onInput: (_props) => {
        // eslint-disable-next-line solid/reactivity
        if (_props.number) {
          // eslint-disable-next-line solid/reactivity
          props.onChange(_props.number);
        } else {
          props.onChange(0);
        }
      },
    });

    numberInputInstance.setValue(props.value);
  });

  createEffect(() => {
    numberInputInstance.setValue(props.value);
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    if (e.key === "k" || e.key === "K") {
      const numericValue = parseFloat(value) * 1000;
      if (!isNaN(numericValue)) {
        numberInputInstance.setValue(numericValue);
      }
    }
  };

  const id = createUniqueId();

  return (
    <div class="flex flex-col">
      <label class="mb-1 text-sm text-neutral-700" for={id}>
        {props.label}
      </label>
      <div class="flex items-center gap-x-1 rounded-md border pl-2 text-neutral-700 focus-within:ring-2 focus-within:ring-blue-400">
        <input
          id={id}
          ref={ref}
          type="text"
          onKeyDown={handleKeyDown}
          class="w-full rounded-md py-2 focus:outline-none"
        />
      </div>
    </div>
  );
};

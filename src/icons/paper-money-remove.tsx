import { JSX, VoidProps } from "solid-js";

export default function IconPaperMoneyRemove(
  props: VoidProps<JSX.SvgSVGAttributes<SVGSVGElement>>
) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        color="currentColor"
      >
        <path d="M12 20h-1.5c-3.759 0-5.638 0-6.893-.99a4.4 4.4 0 0 1-.554-.523C2 17.307 2 15.537 2 12s0-5.306 1.053-6.487q.253-.284.554-.522C4.862 4 6.741 4 10.5 4h3c3.759 0 5.638 0 6.892.99q.302.24.555.523C22 6.693 22 8.463 22 12v3m-7 3.5h7M5.5 12h-.009M18.5 12h-.009" />
        <path d="M14.5 12a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0" />
      </g>
    </svg>
  );
}

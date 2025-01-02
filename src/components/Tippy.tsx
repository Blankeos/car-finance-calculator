import { TippyOptions, useTippy } from "@/lib/solid-tippy";
import { createSignal, FlowProps } from "solid-js";

export function Tippy(props: FlowProps<TippyOptions>) {
  const [ref, setRef] = createSignal<HTMLSpanElement>();

  useTippy(ref, {
    ...props,
  });

  return <span ref={setRef}>{props.children}</span>;
}

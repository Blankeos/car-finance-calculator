import { createSignal, FlowProps } from "solid-js";
import { TippyOptions, useTippy } from "solid-tippy";

export function Tippy(props: FlowProps<TippyOptions>) {
  const [ref, setRef] = createSignal<HTMLSpanElement>();

  useTippy(ref, {
    ...props,
  });

  return <span ref={setRef}>{props.children}</span>;
}

import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  FlowProps,
  JSX,
  onCleanup,
  Setter,
  useContext,
} from "solid-js";

import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { createStore } from "solid-js/store";

type DraggableContextValue = {
  instanceId: string | null;
};

const DraggableContext = createContext<DraggableContextValue>({
  instanceId: null,
} as DraggableContextValue);

const useDraggableContext = () => useContext(DraggableContext);

type DraggableContextProviderProps = {
  instanceId: string;
  onDrop: (data: { fromId: string; toId: string }) => void;
};

export function DraggableContextProvider(props: FlowProps<DraggableContextProviderProps>) {
  // eslint-disable-next-line solid/reactivity
  const [instanceId] = createSignal<string>(props.instanceId);

  createEffect(() => {
    onCleanup(
      monitorForElements({
        canMonitor({ source }) {
          console.log("canMonitor", { source });
          return source.data.instanceId === instanceId();
        },
        onDrop({ source, location }) {
          console.log("onDrop", { source, location });
          const destination = location.current.dropTargets[0];
          if (!destination) {
            return;
          }

          if (source.data.id && destination.data.id) {
            props?.onDrop({
              fromId: source.data.id as string,
              toId: destination.data.id as string,
            });
          }
        },
      })
    );
  });

  return (
    // eslint-disable-next-line solid/reactivity
    <DraggableContext.Provider value={{ instanceId: instanceId() }}>
      {props.children}
    </DraggableContext.Provider>
  );
}

type DraggableItemState = {
  status: "idle" | "dragging" | "over";
};

type DraggableItemProps = {
  id: string;
  children: (props: {
    ref: Setter<HTMLElement | undefined>;
    state: DraggableItemState;
  }) => JSX.Element;
};
export function DraggableItem(props: DraggableItemProps) {
  const draggableContext = useDraggableContext();
  const [dragState, setDragState] = createStore<{ status: "idle" | "dragging" | "over" }>({
    status: "idle",
  });

  const [ref, setRef] = createSignal<HTMLElement>();

  createEffect(() => {
    onCleanup(
      combine(
        draggable({
          element: ref()!,
          getInitialData: () => ({
            type: "grid-item",
            id: props.id,
            instanceId: draggableContext.instanceId,
          }),
          onDragStart: () => {
            setDragState("status", "dragging");
          },
          onDrop: () => {
            setDragState("status", "idle");
          },
        }),
        dropTargetForElements({
          element: ref()!,
          getData: () => ({ id: props.id }),
          getIsSticky: () => true,
          canDrop: ({ source }) =>
            source.data.instanceId === draggableContext.instanceId &&
            source.data.type === "grid-item" &&
            source.data.id !== props.id,
          onDragEnter: () => setDragState("status", "over"),
          onDragLeave: () => setDragState("status", "idle"),
          onDrop: () => setDragState("status", "idle"),
        })
      )
    );
  });

  // eslint-disable-next-line solid/reactivity
  return createMemo(() => {
    const child = props.children({ ref: setRef, state: dragState });
    return child;
  }, undefined) as unknown as JSX.Element;
}

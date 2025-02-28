import * as React from "react";
import { StateMachine } from "./core";

export function useMachine<T extends StateMachine<any, any>>(
  constructMachine: () => T,
  deps: unknown[]
): [ReturnType<T["getState"]>, T["events"], T["subscribe"]];
export function useMachine<T extends StateMachine<any, any>>(
  passedMachine: T
): [ReturnType<T["getState"]>, T["events"], T["subscribe"]];
export function useMachine<T extends StateMachine<any, any>>(
  passedMachine: T | (() => T),
  deps?: unknown[]
) {
  let machine: T;

  if (typeof passedMachine === "function") {
    machine = React.useMemo(() => passedMachine(), deps);
  } else {
    machine = passedMachine;
  }

  const [state, setState] = React.useState(machine.getState());
  const useTransitionEffect = React.useMemo(
    () =>
      (...params: any[]) =>
        // @ts-ignore
        React.useEffect(() => machine.subscribe(...params), []),
    [machine]
  );

  React.useEffect(() => machine.subscribe(setState), [machine]);

  return [state, machine.events, useTransitionEffect] as any;
}

const noop = () => {
  // Intentionally empty — ResizeObserver mock for jsdom.
};

class ResizeObserverMock {
  observe = noop;
  unobserve = noop;
  disconnect = noop;
}

globalThis.ResizeObserver =
  globalThis.ResizeObserver ??
  (ResizeObserverMock as unknown as typeof ResizeObserver);

export { };

declare global {
  interface Array<T> {
    includes<E>(searchElement: E, fromIndex?: number): searchElement is E & T;
  }
  interface ReadonlyArray<T> {
    includes<E>(searchElement: E, fromIndex?: number): searchElement is E & T;
  }
}

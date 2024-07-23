export function createFunctionReturning(): () => undefined;
export function createFunctionReturning<R>(result: R): () => R;
export function createFunctionReturning<R>(result?: R): () => R {
  return () => result as R;
}

export function assertNever(value: never): never {
  throw new Error(`Expected \`never\` but got ${value}`);
}

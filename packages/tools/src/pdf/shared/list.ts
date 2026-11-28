/** Moves the item at `from` one place up (-1) or down (+1). */
export function move<T>(list: readonly T[], from: number, step: -1 | 1): T[] {
    const to = from + step;
    if (from < 0 || from >= list.length || to < 0 || to >= list.length) return [...list];
    const next = [...list];
    [next[from], next[to]] = [next[to] as T, next[from] as T];
    return next;
}

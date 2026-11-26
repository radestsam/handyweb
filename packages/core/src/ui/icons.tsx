/* Line icons for the tool UI, 24px grid. Decorative: the visible label carries the meaning. */
const PATHS = {
    copy: "M9 9h10v10H9zM5 15V5h10",
    check: "m5 12.5 4.5 4.5L19 7.5",
    paste: "M9 4h6v3H9zM8 5.5H6.5A1.5 1.5 0 0 0 5 7v12.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V7a1.5 1.5 0 0 0-1.5-1.5H16",
    clear: "M6 6l12 12M18 6 6 18",
    swap: "M7 7h12m0 0-3-3m3 3-3 3M17 17H5m0 0 3 3m-3-3 3-3",
    file: "M7 3h7l5 5v13H7zM14 3v5h5",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "size-4" }: { name: IconName; className?: string }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d={PATHS[name]} />
        </svg>
    );
}

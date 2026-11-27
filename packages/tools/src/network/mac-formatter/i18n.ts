import type { LocalizedText } from "@handyweb/core";

export const strings = {
    input: { fa: "نشانی‌های MAC (هر خط یکی)", en: "MAC addresses (one per line)" },
    output: { fa: "خروجی", en: "Output" },
    style: { fa: "شکل", en: "Style" },
    plain: { fa: "بی‌جداکننده", en: "No separator" },
    upper: { fa: "حروف بزرگ", en: "Uppercase" },
    invalid: { fa: "نادرست", en: "not valid" },
    about: { fa: "درباره نخستین نشانی", en: "About the first address" },
    kind: { fa: "گونه", en: "Kind" },
    unicast: { fa: "تک‌پخشی (یک دستگاه)", en: "Unicast (one device)" },
    multicast: { fa: "چندپخشی (گروه)", en: "Multicast (a group)" },
    broadcast: { fa: "همگانی (همه دستگاه‌ها)", en: "Broadcast (every device)" },
    origin: { fa: "منبع", en: "Origin" },
    global: { fa: "داده سازنده (OUI معنادار)", en: "Set by the maker (the OUI is meaningful)" },
    local: {
        fa: "محلی یا تصادفی (برای نمونه حریم خصوصی گوشی)",
        en: "Local or random (for example, phone privacy)",
    },
    oui: { fa: "OUI (پیشوند سازنده)", en: "OUI (maker prefix)" },
    eui64: { fa: "شناسه EUI-64 برای IPv6", en: "EUI-64 interface ID for IPv6" },
    note: {
        fa: "نام سازنده از روی OUI نشان داده نمی‌شود، چون فهرست آن بزرگ است و باید به‌روز شود.",
        en: "The maker name is not shown from the OUI, because that list is large and must be kept up to date.",
    },
} as const satisfies Record<string, LocalizedText>;

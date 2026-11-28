import type { LocalizedText } from "@handyweb/core";

export const strings = {
    input: { fa: "نشانی IP با پیشوند یا ماسک", en: "IP address with a prefix or mask" },
    address: { fa: "نشانی", en: "Address" },
    network: { fa: "نشانی شبکه", en: "Network address" },
    broadcast: { fa: "نشانی Broadcast", en: "Broadcast address" },
    last: { fa: "آخرین نشانی", en: "Last address" },
    mask: { fa: "ماسک زیرشبکه", en: "Subnet mask" },
    wildcard: { fa: "ماسک Wildcard", en: "Wildcard mask" },
    binaryMask: { fa: "ماسک دودویی", en: "Binary mask" },
    range: { fa: "بازه میزبان‌ها", en: "Host range" },
    addresses: { fa: "شمار نشانی‌ها", en: "Addresses" },
    hosts: { fa: "میزبان‌های قابل استفاده", en: "Usable hosts" },
    special: { fa: "بازه ویژه", en: "Special range" },
    public: { fa: "عمومی (بازه ویژه نیست)", en: "Public (not a special range)" },
    note: {
        fa: "در IPv4 نشانی شبکه و Broadcast از میزبان‌ها کم می‌شوند، جز در /31 و /32. IPv6 نشانی Broadcast ندارد.",
        en: "In IPv4, the network and broadcast addresses are not hosts, except in /31 and /32. IPv6 has no broadcast address.",
    },
} as const satisfies Record<string, LocalizedText>;

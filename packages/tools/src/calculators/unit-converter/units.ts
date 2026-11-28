import type { LocalizedText } from "@handyweb/core";

/*
 * Units, each with its size in the base unit of its kind. Temperature has
 * offsets, so it has its own functions. Sources: SI Brochure (BIPM, 9th
 * edition) and NIST SP 811 for the other units. The Iranian units use the
 * values that are common in Iran today (mesghal 4.608 g, sir 75 g, man-e
 * Tabriz 3 kg, zar 104 cm, jerib 10,000 m²); older regional values differ.
 */

export interface Unit {
    id: string;
    label: LocalizedText;
    symbol: string;
    /** The size in the base unit. Not used for temperature. */
    factor: number;
}

export interface Kind {
    id: string;
    label: LocalizedText;
    units: Unit[];
}

const u = (id: string, symbol: string, factor: number, en: string, fa: string): Unit => ({
    id,
    symbol,
    factor,
    label: { en, fa },
});

export const KINDS: Kind[] = [
    {
        id: "length",
        label: { fa: "طول", en: "Length" },
        units: [
            u("mm", "mm", 0.001, "Millimeter", "میلی‌متر"),
            u("cm", "cm", 0.01, "Centimeter", "سانتی‌متر"),
            u("m", "m", 1, "Meter", "متر"),
            u("km", "km", 1000, "Kilometer", "کیلومتر"),
            u("in", "in", 0.0254, "Inch", "اینچ"),
            u("ft", "ft", 0.3048, "Foot", "فوت"),
            u("yd", "yd", 0.9144, "Yard", "یارد"),
            u("mi", "mi", 1609.344, "Mile", "مایل"),
            u("nmi", "nmi", 1852, "Nautical mile", "مایل دریایی"),
            u("zar", "zar", 1.04, "Zar (Iranian)", "ذرع"),
        ],
    },
    {
        id: "mass",
        label: { fa: "وزن", en: "Weight" },
        units: [
            u("mg", "mg", 0.000001, "Milligram", "میلی‌گرم"),
            u("g", "g", 0.001, "Gram", "گرم"),
            u("kg", "kg", 1, "Kilogram", "کیلوگرم"),
            u("t", "t", 1000, "Tonne", "تن"),
            u("oz", "oz", 0.028349523125, "Ounce", "اونس"),
            u("lb", "lb", 0.45359237, "Pound", "پوند"),
            u("ozt", "oz t", 0.0311034768, "Troy ounce", "اونس تروا"),
            u("ct", "ct", 0.0002, "Carat", "قیراط"),
            u("mesghal", "mesghal", 0.004608, "Mesghal (Iranian)", "مثقال"),
            u("sir", "sir", 0.075, "Sir (Iranian)", "سیر"),
            u("man", "man", 3, "Man-e Tabriz (Iranian)", "من تبریز"),
        ],
    },
    {
        id: "temperature",
        label: { fa: "دما", en: "Temperature" },
        units: [
            u("c", "°C", 1, "Celsius", "سلسیوس"),
            u("f", "°F", 1, "Fahrenheit", "فارنهایت"),
            u("k", "K", 1, "Kelvin", "کلوین"),
        ],
    },
    {
        id: "area",
        label: { fa: "مساحت", en: "Area" },
        units: [
            u("cm2", "cm²", 0.0001, "Square centimeter", "سانتی‌متر مربع"),
            u("m2", "m²", 1, "Square meter", "متر مربع"),
            u("ha", "ha", 10000, "Hectare", "هکتار"),
            u("km2", "km²", 1000000, "Square kilometer", "کیلومتر مربع"),
            u("ft2", "ft²", 0.09290304, "Square foot", "فوت مربع"),
            u("ac", "ac", 4046.8564224, "Acre", "ایکر"),
            u("jerib", "jerib", 10000, "Jerib (Iranian)", "جریب"),
        ],
    },
    {
        id: "volume",
        label: { fa: "حجم", en: "Volume" },
        units: [
            u("ml", "mL", 0.001, "Milliliter", "میلی‌لیتر"),
            u("l", "L", 1, "Liter", "لیتر"),
            u("m3", "m³", 1000, "Cubic meter", "متر مکعب"),
            u("gal", "gal", 3.785411784, "US gallon", "گالن آمریکایی"),
            u("galuk", "gal (UK)", 4.54609, "UK gallon", "گالن انگلیسی"),
            u("cup", "cup", 0.2365882365, "US cup", "پیمانه آمریکایی"),
            u("floz", "fl oz", 0.0295735295625, "US fluid ounce", "اونس مایع"),
            u("bbl", "bbl", 158.987294928, "Oil barrel", "بشکه نفت"),
        ],
    },
    {
        id: "speed",
        label: { fa: "سرعت", en: "Speed" },
        units: [
            u("ms", "m/s", 1, "Meter per second", "متر بر ثانیه"),
            u("kmh", "km/h", 1 / 3.6, "Kilometer per hour", "کیلومتر بر ساعت"),
            u("mph", "mph", 0.44704, "Mile per hour", "مایل بر ساعت"),
            u("kn", "kn", 1852 / 3600, "Knot", "گره دریایی"),
        ],
    },
    {
        id: "data",
        label: { fa: "حجم داده", en: "Data" },
        units: [
            u("b", "B", 1, "Byte", "بایت"),
            u("kb", "kB", 1e3, "Kilobyte (1000)", "کیلوبایت (۱۰۰۰)"),
            u("mb", "MB", 1e6, "Megabyte (1000²)", "مگابایت (۱۰۰۰²)"),
            u("gb", "GB", 1e9, "Gigabyte (1000³)", "گیگابایت (۱۰۰۰³)"),
            u("tb", "TB", 1e12, "Terabyte (1000⁴)", "ترابایت (۱۰۰۰⁴)"),
            u("kib", "KiB", 1024, "Kibibyte (1024)", "کیبی‌بایت (۱۰۲۴)"),
            u("mib", "MiB", 1024 ** 2, "Mebibyte (1024²)", "مبی‌بایت (۱۰۲۴²)"),
            u("gib", "GiB", 1024 ** 3, "Gibibyte (1024³)", "گیبی‌بایت (۱۰۲۴³)"),
            u("tib", "TiB", 1024 ** 4, "Tebibyte (1024⁴)", "تبی‌بایت (۱۰۲۴⁴)"),
            u("bit", "bit", 1 / 8, "Bit", "بیت"),
            u("mbit", "Mbit", 1e6 / 8, "Megabit", "مگابیت"),
        ],
    },
    {
        id: "time",
        label: { fa: "زمان", en: "Time" },
        units: [
            u("ms", "ms", 0.001, "Millisecond", "میلی‌ثانیه"),
            u("s", "s", 1, "Second", "ثانیه"),
            u("min", "min", 60, "Minute", "دقیقه"),
            u("h", "h", 3600, "Hour", "ساعت"),
            u("d", "d", 86400, "Day", "روز"),
            u("wk", "wk", 604800, "Week", "هفته"),
            u("yr", "yr", 31556952, "Year (365.2425 days)", "سال (۳۶۵٫۲۴۲۵ روز)"),
        ],
    },
    {
        id: "pressure",
        label: { fa: "فشار", en: "Pressure" },
        units: [
            u("pa", "Pa", 1, "Pascal", "پاسکال"),
            u("kpa", "kPa", 1000, "Kilopascal", "کیلوپاسکال"),
            u("bar", "bar", 100000, "Bar", "بار"),
            u("atm", "atm", 101325, "Atmosphere", "اتمسفر"),
            u("psi", "psi", 6894.757293168, "Pound per square inch", "پوند بر اینچ مربع (psi)"),
            u("mmhg", "mmHg", 133.322387415, "Millimeter of mercury", "میلی‌متر جیوه"),
        ],
    },
    {
        id: "energy",
        label: { fa: "انرژی", en: "Energy" },
        units: [
            u("j", "J", 1, "Joule", "ژول"),
            u("kj", "kJ", 1000, "Kilojoule", "کیلوژول"),
            u("cal", "cal", 4.184, "Calorie", "کالری"),
            u("kcal", "kcal", 4184, "Kilocalorie", "کیلوکالری"),
            u("wh", "Wh", 3600, "Watt-hour", "وات‌ساعت"),
            u("kwh", "kWh", 3600000, "Kilowatt-hour", "کیلووات‌ساعت"),
        ],
    },
];

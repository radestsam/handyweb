import { describe, expect, it } from "vitest";
import { calculate, formatIpv6, parseIpv6 } from "./logic";

describe("IPv4", () => {
    it("works out a /24", () => {
        expect(calculate("192.168.1.10/24")).toMatchObject({
            network: "192.168.1.0",
            broadcast: "192.168.1.255",
            mask: "255.255.255.0",
            wildcard: "0.0.0.255",
            firstHost: "192.168.1.1",
            lastHost: "192.168.1.254",
            hosts: 254n,
            special: expect.objectContaining({ en: "Private (RFC 1918)" }),
        });
    });

    it("reads a dotted mask and handles /31 and /32", () => {
        expect(calculate("10.1.2.3 255.255.240.0")).toMatchObject({
            prefix: 20,
            network: "10.1.0.0",
            broadcast: "10.1.15.255",
        });
        expect(calculate("203.0.113.4/31")).toMatchObject({
            hosts: 2n,
            firstHost: "203.0.113.4",
            lastHost: "203.0.113.5",
        });
        expect(calculate("8.8.8.8")).toMatchObject({ prefix: 32, hosts: 1n, special: null });
    });

    it("refuses bad input", () => {
        expect(() => calculate("256.1.1.1/24")).toThrow(/IPv4/);
        expect(() => calculate("192.168.01.1")).toThrow();
        expect(() => calculate("10.0.0.0 255.0.255.0")).toThrow(/contiguous/);
        expect(() => calculate("10.0.0.0/33")).toThrow(/prefix/);
    });
});

describe("IPv6", () => {
    it("parses and writes the short form", () => {
        expect(formatIpv6(parseIpv6("2001:0db8:0000:0000:0000:ff00:0042:8329"))).toBe(
            "2001:db8::ff00:42:8329",
        );
        expect(formatIpv6(parseIpv6("::1"))).toBe("::1");
        expect(formatIpv6(parseIpv6("::ffff:192.0.2.1"))).toBe("::ffff:c000:201");
        // A single zero group is not shortened.
        expect(formatIpv6(parseIpv6("2001:db8:0:1:1:1:1:1"))).toBe("2001:db8:0:1:1:1:1:1");
    });

    it("works out a /64", () => {
        const subnet = calculate("2001:db8:abcd:12::5/64");
        expect(subnet).toMatchObject({
            network: "2001:db8:abcd:12::",
            last: "2001:db8:abcd:12:ffff:ffff:ffff:ffff",
            special: expect.objectContaining({ en: "Documentation (RFC 3849)" }),
        });
        expect(subnet.addresses).toBe(2n ** 64n);
        expect(calculate("fe80::1/10").special?.en).toBe("Link-local (RFC 4291)");
    });

    it("refuses bad input", () => {
        expect(() => calculate("2001:db8::1::2")).toThrow(/IPv6/);
        expect(() => calculate("2001:db8:g::1")).toThrow(/IPv6/);
    });
});

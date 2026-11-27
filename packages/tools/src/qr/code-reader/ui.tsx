import { useEffect, useRef, useState } from "react";
import { decodeImage } from "@handyweb/core/image";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import {
    Button,
    CopyButton,
    ErrorMessage,
    FileDrop,
    Ltr,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { browserDetector, decodeCanvas, type Found } from "./decode";
import { KINDS, strings } from "./i18n";
import { classify, parseWifi, safeLink } from "./logic";

export default function CodeReader({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const video = useRef<HTMLVideoElement>(null);
    const stream = useRef<MediaStream | null>(null);
    const timer = useRef<number | null>(null);
    const [scanning, setScanning] = useState(false);
    const [found, setFound] = useState<Found | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<ToolError | null>(null);
    const [native, setNative] = useState<boolean | null>(null);

    useEffect(() => {
        void browserDetector().then((detector) => setNative(detector !== null));
    }, []);

    const stop = () => {
        if (timer.current !== null) window.clearInterval(timer.current);
        timer.current = null;
        stream.current?.getTracks().forEach((track) => track.stop());
        stream.current = null;
        setScanning(false);
    };
    // Turn the camera off when the tool closes.
    useEffect(() => stop, []);

    // The camera starts only after the user asks, so the browser asks for permission only then.
    const start = async () => {
        setFound(null);
        setMessage(null);
        setError(null);
        try {
            const media = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false,
            });
            stream.current = media;
            setScanning(true);
            const element = video.current;
            if (!element) return;
            element.srcObject = media;
            await element.play();
            const canvas = document.createElement("canvas");
            timer.current = window.setInterval(() => {
                if (!element.videoWidth) return;
                canvas.width = element.videoWidth;
                canvas.height = element.videoHeight;
                canvas.getContext("2d", { willReadFrequently: true })?.drawImage(element, 0, 0);
                void decodeCanvas(canvas).then((codes) => {
                    if (codes[0] && stream.current) {
                        setFound(codes[0]);
                        stop();
                    }
                });
            }, 350);
        } catch {
            stop();
            setMessage(t("denied"));
        }
    };

    const readFile = async (file: File) => {
        stop();
        setFound(null);
        setMessage(null);
        setError(null);
        try {
            const image = await decodeImage(file);
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext("2d", { willReadFrequently: true })?.drawImage(image.bitmap, 0, 0);
            image.bitmap.close();
            const codes = await decodeCanvas(canvas);
            canvas.width = canvas.height = 0;
            if (codes[0]) setFound(codes[0]);
            else setMessage(t("none"));
        } catch (caught) {
            setError(toToolError(caught));
        }
    };

    const kind = found ? classify(found.value) : null;
    const link = found && kind === "url" ? safeLink(found.value) : null;
    const wifi = found && kind === "wifi" ? parseWifi(found.value) : null;

    return (
        <div className="flex flex-col gap-5">
            {native === false && (
                <p className="rounded-2xl border border-border bg-surface-2/60 px-4 py-3 text-sm">
                    {t("qrOnly")}
                </p>
            )}
            <div className="flex flex-wrap gap-2">
                {scanning ? (
                    <Button onClick={stop}>{t("stop")}</Button>
                ) : (
                    <Button variant="primary" onClick={() => void start()} data-reader-camera="">
                        {found ? t("again") : t("camera")}
                    </Button>
                )}
            </div>
            <video
                ref={video}
                muted
                playsInline
                className={
                    scanning ? "max-h-96 w-full rounded-2xl bg-black object-contain" : "hidden"
                }
                aria-label={t("looking")}
            />
            {scanning && <p className="text-sm text-muted">{t("looking")}</p>}
            <FileDrop
                locale={locale}
                accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
                hint={t("orImage")}
                onFile={(file) => void readFile(file)}
            />
            {message && (
                <p className="text-sm text-muted" role="status">
                    {message}
                </p>
            )}
            {error && <ErrorMessage error={error} locale={locale} />}

            {found && kind && (
                <section
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-4"
                    aria-live="polite"
                >
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm font-semibold">
                            {KINDS[kind][locale]}{" "}
                            <span className="text-xs font-normal text-muted">({found.format})</span>
                        </h2>
                        <CopyButton text={found.value} locale={locale} compact />
                    </div>
                    <pre
                        dir="auto"
                        className="max-h-60 overflow-auto rounded-xl bg-surface-2/60 px-3 py-2 text-sm break-all whitespace-pre-wrap"
                        data-reader-value=""
                    >
                        {found.value}
                    </pre>
                    {wifi && (
                        <dl className="grid gap-1 text-sm sm:grid-cols-3">
                            <div>
                                <dt className="text-xs text-muted">{t("network")}</dt>
                                <dd>
                                    <bdi>{wifi.ssid}</bdi>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted">{t("password")}</dt>
                                <dd className="flex items-center gap-1">
                                    <Ltr as="code" className="font-mono">
                                        {wifi.password}
                                    </Ltr>
                                    {wifi.password && (
                                        <CopyButton text={wifi.password} locale={locale} compact />
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted">{t("security")}</dt>
                                <dd>{wifi.security}</dd>
                            </div>
                        </dl>
                    )}
                    {link && (
                        <div className="flex flex-col gap-2">
                            <p className="text-xs text-muted">{t("openWarning")}</p>
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-fit rounded-full border border-border px-4 py-2 text-sm font-semibold"
                            >
                                {t("open")}
                            </a>
                        </div>
                    )}
                </section>
            )}
            <p className="text-xs text-muted">{t("privacy")}</p>
            <input type="hidden" value={found ? found.value : ""} readOnly data-tool-output="" />
        </div>
    );
}

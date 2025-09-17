import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

/**
 * Shadcn-style barcode scanner card using Tailwind utilities.
 * No external UI imports required.
 */

type Props = {
  onDetected?: (text: string) => void;
  pauseOnDetect?: boolean; // default true
  title?: string;
  description?: string;
};

export default function BarcodeScanner({
  onDetected,
  pauseOnDetect = true,
  title = "Think about your Products",
  description = "Scan or enter an EAN to discover the environmental and social impact of your electronic product..",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<
    ReturnType<BrowserMultiFormatReader["decodeFromVideoDevice"]> | undefined
  >(undefined);
  const readerRef = useRef(new BrowserMultiFormatReader());

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceIndex, setDeviceIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const loadDevices = useCallback(async () => {
    try {
      const list = await BrowserMultiFormatReader.listVideoInputDevices();
      setDevices(list);
      if (list.length > 0) {
        setDeviceIndex((idx) => Math.min(idx, list.length - 1));
      }
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }, []);

  const stop = useCallback(() => {
    try {
      controlsRef.current?.then((c) => c?.stop()).catch(() => {});
    } finally {
      const v = videoRef.current as HTMLVideoElement | null;
      if (v && v.srcObject) {
        try {
          (v.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
        } catch {}
        // @ts-ignore
        v.srcObject = null;
      }
      readerRef.current.reset();
      setIsActive(false);
    }
  }, []);

  const start = useCallback(
    async (id?: string) => {
      setError(null);
      setResult((r) => (pauseOnDetect ? r : null));
      const reader = readerRef.current;
      controlsRef.current = undefined;
      const v = videoRef.current as HTMLVideoElement | null;
      if (v && v.srcObject) {
        try {
          (v.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
        } catch {}
        // @ts-ignore
        v.srcObject = null;
      }
      try {
        controlsRef.current = await reader.decodeFromVideoDevice(
          id,
          videoRef.current!,
          (res, _err, ctl) => {
            if (res) {
              const text = res.getText();
              setResult(text);
              onDetected?.(text);
              if (pauseOnDetect) {
                ctl.stop();
                setIsActive(false);
              }
            }
          }
        );
        setIsActive(true);
      } catch (e: any) {
        setError(e?.message ?? String(e));
        setIsActive(false);
      }
    },
    [onDetected, pauseOnDetect]
  );

  const restart = useCallback(async () => {
    try {
      await stop();
    } catch {}
    const targetId = devices[deviceIndex]?.deviceId;
    await start(targetId);
  }, [devices, deviceIndex, start, stop]);

  const clearResult = () => setResult(null);

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
    } catch {}
  };

  useEffect(() => {
    loadDevices();
    // autostart on mount
    (async () => {
      await start(undefined);
    })();

    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // re-run if device index changes (manual switch handled by switchCamera)
  useEffect(() => {
    // keep label visibility updated when permissions are granted later
    loadDevices();
  }, [isActive, loadDevices]);

  return (
    <div className="w-full p-0 md:p-0">
      {/* Card */}
      <div className="w-full rounded-lg border bg-background shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b p-4 md:p-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 p-4 md:p-6">
          {/* Video surface */}
          <div className="relative w-full overflow-hidden rounded-lg bg-muted">
            {/* Fixed height so gray area equals camera area even before start */}
            <div className="w-full h-[430px] md:h-[490px] ">
              <video
                ref={videoRef}
                playsInline
                muted
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          {/* subtle top gradient */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background/60 to-transparent" />

          {/* Controls */}
          <div class="mt-6 flex gap-2">
            <input
              type="text"
              placeholder="Enter EAN..."
              class="flex-1 h-10 rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <button class="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Scan EAN
            </button>
          </div>

          {/* Result / Error */}
          {result && (
            <div className="flex items-start gap-3 rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
              <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-green-500" />
              <div className="flex-1">
                <div className="font-medium">Detected</div>
                <div className="select-all break-all font-mono text-sm">
                  {result}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyResult}
                  className="inline-flex items-center justify-center rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Copy
                </button>
                <button
                  onClick={clearResult}
                  className="inline-flex items-center justify-center rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {error && (
            <div
              className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-400"
              role="alert"
            >
              <div className="font-medium">Camera error</div>
              <div className="mt-1 text-sm">{error}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

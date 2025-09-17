import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

// shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

// Daten: T-Phone
import recyclingT from "@/assets/data/recycling/recycling_summary_tphone.json";
import longevityT from "@/assets/data/longtivity/t-phone-datenblatt.json";
import supplychainTelekom from "@/assets/data/supplychain/telekom.json";
import socialTelekom from "@/assets/data/social/telekom_esrs_clustered_en.json";
import hazardT from "@/assets/data/hazard/tphone.json";
import dangerousData from "@/assets/data/dangerous/tphone_dangerous.json";

/**
 * BarcodeScanner (T-Phone)
 * - Scannt EAN/Barcodes
 * - Öffnet Dialog mit T-Phone-Daten (Tabs) auf jeden Treffer
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
  const [open, setOpen] = useState(false);

  // Name für Titel/KPIs aus Longevity ableiten (einheitlich, z.B. "TPhone 3")
  const productName = formatDeviceName((longevityT as any)?.product || {});

  const loadDevices = useCallback(async () => {
    try {
      const list = await BrowserMultiFormatReader.listVideoInputDevices();
      setDevices(list);
      if (list.length > 0)
        setDeviceIndex((idx) => Math.min(idx, list.length - 1));
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
              setOpen(true); // Dialog immer auf
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
    (async () => {
      await start(undefined);
    })();
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadDevices();
  }, [isActive, loadDevices]);

  return (
    <div className="w-full p-0 md:p-0">
      {/* Scanner Card */}
      <div className="w-full rounded-lg border bg-background shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b p-4 md:p-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="space-y-4 p-4 md:p-6">
          <div className="relative w-full overflow-hidden rounded-lg bg-muted">
            <div className="w-full h-[430px] md:h-[483px] ">
              <video
                ref={videoRef}
                playsInline
                muted
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <input
              type="text"
              placeholder="Enter EAN..."
              className="flex-1 h-10 rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <button className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Scan EAN
            </button>
          </div>

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

      {/* Dialog */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          // if (!isActive && v === false) restart();
        }}
      >
        <DialogContent className="w-[96vw] lg:max-w-[700px] max-h-[85vh] overflow-hidden brand-ui">
          <DialogHeader>
            <DialogTitle>{productName} — Sustainability Profile</DialogTitle>
            {result && (
              <p className="text-xs text-muted-foreground">
                Scanned code: {result}
              </p>
            )}
          </DialogHeader>

          <Tabs defaultValue="recycling" className="mt-2">
            {/* FIX: Tabs horizontal scrollbar + kein Umbruch */}
            <ScrollArea className="w-full">
              <div className="pr-2">
                <TabsList className="flex w-max gap-2">
                  <TabsTrigger className="whitespace-nowrap" value="recycling">
                    Recycling
                  </TabsTrigger>
                  <TabsTrigger className="whitespace-nowrap" value="longevity">
                    Longevity
                  </TabsTrigger>
                  <TabsTrigger
                    className="whitespace-nowrap"
                    value="supplychain"
                  >
                    Supply Chain
                  </TabsTrigger>
                  <TabsTrigger className="whitespace-nowrap" value="social">
                    Social
                  </TabsTrigger>
                  <TabsTrigger className="whitespace-nowrap" value="hazard">
                    Hazard
                  </TabsTrigger>
                  <TabsTrigger className="whitespace-nowrap" value="dangerous">
                    Dangerous components
                  </TabsTrigger>
                </TabsList>
              </div>
            </ScrollArea>

            <TabsContent value="recycling">
              <RecyclingTab data={recyclingT as any} />
            </TabsContent>
            <TabsContent value="longevity">
              <LongevityTab data={longevityT as any} />
            </TabsContent>
            <TabsContent value="supplychain">
              <ScrollArea className="h-[60vh] pr-2">
                <SupplyChainTab data={supplychainTelekom as any} />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="social">
              <SocialTab data={socialTelekom as any} />
            </TabsContent>
            <TabsContent value="hazard">
              <ScrollArea className="h-[60vh] pr-2">
                <HazardTab data={hazardT as any} />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="dangerous">
              <ScrollArea className="h-[60vh] pr-2">
                <DangerousComponentsTab data={dangerousData as any} />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =========================
   Helper
   ========================= */

function fmtNum(n?: number, digits = 0) {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: digits,
  }).format(n);
}
function pct(n?: number) {
  if (n == null) return "—";
  return `${fmtNum(n, 1)}%`;
}
function safePct(n?: number) {
  const v = Number.isFinite(n as number) ? (n as number) : 0;
  return Math.max(0, Math.min(100, v));
}

/** Einheitlichen Produktnamen bilden – z.B. "TPhone 3" */
function formatDeviceName(p: any) {
  const brand = (p?.brand || "").trim();
  const model = (p?.model || "").trim();

  const norm = (s: string) => s.toLowerCase().replace(/[\s-]+/g, "");
  const collapseTPhone = (s: string) =>
    s.replace(/\bT[\s-]?Phone\b/gi, "TPhone");

  if (!brand && !model) return "—";
  if (brand && model) {
    // Modell enthält Brand -> nimm nur Modell
    if (norm(model).includes(norm(brand))) {
      return collapseTPhone(model)
        .replace(/\s{2,}/g, " ")
        .trim();
    }
    return collapseTPhone(`${brand} ${model}`)
      .replace(/\s{2,}/g, " ")
      .trim();
  }
  return collapseTPhone(model || brand)
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* =========================
   Tabs
   ========================= */

/** RECYCLING (T-Phone) */
function RecyclingTab({
  data,
}: {
  data: {
    total_summary: {
      total_phone_weight_mg: number;
      total_recyclable_weight_mg: number;
      total_partially_recyclable_weight_mg: number;
      total_burnable_weight_mg: number;
      total_non_recyclable_weight_mg: number;
      percentage_recyclable?: number;
      percentage_partially_recyclable?: number;
      percentage_burnable?: number;
      percentage_non_recyclable?: number;
      precentages_recyclable?: number;
      precentages_partially_recyclable?: number;
      precentages_burnable?: number;
      precentages_non_recyclable?: number;
    };
    material_type_summary: Array<{
      material_type: string;
      total_weight_mg: number;
      recyclable_weight_mg: number;
      partially_recyclable_weight_mg: number;
      burnable_weight_mg: number;
      non_recyclable_weight_mg: number;
      precentages_recyclable?: number;
      precentages_partially_recyclable?: number;
      precentages_burnable?: number;
      precentages_non_recyclable?: number;
    }>;
  };
}) {
  if (!data)
    return <p className="text-sm text-muted-foreground">No data available</p>;

  const t = data.total_summary || ({} as any);
  const pRec = t.percentage_recyclable ?? t.precentages_recyclable ?? undefined;
  const pPart =
    t.percentage_partially_recyclable ??
    t.precentages_partially_recyclable ??
    undefined;
  const pBurn = t.percentage_burnable ?? t.precentages_burnable ?? undefined;
  const pNon =
    t.percentage_non_recyclable ?? t.precentages_non_recyclable ?? undefined;

  const total_g = (t.total_phone_weight_mg || 0) / 1000;

  const materials = [...(data.material_type_summary || [])]
    .sort((a, b) => (b.total_weight_mg || 0) - (a.total_weight_mg || 0))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-lg border p-3">
          <div className="text-xs text-muted-foreground">Total weight</div>
          <div className="text-lg font-semibold">{fmtNum(total_g, 1)} g</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-xs text-muted-foreground">Recyclable</div>
          <div className="text-lg font-semibold">{pct(pRec)}</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-xs text-muted-foreground">
            Partially recyclable
          </div>
          <div className="text-lg font-semibold">{pct(pPart)}</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-xs text-muted-foreground">
            Non-recyclable + burnable
          </div>
          <div className="text-lg font-semibold">
            {pct((pNon ?? 0) + (pBurn ?? 0))}
          </div>
        </div>
      </div>

      {/* Stacked Bar */}
      <div className="space-y-2">
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted flex">
          <div
            className="bg-emerald-500"
            style={{ width: `${safePct(pRec)}%` }}
            title={`Recyclable ${pct(pRec)}`}
          />
          <div
            className="bg-amber-500"
            style={{ width: `${safePct(pPart)}%` }}
            title={`Partially ${pct(pPart)}`}
          />
          <div
            className="bg-fuchsia-500"
            style={{ width: `${safePct(pBurn)}%` }}
            title={`Burnable ${pct(pBurn)}`}
          />
          <div
            className="bg-rose-500"
            style={{ width: `${safePct(pNon)}%` }}
            title={`Non-recyclable ${pct(pNon)}`}
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Badge className="bg-emerald-500 hover:bg-emerald-600">
            Recyclable
          </Badge>
          <Badge className="bg-amber-500 hover:bg-amber-600">Partially</Badge>
          <Badge className="bg-fuchsia-500 hover:bg-fuchsia-600">
            Burnable
          </Badge>
          <Badge className="bg-rose-500 hover:bg-rose-600">
            Non-recyclable
          </Badge>
        </div>
      </div>

      {/* Top materials */}
      <div className="grid md:grid-cols-2 gap-3">
        {materials.map((m) => (
          <div key={m.material_type} className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium capitalize">
                {m.material_type}
              </div>
              <div className="text-sm text-muted-foreground">
                {fmtNum(m.total_weight_mg / 1000, 2)} g
                {m.precentages_recyclable != null && (
                  <> ({fmtNum(m.precentages_recyclable, 1)}%)</>
                )}
              </div>
            </div>

            <div className="mt-2 h-2 w-full rounded bg-muted overflow-hidden flex">
              <div
                className="bg-emerald-500"
                style={{ width: `${safePct(m.precentages_recyclable)}%` }}
                title="Recyclable"
              />
              <div
                className="bg-amber-500"
                style={{
                  width: `${safePct(m.precentages_partially_recyclable)}%`,
                }}
                title="Partially"
              />
              <div
                className="bg-fuchsia-500"
                style={{ width: `${safePct(m.precentages_burnable)}%` }}
                title="Burnable"
              />
              <div
                className="bg-rose-500"
                style={{ width: `${safePct(m.precentages_non_recyclable)}%` }}
                title="Non-recyclable"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** LONGEVITY (T-Phone) – clean KPIs + strukturierte Sections */
function LongevityTab({ data }: { data: any }) {
  if (!data)
    return <p className="text-sm text-muted-foreground">No data available</p>;
  const p = data.product ?? {};
  const e = data.energy ?? {};
  const r = data.repairability ?? {};
  const b = e.battery ?? {};

  const kpi = (
    label: string,
    value: React.ReactNode,
    sub?: React.ReactNode
  ) => (
    <div className="rounded-xl border p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-semibold leading-none">{value}</div>
      {sub ? (
        <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
      ) : null}
    </div>
  );
  const Stat = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="text-sm">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
  const Bar = ({ pct }: { pct: number }) => (
    <div className="mt-1 h-2 w-full rounded bg-muted overflow-hidden">
      <div
        className="h-full rounded bg-primary"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </div>
  );

  const cycles = Number(b.lifetimeCycles) || 0;
  const cyclePct = Math.min(100, (cycles / 1200) * 100); // Orientierung
  const perCycleHours = Number(b.lifetimePerCycle_h) || 0;
  const perCyclePct = Math.min(100, (perCycleHours / 50) * 100); // Orientierung

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpi(
          "Device",
          <div className="space-y-1">
            <div className="text-base">{formatDeviceName(p)}</div>
            <div className="text-xs text-muted-foreground">
              ({p.deviceType ?? "—"})
            </div>
          </div>
        )}

        {kpi("OS", p.operatingSystem ?? "—")}

        {kpi(
          "Efficiency class",
          <div className="inline-flex items-center gap-2">
            <span>{e.efficiencyClass ?? "—"}</span>
          </div>,
          e.requiredChargerPower_W != null ? (
            <>Req.Charger: {fmtNum(e.requiredChargerPower_W)} W</>
          ) : undefined
        )}

        {kpi(
          "Repairability index",
          <div className="inline-flex items-center gap-2">
            <span>{r.index ?? "—"}</span>
            {r.class ? <Badge variant="outline">{r.class}</Badge> : null}
          </div>,
          r.notes ?? undefined
        )}
      </div>

      {/* Battery */}
      <div className="rounded-xl border p-4">
        <div className="mb-3 text-sm font-medium">Battery</div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Stat
              label="User-replaceable"
              value={
                <span className="font-medium">
                  {e.userReplaceableBattery ? "Yes" : "No"}
                </span>
              }
            />
            <Stat label="Capacity" value={<>{fmtNum(b.capacity_mAh)} mAh</>} />
            <div>
              <Stat
                label="Lifetime per cycle"
                value={<>{fmtNum(perCycleHours)} h</>}
              />
              <Bar pct={perCyclePct} />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Stat label="Lifetime cycles" value={<>{fmtNum(cycles)}</>} />
              <Bar pct={cyclePct} />
            </div>
            {e.batteryRemovable != null && (
              <Stat
                label="Removable pack"
                value={
                  <span className="font-medium">
                    {e.batteryRemovable ? "Yes" : "No"}
                  </span>
                }
              />
            )}
            {b.warranty_months != null && (
              <Stat
                label="Battery warranty"
                value={<>{fmtNum(b.warranty_months)} months</>}
              />
            )}
          </div>
        </div>
      </div>

      {/* Charging & accessories */}
      <div className="rounded-xl border p-4">
        <div className="mb-3 text-sm font-medium">Charging & accessories</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat
            label="Required charger power"
            value={<>{fmtNum(e.requiredChargerPower_W)} W</>}
          />
          <Stat label="Connector" value={<>{e.chargerConnector ?? "—"}</>} />
          <Stat
            label="Protective cover included"
            value={
              <span className="font-medium">
                {e.shippedWithProtectiveCover ? "Yes" : "No"}
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}

//** SUPPLY CHAIN (Telekom) – kompakt mit Accordion + Show more */
function SupplyChainTab({ data }: { data: any }) {
  if (!data)
    return <p className="text-sm text-muted-foreground">No data available</p>;

  const sections: Array<{ key: string; title: string; items: any[] }> = [
    {
      key: "internal",
      title: "Internal risks",
      items: data.identified_internal_risks ?? [],
    },
    {
      key: "direct",
      title: "Direct supplier risks",
      items: data.identified_direct_supplier_risks ?? [],
    },
    {
      key: "indirect",
      title: "Indirect supplier risks",
      items: data.identified_indirect_supplier_risks ?? [],
    },
  ];

  return (
    <div className="space-y-4">
      {/* KPIs oben */}
      <div className="grid sm:grid-cols-3 gap-3">
        {sections.map((s) => (
          <div key={s.key} className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">{s.title}</div>
            <div className="text-2xl font-semibold">
              {fmtNum(s.items.length)}
            </div>
          </div>
        ))}
      </div>

      {/* Accordion-Listen */}
      <Accordion type="multiple" className="w-full">
        {sections.map((s) => (
          <SupplySection key={s.key} title={s.title} items={s.items} />
        ))}
      </Accordion>
    </div>
  );
}

/** Ein Section-Item mit lokalem "Show more" State */
function SupplySection({ title, items }: { title: string; items: any[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, 5);

  return (
    <AccordionItem value={title}>
      <AccordionTrigger className="justify-between">
        <span>{title}</span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="rounded-lg border p-3">
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {visible.map((it: any) => (
              <li key={it.id ?? it.name}>
                <span className="font-medium">{it.name ?? "Risk"}</span>
                {typeof it.appropriate_mitigation_measures === "number" && (
                  <span className="ml-2 text-muted-foreground">
                    ({it.appropriate_mitigation_measures} mitigation measures)
                  </span>
                )}
              </li>
            ))}
            {items.length === 0 && (
              <li className="text-muted-foreground">No items</li>
            )}
          </ul>

          {items.length > 5 && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-xs font-medium text-primary hover:underline"
              >
                {expanded ? "Show less" : `Show all ${items.length}`}
              </button>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

/** SOCIAL (Telekom ESRS) */
function SocialTab({ data }: { data: any }) {
  const clusters: any[] = data?.clusters ?? [];
  if (!clusters.length)
    return <p className="text-sm text-muted-foreground">No data available</p>;
  return (
    <Accordion type="single" collapsible className="w-full">
      {clusters.map((c, idx) => (
        <AccordionItem key={idx} value={`c-${idx}`}>
          <AccordionTrigger>{c.topic ?? `Cluster ${idx + 1}`}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm">
              {c.description && (
                <p>
                  <span className="font-medium">Description: </span>
                  {c.description}
                </p>
              )}
              {c.esrs_extract && (
                <p className="text-muted-foreground">{c.esrs_extract}</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** HAZARD (T-Phone) – saubere Karten, Progress, Badges, Show more */
function HazardTab({ data }: { data: any }) {
  // Daten robust normalisieren (Array bevorzugt)
  const items: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.substances)
    ? data.substances
    : Object.values(data ?? {});

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">No data available</p>;
  }

  // sortieren: zuerst Überschreitungen, dann nach Verhältnis amount/threshold absteigend
  const normalized = items.map(normalizeSubstance).sort((a, b) => {
    if (a.exceeded !== b.exceeded) return a.exceeded ? -1 : 1;
    return b.ratio - a.ratio;
  });

  return (
    <div className="grid gap-3">
      {normalized.map((s) => (
        <HazardItem key={`${s.symbol}-${s.id ?? s.name}`} s={s} />
      ))}
    </div>
  );
}

/** Einzel-Karte für eine Substanz */
function HazardItem({ s }: { s: ReturnType<typeof normalizeSubstance> }) {
  const [expand, setExpand] = useState(false);

  // Progress-/Badge-Farben
  const barClass = s.exceeded ? "bg-rose-500" : "bg-emerald-500";
  const statusClass = s.exceeded
    ? "bg-rose-100 text-rose-700 border-rose-200"
    : "bg-emerald-100 text-emerald-700 border-emerald-200";

  return (
    <Card className="p-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">
            {s.name ?? s.symbol ?? "Substance"}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {s.symbol && <Badge variant="outline">{s.symbol}</Badge>}
            {s.regulation && <Badge variant="outline">{s.regulation}</Badge>}
            <Badge className={statusClass + " border"}>
              {s.exceeded ? "Exceeded" : "OK"}
            </Badge>
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground shrink-0">
          <div>
            Threshold:{" "}
            <span className="font-medium">{fmtNum(s.threshold, 2)}%</span>
          </div>
          <div>
            Amount: <span className="font-medium">{fmtNum(s.amount, 2)}%</span>
          </div>
        </div>
      </div>

      {/* Progress: Anteil am Threshold */}
      <div className="mt-3">
        <div className="h-2 w-full rounded bg-muted overflow-hidden">
          <div
            className={`h-full ${barClass}`}
            style={{ width: `${Math.max(0, Math.min(100, s.ratio * 100))}%` }}
            title={`${fmtNum(s.ratio * 100, 1)}% of threshold`}
          />
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">
          {fmtNum(s.ratio * 100, 1)}% of threshold
        </div>
      </div>

      {/* Beschreibung */}
      {s.description && (
        <div className="mt-3 text-sm text-muted-foreground">
          {expand ? s.description : cutText(s.description, 220)}
          {s.description.length > 220 && (
            <>
              {" "}
              <button
                onClick={() => setExpand((v) => !v)}
                className="text-primary font-medium hover:underline"
              >
                {expand ? "Show less" : "Show more"}
              </button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}

/** -------- helpers für Hazard -------- */

function cutText(t: string, n: number) {
  if (!t) return "";
  return t.length <= n ? t : t.slice(0, n).trimEnd() + "…";
}

function parsePercent(x: unknown): number {
  if (x == null) return 0;
  if (typeof x === "number") return x;
  const s = String(x).trim();
  const num = parseFloat(s.replace(",", ".").replace("%", ""));
  return Number.isFinite(num) ? num : 0;
}

function normalizeSubstance(raw: any) {
  const id = raw?.id ?? raw?.ID;
  const name = raw?.name ?? raw?.NAME;
  const symbol = raw?.symbol ?? raw?.SYMBOL;
  const regulation = raw?.regulation ?? raw?.REGULATION ?? "—";
  const threshold = parsePercent(raw?.threshold ?? raw?.THRESHOLD);
  const amount = parsePercent(raw?.amount ?? raw?.AMOUNT);
  const exceeded =
    typeof raw?.exceeded === "boolean" ? raw.exceeded : amount >= threshold;
  const ratio = threshold > 0 ? amount / threshold : 0;
  const description = raw?.description ?? raw?.DESCRIPTION ?? "";

  return {
    id,
    name,
    symbol,
    regulation,
    threshold, // in %
    amount, // in %
    exceeded,
    ratio, // amount / threshold
    description,
  };
}

/** DANGEROUS COMPONENTS – Teile & gefährliche Stoffe schön formatiert */
function DangerousComponentsTab({ data }: { data: any }) {
  // Erwartetes Format = Array von Parts
  const parts: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
    ? data.items
    : [];

  if (!parts.length) {
    return <p className="text-sm text-muted-foreground">No data available</p>;
  }

  return (
    <div className="grid gap-3">
      {parts.map((p, idx) => (
        <DangerousPartCard key={p.PartNumber ?? idx} part={p} />
      ))}
    </div>
  );
}

function DangerousPartCard({ part }: { part: any }) {
  const substances: any[] = Array.isArray(part?.DangerousComponents)
    ? part.DangerousComponents
    : [];
  const partName =
    part?.SimplifiedDescription ||
    part?.Description ||
    part?.PartNumber ||
    "Component";

  return (
    <Card className="p-3">
      {/* Part Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{partName}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {part?.PartNumber ? (
              <>
                Part No. <span className="font-medium">{part.PartNumber}</span>
              </>
            ) : null}
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          {part?.PartWeightmg != null && (
            <div>
              Weight:{" "}
              <span className="font-medium">
                {fmtNum(part.PartWeightmg, 0)} mg
              </span>
            </div>
          )}
          <div>
            Hazardous subs:{" "}
            <span className="font-medium">{substances.length}</span>
          </div>
        </div>
      </div>

      {/* Substances list */}
      <div className="mt-3 grid gap-2">
        {substances.map((s, i) => (
          <DangerousSubstanceRow
            key={`${s.CASNO ?? i}-${s.ChemicalSubstance ?? i}`}
            s={s}
          />
        ))}
        {!substances.length && (
          <div className="text-sm text-muted-foreground">
            No hazardous substances listed.
          </div>
        )}
      </div>
    </Card>
  );
}

function DangerousSubstanceRow({ s }: { s: any }) {
  // normalize
  const name = s?.ChemicalSubstance ?? "Substance";
  const cas = s?.CASNO ?? "—";
  const hm = s?.HomogeneousMaterial ?? "—";
  const hmWg = s?.HomogeneousMaterialWeightg; // g
  const subWmg = s?.SubstanceWeightmg; // mg
  const desc = s?.DangerDescription as string | undefined;

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{name}</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">CAS {cas}</Badge>
            {hm && <Badge variant="outline">{hm}</Badge>}
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground shrink-0">
          {hmWg != null && (
            <div>
              Matrix: <span className="font-medium">{fmtNum(hmWg, 0)} g</span>
            </div>
          )}
          {subWmg != null && (
            <div>
              Amount:{" "}
              <span className="font-medium">{fmtNum(subWmg, 0)} mg</span>
            </div>
          )}
        </div>
      </div>

      {desc && (
        <div className="mt-2 text-sm text-muted-foreground">
          {expanded ? desc : truncate(desc, 220)}
          {desc.length > 220 && (
            <>
              {" "}
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-primary font-medium hover:underline"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function truncate(t: string, n: number) {
  if (!t) return "";
  return t.length <= n ? t : t.slice(0, n).trimEnd() + "…";
}

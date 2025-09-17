// src/components/ToxicityAccordion.tsx
import React from "react";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

export type ToxicityAccordionItem = {
  name: string;
  regulation: string;
  amount: string; // "0.05%"
  thresholdPct: number; // 80 = 80% of limit
  exceeded: boolean;
  // optional direct colors coming from data-mapper
  bar?: string; // e.g. "#16a34a"
  label?: string; // e.g. "#065f46"
  bg?: string; // e.g. "#ecfdf5"
  level?: "ok" | "warning" | "danger";
};

function colorByPct(pct: number) {
  if (pct <= 60) return "bg-emerald-500";
  if (pct <= 100) return "bg-amber-500";
  return "bg-red-500";
}

type Props = { title?: string; items: ToxicityAccordionItem[] };

const ToxicityAccordion: React.FC<Props> = ({
  title = "Toxicity Data",
  items,
}) => {
  const allSafe = items.every((i) => !i.exceeded);
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge
            variant={allSafe ? "default" : "destructive"}
            className="gap-2"
          >
            {allSafe ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            {allSafe ? "Compliant" : "Issues found"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="toxicity">
            <AccordionTrigger className="text-base">Details</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3">
                {items.map((chem) => {
                  const pct = chem.thresholdPct;
                  return (
                    <li
                      key={chem.name}
                      className="rounded-xl border p-4"
                      style={chem.bg ? { backgroundColor: "#fff" } : undefined}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{chem.name}</span>
                            {chem.exceeded ? (
                              <Badge variant="destructive">over limit</Badge>
                            ) : (
                              <Badge variant="secondary">ok</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Regulation: {chem.regulation} • Amount:{" "}
                            {chem.amount}
                          </p>
                        </div>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="min-w-40 text-right"
                                style={
                                  chem.label ? { color: chem.label } : undefined
                                }
                              >
                                <div className="text-sm font-medium">
                                  {pct}% of threshold
                                </div>
                                <div className="mt-2 h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${Math.min(pct, 150)}%`,
                                      backgroundColor: chem.bar || undefined,
                                    }}
                                  />
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{
                                    backgroundColor: chem.bar || undefined,
                                  }}
                                />
                                <span>
                                  {pct <= 100 ? "Below" : "Above"} threshold
                                </span>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ToxicityAccordion;

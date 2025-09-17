import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Option = { value: string; label: string };
type Q = { id: keyof Answers; title: string; options: Option[] };

type Answers = {
  allergies?: "yes" | "no";
  recycling?: "yes" | "no";
  usageDuration?: "lt2" | "gt2";
  repairability?: "expert" | "myself" | "doesnt_matter";
  ecoManufacturing?: "important" | "not_important";
};

const QUESTIONS: Q[] = [
  {
    id: "allergies",
    title: "Do you have plastic or metal allergies?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "recycling",
    title: "Is recycling important to you?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "usageDuration",
    title: "How long do you plan to use the device?",
    options: [
      { value: "lt2", label: "Less than 2 years" },
      { value: "gt2", label: "More than 2 years" },
    ],
  },
  {
    id: "repairability",
    title: "How important is repairability to you?",
    options: [
      { value: "expert", label: "Expert service" },
      { value: "myself", label: "I'll do it myself" },
      { value: "doesnt_matter", label: "Doesn't matter" },
    ],
  },
  {
    id: "ecoManufacturing",
    title: "How important is environmentally friendly manufacturing to you?",
    options: [
      { value: "important", label: "Important" },
      { value: "not_important", label: "Not that important" },
    ],
  },
];

const EXIT_MS = 260; // muss zu deinen CSS keyframes passen

export default function QuestionFlow() {
  const [i, setI] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [exiting, setExiting] = React.useState(false);

  // restart or skip logic
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const force = params.get("questions") === "1";
    const done = localStorage.getItem("questionnaireDone") === "1";
    if (force) {
      localStorage.removeItem("questionnaireDone");
      params.delete("questions");
      const clean =
        window.location.pathname +
        (params.toString() ? `?${params}` : "") +
        window.location.hash;
      window.history.replaceState({}, "", clean);
    } else if (done) {
      window.location.assign("/scanner");
    }
  }, []);

  const current = QUESTIONS[i];

  const goNext = () => {
    if (i < QUESTIONS.length - 1) {
      setI((n) => n + 1);
      setExiting(false); // neue Karte kommt mit Enter-Anim rein
    } else {
      localStorage.setItem("questionnaireDone", "1");
      window.location.assign("/scanner");
    }
  };

  const onPick = (value: string) => {
    if (exiting) return; // doppelklick verhindern
    setAnswers((a) => ({ ...a, [current.id]: value } as Answers));
    // Exit-Animation starten
    setExiting(true);
    window.setTimeout(goNext, EXIT_MS);
  };

  const progress = ((i + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto flex h-screen max-w-3xl flex-col items-center justify-center px-6">
        {/* Progress Bar */}
        <div className="mb-6 h-1 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
            aria-hidden
          />
        </div>

        {/* Card – bekommt je nach Phase Enter oder Exit Klasse */}
        <Card
          key={current.id}
          className={[
            "w-full rounded-2xl border p-8 shadow-sm",
            exiting
              ? "animate-slide-out-left pointer-events-none"
              : "animate-fade-in",
          ].join(" ")}
        >
          <h1 className="mb-6 text-2xl font-semibold tracking-tight">
            {current.title}
          </h1>

          <div className="grid gap-3 stagger">
            {current.options.map((opt, idx) => (
              <Button
                key={opt.value}
                variant="outline"
                size="lg"
                className="justify-start h-12 text-base animate-stagger-item transition-transform active:scale-[0.98]"
                style={{ animationDelay: exiting ? "0ms" : `${idx * 60}ms` }}
                onClick={() => onPick(opt.value)}
                disabled={exiting}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { Rocket } from "lucide-react";
import { GradientCard } from "./motion-brew/gradient-card";
import { GravityTagPile, type GravityTag } from "./motion-brew/gravity-tag-pile";
import { TechnologyStackDiagram } from "./TechnologyStackDiagram";
import { VerifyFlow, type VerifyStage } from "./motion-brew/verify-flow";
import { workflowStages } from "./workflow-stages";
import styles from "./WorkflowVisuals.module.css";

const signals = [
  "Find the gaps and opportunities in the market.",
  "See how alternatives present and solve the problem.",
  "Identify what people need, expect, and struggle with.",
  "Agree on what the project should achieve and how to measure it.",
];
const signalColors = [
  ["#ffc7a1", "#552916"],
  ["#ffe2b6", "#4d2e20"],
  ["#e99a87", "#422219"],
  ["#fff5dc", "#4d3526"],
];
const researchTags: GravityTag[] = workflowStages[0].points.map((label, index) => ({
  label,
  color: signalColors[index]![0],
  textColor: signalColors[index]![1],
}));

const designPalette: NonNullable<ComponentProps<typeof GradientCard>["palette"]> = {
  young: ["#a83758", "#de625c", "#f3a15f", "#63314d"],
  even: ["#b53b36", "#f28a4d", "#de6e64", "#79332c"],
  old: ["#992d4a", "#d85a43", "#eca166", "#5e293e"],
};
const releaseChecks = ["Build bundle", "Test & optimize", "Verify deployment"];

function LaunchVisual() {
  const [stage, setStage] = useState<VerifyStage>("waiting");
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    if (stage !== "checking") return;
    const timers = releaseChecks.map((_, index) =>
      window.setTimeout(() => setCompleted(index + 1), (index + 1) * 780),
    );
    timers.push(window.setTimeout(() => setStage("done"), releaseChecks.length * 780 + 460));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [stage]);

  return (
    <VerifyFlow
      title="Release preview"
      provider="Production build"
      providerIcon={<Rocket aria-hidden className="size-4" />}
      checks={releaseChecks}
      stage={stage}
      completed={completed}
      accent="#b6583b"
      redirectSeconds={0}
      onSignIn={() => { setCompleted(0); setStage("checking"); }}
      onContinue={() => { setCompleted(0); setStage("waiting"); }}
      className={styles.release}
    />
  );
}

function ResearchVisual() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <div className={styles.signalScene}>
        <div className={styles.signalMap} aria-hidden="true">
          {researchTags.map(({ label }, index) => <span key={label} data-active={index === active} />)}
        </div>
        <GravityTagPile
          className="absolute inset-0 h-full"
          tagClassName="px-3 py-2.5 text-xs sm:px-4 sm:text-sm"
          tags={researchTags}
          entrance="sequence"
          gravity={1100}
          bounce={0.48}
          throwStrength={0.82}
          showReset
          onTagClick={(_, index) => setActive(index)}
        />
      </div>
      <p className={styles.signalCaption} aria-live="polite">
        {active === null ? "Tap or move a research signal." : signals[active]}
      </p>
    </>
  );
}

export function WorkflowVisual({ stage }: { stage: (typeof workflowStages)[number]["id"] }) {
  if (stage === "strategy") return <TechnologyStackDiagram />;

  return (
    <div className={`capability-media ${styles.visual}`} data-workflow-visual={stage}>
      {stage === "research" && <ResearchVisual />}
      {stage === "design" && (
        <GradientCard
          label="Prototype fidelity"
          value={24}
          min={10}
          max={40}
          reference={24}
          palette={designPalette}
          speed={0.7}
          caption={(value) => value < 19 ? "Sketch the flows" : value < 30 ? "Test an interactive prototype" : "Refine the design system"}
          className={`h-full w-full rounded-none shadow-none ${styles.gradient}`}
        />
      )}
      {stage === "launch" && <LaunchVisual />}
    </div>
  );
}

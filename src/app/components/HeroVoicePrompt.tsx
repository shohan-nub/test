"use client";

import { useState } from "react";
import { VoicePrompt } from "./motion-brew/voice-prompt";
import styles from "./HeroVoicePrompt.module.css";

const voiceColors = ["#833c29", "#c55d36", "#eda47e", "#ffe5cc"];

export default function HeroVoicePrompt() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={styles.placement} role="group" aria-label="Voice prompt preview">
      <VoicePrompt
        theme="light"
        colors={voiceColors}
        placeholder="Try a voice prompt"
        script="Help me plan a website and automate customer inquiries."
        onSubmit={() => setSubmitted(true)}
        className={styles.card}
      />
      <p className={styles.caption} role="status">
        {submitted ? "Preview complete. Nothing was sent." : "Voice preview · Uses sample words"}
      </p>
    </div>
  );
}

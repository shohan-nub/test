"use client";

import { useState } from "react";
import { RotatingText } from "./motion-brew/rotating-text";
import styles from "./HomeFaq.module.css";

const questions = [
  { id: "why-sparklab", question: "Why SparkLab Best?", answer: "SparkLab brings websites, web applications, mobile apps, custom software, and AI-powered automation together under one roof. You can work with one team across your complete digital project." },
  { id: "entire-project", question: "Can SparkLab Manage My Entire Software Project?", answer: "Yes. We support projects from planning and strategy through UI/UX design, development, deployment, and ongoing improvements. Each stage builds on decisions made with you earlier in the project." },
  { id: "limited-budget", question: "What If I Have a Limited Budget?", answer: "We can help you prioritize essential features, explore alternative approaches, and consider suitable software rental options where available. That gives you a way to start with what your business needs most." },
  { id: "design-inspiration", question: "Can You Build Software Inspired by Existing Designs or Products?", answer: "Yes. We can discuss what you find useful in existing designs, interfaces, or products and use those references to inform an original solution tailored to your brand, business requirements, and functionality needs." },
  { id: "hosting-location", question: "Where Is Your Hosting Infrastructure Located?", answer: "Our hosting infrastructure includes servers in Singapore that support our digital solutions." },
];

function FaqQuestion({ id, question, answer }: (typeof questions)[number]) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const expanded = hovered || pinned;
  const answerId = `faq-answer-${id}`;

  function close() {
    setHovered(false);
    setPinned(false);
  }

  return (
    <div
      className={styles.row}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
    >
      <h3>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={answerId}
          onClick={() => { if (pinned) close(); else setPinned(true); }}
          onKeyDown={(event) => { if (event.key === "Escape" && expanded) close(); }}
        >
          {question}
          <span className={styles.indicator} aria-hidden="true" />
        </button>
      </h3>
      <div id={answerId} className={styles.answer} data-expanded={expanded} aria-hidden={!expanded}>
        <div><p>{answer}</p></div>
      </div>
    </div>
  );
}

export default function HomeFaq() {
  return (
    <section className={styles.section} id="faq" aria-labelledby="faq-heading">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <h2 id="faq-heading">Frequently Asked <em>Questions.</em></h2>
          <RotatingText text="Digital Innovation • Creative Technology • " label="Digital Innovation and Creative Technology" size={120} duration={30} boost={2} className={styles.ring} />
        </div>
        <div>{questions.map((question) => <FaqQuestion key={question.id} {...question} />)}</div>
      </div>
    </section>
  );
}

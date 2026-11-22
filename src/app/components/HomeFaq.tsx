"use client";

import { useState } from "react";
import { RotatingText } from "./motion-brew/rotating-text";
import styles from "./HomeFaq.module.css";

const questions = [
  { id: "why-sparklab", question: "What does SparkLab do?", answer: "SparkLab is a creative technology studio that builds websites, web and mobile apps, custom software, and AI workflow automation for businesses." },
  { id: "entire-project", question: "Can SparkLab Manage My Entire Software Project?", answer: "Yes. SparkLab can handle planning, design, development, testing, and launch. We agree on the scope with you before development." },
  { id: "limited-budget", question: "What If I Have a Limited Budget?", answer: "Smaller projects are welcome. SparkLab can prioritize essential features, reduce the number of integrations, or split delivery into phases while keeping its engineering and testing standards." },
  { id: "design-inspiration", question: "Can You Build Software Inspired by Existing Designs or Products?", answer: "Yes. Tell us what works for you in a reference design or product. We can use those ideas to inform an original design for your business." },
  { id: "hosting-location", question: "Does SparkLab Work With Businesses Worldwide?", answer: "Yes. SparkLab is based in Bangladesh and serves businesses worldwide. You can request a proposal online or book a 30-minute discovery call." },
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

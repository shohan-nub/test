import styles from "./Services.module.css";

const stages = [
  [
    ["Search Intent", "Understand the questions people ask."],
    ["Entity Relationships", "Connect related topics, pages, and services."],
  ],
  [
    ["Structured Data", "Make those relationships machine-readable."],
    ["Generative Engine Optimization", "Make expertise easier for answer engines to interpret."],
  ],
  [
    ["Search Visibility", "Help relevant pages surface in search."],
    ["AI Search Discovery", "Help answer engines identify relevant information."],
  ],
] as const;

export default function DiscoveryGraphic() {
  return (
    <figure className={styles.diagram}>
      <figcaption>How discovery connects</figcaption>
      <ol className={styles.stages}>
        {stages.map(stage => (
          <li key={stage[0][0]}>
            {stage.map(([name, explanation]) => (
              <div key={name}>
                <strong>{name}</strong>
                <p>{explanation}</p>
              </div>
            ))}
          </li>
        ))}
      </ol>
    </figure>
  );
}

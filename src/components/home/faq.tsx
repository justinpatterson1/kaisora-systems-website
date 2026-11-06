import { PlusIcon } from "@/components/icons";
import { FAQS } from "@/lib/content/catalogue";

/** Questions, as native disclosures: keyboard and screen-reader ready with no script. */
export function Faq() {
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="wrap">
        <h2 id="faq-title" className="section-title">
          Questions
        </h2>
        <div className="faq">
          {FAQS.map((item) => (
            <details key={item.question}>
              <summary>
                {item.question}
                <PlusIcon width={14} height={14} />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

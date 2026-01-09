import { useEffect, useState } from "react";
import styles from "./ExamplesGallery.module.css";

import example1 from "../../assets/images/example4.jpg";
import example2 from "../../assets/images/example5.jpg";
import example3 from "../../assets/images/example6.jpg";
import example4 from "../../assets/images/example1.jpg";
import example5 from "../../assets/images/example2.jpg";
import example6 from "../../assets/images/example3.jpg";

const items = [
  {
    id: 1,
    image: example1,
    title: "Подарок на день рождение",
    text: "Мы проанализировали увлечения клиента более чем по 100 параметрам и собрали тот подарок, который он всегда хотел: полный комплект для пейзажной фотосъёмки.",
  },
  {
    id: 2,
    image: example2,
    title: "Подарок на свадьбу",
    text: "Подобрали персональный набор под стиль пары и формат праздника: полезные детали, эмоции и эстетика в одном боксе.",
  },
  {
    id: 3,
    image: example3,
    title: "Подарок на новоселье",
    text: "Собрали тёплый набор для нового дома: уют, вкусные мелочи и вещи, которые реально пригодятся в быту.",
  },
  {
    id: 4,
    image: example4,
    title: "Подарок творческому человеку",
    text: "Упор на хобби и вдохновение: материалы, аксессуары и приятные детали, которые усиливают творческий процесс.",
  },
  {
    id: 5,
    image: example5,
    title: "Персонализированные боксы на корпоратив",
    text: "Собрали варианты под задачу компании: брендируемые элементы, универсальные подарки и аккуратная подача.",
  },
  {
    id: 6,
    image: example6,
    title: "Подарок от коллег",
    text: "Подобрали набор без риска: нейтрально, красиво и в точку по предпочтениям получателя.",
  },
];

export default function ExamplesGallery() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!active) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setActive(null);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.title}>Примеры персонализации подарков WOWbox</h2>

        <div className={styles.grid}>
          {items.map((it) => (
            <figure key={it.id} className={styles.item}>
              <button
                type="button"
                className={styles.imageBtn}
                onClick={() => setActive(it)}
                aria-label={it.title}
              >
                <img className={styles.image} src={it.image} alt={it.title} loading="lazy" />
              </button>
              <figcaption className={styles.caption}>{it.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {active && (
        <div className={styles.overlay} onClick={() => setActive(null)} role="dialog" aria-modal="true">
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTop}>
              <button type="button" className={styles.closeBtn} onClick={() => setActive(null)} aria-label="Закрыть">
                ×
              </button>
            </div>

            <div className={styles.modalMedia}>
              <img className={styles.modalImage} src={active.image} alt={active.title} />
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalTitle}>{active.title}</div>
              <div className={styles.modalText}>{active.text}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

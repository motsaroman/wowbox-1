import styles from "./ImageContainerBlock.module.css";
import sending from "../../assets/images/sending.png";
import answer from "../../assets/images/answer.png";
import phone from "../../assets/images/phone.png";
import brain from "../../assets/images/brain.jpg";
import podarki from "../../assets/images/podarki.png";
import checklist from "../../assets/images/checklist.png";
import derevo from "../../assets/images/derevo2.png";
import deliveryBox from "../../assets/images/deliveryBox.png";

import appStyles from "../../App.module.css";

export default function ImageContainerBlock() {
  return (
    <section className={`${styles.section} ${appStyles.howToWorksWowBox}`}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          КАК РАБОТАЕТ ПЕРСОНАЛИЗИРОВАННЫЙ
          <br /> ПОДБОР ПОДАРКОВ WOWbox
        </h2>
        <div className={styles.cardsRow}>
          <div className={styles.cardWrap}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>01</h3>
              <p className={styles.cardText}>
                Пройдите квиз из 4-х вопросов за 30 секунд
              </p>
              <div className={styles.imageContainer}>
                <img src={answer}  alt="Описание 1" className={styles.image} />
              </div>
            </div>
          </div>
          <div className={styles.cardWrap}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>02</h3>
              <p className={styles.cardText}>Укажите бюджет и оставьте контакты</p>
              <div className={styles.imageContainer}>
                <img src={sending} alt="Описание 1" className={styles.image} />
              </div>
            </div>
          </div>
          <div className={styles.cardWrap2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>03</h3>
              <p className={styles.cardText}>Здесь начинается магия</p>
              <p className={styles.subtitle}>
                Сервис WOWbox анализирует
                <br /> получателя по многим параметрам
              </p>
              <div className={styles.imageContainerRow}>
                <div className={styles.placeholder}>
                  <img src={phone} alt="Описание 1" className={styles.image} />
                  <p>Мы свяжемся с вами для уточнения деталей</p>
                </div>
                <div className={styles.placeholder}>
                  <img
                    src={brain}
                    alt="Описание 1"
                    className={styles.image}
                  />
                  <p>Наш алгоритм проанализирует интересы получателя используя более 100 параметров</p>
                </div>
                <div className={styles.placeholder}>
                  <img
                    src={checklist}
                    alt="Описание 1"
                    className={styles.image}
                  />
                  <p>Показываем собранный подарок → Вы утверждаете</p>
                </div>
                <div className={styles.placeholder}>
                  <img
                    src={podarki}
                    alt="Описание 1"
                    className={styles.image}
                  />
                  <p>Если вас все устраивает, оплачиваете → Собираем и отправляем 
Доставка 3-5 дней по РФ</p>
                </div>
              </div>
              <img src={derevo} alt="Описание 1" className={styles.derevo} />
            </div>
          </div>
          <div className={styles.cardWrap3}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>04</h3>
              <p className={styles.cardText} style={{ marginBottom: "1rem" }}>
                Готово! Персональный бокс доставлен
              </p>
              <div className={styles.imageContainer}>
                <div className={styles.placeholder}>
                  <img
                    src={deliveryBox}
                    alt="Описание 1"
                    className={styles.image}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// src\App.jsx

import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useBoxStore, BOXES_DATA } from "./store/boxStore";
import { useUIStore } from "./store/uiStore";
import { useOrderStore } from "./store/orderStore";
// Компоненты
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import BoxesCarousel from "./components/BoxesCarousel/BoxesCarousel.jsx";
import PromoPopup from "./components/PromoPopup/PromoPopup.jsx";
import TelegramChat from "./components/TelegramChat/TelegramChat.jsx";
import BoxingPersonalization from "./components/BoxPersonalization/BoxingPersonalization.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy.jsx";
import PublicOffer from "./components/PublicOffer/PublicOffer.jsx";
import PainAndSolution from "./components/PainAndSolution/PainAndSolution.jsx";
import ImageContainerBlock from "./components/ImageContainerBlock/ImageContainerBlock.jsx";
import ExamplesGallery from "./components/ExamplesGallery/ExamplesGallery.jsx";

// Модалки
import OrderModal from "./components/OrderModal/OrderModal.jsx";
import DeliveryModal from "./components/DeliveryModal/DeliveryModal.jsx";
import SmsModal from "./components/SmsModal/SmsModal.jsx";
import PaymentResultModal from "./components/PaymentResultModal/PaymentResultModal.jsx";
import BankSelectionModal from "./components/BankSelectionModal/BankSelectionModal.jsx";
import PaymentWaitingModal from "./components/PaymentWaitingModal/PaymentWaitingModal.jsx";
import toRight from "./assets/icons/toRight.svg";
import { quizData } from "./data/quizData.js";
import { faqData } from "./data/faqData.js";

import styles from "./App.module.css";
import QualitySection from "./components/QualitySection/QualitySection.jsx";
import DeliverySection from "./components/DeliverySection/DeliverySection.jsx";
import HowItWorksSection from "./components/HowItWorksSection/HowItWorksSection.jsx";
import PartnerSwiper from "./components/PartnersSwiper/PartnersSwiper.jsx";
import CookieConsent from "./components/CookieConsent/CookieConsent.jsx";

const YM_ID = 105562569;

const reachGoal = (goal) => {
  if (window.ym) {
    window.ym(YM_ID, "reachGoal", goal);
    console.log(`Goal reached: ${goal}`);
  }
};

const LABELS_TO_SHOW = [3000, 5000, 20000, 50000, 120000];

export default function App() {
  const navigate = useNavigate();

  const {
    currentQuestionIndex,
    setQuizAnswer,
    nextQuestion,
    prevQuestion: prevQuestionAction,
    resetQuiz: resetQuizAction,
    getRecommendedBox,
    applyRecommendation,
    priceSteps,
    fetchPricing,
    selectedPrice,
    setSelectedPrice,
  } = useBoxStore();

  const {
    openFaqIndex,
    toggleFaq: toggleFaqAction,

    // Состояния для модальных окон
    isDeliveryModalOpen,
    setDeliveryModalOpen,
    isSmsModalOpen,
    setSmsModalOpen,
    isPaymentResultModalOpen,
    setPaymentResultModalOpen,
    isBankSelectionModalOpen,
    setBankSelectionModalOpen,
    isPaymentWaitingModalOpen,
    setPaymentWaitingModalOpen,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  } = useUIStore();

  const setOrderBoxPrice = useOrderStore((state) => state.setBoxPrice);

  // --- ЛОГИКА ФОРМЫ (НОВОЕ) ---
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    telegram: "",
    wishes: "",
  });
  const [isTelegramActive, setIsTelegramActive] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Состояние для модалки успеха

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleTelegramToggle = () => {
    setIsTelegramActive(!isTelegramActive);
    if (isTelegramActive) {
      // Если выключаем, очищаем поле
      setFormData((prev) => ({ ...prev, telegram: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = true;
    if (!formData.phone.trim()) errors.phone = true;
    if (isTelegramActive && !formData.telegram.trim()) errors.telegram = true;
    return errors;
  };
  // ---------------------------

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  const foundIndex = priceSteps.indexOf(selectedPrice);
  const priceIndex = foundIndex !== -1 ? foundIndex : 1;

  // 3. Расчеты для отображения
  const currentPrice = priceSteps[priceIndex] || 5000;
  const maxTotalValue = currentPrice + 3000;
  const savings = Math.round(currentPrice * 0.4);
  const max = Math.max(0, priceSteps.length - 1);
  const percentage = (priceIndex / max) * 100;

  const sliderStyle = {
    background: `linear-gradient(to right, #93d3e1 0%, #93d3e1 ${percentage}%, #e2e1df ${percentage}%, #e2e1df 100%)`,
  };
  const scrollToQuiz = () => {
    const element = document.querySelector(`.${styles.weFoundYourSuperWowbox}`);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleQuizAnswer = (answerId) => {
    // Отправляем цель в зависимости от номера вопроса (index + 1)
    const goalMap = {
      0: "quiz_q1_completed",
      1: "quiz_q2_completed",
      2: "quiz_q3_completed",
      3: "quiz_q4_completed",
    };
    if (goalMap[currentQuestionIndex]) {
      reachGoal(goalMap[currentQuestionIndex]);
    }

    setQuizAnswer(currentQuestionIndex, answerId);
    setTimeout(nextQuestion, 300);
  };

  const prevQuestion = () => {
    reachGoal("quiz_back");
    prevQuestionAction();
  };

  // Сброс квиза теперь также очищает форму
  const resetQuiz = () => {
    reachGoal("quiz_restart");
    setFormData({ name: "", phone: "", telegram: "", wishes: "" });
    setIsTelegramActive(false);
    setFormErrors({});
    resetQuizAction();
  };

  const handleSliderChange = (e) => {
    const newIndex = Number(e.target.value);
    const newPrice = priceSteps[newIndex];

    // Обновляем оба стора сразу при движении
    setSelectedPrice(newPrice);
    setOrderBoxPrice(newPrice);
  };

  const recommendedBox = getRecommendedBox();

  // --- ФУНКЦИЯ ОТПРАВКИ В БИТРИКС (ОБНОВЛЕННАЯ) ---
  const sendOrderToBitrix = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    reachGoal("buy_after_quiz"); // Цель при успешной отправке формы

    // Формирование данных для аналитики (DataLayer)
    if (window.dataLayer) {
      window.dataLayer.push({
        ecommerce: {
          currencyCode: "RUB",
          add: {
            products: [
              {
                id: recommendedBox?.id || "custom_box",
                name: recommendedBox?.title || "Персональный подбор",
                price: selectedPrice,
                brand: "WOWBOX",
                category: "Подарочные боксы",
                quantity: 1,
                list: "Форма заявки квиза",
              },
            ],
          },
        },
      });
    }

    try {
      // Подготовка параметров для вебхука
      const queryParams = new URLSearchParams({
        "fields[TITLE]": `Заявка с сайта WOWBOX (Квиз)`,
        "fields[NAME]": formData.name,
        "fields[PHONE][0][VALUE]": formData.phone,
        "fields[PHONE][0][VALUE_TYPE]": "WORK",
        "fields[COMMENTS]": `
          Бюджет: ${currentPrice}₽.
          Предварительный бокс: ${recommendedBox.title}.
          Telegram: ${isTelegramActive ? formData.telegram : "Не указан"}.
          Пожелания: ${formData.wishes}
        `,
        "fields[OPPORTUNITY]": currentPrice,
        "fields[SOURCE_ID]": "WEB",
      });

      // !!! ВАЖНО: ЗАМЕНИТЕ 'YOUR_BITRIX_WEBHOOK_URL' НА ВАШ РЕАЛЬНЫЙ URL !!!
      await fetch(`YOUR_BITRIX_WEBHOOK_URL/crm.lead.add.json?${queryParams}`);

      // ВМЕСТО ALERT ОТКРЫВАЕМ МОДАЛКУ
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Ошибка отправки в Битрикс", error);
      alert("Произошла ошибка при отправке заявки. Попробуйте позже.");
    }
  };

  // Функция закрытия модалки успеха и сброса квиза
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    resetQuiz();
  };
  // ------------------------------------------

  const toggleFaq = (index) => {
    // Если мы открываем (а не закрываем), шлем цель
    if (openFaqIndex !== index) {
      reachGoal("faq_opened");
    }
    toggleFaqAction(index);
  };

  // Эффект для DataLayer при просмотре результатов (оставляем для аналитики)
  useEffect(() => {
    if (currentQuestionIndex >= quizData.length && window.dataLayer) {
      const box = BOXES_DATA.find((b) => b.title === recommendedBox.title);
      if (box) {
        window.dataLayer.push({
          ecommerce: {
            currencyCode: "RUB",
            detail: {
              products: [
                {
                  id: box.id,
                  name: box.title,
                  price: selectedPrice,
                  brand: "WOWBOX",
                  category: "Подарочные боксы",
                  list: "Результаты квиза",
                },
              ],
            },
          },
        });
      }
    }
  }, [currentQuestionIndex, selectedPrice]);

  return (
    <>
      <Routes>
        <Route
          path="/privacy"
          element={
            <PrivacyPolicy isOpen={true} onClose={() => navigate("/")} />
          }
        />
        <Route
          path="/public-offer"
          element={<PublicOffer isOpen={true} onClose={() => navigate("/")} />}
        />
        <Route
          path="/"
          element={
            <>
              <PromoPopup />
              <TelegramChat />
              <Header />

              <main>
                {/*Секция Боль и Решение*/}
                <PainAndSolution />
                <ImageContainerBlock />
                <QualitySection />
                {/* Секция выбора бокса (Карусель) */}
                <div className={styles.selectYourOwnWowbox}>
                  <h1>Выберите свой WOWBOX</h1>
                  <BoxesCarousel />
                </div>
                <PartnerSwiper />
                {/* Секция Квиза */}
                <div id="quiz" className={styles.weFoundYourSuperWowbox}>
                  <div className={styles.quizContainer}>
                    <h2>
                      Найдём ваш идеальный
                      <br />
                      WOWBOX за 30 секунд
                    </h2>
                    <p className={styles.quizSubtitle}>
                      Ответьте на 4 вопроса - мы подберём бокс,
                      <br />
                      который точно вам подойдёт
                    </p>

                    <div className={styles.quizBox}>
                      <div className={styles.quizHeader}>
                        {/* Индикатор прогресса (показываем только пока идут вопросы) */}
                        {currentQuestionIndex < quizData.length && (
                          <div className={styles.progressDots}>
                            {quizData.map((_, index) => (
                              <span
                                key={index}
                                className={
                                  currentQuestionIndex === index
                                    ? styles.active
                                    : ""
                                }
                              ></span>
                            ))}
                          </div>
                        )}

                        {/* Заголовок вопроса или результата */}
                        {currentQuestionIndex < quizData.length ? (
                          <>
                            <p className={styles.questionLabel}>
                              ВОПРОС {currentQuestionIndex + 1}/
                              {quizData.length}:
                            </p>
                            <h3 className={styles.questionTitle}>
                              {quizData[currentQuestionIndex].question}
                            </h3>
                          </>
                        ) : (
                          <h3 className={styles.resultsTitle}>
                            Подбор идеального подарка
                          </h3>
                        )}
                      </div>

                      {/* Тело Квиза */}
                      {currentQuestionIndex < quizData.length ? (
                        <>
                          <div className={styles.quizOptions}>
                            {quizData[currentQuestionIndex].options.map(
                              (option) => (
                                <div
                                  key={option.id}
                                  className={styles.quizOption}
                                  onClick={() => handleQuizAnswer(option.id)}
                                >
                                  <img
                                    className={styles.optionIcon}
                                    src={option.icon}
                                    alt={option.title}
                                    loading="lazy"
                                  />
                                  <div className={styles.optionText}>
                                    <p className={styles.optionTitle}>
                                      {option.title}
                                    </p>
                                    {option.subtitle && (
                                      <p className={styles.optionSubtitle}>
                                        {option.subtitle}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                          <div className={styles.quizActions}>
                            {currentQuestionIndex > 0 && (
                              <button
                                className={styles.quizBackButton}
                                onClick={prevQuestion}
                              >
                                <img
                                  src={toRight}
                                  alt="toRight"
                                  loading="lazy"
                                />
                                <span>Назад</span>
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* --- ЭКРАН С ФОРМОЙ И БЮДЖЕТОМ --- */}
                          <div className={styles.quizResultsForm}>
                            <div className={styles.formContainer}>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>
                                  Имя *
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  placeholder="Введите имя..."
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  className={`${styles.formInput} ${
                                    formErrors.name ? styles.inputError : ""
                                  }`}
                                />
                              </div>

                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>
                                  Телефон *
                                </label>
                                <input
                                  type="tel"
                                  name="phone"
                                  placeholder="+7 (000) 000-00-00"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  className={`${styles.formInput} ${
                                    formErrors.phone ? styles.inputError : ""
                                  }`}
                                />
                              </div>

                              <div className={styles.toggleGroup}>
                                <span className={styles.toggleLabel}>
                                  Хочу получать информацию о заказе в Telegram
                                </span>
                                <label className={styles.switch}>
                                  <input
                                    type="checkbox"
                                    checked={isTelegramActive}
                                    onChange={handleTelegramToggle}
                                  />
                                  <span className={styles.sliderRound}></span>
                                </label>
                              </div>

                              {isTelegramActive && (
                                <div
                                  className={`${styles.inputGroup} ${styles.fadeInd}`}
                                >
                                  <input
                                    type="text"
                                    name="telegram"
                                    placeholder="@username"
                                    value={formData.telegram}
                                    onChange={handleInputChange}
                                    className={`${styles.formInput} ${
                                      formErrors.telegram
                                        ? styles.inputError
                                        : ""
                                    }`}
                                  />
                                </div>
                              )}

                              <div className={styles.inputGroup}>
                                <h4 className={styles.wishesTitle}>
                                  Дополнительные пожелания
                                </h4>
                                <textarea
                                  name="wishes"
                                  placeholder="Напишите дополнительные пожелания..."
                                  value={formData.wishes}
                                  onChange={handleInputChange}
                                  className={styles.formTextarea}
                                />
                              </div>

                              {/* Крупный блок бюджета */}
                              <div className={styles.budgetSectionLarge}>
                                <p className={styles.budgetTitleLarge}>
                                  Ваш бюджет на подарок:
                                </p>
                                <p className={styles.budgetPriceLarge}>
                                  {currentPrice}₽
                                </p>
                                <div className={styles.sliderContainer}>
                                  <input
                                    type="range"
                                    min="0"
                                    max={max}
                                    step="1"
                                    value={priceIndex}
                                    onChange={handleSliderChange}
                                    className={styles.budgetSlider}
                                    style={sliderStyle}
                                  />
                                  <div className={styles.sliderLabels}>
                                    {priceSteps.map((step, idx) => {
                                      const isVisible =
                                        LABELS_TO_SHOW.includes(step);
                                      return (
                                        <div
                                          key={step}
                                          className={styles.sliderLabelWrapper}
                                        >
                                          <span
                                            className={`${
                                              styles.sliderLabelText
                                            } ${
                                              step === 5000
                                                ? styles.popularPrice
                                                : ""
                                            } ${
                                              step === 3000
                                                ? styles.minPrice
                                                : ""
                                            } ${
                                              idx === priceIndex
                                                ? styles.activeLabel
                                                : ""
                                            }`}
                                            style={{
                                              opacity: isVisible ? 1 : 0,
                                            }}
                                          >
                                            {step}₽
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className={styles.budgetInfoResultSmall}>
                                  <p>
                                    Внутри бокса за {currentPrice}₽: Суммарная
                                    стоимость ~{currentPrice}-{maxTotalValue}₽.
                                    Вы экономите ~{savings}₽
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className={styles.quizActionsForm}>
                              <button
                                className={styles.submitButton}
                                onClick={sendOrderToBitrix}
                              >
                                Отправить на бесплатный подбор
                              </button>
                              <p className={styles.privacyText}>
                                Нажимая на кнопку, вы даете согласие на
                                обработку <a href="#">персональных данных</a>
                              </p>
                            </div>
                          </div>
                          {/* ------------------------------------- */}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Секция "Как это работает" */}
                {/*<HowItWorksSection />*/}
                {/* Секция "Качество" */}

                {/* Секция "Гарантии и доставка" */}
                {/*<DeliverySection />*/}

                {/* Блок примеров персонализации */}
                <ExamplesGallery />

                {/* Секция FAQ */}
                <div className={styles.faq}>
                  <h1 className={styles.faqTitle}>FAQ</h1>
                  <p className={styles.faqSubtitle}>Часто задаваемые вопросы</p>
                  <div className={styles.faqItems}>
                    {faqData.map((faq, index) => (
                      <div
                        key={index}
                        className={`${styles.faqItem} ${
                          openFaqIndex === index ? styles.faqItemOpen : ""
                        }`}
                      >
                        <div
                          className={styles.faqItemHeader}
                          onClick={() => toggleFaq(index)}
                        >
                          <h3>{faq.question}</h3>
                          <div className={styles.faqToggle}>
                            {openFaqIndex === index ? "×" : "+"}
                          </div>
                        </div>
                        {openFaqIndex === index && faq.answer && (
                          <div className={styles.faqItemContent}>
                            <div
                              className={styles.textContainer}
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.readyForSurprise}>
                  <h1 className={styles.readyForSurpriseTitle}>
                    Готовы к сюрпризу?
                  </h1>
                  <p className={styles.readyForSurpriseSubtitle}>
                    Закажите WOWBOX прямо сейчас
                  </p>
                  <div className={styles.readyForSurpriseButtonWrapper}>
                    <button
                      className={styles.readyForSurpriseButton}
                      onClick={scrollToQuiz}
                    >
                      Собрать персональный подарок бесплатно
                    </button>
                  </div>
                </div>
              </main>

              <Footer />
              <BoxingPersonalization />

              {/* Глобальные модальные окна (управляемые через Store) */}
              <OrderModal
                onPayment={(paymentMethod) => {
                  setSelectedPaymentMethod(paymentMethod);
                  setDeliveryModalOpen(true);
                }}
                onOpenPrivacyPolicy={() => navigate("/privacy")}
                onOpenPublicOffer={() => navigate("/public-offer")}
              />

              <BankSelectionModal
                isOpen={isBankSelectionModalOpen}
                onClose={() => setBankSelectionModalOpen(false)}
                onSelectBank={(bank) => {
                  console.log("Selected bank:", bank);
                  setBankSelectionModalOpen(false);
                  setPaymentWaitingModalOpen(true);
                  setTimeout(() => {
                    setPaymentWaitingModalOpen(false);
                    setPaymentResultModalOpen(true);
                  }, 3000);
                }}
              />
              <PaymentWaitingModal
                isOpen={isPaymentWaitingModalOpen}
                onClose={() => setPaymentWaitingModalOpen(false)}
              />
              <SmsModal
                isOpen={isSmsModalOpen}
                onClose={() => setSmsModalOpen(false)}
                onVerify={(code) => {
                  console.log("SMS code verified:", code);
                  setSmsModalOpen(false);
                  setPaymentResultModalOpen(true);
                }}
                phoneNumber="+998 XX XXX-XX-XX"
              />
              <PaymentResultModal
                isOpen={isPaymentResultModalOpen}
                onClose={() => setPaymentResultModalOpen(false)}
                isSuccess={true}
                orderNumber="OO OOO OOO1"
                onRetry={() => {
                  setPaymentResultModalOpen(false);
                  setDeliveryModalOpen(true);
                }}
                onGoHome={() => setPaymentResultModalOpen(false)}
              />

              {/* --- МОДАЛЬНОЕ ОКНО УСПЕХА --- */}
              {isSuccessModalOpen && (
                <div className={styles.successOverlay}>
                  <div className={styles.successModal}>
                    <div className={styles.successIconWrapper}>
                      <span className={styles.successIcon}>✅</span>
                    </div>
                    <h3 className={styles.successTitle}>Спасибо!</h3>
                    <p className={styles.successText}>
                      Скоро с Вами свяжется наш менеджер
                    </p>
                    <button
                      className={styles.successButton}
                      onClick={handleCloseSuccessModal}
                    >
                      Вернуться в магазин
                    </button>
                  </div>
                </div>
              )}
            </>
          }
        />
      </Routes>
      <CookieConsent />
    </>
  );
}
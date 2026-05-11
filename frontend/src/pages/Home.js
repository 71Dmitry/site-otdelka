import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Home.css';

const Home = () => {
  const [calcData, setCalcData] = useState({
    roomType: 'apartment',
    area: 40,
    serviceType: 1
  });
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const calculatePrice = () => {
  const repairPrices = { 1: 2000, 2: 3500, 3: 5000 };
  const roomCoefficients = { apartment: 1.0, house: 1.3, office: 1.1 };
  
  const basePrice = repairPrices[calcData.serviceType];
  const coefficient = roomCoefficients[calcData.roomType];
  const total = calcData.area * basePrice * coefficient;
  setResult(Math.round(total));
};

  return (
    <>
      <Helmet>
        <title>ОтделкаПрофи | Профессиональные отделочные услуги</title>
        <meta name="description" content="Ремонт квартир и домов под ключ. Отделка стен, пола, потолков. Сантехника, электрика. Гарантия 3 года." />
      </Helmet>

      <div className="home-page">
        
        <section className="hero">
          <div className="hero-overlay">
            <img src="/images/1.png" alt="title_image" />
          </div>          
          <div className="container hero-content">
            <h1 className="hero__title">Профессиональный ремонт<br />и отделка под ключ</h1>
            <p className="hero__subtitle">Работаем с 2010 года • Более 2500 объектов • Гарантия 3 года</p>
            <div className="hero__actions">
              
              <Link to="/portfolio" className="btn btn-outline-light btn-large">Наши работы</Link>
            </div>
            <div className="hero__stats">
              <div className="stat-item"><span className="stat-number">2500+</span><span className="stat-label">Объектов</span></div>
              <div className="stat-item"><span className="stat-number">5</span><span className="stat-label">Мастеров</span></div>
              <div className="stat-item"><span className="stat-number">98%</span><span className="stat-label">Довольных</span></div>
            </div>
          </div>
        </section>

        {/* калькулятор (оставляем как функцию тестирования) */}
        <section className="calculator-section">
          <div className="container">
            <h2 className="section-title">Калькулятор ремонта</h2>
            <p className="section-subtitle">Узнайте примерную стоимость вашего ремонта</p>
            <div className="calculator-card">
              <div className="calculator-form">
                <div className="form-group">
                  <label>Тип помещения</label>
                  <select className="form-control" value={calcData.roomType} onChange={(e) => setCalcData({...calcData, roomType: e.target.value})}>
                    <option value="apartment">Квартира</option>
                    <option value="house">Частный дом</option>
                    <option value="office">Офис</option>
                  </select>
                </div>
                <div className="form-group">
                <label>Площадь (м²)</label>
                <input 
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="form-control"
                  value={calcData.area}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    if (value === '') {
                      setCalcData({...calcData, area: ''});
                    } else {
                      let num = parseInt(value, 10);
                      if (num > 5000) num = 5000;
                      if (num < 1) num = 1;
                      setCalcData({...calcData, area: num});
                    }
                  }}
                />
              </div>
                <div className="form-group">
                  <label>Тип ремонта</label>
                  <select className="form-control" value={calcData.serviceType} onChange={(e) => setCalcData({...calcData, serviceType: e.target.value})}>
                    <option value="1">Косметический</option>
                    <option value="2">Капитальный</option>
                    <option value="3">Дизайнерский</option>
                  </select>
                </div>
                <button className="btn btn-primary btn-block" onClick={calculatePrice}>Рассчитать стоимость</button>
              </div>
              {result && (
                <div className="calculator-result">
                  <h3>Примерная стоимость:</h3>
                  <div className="result-price">{result.toLocaleString()} ₽</div>
                  <p className="result-note">* Точная цена после выезда мастера</p>
                      <button className="btn btn-primary" onClick={() => navigate('/contacts')}>
                        Договориться о встрече
                      </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Преимущества — с картинками вместо иконок */}
        <section className="features">
          <div className="container">
            <h2 className="section-title">Почему выбирают нас</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-image"><img src="/images/2.jpg" alt="Опытные мастера" /></div>
                <h3>Опытные мастера</h3>
                <p>Все специалисты с опытом от 5 лет, регулярное повышение квалификации.</p>
              </div>
              <div className="feature-card">
                <div className="feature-image"><img src="/images/3.jpg" alt="Договор и гарантия" /></div>
                <h3>Договор и гарантия</h3>
                <p>Работаем официально, гарантия на все виды работ до 3 лет.</p>
              </div>
              <div className="feature-card">
                <div className="feature-image"><img src="/images/5.jpg" alt="Прозрачные цены" /></div>
                <h3>Прозрачные цены</h3>
                <p>Фиксированная смета без скрытых платежей и доплат.</p>
              </div>
              <div className="feature-card">
                <div className="feature-image"><img src="/images/6.jpg" alt="Соблюдение сроков" /></div>
                <h3>Соблюдение сроков</h3>
                <p>Четкое соблюдение сроков, указанных в договоре.</p>
              </div>
              <div className="feature-card">
                <div className="feature-image"><img src="/images/7.jpg" alt="Уборка после ремонта" /></div>
                <h3>Уборка после ремонта</h3>
                <p>Вывозим мусор и проводим профессиональную уборку.</p>
              </div>
              <div className="feature-card">
                <div className="feature-image"><img src="/images/8.jpg" alt="Качество материалов" /></div>
                <h3>Качество материалов</h3>
                <p>Используем только проверенные материалы.</p>
              </div>
            </div>
          </div>
        </section>

        {/* популярные услуги */}
        <section className="popular-services">
          <div className="container">
            <h2 className="section-title">Популярные услуги</h2>
            <div className="services-preview">
              <div className="service-preview-card">
                <img src="/images/9.jpg" alt="Отделка стен" />
                <h3>Отделка стен</h3>
                <p>Штукатурка, шпаклевка, покраска, обои</p>
                <span className="price">от 400 ₽/м²</span>
                <Link to="/services" className="btn-link">Подробнее →</Link>
              </div>
              <div className="service-preview-card">
                <img src="/images/10.jpg" alt="Отделка пола" />
                <h3>Отделка пола</h3>
                <p>Ламинат, паркет, плитка, наливной пол</p>
                <span className="price">от 600 ₽/м²</span>
                <Link to="/services" className="btn-link">Подробнее →</Link>
              </div>
              <div className="service-preview-card">
                <img src="/images/11.jpg" alt="Потолочные работы" />
                <h3>Потолочные работы</h3>
                <p>Натяжные потолки, гипсокартон, покраска</p>
                <span className="price">от 500 ₽/м²</span>
                <Link to="/services" className="btn-link">Подробнее →</Link>
              </div>
            </div>
          </div>
        </section>
        {/* Акция */}
        <section className="promo-banner">
          <div className="container">
            <div className="promo-card">
              <div className="promo-content">
                <h3>Скидка 15% на монтаж натяжного потолка</h3>
                <p>При заказе капитального ремонта от 50 000 ₽</p>
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/contacts')}>
                Узнать подробности
              </button>
            </div>
          </div>
        </section>
        {/* Этапы работы */}
<section className="work-steps">
  <div className="container">
    <h2 className="section-title">Как мы работаем</h2>
    <p className="section-subtitle">6 простых шагов к идеальному ремонту</p>
    
    <div className="steps-timeline">
      <div className="step-item">
        <div className="step-number">1</div>
        <div className="step-content">
          <h3>Заявка и замер</h3>
          <p>Оставляете заявку, мы выезжаем на бесплатный замер и консультацию</p>
        </div>
      </div>

      <div className="step-item reverse">
        <div className="step-number">2</div>
        <div className="step-content">
          <h3>Дизайн-проект и смета</h3>
          <p>Разрабатываем дизайн, подбираем материалы, составляем точную смету</p>
        </div>
      </div>

      <div className="step-item">
        <div className="step-number">3</div>
        <div className="step-content">
          <h3>Демонтаж</h3>
          <p>Удаляем старую отделку, вывозим мусор</p>
        </div>
      </div>

      <div className="step-item reverse">
        <div className="step-number">4</div>
        <div className="step-content">
          <h3>Черновые работы</h3>
          <p>Стяжка пола, штукатурка стен, разводка коммуникаций</p>
        </div>
      </div>

      <div className="step-item">
        <div className="step-number">5</div>
        <div className="step-content">
          <h3>Чистовая отделка</h3>
          <p>Плитка, обои, ламинат, установка дверей и сантехники</p>
        </div>
      </div>

      <div className="step-item reverse">
        <div className="step-number">6</div>
        <div className="step-content">
          <h3>Уборка и сдача объекта</h3>
          <p>Клининг, финальная проверка, подписание акта приема-передачи</p>
        </div>
      </div>
    </div>
  </div>
</section>
{/* FAQ */}
<section className="faq-section">
  <div className="container">
    <h2 className="section-title">Часто задаваемые вопросы</h2>
    
    <div className="faq-grid">
      <div className="faq-item">
        <div className="faq-question" onClick={(e) => e.currentTarget.classList.toggle('open')}>
          <span>Сколько длится ремонт 2-комнатной квартиры?</span>
          <span className="faq-icon">▼</span>
        </div>
        <div className="faq-answer">
          <p>В среднем 2-3 месяца. Все зависит от сложности работ и площади. Приступаем строго по графику, без задержек.</p>
        </div>
      </div>

      <div className="faq-item">
        <div className="faq-question" onClick={(e) => e.currentTarget.classList.toggle('open')}>
          <span>Вы работаете по договору?</span>
          <span className="faq-icon">▼</span>
        </div>
        <div className="faq-answer">
          <p>Да, мы работаем официально. Заключаем договор, предоставляем гарантию 3 года. Все обязательства прописаны юридически.</p>
        </div>
      </div>

      <div className="faq-item">
        <div className="faq-question" onClick={(e) => e.currentTarget.classList.toggle('open')}>
          <span>Можно ли посмотреть объект в работе?</span>
          <span className="faq-icon">▼</span>
        </div>
        <div className="faq-answer">
          <p>Конечно! Мы открыты к диалогу. Вы можете приехать на любой наш объект и оценить качество работ лично.</p>
        </div>
      </div>

      <div className="faq-item">
        <div className="faq-question" onClick={(e) => e.currentTarget.classList.toggle('open')}>
          <span>Что входит в «ремонт под ключ»?</span>
          <span className="faq-icon">▼</span>
        </div>
        <div className="faq-answer">
          <p>Полный цикл: от демонтажа до финишной отделки. Включая черновые работы, чистовую отделку, установку сантехники, освещения и уборку.</p>
        </div>
      </div>

      <div className="faq-item">
        <div className="faq-question" onClick={(e) => e.currentTarget.classList.toggle('open')}>
          <span>Как происходит оплата?</span>
          <span className="faq-icon">▼</span>
        </div>
        <div className="faq-answer">
          <p>Удобная система: поэтапная оплата. Вы платите за выполненный этап работ. Никакой 100% предоплаты.</p>
        </div>
      </div>
    </div>
  </div>
</section>
        {/* отзывы */}
        <section className="reviews">
          <div className="container">
            <h2 className="section-title">Отзывы наших клиентов</h2>
            <div className="reviews-grid">
              <div className="review-card">
                <div className="review-header">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Александр" className="review-avatar" />
                  <div><h4>Александр Петров</h4><div className="rating">★★★★★</div></div>
                </div>
                <p className="review-text">"Сделали ремонт в квартире под ключ. Очень доволен качеством. Все в срок."</p>
                <span className="review-date">15.01.2026</span>
              </div>
              <div className="review-card">
                <div className="review-header">
                  <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Елена" className="review-avatar" />
                  <div><h4>Елена Смирнова</h4><div className="rating">★★★★★</div></div>
                </div>
                <p className="review-text">"Заказывала отделку ванной. Подобрали плитку, быстро и качественно уложили."</p>
                <span className="review-date">09.03.2026</span>
              </div>
              <div className="review-card">
                <div className="review-header">
                  <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Дмитрий" className="review-avatar" />
                  <div><h4>Дмитрий Иванов</h4><div className="rating">★★★★★</div></div>
                </div>
                <p className="review-text">"Делали косметический ремонт в офисе. Работали быстро, не мешали процессу."</p>
                <span className="review-date">23.02.2026</span>
              </div>
            </div>
          </div>
        </section>

        {/*телефон */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2>Нужен качественный ремонт?</h2>
              <p>Позвоните нам, и мы проконсультируем по всем вопросам</p>
              <a href="tel:+79282709987" className="btn btn-large btn-primary">+7 (928) 270-99-87</a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
  
export default Home;
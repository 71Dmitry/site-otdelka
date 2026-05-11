import React from 'react';
import { Helmet } from 'react-helmet';
import './Contacts.css';

const Contacts = () => {
  return (
    <>
      <Helmet>
        <title>Контакты | ОтделкаПрофи</title>
        <meta name="description" content="Наши контакты: адрес, телефон, email. Свяжитесь с нами для консультации или вызова мастера. Работаем ежедневно с 9:00 до 20:00." />
      </Helmet>

      <div className="contacts-page">
        <div className="container">
          <h1 className="page-title">Контакты</h1>

          <div className="contacts-grid">
            {/* Левая колонка - контактная информация */}
            <div className="contacts-info">
              <div className="info-card">
                <h2>Свяжитесь с нами</h2>

                <div className="info-item">
                  <div className="info-content">
                    <h3>Адрес офиса</h3>
                    <p><a href="https://yandex.ru/map-widget/v1/?text=Ростов-на-Дону%20проспект%20Сельмаш%2018&z=17&pt=39.7135+47.2715~адрес">г. Ростов-на-Дону, пр. Сельмаш, 18, 78</a></p>
                    <p className="info-note">Ждём вас у нас в офисе!</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <h3>Телефон</h3>
                    <p><a href="tel:+79282709987">+7 (928) 270-99-87</a></p>
                    <p className="info-note">Обращайтесь по любым вопросам!</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <h3>Email</h3>
                    <p><a href="mailto:rstepano@yandex.ru">rstepano@yandex.ru</a></p>
                    <p className="info-note">Ответим в ближайщее время!</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <h3>Режим работы</h3>
                    <p>Пн-Пт: 7:00 - 20:00</p>
                    <p>Сб-Вс: 8:00 - 18:00</p>
                  </div>
                </div>

                <div className="social-links">
                  <h3>Мы в соцсетях</h3>
                  <div className="social-grid">
                    <a href="https://wa.me/79282709987" className="social-link"><img src="/images/32.jpg" alt="Facebook" width="40" height="40" style={{ borderRadius: '50%' }} /></a>
                    <a href="https://t.me/@romsstepanov01" className="social-link"><img src="/images/33.jpg" alt="Facebook" width="40" height="40" style={{ borderRadius: '50%' }} /></a>
                    <a href="https://max.ru/u/f9LHodD0cOLwU6BDpcTvKv83ftuRTok-dRFetzh00fZ6eOpFOBpyqbvmUhg" className="social-link"><img src="/images/34.jpg" alt="Facebook" width="40" height="40" style={{ borderRadius: '50%' }} /></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка - карта */}
            <div className="contacts-map">
              <div className="map-card">
                <h2>Как нас найти</h2>
                <div className="map-container">
                  <iframe
                    title="Карта проезда"
                    src="https://yandex.ru/map-widget/v1/?text=Ростов-на-Дону%20проспект%20Сельмаш%2018&z=17&pt=39.7135+47.2715~адрес"
                    width="100%"
                    height="400"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="map-directions">
                  <h3>Схема проезда</h3>
                  <div className="directions-grid">
                    <div className="direction-item">
                      <div>
                        <strong>Трамвай</strong>
                        <p>Трамваи №4, 10, 54. Остановка "ДК Ростсельмаш"</p>
                      </div>
                    </div>
                    <div className="direction-item">
                      <div>
                        <strong>Общественный транспорт</strong>
                        <p>Автобусы №3, 3а, 54, 40, 66, 29, 18, 164. Остановка "Улица 1-й Конной Армиии"</p>
                      </div>
                    </div>
                    <div className="direction-item">
                      <div>
                        <strong>На автомобиле</strong>
                        <p>Парковка на территории здания, въезд со стороны пр. Сельмаш</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts;
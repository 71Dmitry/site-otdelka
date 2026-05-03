import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-title">О компании</h3>
            <p className="footer-text">
              Профессиональные отделочные услуги с 2010 года. 
              Более 2500 выполненных объектов. Гарантия качества 3 года.
            </p>
            <div className="footer-social">
              <a href="https://wa.me/79282709987" className="social-link"><img src="/images/32.jpg" alt="Facebook" width="40" height="40" style={{ borderRadius: '50%' }} /></a>
              <a href="https://t.me/@romsstepanov01" className="social-link"><img src="/images/33.jpg" alt="Facebook" width="40" height="40" style={{ borderRadius: '50%' }} /></a>
              <a href="https://max.ru/u/f9LHodD0cOLwU6BDpcTvKv83ftuRTok-dRFetzh00fZ6eOpFOBpyqbvmUhg" className="social-link"><img src="/images/34.jpg" alt="Facebook" width="40" height="40" style={{ borderRadius: '50%' }} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Быстрые ссылки</h3>
            <ul className="footer-links">
              <li><Link to="/services">Услуги</Link></li>
              <li><Link to="/masters">Мастера</Link></li>
              <li><Link to="/portfolio">Портфолио</Link></li>
              <li><Link to="/contacts">Контакты</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Контакты</h3>
            <ul className="footer-contacts">
              <li>г. Ростов-на-Дону, пр. Сельмаш, 18, 78</li>
              <li>+7 (928) 270-99-87</li>
              <li>rstepano@yandex.ru</li>
              <li>Пн-Пт: 7:00 - 20:00</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 ОтделкаПрофи. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
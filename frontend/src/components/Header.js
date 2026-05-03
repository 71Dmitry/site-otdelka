import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

useEffect(() => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  setIsLoggedIn(!!token);
  if (userData) {
    setUser(JSON.parse(userData));
  }
}, [location]);

useEffect(() => {
  setIsOpen(false);
}, [location.pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon"><img src="/images/35.jpg" alt="Лого" style={{ width: '65px', height: '50px' }} /></span>
          <span className="logo-text">ОтделкаПрофи</span>
        </Link>

        <button className="burger" onClick={toggleMenu}>
          <span className={`burger-line ${isOpen ? 'open' : ''}`}></span>
          <span className={`burger-line ${isOpen ? 'open' : ''}`}></span>
          <span className={`burger-line ${isOpen ? 'open' : ''}`}></span>
        </button>

        <nav className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}onClick={toggleMenu}> 
                Главная
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}onClick={toggleMenu}>
                Услуги
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/masters" className={`nav-link ${location.pathname === '/masters' ? 'active' : ''}`}onClick={toggleMenu}>
                Мастера
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/portfolio" className={`nav-link ${location.pathname === '/portfolio' ? 'active' : ''}`}onClick={toggleMenu}>
                Портфолио
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contacts" className={`nav-link ${location.pathname === '/contacts' ? 'active' : ''}`}onClick={toggleMenu}>
                Контакты
              </Link>
            </li>
          </ul>

          <div className="header-actions">
            {isLoggedIn ? (
              <>
              {user?.role === 1 && (
      <Link to="/admin" className="btn btn-primary btn-sm">
        Админ панель
      </Link>
    )}
                <Link to="/profile" className="btn btn-outline btn-sm">
                  Личный кабинет
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Выйти
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Войти
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { getMasters } from '../api';
import Loader from '../components/Loader';
import './Masters.css';

const Masters = () => {
  const [masters, setMasters] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedMaster, setSelectedMaster] = useState(null);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        setLoading(true);
        const response = await getMasters();
        setMasters(response.data);
      } catch (error) {
        console.error('Ошибка загрузки мастеров:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMasters();
  }, []);

  // получил уникальные категории
  const categories = ['all', ...new Set(masters.map(m => m.Категория))];

  // фильтрация по категории
  const filteredMasters = filter === 'all' 
    ? masters 
    : masters.filter(master => master.Категория === filter);

  // уникальные данные для каждого мастера
  const getMasterExperience = (id) => {
    const experiences = {
      1: '6+',
      2: '8+', 
      3: '7+',
      4: '7+',
      5: '6+',
    };
    return experiences[id] || '5+ лет опыта';
  };

  const getMasterWorks = (id) => {
    const works = {
      1: '470+',
      2: '340+',
      3: '750+',
      4: '470+',
      5: '340+',
    };
    return works[id] || '500+ работ';
  };

  const getMasterSatisfaction = (id) => {
    const satisfaction = {
      1: '99%',
      2: '97%',
      3: '100%',
      4: '98%',
      5: '96%',
    };
    return satisfaction[id] || '98% довольны';
  };

  const getMasterRating = (id) => {
    const ratings = {
      1: '4.9',
      2: '4.8',
      3: '5.0',
      4: '4.9',
      5: '4.7',
      6: '4.8'
    };
    return ratings[id] || '4.9';
  };

  // описание для мастеров
  const getMasterDescription = (master) => {
    const descriptions = {
      'Ступин Дмитрий Сергеевич': 'Специализируется на штукатурных работах и выравнивании стен любой сложности. Использует современные материалы и технологии. За его плечами более 450 отремонтированных квартир. Работает аккуратно, соблюдает все сроки.',
      'Просоленко Дмитрий Анатольевич': 'Мастер по малярным работам с идеальным чувством цвета. Поможет подобрать идеальные оттенки для вашего интерьера. Работает с любыми типами красок и обоев. Выполняет работы "под ключ".',
      'Замятин Николай Сергеевич': 'Профессиональный плиточник с 8-летним опытом. Укладывает плитку любой сложности, включая мозаику и крупноформатную плитку. Выполняет работы "под ключ". Дает гарантию на все виды работ.',
      'Козлов Андрей Николаевич': 'Сантехник высшей категории. Устанавливает любые сантехнические приборы, монтирует системы отопления и водоснабжения. Работает аккуратно и чисто. Имеет все необходимые инструменты.',
      'Ясаян Арсен Тимурович': 'Мастер-универсал, администратор. Координирует работу всей бригады, выезжает на замеры, составляет сметы. Опыт работы в строительстве более 7 лет. Поможет оптимизировать бюджет ремонта.'
    };
    return descriptions[master.ФИО] || `${master.ФИО} - профессиональный ${master.Категория.toLowerCase()} с большим опытом работы. Выполняет работы качественно и в срок.`;
  };

  if (loading) return <Loader />;

  return (
    <>
      <Helmet>
        <title>Наши мастера | Команда профессионалов | РемонтПрофи</title>
        <meta name="description" content="Знакомьтесь с нашей командой. Опытные мастера с подтвержденной квалификацией." />
      </Helmet>

      <div className="masters-page">
        <div className="container">
          <h1 className="page-title">Наши мастера</h1>
          <p className="page-subtitle">Профессионалы с многолетним опытом, которые превратят ваш дом в идеальное пространство</p>
          
          {/* фильтрация по категориям */}
          <div className="masters-toolbar">
            <div className="category-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-btn ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat === 'all' ? 'Все специалисты' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="masters-stats">
            <div className="stat-card">
              <div className="stat-number">{masters.length}</div>
              <div className="stat-label">Опытных мастеров</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">7+</div>
              <div className="stat-label">Лет средний опыт</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">2300+</div>
              <div className="stat-label">Выполненных объектов</div>
            </div>
          </div>

          {/* сетка мастеров */}
          {filteredMasters.length > 0 ? (
            <div className="masters-grid">
              {filteredMasters.map((master, index) => {
                const experienceNum = getMasterExperience(master.id_m);
                const worksNum = getMasterWorks(master.id_m);
                const satisfactionNum = getMasterSatisfaction(master.id_m);
                const rating = getMasterRating(master.id_m);
                
                return (
                  <div key={master.id_m} className="master-card">
                    <div className="master-image">
                      <img 
                        src={`/images/${36 + (master.id_m % 5)}.jpg`}
                        alt={master.ФИО}
                      />
                      <div className="master-rating">
                        <span className="rating-stars">★★★★★</span>
                        <span className="rating-value">{rating}</span>
                      </div>
                    </div>
                    <div className="master-info">
                      <h3 className="master-name">{master.ФИО}</h3>
                      <p className="master-category">{master.Категория}</p>
                      <div className="master-stats">
                        <div className="master-stat">
                          <span className="stat-value">{experienceNum}</span>
                          <span className="stat-label">опыта</span>
                        </div>
                        <div className="master-stat">
                          <span className="stat-value">{worksNum}</span>
                          <span className="stat-label">работ</span>
                        </div>
                        <div className="master-stat">
                          <span className="stat-value">{satisfactionNum}</span>
                          <span className="stat-label">довольны</span>
                        </div>
                      </div>
                      <button 
                        className="btn btn-primary btn-block"
                        onClick={() => setSelectedMaster(master)}
                      >
                        Подробнее
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-results">
              <p>Мастера не найдены</p>
              <button onClick={() => setFilter('all')} className="btn btn-primary">
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>

      {/* модальное окно с подробностями мастера */}
      {selectedMaster && (
        <div className="modal-overlay" onClick={() => setSelectedMaster(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMaster(null)}>×</button>
            
            <div className="modal-content-master">
              <div className="modal-image">
                <img 
                  src={`/images/${36 + (selectedMaster.id_m % 5)}.jpg`}
                  alt={selectedMaster.ФИО}
                />
              </div>
              
              <div className="modal-details">
                <h2>{selectedMaster.ФИО}</h2>
                <p className="modal-category">{selectedMaster.Категория}</p>
                <div className="modal-description">
                  <h3>О мастере</h3>
                  <p>{getMasterDescription(selectedMaster)}</p>
                </div>
                
                <div className="modal-specs">
                  <div className="spec-item">
                    <span className="spec-label">Стаж работы:</span>
                    <span className="spec-value">{getMasterExperience(selectedMaster.id_m)}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Выполнено объектов:</span>
                    <span className="spec-value">{getMasterWorks(selectedMaster.id_m)}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Образование:</span>
                    <span className="spec-value">Строительный техникум, курсы повышения квалификации</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Специализация:</span>
                    <span className="spec-value">{selectedMaster.Категория}</span>
                  </div>
                </div>
                
                <button className="btn btn-primary btn-block" onClick={() => setSelectedMaster(null)}>
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Masters;
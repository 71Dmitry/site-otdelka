import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import './Services.css';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [filter, setFilter] = useState(() => localStorage.getItem('servicesFilter') || 'all');
  const [searchQuery, setSearchQuery] = useState(''); 
  
  useEffect(() => {
      localStorage.setItem('servicesFilter', filter);
  }, [filter]);
  // карточки  
  
  const allServices = [
    // отделка стен
    {
      id: 1,
      category: 'Отделка стен',
      title: 'Штукатурка стен',
      shortDesc: 'Выравнивание стен по маякам с использованием качественных смесей',
      price: '800 ₽/м²',
      timeFrame: 'от 3 до 5 дней',
      image: '/images/12.jpg',
      fullDescription: 'Профессиональная штукатурка стен по маякам. Используем смеси Knauf, Ceresit. Идеальное выравнивание под покраску или обои. Работаем с кирпичными, бетонными и газоблочными поверхностями.',
      features: [
        'Очистка и грунтовка стен',
        'Установка маяков',
        'Нанесение штукатурки',
        'Затирка и выравнивание'
      ],
      materials: ['Knauf Rotband', 'Ceresit CT29', 'Weber Vetonit'],
    },
    {
      id: 2,
      category: 'Отделка стен',
      title: 'Покраска стен',
      shortDesc: 'Качественная покраска стен в любой цвет',
      price: '400 ₽/м²',
      timeFrame: 'от 2 до 3 дней',
      image: '/images/13.jpg',
      fullDescription: 'Профессиональная покраска стен. Подготовка поверхности, грунтовка, нанесение краски в 2-3 слоя. Работаем с любыми типами красок: матовые, глянцевые, фактурные.',
      features: [
        'Шпаклевка и шлифовка',
        'Грунтовка',
        'Нанесение краски',
        'Финальная обработка',
      ],
      materials: ['Dulux', 'Tikkurila', 'Caparol'],
    },
    {
      id: 3,
      category: 'Отделка стен',
      title: 'Шпаклевка стен',
      shortDesc: 'Финишное выравнивание стен под отделку',
      price: '600 ₽/м²',
      timeFrame: 'от 2 до 4 дней',
      image: '/images/14.jpg',
      fullDescription: 'Финишная шпаклевка стен. Создаем идеально гладкую поверхность под покраску или тонкие обои. Убираем все неровности и дефекты.',
      features: [
        'Нанесение стартового слоя',
        'Армирование',
        'Финишная шпаклевка',
        'Шлифовка'
      ],
      materials: ['Knauf Finish', 'Sheetrock', 'Vetonit LR'],
    },

    // отделка пола
    {
      id: 4,
      category: 'Отделка пола',
      title: 'Укладка ламината',
      shortDesc: 'Профессиональная укладка ламината любой сложности',
      price: '600 ₽/м²',
      timeFrame: 'от 1 до 3 дней',
      image: '/images/15.jpg',
      fullDescription: 'Укладка ламината с подготовкой основания. Делаем стяжку, подложку, укладку с учетом всех технических требований. Гарантия на работы.',
      features: [
        'Подготовка основания',
        'Укладка подложки',
        'Монтаж ламината',
        'Установка плинтусов'
      ],
      materials: ['Tarkett', 'Egger', 'Kronospan'],
    },
    {
      id: 5,
      category: 'Отделка пола',
      title: 'Укладка плитки',
      shortDesc: 'Качественная укладка керамической плитки',
      price: '1500 ₽/м²',
      timeFrame: 'от 3 до 7 дней',
      image: '/images/16.jpg',
      fullDescription: 'Профессиональная укладка плитки на пол. Работаем с керамогранитом, керамической плиткой, мозаикой. Делаем гидроизоляцию, стяжку, укладку под уровень.',
      features: [
        'Гидроизоляция',
        'Стяжка пола',
        'Укладка плитки',
        'Затирка швов'
      ],
      materials: ['Ceresit', 'Litokol', 'Mapei'],
    },
    {
      id: 6,
      category: 'Отделка пола',
      title: 'Наливной пол 3D',
      shortDesc: 'Современные наливные полы с 3D эффектом',
      price: '2500 ₽/м²',
      timeFrame: 'от 5 до 10 дней',
      image: '/images/17.jpg',
      fullDescription: 'Наливные полы 3D с любым рисунком. Делаем подготовку, заливку, нанесение рисунка, финишный слой. Полы получаются прочными, износостойкими и красивыми.',
      features: [
        'Подготовка основания',
        'Нанесение рисунка',
        'Заливка полимера',
        'Финальное покрытие'
      ],
      materials: ['Epoxy Floor', 'Remmers', 'Sika'],
    },

    //потолочные работы
    {
      id: 7,
      category: 'Потолочные работы',
      title: 'Натяжные потолки',
      shortDesc: 'Монтаж натяжных потолков любой сложности',
      price: '2000 ₽/м²',
      timeFrame: 'от 1 до 2 дней',
      image: '/images/18.jpg',
      fullDescription: 'Монтаж натяжных потолков. Матовые, глянцевые, сатиновые. Многоуровневые конструкции с подсветкой. Работаем с полотнами любых размеров.',
      features: [
        'Замер и раскрой',
        'Монтаж багета',
        'Натяжка полотна',
        'Установка освещения'
      ],
      materials: ['MSD', 'Saros Design', 'Polyplast'],
    },
    {
      id: 8,
      category: 'Потолочные работы',
      title: 'Потолки из гипсокартона',
      shortDesc: 'Многоуровневые потолки из ГКЛ',
      price: '1800 ₽/м²',
      timeFrame: 'от 3 до 7 дней',
      image: '/images/19.jpg',
      fullDescription: 'Многоуровневые потолки из гипсокартона любой сложности. Встроенная подсветка, криволинейные формы, ниши. Полная подготовка под покраску.',
      features: [
        'Монтаж каркаса',
        'Обшивка ГКЛ',
        'Шпаклевка швов',
        'Подготовка под покраску'
      ],
      materials: ['Knauf', 'Gyproc', 'Волма'],
    },

    // сантехнические работы
    {
      id: 9,
      category: 'Сантехнические работы',
      title: 'Установка ванной',
      shortDesc: 'Монтаж и подключение ванной',
      price: '8000 ₽/шт',
      timeFrame: 'от 1 дня',
      image: '/images/20.jpg',
      fullDescription: 'Установка и подключение ванны любой сложности. Акриловые, чугунные, стальные ванны. Подключение смесителей, сливов, герметизация швов.',
      features: [
        'Сборка ванны',
        'Подключение коммуникаций',
        'Герметизация',
        'Установка экрана'
      ],
      materials: ['Roca', 'Jacob Delafon', 'Kolpa'],
    },
    {
      id: 10,
      category: 'Сантехнические работы',
      title: 'Замена труб',
      shortDesc: 'Замена стояков и разводка труб',
      price: '5000 ₽/точка',
      timeFrame: 'от 1 до 2 дней',
      image: '/images/21.jpg',
      fullDescription: 'Замена стояков холодной и горячей воды, канализации. Разводка труб по квартире. Установка фильтров, счетчиков, коллекторов.',
      features: [
        'Демонтаж старых труб',
        'Монтаж новых труб',
        'Подключение сантехники',
        'Опрессовка системы'
      ],
      materials: ['REHAU', 'Viega', 'Wavin', 'Valtec'],
    },

    //электромонтадные работы
    {
      id: 11,
      category: 'Электромонтажные работы',
      title: 'Замена проводки',
      shortDesc: 'Полная замена электропроводки под ключ',
      price: '8000 ₽/точка',
      timeFrame: 'от 3 до 7 дней',
      image: '/images/22.jpg',
      fullDescription: 'Полная замена электропроводки в квартире или доме. Штробление стен, прокладка кабеля, монтаж щитков и автоматов. Работаем по ПУЭ.',
      features: [
        'Проект электропроводки',
        'Штробление стен',
        'Прокладка кабеля',
        'Монтаж щитка'
      ],
      materials: ['Schneider Electric', 'Legrand', 'ABB', 'ВВГнг'],
    },
    {
      id: 12,
      category: 'Электромонтажные работы',
      title: 'Установка розеток',
      shortDesc: 'Монтаж розеток и выключателей',
      price: '300 ₽/шт',
      timeFrame: 'от 1 дня',
      image: '/images/23.jpg',
      fullDescription: 'Установка розеток и выключателей любых типов. Замена старых, установка новых точек. Скрытый монтаж, подключение.',
      features: [
        'Демонтаж старых',
        'Монтаж подрозетников',
        'Подключение проводки',
        'Установка механизмов'
      ],
      materials: ['Schneider Electric', 'Legrand', 'MK Electric'],
    },
  ];

  // получил уникальные категории для фильтра
  const categories = ['all', ...new Set(allServices.map(s => s.category))];

  // фильтрация по категории и поиску
  const filteredServices = allServices.filter(service => {
    // Фильтр по категории
    const matchesCategory = filter === 'all' || service.category === filter;
    
    // искать по названию и краткому описанию
    const matchesSearch = searchQuery === '' || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.fullDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Услуги по отделке | Цены на ремонт | РемонтПрофи</title>
        <meta name="description" content="Полный список услуг по ремонту и отделке. Штукатурка стен, укладка плитки, монтаж потолков, сантехника, электрика." />
      </Helmet>

      <div className="services-page">
        <div className="container">
          <h1 className="page-title">Наши услуги</h1>
          
          {/* Строка поиска */}
          <div className="search-section">
            <div className="search-box">
              <input 
                type="text"
                className="search-input"
                placeholder="Поиск услуги по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* фильтр по категориям */}
          <div className="filter-section">
            <div className="filter-buttons">
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`filter-btn ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat === 'all' ? 'Все услуги' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* результаты поиска */}
          {filteredServices.length === 0 ? (
            <div className="no-results">
              <p>По вашему запросу "{searchQuery}" ничего не найдено</p>
              <button 
                className="btn btn-primary" 
                onClick={() => { setSearchQuery(''); setFilter('all'); }}
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="services-grid">
              {filteredServices.map(service => (
                <div 
                  key={service.id} 
                  className="service-card"
                  onClick={() => setSelectedService(service)}
                >
                  <div className="service-card-image">
                    <img src={service.image} alt={service.title} />
                    <div className="service-card-overlay">
                      <span className="service-price">{service.price}</span>
                    </div>
                  </div>
                  <div className="service-card-content">
                    <span className="service-category">{service.category}</span>
                    <h3>{service.title}</h3>
                    <p className="service-short-desc">{service.shortDesc}</p>
                    <div className="service-card-footer">
                      <span className="service-time">⏱ {service.timeFrame}</span>
                      <span className="details-hint">Подробнее →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* модальное окно с деталями */}
          {selectedService && (
            <div className="modal-overlay" onClick={() => setSelectedService(null)}>
              <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedService(null)}>×</button>
                
                <div className="modal-grid">
                  <div className="modal-image">
                    <img src={selectedService.image} alt={selectedService.title} />
                    <div className="modal-price-badge">{selectedService.price}</div>
                  </div>
                  
                  <div className="modal-info">
                    <span className="modal-category">{selectedService.category}</span>
                    <h2>{selectedService.title}</h2>
                    
                    <div className="modal-meta">
                      <span className="meta-item">Срок: {selectedService.timeFrame}</span>
                    </div>

                    <div className="modal-description">
                      <h3>Описание</h3>
                      <p>{selectedService.fullDescription}</p>
                    </div>

                    <div className="modal-features">
                      <h3>Что входит в услугу</h3>
                      <ul>
                        {selectedService.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="modal-materials">
                      <h3>Используемые материалы</h3>
                      <div className="materials-list">
                        {selectedService.materials.map((material, idx) => (
                          <span key={idx} className="material-tag">{material}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Services;
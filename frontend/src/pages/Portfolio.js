import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Portfolio.css';

const Portfolio = () => {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    { id: 'all', name: 'Все работы' },
    { id: 'kitchen', name: 'Кухни' },
    { id: 'bathroom', name: 'Ванные' },
    { id: 'living', name: 'Гостиные' },
    { id: 'hallway', name: 'Прихожие' }
  ];

  const projects = [
    {
      id: 1,
      title: 'Отделка кухни 12 м²',
      category: 'kitchen',
      categoryName: 'Кухни',
      location: 'ЖК «Солнечный», Батайск',
      year: '2025',
      description: 'Полная отделка кухни с заменой коммуникаций. Выровнены стены под покраску, уложена плитка на фартук, натяжной потолок с точечными светильниками.',
      image: '/images/24.jpg',
      works: ['Выравнивание стен', 'Покраска', 'Укладка плитки', 'Натяжной потолок', 'Электрика']
    },
    {
      id: 2,
      title: 'Ремонт ванной 5 м²',
      category: 'bathroom',
      categoryName: 'Ванные',
      location: 'ул. Ленина, 15, Ростов-на-Дону',
      year: '2026',
      description: 'Капитальный ремонт ванной комнаты. Полная гидроизоляция, укладка керамогранита, установка душевой кабины и подвесного унитаза.',
      image: '/images/25.jpg',
      works: ['Демонтаж старой плитки', 'Гидроизоляция', 'Укладка плитки', 'Сантехника', 'Теплый пол']
    },
    {
      id: 3,
      title: 'Отделка гостиной 18 м²',
      category: 'living',
      categoryName: 'Гостиные',
      location: 'пр. Королёва, 25, Ростов-на-Дону',
      year: '2023',
      description: 'Косметический ремонт гостиной. Поклейка флизелиновых обоев, укладка ламината, монтаж плинтусов и освещения.',
      image: '/images/26.jpg',
      works: ['Подготовка стен', 'Поклейка обоев', 'Укладка ламината', 'Установка плинтусов', 'Монтаж светильников']
    },
    {
      id: 4,
      title: 'Прихожая 6 м²',
      category: 'hallway',
      categoryName: 'Прихожие',
      location: 'ЖК «Феникс», Ростов-на-Дону',
      year: '2025',
      description: 'Отделка прихожей в современном стиле. Декоративная штукатурка, установка встроенного шкафа, замена напольного покрытия.',
      image: '/images/27.jpg',
      works: ['Декоративная штукатурка', 'Укладка плитки', 'Монтаж светильников', 'Установка двери']
    },
    {
      id: 5,
      title: 'Кухня-студия 22 м²',
      category: 'kitchen',
      categoryName: 'Кухни',
      location: 'ЖК «Лайм Сити», Ростов-на-Дону',
      year: '2024',
      description: 'Ремонт кухни-студии с перепланировкой. Демонтаж стены, устройство арки, укладка кварцвинила, монтаж фартука из скинали.',
      image: '/images/28.jpg',
      works: ['Демонтаж стены', 'Выравнивание пола', 'Укладка кварцвинила', 'Покраска стен', 'Установка розеток']
    },
    {
      id: 6,
      title: 'Совмещенный санузел 7 м²',
      category: 'bathroom',
      categoryName: 'Ванные',
      location: 'ул. Миллеровская, 106, Ростов-на-Дону',
      year: '2024',
      description: 'Отделка совмещенного санузла. Укладка крупноформатной плитки, установка инсталляции, монтаж душевого уголка.',
      image: '/images/29.jpg',
      works: ['Гидроизоляция', 'Укладка плитки', 'Установка инсталляции', 'Монтаж душевого уголка']
    },
    {
      id: 7,
      title: 'Спальня 15 м²',
      category: 'living',
      categoryName: 'Гостиные',
      location: 'пр. Стачки, 183, Ростов-на-Дону',
      year: '2023',
      description: 'Отделка спальни в светлых тонах. Выравнивание стен, покраска, укладка паркетной доски, установка плинтусов.',
      image: '/images/30.jpg',
      works: ['Штукатурка стен', 'Покраска', 'Укладка паркета', 'Монтаж плинтусов']
    },
    {
      id: 8,
      title: 'Узкая прихожая 4 м²',
      category: 'hallway',
      categoryName: 'Прихожие',
      location: 'ЖК «Берёзка», Аксай',
      year: '2026',
      description: 'Отделка маленькой прихожей. Зеркальные панели, светлая отделка для визуального расширения пространства.',
      image: '/images/31.jpg',
      works: ['Подготовка стен', 'Покраска', 'Укладка плитки', 'Монтаж зеркал']
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <>
      <Helmet>
        <title>Портфолио работ | Примеры ремонта | РемонтПрофи</title>
        <meta name="description" content="Реальные примеры наших работ. Ремонт кухонь, ванных, гостиных и прихожих. Фото до и после. Качественная отделка в Москве." />
      </Helmet>

      <div className="portfolio-page">
        <div className="container">
          <h1 className="page-title">Наши работы</h1>
          <p className="portfolio-subtitle">Реальные проекты, выполненные нашими мастерами</p>

          {/* Фильтр категорий */}
          <div className="portfolio-filter">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                onClick={() => setFilter(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* счетчик работ */}
          <div className="portfolio-count">
            Показано {filteredProjects.length} из {projects.length} работ
          </div>

          {/* сетка проектов */}
          <div className="portfolio-grid">
            {filteredProjects.map(project => (
              <div 
                key={project.id} 
                className="portfolio-item"
                onClick={() => setSelectedProject(project)}
              >
                <div className="portfolio-image">
                  <img src={project.image} alt={project.title} loading="lazy" />
                  <div className="portfolio-overlay">
                    <span className="portfolio-category">{project.categoryName}</span>
                    <h3>{project.title}</h3>
                    <p>{project.location}</p>
                    <span className="portfolio-year">{project.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* модальное окно */}
          {selectedProject && (
            <div className="modal" onClick={() => setSelectedProject(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedProject(null)}>×</button>
                
                <div className="modal-grid">
                  <div className="modal-image">
                    <img src={selectedProject.image} alt={selectedProject.title} />
                  </div>
                  
                  <div className="modal-info">
                    <h2>{selectedProject.title}</h2>
                    <div className="modal-meta">
                      <span className="modal-location">{selectedProject.location}</span>
                      <span className="modal-year"> {selectedProject.year}</span>
                    </div>
                    
                    <h3>Описание работ</h3>
                    <p>{selectedProject.description}</p>
                    
                    <h3>Выполненные работы</h3>
                    <ul className="works-list">
                      {selectedProject.works.map((work, index) => (
                        <li key={index}>{work}</li>
                      ))}
                    </ul>
                    
                   <Link to="/contacts" className="btn btn-primary btn-block">
                    Заказать такой ремонт
                  </Link>
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

export default Portfolio;
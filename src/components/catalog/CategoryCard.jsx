import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function CategoryCard({ category }) {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { template } = useTheme();

  const handleCardClick = () => {
    navigate(`/c/catalogue/${slug}/explore?category=${category.id}`);
  };

  return (
    <div className="category-card" onClick={handleCardClick}>
      <div className="category-card-image-wrapper">
        <img src={category.image_url} alt={category.name} loading="lazy" />
        {category.icon_url && template !== 'elegance' && (
          <div className="category-card-icon-overlay">
            {category.icon_url.length < 5 ? category.icon_url : <img src={category.icon_url} alt="icon" />}
          </div>
        )}
      </div>
      <div className="category-card-content">
        <h3 className="category-card-title">{category.name}</h3>
        <p className="category-card-desc">{category.description}</p>
      </div>
    </div>
  );
}

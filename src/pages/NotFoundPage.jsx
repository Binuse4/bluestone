import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container not-found-layout fade-in">
      <span className="not-found-code">404</span>
      <h1 className="not-found-title">Page Introuvable</h1>
      <p className="not-found-text">
        Désolé, la page que vous recherchez n'existe pas ou la boutique associée n'a pas pu être trouvée.
      </p>
      <Link to="/c/catalogue/africa-chic" className="btn btn-primary">
        Retour à la boutique de démonstration
      </Link>
    </div>
  );
}

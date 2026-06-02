/**
 * Génère le lien WhatsApp pré-rempli pour soumettre une commande
 * @param {string} phone - Numéro de téléphone de la boutique (ex: 22997000000)
 * @param {string} storeName - Nom de la boutique (ex: Africa Chic)
 * @param {Array} items - Liste des articles dans le panier
 * @param {number} total - Prix total brut (hors réduction)
 * @param {string} currency - Devise (ex: FCFA)
 * @param {string} promoCode - Code promo appliqué (ex: BLUESTON10)
 * @param {number} discount - Montant de la réduction appliquée
 * @param {number} finalTotal - Prix total net final après réduction
 * @returns {string} - URL WhatsApp
 */
export function generateWhatsAppLink(phone, storeName, items, total, currency = 'FCFA', promoCode = '', discount = 0, finalTotal = null) {
  if (!phone) return '#';

  // Formatage du numéro de téléphone (retirer les espaces, signes +, etc.)
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  // Construction du message
  let message = `Bonjour *${storeName}* !\n\n`;
  message += `Je viens de finir mes différents choix dans votre catalogue.\n\n`;
  message += `Je vous envoie ci-joint le fichier image (PNG) qui vient de se télécharger sur mon appareil récapitulant ma commande.`;

  // Encodage du message pour l'URL
  const encodedText = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

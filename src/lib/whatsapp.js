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
  let message = `Bonjour ${storeName} ! 👋\n\n`;
  message += `Je souhaite commander les articles suivants :\n\n`;
  
  items.forEach(item => {
    const itemTotal = item.price * item.quantity;
    
    // Déterminer les détails de tailles/couleurs
    let optionsText = '';
    if (item.selectedSize && item.selectedSize !== 'Standard' && item.selectedSize !== 'Unique') {
      optionsText += `Taille: ${item.selectedSize}`;
    }
    if (item.selectedColor && item.selectedColor !== 'Unique' && item.selectedColor !== 'Standard') {
      optionsText += `${optionsText ? ', ' : ''}Couleur: ${item.selectedColor}`;
    }
    const optionLabel = optionsText ? ` (${optionsText})` : '';

    message += `• *${item.name}*${optionLabel} (x${item.quantity})\n`;
    message += `  Prix : ${item.price.toLocaleString()} ${currency} → Total : ${itemTotal.toLocaleString()} ${currency}\n\n`;
  });
  
  message += `━━━━━━━━━━━━━━━━━━━\n`;
  
  const displayTotal = finalTotal !== null ? finalTotal : total;
  
  if (discount > 0) {
    message += `Sous-total : ${total.toLocaleString()} ${currency}\n`;
    message += `Code Promo : *${promoCode}* (-${discount.toLocaleString()} ${currency})\n`;
    message += `*Total Net à payer : ${displayTotal.toLocaleString()} ${currency}*\n\n`;
  } else {
    message += `*Total de la commande : ${displayTotal.toLocaleString()} ${currency}*\n\n`;
  }
  
  message += `📍 *Livraison :* [À préciser]\n`;
  message += `✍️ *Note spéciale :* [À préciser]\n\n`;
  message += `_Commande passée depuis le catalogue digital BLUE'STON Connect._`;
  
  // Encodage du message pour l'URL
  const encodedText = encodeURIComponent(message);
  
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

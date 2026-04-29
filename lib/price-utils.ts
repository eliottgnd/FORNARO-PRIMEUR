export function calculateDiscount(product: any) {
  const promotion = product.promotions?.[0];
  const originalPrice = product.price;

  if (!promotion) {
    return { originalPrice, discountedPrice: originalPrice, discountPercent: 0, hasPromotion: false, promotionType: null as string | null };
  }

  const type = promotion.type ?? 'percent';
  let discountedPrice = originalPrice;
  let discountPercent = 0;

  if (type === 'percent' && promotion.discountPercent) {
    discountPercent = promotion.discountPercent;
    discountedPrice = originalPrice - (originalPrice * discountPercent) / 100;
  } else if (type === 'fixed' && promotion.discountAmount) {
    discountedPrice = Math.max(0, originalPrice - promotion.discountAmount);
    discountPercent = Math.round((promotion.discountAmount / originalPrice) * 100);
  } else if (type === 'bundle') {
    // Pour l'affichage unitaire on ne change pas le prix — le bundle s'affiche via le label
    discountedPrice = originalPrice;
  }

  return {
    originalPrice,
    discountedPrice,
    discountPercent,
    hasPromotion: true,
    promotionType: type,
    promotion,
  };
}

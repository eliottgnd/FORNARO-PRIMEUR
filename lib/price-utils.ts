export function calculateDiscount(product: any) {
  const promotion = product.promotions?.[0]; // Get the first active promotion
  const originalPrice = product.price;

  if (!promotion) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountPercent: 0,
      hasPromotion: false,
    };
  }

  const discountAmount = (originalPrice * promotion.discountPercent) / 100;
  const discountedPrice = originalPrice - discountAmount;

  return {
    originalPrice,
    discountedPrice,
    discountPercent: promotion.discountPercent,
    hasPromotion: true,
  };
}

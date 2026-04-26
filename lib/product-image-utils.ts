import { Product } from '@prisma/client'

/**
 * Mapping of French produce names to English filenames in the public folder.
 * This map is based on the files present in public/*.webp
 */
const translationMap: Record<string, string> = {
  'Pomme': 'apple',
  'Poire': 'pear',
  'Banane': 'banane',
  'Orange': 'orange',
  'Fraise': 'strawberries',
  'Framboise': 'raspberry',
  'Myrtille': 'blueberries',
  'Mûre': 'blackberry',
  'Raisin': 'grapes',
  'Kiwi': 'kiwi',
  'Mangue': 'mango',
  'Ananas': 'pineapple',
  'Pastèque': 'watermelon',
  'Melon': 'honeydew',
  'Pêche': 'peach',
  'Nectarine': 'nectarine',
  'Abricot': 'apricot',
  'Prune': 'plum',
  'Cerise': 'cherry',
  'Grenade': 'pomegranate',
  'Avocat': 'avocado',
  'Citron': 'lemon',
  'Citron Vert': 'lime',
  'Pamplemousse': 'grapefruit',
  'Pomélo': 'grapefruit',
  'Papaye': 'papaya',
  'Figue': 'fig',
  'Datte': 'date',
  'Carotte': 'carrots',
  'Radis': 'radish',
  'Navet': 'turnip',
  'Pomme de Terre': 'potato',
  'Patate Douce': 'sweet-potato',
  'Betterave': 'beetroot',
  'Oignon': 'onion',
  'Ail': 'garlic',
  'Poireau': 'leek',
  'Échalote': 'shallot',
  'Aubergine': 'eggplant',
  'Courgette': 'zucchini',
  'Poivron': 'bell-peppers',
  'Concombre': 'cucumber',
  'Chou': 'cabbage',
  'Chou-fleur': 'cauliflower',
  'Brocoli': 'broccoli',
  'Épinards': 'spinach',
  'Laitue': 'lettuce',
  'Arugula': 'arugula',
  'Roquette': 'arugula',
  'Asperge': 'asparagus',
  'Artichaut': 'artichoke',
  'Fenouil': 'fennel',
  'Endive': 'endive',
  'Chou de Bruxelles': 'brussels-sprouts',
  'Petit Pois': 'peas',
  'Haricot Vert': 'green-beans',
  'Fève': 'broad-bean',
  'Graine de Courge': 'pumpkin',
  'Courge': 'squash',
};

export function getProductImage(product: any) {
  // 1. Explicit image from database
  if (product.image) {
    return `/${product.image.endsWith('.webp') || product.image.endsWith('.png') || product.image.endsWith('.jpg') || product.image.endsWith('.jpeg') ? product.image : product.image + '.webp'}`
  }

  // 2. Translation match
  const name = product.name.toLowerCase()
  const translated = Object.entries(translationMap).find(([fr, en]) =>
    name.includes(fr.toLowerCase())
  )

  if (translated) {
    return `/${translated[1]}.webp`
  }

  // 3. Direct English match (slugified)
  const slug = product.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')

  if (slug) {
    return `/${slug}.webp`
  }

  return '/placeholder.webp'
}

export function getProductImagePreview(name: string, image: string | null) {
  // Mock product object for getProductImage
  const mockProduct = { name, image }
  return getProductImage(mockProduct)
}

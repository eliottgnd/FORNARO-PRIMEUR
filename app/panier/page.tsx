"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { AnimateIn } from "@/components/layout/AnimateIn";
import {
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Truck,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { getProductImage } from "@/lib/product-image-utils";
import { getQuantityStep } from "@/lib/unit-utils";
import { useToast } from "@/components/providers/ToastProvider";

export default function PanierPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const totalPrice = getTotalPrice();
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<{
    label: string;
    street: string;
    city: string;
    zipCode: string;
    id?: string;
  }>({ label: "", street: "", city: "", zipCode: "" });
  const [addresses, setAddresses] = useState<any[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [addressMode, setAddressMode] = useState<'saved' | 'custom'>('saved');
  const [selectedCity, setSelectedCity] = useState("");
  const [deliverySettings, setDeliverySettings] = useState<{
    fraisLivraison: number;
    minimumCommande: number;
    zonesActives: string[];
  }>({ fraisLivraison: 0, minimumCommande: 0, zonesActives: [] });
  const [deliverySlots, setDeliverySlots] = useState<Array<{
    id: string; date: string; label: string | null; maxCapacity: number; booked: number; remaining: number;
  }>>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchData() {
      const [addrRes, settingsRes, slotsRes] = await Promise.all([
        fetch("/api/user/addresses", { credentials: "include" }),
        fetch("/api/delivery-settings"),
        fetch("/api/delivery-slots"),
      ]);

      if (addrRes.ok) {
        const data = await addrRes.json();
        setAddresses(data);
        if (data.length > 0) {
          setAddress(data[0]);
          setSelectedCity(data[0].city || "");
        }
      }

      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        setDeliverySettings({
          fraisLivraison: settings.fraisLivraison || 0,
          minimumCommande: settings.minimumCommande || 0,
          zonesActives: settings.zonesActives || [],
        });
      }

      if (slotsRes.ok) {
        const slots = await slotsRes.json();
        setDeliverySlots(slots);
        if (slots.length > 0) setSelectedSlotId(slots[0].id);
      }
    }
    fetchData();
  }, []);

  const subtotal = totalPrice * (1 - appliedDiscount / 100);
  const minimumOrder = deliverySettings.minimumCommande;
  const meetsMinimum = subtotal >= minimumOrder;
  const deliveryCost = meetsMinimum ? 0 : deliverySettings.fraisLivraison;
  const finalTotal = subtotal + deliveryCost;

  // Check availability for each cart item based on selected city
  const itemsWithAvailability = items.map((item) => {
    const raw = item.availabilities || [];
    const availabilities: string[] = raw
      .map((a: any) => (typeof a === 'string' ? a : a?.city))
      .filter(Boolean);
    const isAvailable =
      selectedCity && availabilities.length > 0
        ? availabilities.some(
            (c) => c.toLowerCase() === selectedCity.toLowerCase(),
          )
        : true; // If no city selected, don't block
    const isRestricted =
      selectedCity && availabilities.length > 0 && !isAvailable;
    return { ...item, isAvailable, isRestricted, availabilities };
  });

  const hasUnavailableItems = itemsWithAvailability.some((i) => i.isRestricted);
  const allItemsValid =
    !hasUnavailableItems &&
    (selectedCity
      ? (deliverySettings.zonesActives || []).some(
            (z: string) => z.toLowerCase() === selectedCity.toLowerCase(),
          )
      : true);

  // Show city warning when:
  // - A city is selected AND it's not in zonesActives, OR
  // - A city is selected AND some items are unavailable in that city
  const cityWarning =
    selectedCity && selectedCity.length > 0
      ? !(deliverySettings.zonesActives || []).some(
            (z: string) => z.toLowerCase() === selectedCity.toLowerCase(),
          )
          ? "Cette ville n'est pas couverte par nos zones de livraison"
          : hasUnavailableItems
          ? `${itemsWithAvailability.filter((i) => i.isRestricted).length} produit(s) non disponible(s) à ${selectedCity}`
          : ""
      : "";

  const handlePlaceOrder = async () => {
    if (!address.street || !address.street.trim()) {
      showToast("Veuillez entrer une adresse", "error");
      return;
    }

    if (deliverySlots.length > 0 && !selectedSlotId) {
      showToast("Veuillez choisir un créneau de livraison", "error");
      return;
    }

    if (hasUnavailableItems) {
      showToast("Retirez les produits non disponibles dans votre ville", "error");
      return;
    }

    if (
      selectedCity &&
      !(deliverySettings.zonesActives || []).some(
        (z: string) => z.toLowerCase() === selectedCity.toLowerCase(),
      )
    ) {
      showToast("Cette ville n'est pas couverte par nos zones de livraison", "error");
      return;
    }

    setIsLoading(true);
    try {
      let finalAddressId = address.id;

      if (addressMode === "custom") {
        const addrRes = await fetch("/api/user/addresses", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: "Adresse de commande",
            street: address.street,
            city: selectedCity || address.city,
            zipCode: address.zipCode,
            isDefault: false,
          }),
        });

        if (!addrRes.ok) {
          const addrErr = await addrRes.json();
          throw new Error(addrErr.error || "Erreur lors de l'enregistrement de l'adresse");
        }

        const addrData = await addrRes.json();
        finalAddressId = addrData.id;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total: finalTotal,
          addressId: finalAddressId,
          deliveryCost: deliveryCost,
          deliverySlotId: selectedSlotId || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Redirect to SumUp hosted checkout
        if (data.hostedCheckoutUrl) {
          window.location.href = data.hostedCheckoutUrl;
        } else {
          // Fallback - shouldn't happen with real SumUp credentials
          showToast("Configuration payment manquante", "error");
          setIsLoading(false);
        }
      } else {
        const err = await res.json();
        showToast(err.error || "Une erreur est survenue lors de la commande", "error");
      }
    } catch (e: any) {
      showToast(e.message || "Erreur de connexion au serveur", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-blanc flex items-center justify-center px-6">
        <AnimateIn>
          <div className="text-center">
            <ShoppingBag size={64} className="mx-auto text-creme mb-4" />
            <h1 className="font-display text-3xl text-vert mb-2">
              Votre panier est vide
            </h1>
            <p className="text-gris mb-8">
              Il est temps de remplir votre panier de bonnes choses !
            </p>
            <Link href="/produits" className="btn-primary px-8 py-3">
              Découvrir nos produits
            </Link>
          </div>
        </AnimateIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blanc px-6 md:px-20 py-12">
      <AnimateIn>
        <h1 className="font-display text-3xl md:text-4xl text-vert mb-8">
          Mon Panier
        </h1>
      </AnimateIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {itemsWithAvailability.map((item) => (
            <div
              key={item.id}
              className={clsx(
                "bg-white rounded-3xl p-4 md:p-6 border flex gap-4 items-center relative",
                item.isRestricted
                  ? "border-red-300 bg-red-50"
                  : "border-creme-dark",
              )}
            >
              {item.isRestricted && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                  <AlertTriangle size={14} />
                </div>
              )}
              <div className="w-20 h-20 rounded-2xl bg-creme flex items-center justify-center overflow-hidden relative">
                <img
                  src={getProductImage(item)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/placeholder.webp";
                  }}
                />
                {item.isRestricted && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <AlertTriangle size={20} className="text-red-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-vert text-lg">{item.name}</p>
                <p className="text-gris text-sm">
                  {item.price.toFixed(2)}€ / {item.unit || 'unité'}
                </p>
                {item.isRestricted && (
                  <p className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    Non disponible à {selectedCity}
                  </p>
                )}
                {!item.isRestricted && item.availabilities && item.availabilities.length > 0 && (
                  <p className="text-gray-400 text-xs mt-1">
                    Disponible à: {item.availabilities.join(", ")}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 bg-creme rounded-xl px-3 py-2 border border-creme-dark">
                <button
                  onClick={() =>
                    useCartStore
                      .getState()
                      .updateQuantity(item.productId, +(item.quantity - getQuantityStep(item.unit)).toFixed(2))
                  }
                  className="text-vert hover:text-vert-mid font-bold"
                >
                  {" "}
                  -{" "}
                </button>
                <span className="font-display font-semibold text-vert min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    useCartStore
                      .getState()
                      .updateQuantity(item.productId, +(item.quantity + getQuantityStep(item.unit)).toFixed(2))
                  }
                  className="text-vert hover:text-vert-mid font-bold"
                >
                  {" "}
                  +{" "}
                </button>
              </div>
              <div className="text-right font-display font-bold text-vert min-w-80px">
                {(item.price * item.quantity).toFixed(2)}€
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-creme-dark shadow-sm">
            <h2 className="font-display text-xl text-vert mb-6">
              Récapitulatif
            </h2>

            <div className="space-y-4 mb-6">
              {!meetsMinimum && minimumOrder > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>
                    Minimum de commande : <strong>{minimumOrder.toFixed(2)}€</strong> — livraison offerte à partir de {minimumOrder.toFixed(2)}€
                  </span>
                </div>
              )}
              {meetsMinimum && minimumOrder > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>
                    Livraison gratuite !
                  </span>
                </div>
              )}
              <div className="flex justify-between text-gris text-sm">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-matcha text-sm font-medium">
                  <span>Réduction ({appliedDiscount}%)</span>
                  <span>
                    -{(getTotalPrice() * (appliedDiscount / 100)).toFixed(2)}€
                  </span>
                </div>
              )}
              <div className="flex justify-between text-gris text-sm">
                <span className="flex items-center gap-2">
                  <Truck size={14} />
                  Livraison
                </span>
                <span className={meetsMinimum ? "text-green-600 font-medium" : "text-vert font-medium"}>
                  {deliveryCost === 0 ? "Gratuit" : `${deliveryCost.toFixed(2)}€`}
                </span>
              </div>
              <div className="pt-4 border-t border-creme-dark flex justify-between items-center">
                <span className="font-medium text-vert">Total</span>
                <span className="font-display text-2xl font-bold text-vert">
                  {finalTotal.toFixed(2)}€
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-[11px] font-semibold uppercase text-gris mb-2 block">
                Adresse de livraison
              </label>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => {
                    setAddressMode("saved");
                    // Reset address to first saved address to clear custom form values
                    if (addresses.length > 0) {
                      const savedAddr = addresses.find(a => a.id === address.id) || addresses[0];
                      setAddress(savedAddr);
                      setSelectedCity(savedAddr.city || "");
                    }
                  }}
                  className={`text-xs px-3 py-1 rounded-full transition-all ${
                    addressMode === "saved"
                      ? "bg-vert text-white"
                      : "bg-creme text-vert border border-creme-dark"
                  }`}
                >
                  Enregistrée
                </button>
                <button
                  onClick={() => setAddressMode("custom")}
                  className={`text-xs px-3 py-1 rounded-full transition-all ${
                    addressMode === "custom"
                      ? "bg-vert text-white"
                      : "bg-creme text-vert border border-creme-dark"
                  }`}
                >
                  Nouvelle adresse
                </button>
              </div>
              <div className="space-y-2">
                {addressMode === "saved" && (
                  addresses.length > 0 ? (
                    <select
                      value={address.id}
                      onChange={(e) => {
                        const selected = addresses.find((a) => a.id === e.target.value);
                        if (selected) {
                          setAddress(selected);
                          setSelectedCity(selected.city || "");
                        }
                      }}
                      className="w-full p-3 rounded-xl bg-creme border border-creme-dark text-sm text-vert outline-none"
                    >
                      {addresses.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.label} - {a.city}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs text-orange-500 bg-orange-50 p-3 rounded-xl border border-orange-100">
                      Veuillez ajouter une adresse dans votre compte.
                    </p>
                  )
                )}

                {addressMode === "custom" && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Rue et numéro"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full p-3 rounded-xl bg-creme border border-creme-dark text-sm text-vert outline-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={selectedCity}
                        onChange={(e) => {
                          setAddress({ ...address, city: e.target.value });
                          setSelectedCity(e.target.value);
                        }}
                        className="w-full p-3 rounded-xl bg-creme border border-creme-dark text-sm text-vert outline-none"
                      >
                        <option value="">Sélectionner une ville</option>
                        {deliverySettings.zonesActives.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Code Postal"
                        value={address.zipCode}
                        onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                        className="w-full p-3 rounded-xl bg-creme border border-creme-dark text-sm text-vert outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {cityWarning && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{cityWarning}</span>
              </div>
            )}

            {/* Créneau de livraison */}
            {deliverySlots.length > 0 && (
              <div className="mb-6">
                <label className="text-[11px] font-semibold uppercase text-gris mb-2 block flex items-center gap-1.5">
                  <CalendarDays size={13} /> Créneau de livraison
                </label>
                <div className="space-y-2">
                  {deliverySlots.map((slot) => {
                    const d = new Date(slot.date)
                    const jours = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.']
                    const mois = ['jan', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc']
                    const label = `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]}`
                    const isSelected = selectedSlotId === slot.id
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={clsx(
                          "w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 text-sm transition-all",
                          isSelected
                            ? "border-matcha bg-matcha/5 text-vert"
                            : "border-creme-dark bg-white text-gris hover:border-matcha/40"
                        )}
                      >
                        <span className="font-medium">
                          {label}
                          {slot.label && <span className="font-normal ml-1 text-gris text-xs">· {slot.label}</span>}
                        </span>
                        <span className={clsx(
                          "text-[11px] font-medium",
                          slot.remaining <= 2 ? "text-orange-500" : "text-matcha"
                        )}>
                          {slot.remaining} place{slot.remaining > 1 ? 's' : ''} restante{slot.remaining > 1 ? 's' : ''}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {deliverySlots.length === 0 && (
              <div className="mb-6 flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-sm">
                <CalendarDays size={15} className="shrink-0" />
                <span>Aucun créneau de livraison disponible pour le moment.</span>
              </div>
            )}

            <div className="mb-6">
              <label className="text-[11px] font-semibold uppercase text-gris mb-2 block">
                Mode de paiement
              </label>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-matcha ring-1 ring-matcha">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/97/SumUp_Logo.svg"
                  alt="SumUp"
                  className="h-6 w-auto"
                  style={{ filter: 'brightness(0) saturate(100%)' }}
                />
                <span className="text-sm font-medium text-vert">
                  Paiement sécurisé
                </span>
                <div className="ml-auto">
                  <div className="w-4 h-4 rounded-full bg-matcha border-2 border-white shadow-sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Code promo..."
                className="flex-1 p-3 rounded-xl bg-creme border border-creme-dark text-sm text-vert outline-none"
              />
              <button
                onClick={async () => {
                  const res = await fetch("/api/promo-codes/apply", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: promoCode, orderId: "cart" }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setAppliedDiscount(data.discountPercent);
                    showToast("Code appliqué !", "success");
                  } else {
                    showToast(data.message || "Code invalide", "error");
                  }
                }}
                className="px-4 py-3 rounded-xl bg-vert text-white text-sm font-medium"
              >
                Appliquer
              </button>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={
              isLoading ||
              hasUnavailableItems ||
              (addressMode === "saved" && (!addresses.length || !address.id)) ||
              (addressMode === "custom" && (!address.street || !selectedCity || !address.zipCode)) ||
              (deliverySlots.length > 0 && !selectedSlotId)
            }
            className={clsx(
              "w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2",
              isLoading ||
              hasUnavailableItems ||
              (addressMode === "saved" && (!addresses.length || !address.id)) ||
              (addressMode === "custom" && (!address.street || !selectedCity || !address.zipCode)) ||
              (deliverySlots.length > 0 && !selectedSlotId)
                ? "bg-gris text-white cursor-not-allowed"
                : "btn-primary",
            )}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <CreditCard size={18} />
            )}
            {isLoading ? "Traitement..." : " Passer à paiement"}
          </button>
        </div>
      </div>
    </div>
  );
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

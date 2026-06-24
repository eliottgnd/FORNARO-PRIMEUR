"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, X, Plus, Minus, ArrowRight, Trash2, AlertCircle, Truck } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { getQuantityStep } from "@/lib/unit-utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [minimumOrder, setMinimumOrder] = useState(0);
  const [deliverySettings, setDeliverySettings] = useState({ fraisLivraison: 0, minimumCommande: 0 });

  useEffect(() => {
    async function fetchDeliverySettings() {
      try {
        const res = await fetch("/api/delivery-settings");
        if (res.ok) {
          const data = await res.json();
          setMinimumOrder(data.minimumCommande || 0);
          setDeliverySettings({ fraisLivraison: data.fraisLivraison || 0, minimumCommande: data.minimumCommande || 0 });
        }
      } catch (e) {
        console.error("Failed to fetch delivery settings:", e);
      }
    }
    fetchDeliverySettings();
  }, []);

  const totalPrice = getTotalPrice();
  const meetsMinimum = totalPrice >= minimumOrder;
  const deliveryCost = meetsMinimum ? 0 : deliverySettings.fraisLivraison;
  const finalTotal = totalPrice + deliveryCost;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-100 flex justify-end",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <div
        className={clsx(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={clsx(
          "relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-creme-dark flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-vert" size={20} />
            <h2 className="font-display text-xl text-vert">Votre Panier</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-creme rounded-full transition-colors"
          >
            <X size={20} className="text-gris" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-creme mb-4" />
              <p className="text-gris">Votre panier est vide</p>
              <Link href="/produits" className="btn-primary mt-4 inline-block">
                Découvrir nos produits
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 rounded-2xl bg-white border border-creme-dark hover:border-matcha transition-colors"
              >
                <div className="w-16 h-16 rounded-xl bg-creme flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={item.imageUrl || "/placeholder.webp"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/placeholder.webp";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-vert truncate">{item.name}</p>
                  <p className="text-gris text-sm">
                    {item.originalPrice ? (
                      <>
                        <span className="line-through mr-1 opacity-60">
                          {item.originalPrice.toFixed(2)}€
                        </span>
                        <span className="text-vert font-medium">
                          {item.price.toFixed(2)}€
                        </span>
                        <span className="ml-1 text-xs bg-vert text-white px-1 rounded-sm">
                          -{item.discountPercent}%
                        </span>
                      </>
                    ) : (
                      `${item.price.toFixed(2)}€ / ${item.unit || 'unité'}`
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2 bg-creme rounded-lg px-2 py-1">
                      <button
                        onClick={() => {
                          const step = getQuantityStep(item.unit)
                          item.quantity > step &&
                            updateQuantity(item.productId, +(item.quantity - step).toFixed(2))
                        }}
                        className={clsx(
                          "p-1 hover:text-vert transition-colors",
                          item.quantity <= getQuantityStep(item.unit) &&
                            "opacity-50 cursor-not-allowed hover:text-vert-mid",
                        )}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-medium min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, +(item.quantity + getQuantityStep(item.unit)).toFixed(2))
                        }
                        className="p-1 hover:text-vert transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-1 text-red-400 hover:text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-right font-display font-semibold text-vert shrink-0">
                  {(item.price * item.quantity).toFixed(2)}€
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-creme-dark bg-creme/30 shrink-0">
            {!meetsMinimum && minimumOrder > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs mb-4">
                <AlertCircle size={14} className="shrink-0" />
                <span>
                  Livraison : <strong>{deliverySettings.fraisLivraison.toFixed(2)}€</strong> — gratuite dès {minimumOrder.toFixed(2)}€
                </span>
              </div>
            )}
            {meetsMinimum && minimumOrder > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs mb-4">
                <AlertCircle size={14} className="shrink-0" />
                <span>Livraison gratuite !</span>
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-gris">Sous-total</span>
              <span className="font-display text-lg font-bold text-vert">
                {totalPrice.toFixed(2)}€
              </span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-gris flex items-center gap-1">
                <Truck size={12} />
                Livraison
              </span>
              <span className={clsx("font-display text-lg font-bold", meetsMinimum ? "text-green-600" : "text-vert")}>
                {deliveryCost === 0 ? "Gratuit" : `${deliveryCost.toFixed(2)}€`}
              </span>
            </div>
            <div className="flex items-center justify-between mb-6 pt-3 border-t border-creme-dark">
              <span className="font-medium text-vert">Total</span>
              <span className="font-display text-2xl font-bold text-vert">
                {finalTotal.toFixed(2)}€
              </span>
            </div>
            <Link
              href="/panier"
              className="w-full btn-primary flex items-center justify-center gap-2 py-4"
              onClick={onClose}
            >
              Commander <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

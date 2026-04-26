"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimateIn } from "@/components/layout/AnimateIn";
import { CheckCircle2, XCircle, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "pending">("loading");
  const [orderStatus, setOrderStatus] = useState<any>(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!checkoutId) {
        setStatus("failed");
        return;
      }

      try {
        let attempts = 0;
        const pollInterval = setInterval(async () => {
          attempts++;
          const res = await fetch(`/api/payments/verify?checkout_id=${checkoutId}`, {
            credentials: "include",
          });
          if (res.ok) {
            const data = await res.json();
            setOrderStatus(data);
            if (data.status === 'success' || data.status === 'PAID') {
              clearCart();
              setStatus("success");
              clearInterval(pollInterval);
            } else if (data.status === 'failed' || data.status === 'FAILED') {
              setStatus("failed");
              clearInterval(pollInterval);
            }
          }
          if (attempts >= 10) {
            clearInterval(pollInterval);
            setStatus("pending");
          }
        }, 3000);
      } catch (e) {
        console.error("Payment verification error:", e);
        setStatus("failed");
      }
    }

    verifyPayment();
  }, [checkoutId, clearCart]);

  return (
    <div className="min-h-screen bg-blanc flex items-center justify-center px-6">
      <AnimateIn>
        <div className="text-center max-w-md">
          {status === "loading" && (
            <>
              <div className="w-20 h-20 bg-creme rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="animate-spin text-vert" size={40} />
              </div>
              <h1 className="font-display text-3xl text-vert mb-4">
                Vérification du paiement...
              </h1>
              <p className="text-gris">
                Veuillez patienter pendant que nous vérifions votre paiement
                auprès de SumUp.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="font-display text-3xl text-vert mb-4">
                Paiement réussi !
              </h1>
              <p className="text-gris mb-2">
                Votre commande a été confirmée et sera traitée sous peu.
              </p>
              {checkoutId && (
                <p className="text-matcha font-medium mb-8">
                  Référence : {checkoutId.slice(0, 8)}...
                </p>
              )}
              <div className="space-y-3">
                <Link
                  href="/compte/commandes"
                  className="btn-primary w-full py-4 block"
                >
                  Suivre ma commande
                </Link>
                <Link
                  href="/produits"
                  className="w-full py-4 block text-center text-vert font-medium hover:underline"
                >
                  Continuer mes achats
                </Link>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={40} />
              </div>
              <h1 className="font-display text-3xl text-vert mb-4">
                Paiement échoué
              </h1>
              <p className="text-gris mb-8">
                Le paiement n&apos;a pas pu être traité. Veuillez réessayer ou
                contacter le support.
              </p>
              <div className="space-y-3">
                <Link
                  href="/panier"
                  className="btn-primary w-full py-4 block"
                >
                  Retour au panier
                </Link>
                <Link
                  href="/compte/commandes"
                  className="w-full py-4 block text-center text-vert font-medium hover:underline"
                >
                  Mes commandes
                </Link>
              </div>
            </>
          )}

          {status === "pending" && (
            <>
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} />
              </div>
              <h1 className="font-display text-3xl text-vert mb-4">
                Paiement en attente
              </h1>
              <p className="text-gris mb-2">
                Votre paiement est en cours de traitement. Vous recevrez un email
                de confirmation dès qu&apos;il sera validé.
              </p>
              {checkoutId && (
                <p className="text-matcha font-medium mb-8">
                  Référence : {checkoutId.slice(0, 8)}...
                </p>
              )}
              <div className="space-y-3">
                <Link
                  href="/compte/commandes"
                  className="btn-primary w-full py-4 block"
                >
                  Suivre ma commande
                </Link>
                <Link
                  href="/produits"
                  className="w-full py-4 block text-center text-vert font-medium hover:underline"
                >
                  Continuer mes achats
                </Link>
              </div>
            </>
          )}
        </div>
      </AnimateIn>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-blanc flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-creme rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="animate-spin text-vert" size={40} />
        </div>
        <h1 className="font-display text-3xl text-vert mb-4">
          Chargement...
        </h1>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
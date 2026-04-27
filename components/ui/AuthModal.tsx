"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView = "login" | "signup" | "forgot" | "reset";

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères";
  }
  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une majuscule";
  }
  if (!/[0-9]/.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre";
  }
  return null;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [view, setView] = useState<ModalView>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setView("login");
      setError(null);
      setSuccessMessage(null);
      setPasswordError(null);
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        address: "",
        code: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password" || name === "newPassword") {
      const otherPwd = name === "password" ? formData.newPassword : value;
      if (value.length >= 4) {
        const err = validatePassword(value);
        setPasswordError(err);
      }
    }
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      setError("Veuillez entrer votre email");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const endpoint =
        view === "signup"
          ? "/api/auth/send-verification"
          : "/api/auth/send-password-reset";

      const body =
        view === "signup"
          ? { email: formData.email, type: "signup", firstName: formData.firstName }
          : { email: formData.email };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi du code");
      }

      if (view === "forgot") {
        setSuccessMessage("Un code de réinitialisation a été envoyé à votre email");
        setView("reset");
      } else {
        setSuccessMessage(
          "Un code de vérification a été envoyé à votre email"
        );
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    const pwdErr = validatePassword(formData.password);
    if (pwdErr) {
      setError(pwdErr);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (!formData.code) {
      setError("Veuillez entrer le code de vérification");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/verify-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création du compte");
      }

      // Auto-login after successful signup
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Compte créé mais connexion impossible");
      }

      router.push("/");
      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Identifiants invalides");
      }

      router.push("/");
      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.code) {
      setError("Veuillez entrer le code de vérification");
      return;
    }

    const pwdErr = validatePassword(formData.newPassword);
    if (pwdErr) {
      setError(pwdErr);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la réinitialisation");
      }

      setSuccessMessage("Mot de passe réinitialisé avec succès");
      setTimeout(() => {
        setView("login");
        setSuccessMessage(null);
        setFormData((prev) => ({
          ...prev,
          password: "",
          code: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blanc/50 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md p-6 bg-blanc rounded-3xl shadow-xl border border-creme-dark transition-all duration-300 ease-in-out overflow-hidden"
        style={{ minHeight: view === "signup" && !successMessage ? "680px" : view === "reset" ? "600px" : "420px" }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gris hover:text-vert transition-colors p-1 rounded-full"
        >
          <X size={18} />
        </button>

        {/* Tabs */}
        {view !== "signup" && view !== "reset" && (
          <div className="flex mb-6 border-b border-creme-dark pb-2">
            <button
              onClick={() => { setView("login"); setError(null); setSuccessMessage(null); }}
              className="flex-1 py-3 text-center font-medium text-[13px] tracking-widest text-vert border-b-2 border-vert"
            >
              Se connecter
            </button>
            <button
              onClick={() => { setView("signup"); setError(null); setSuccessMessage(null); }}
              className="flex-1 py-3 text-center font-medium text-[13px] tracking-widest text-gris hover:text-vert"
            >
              Créer un compte
            </button>
          </div>
        )}

        {view === "signup" && (
          <button
            onClick={() => { setView("login"); setError(null); setSuccessMessage(null); }}
            className="text-[12px] text-gris hover:text-vert mb-4"
          >
            ← Retour
          </button>
        )}

        {view === "reset" && (
          <button
            onClick={() => { setView("login"); setError(null); setSuccessMessage(null); }}
            className="text-[12px] text-gris hover:text-vert mb-4"
          >
            ← Retour à la connexion
          </button>
        )}

        {error && (
          <div className="mb-4 p-3 text-xs text-white bg-red-500 rounded-lg text-center">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 text-xs text-white bg-green-600 rounded-lg text-center">
            {successMessage}
          </div>
        )}

        {/* LOGIN FORM */}
        {view === "login" && !successMessage && (
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-vert mb-1">Email</label>
              <input name="email" value={formData.email} onChange={handleInputChange} type="email" required
                className="w-full px-4 py-2 border border-creme-dark rounded-xl focus:outline-none focus:border-vert focus:ring-2 focus:ring-vert/20" />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-vert mb-1">Mot de passe</label>
              <input name="password" value={formData.password} onChange={handleInputChange} type="password" required
                className="w-full px-4 py-2 border border-creme-dark rounded-xl focus:outline-none focus:border-vert focus:ring-2 focus:ring-vert/20" />
            </div>

            <div className="flex items-center justify-between text-[12px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-vert" />
                <span>Se souvenir de moi</span>
              </label>
              <button onClick={() => setView("forgot")} className="text-matcha hover:underline">
                Mot de passe oublié ?
              </button>
            </div>

            <Button className="w-full" type="button" disabled={isLoading} onClick={handleLogin}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>

            <p className="text-center text-[12px] text-gris mt-4">
              Vous n&apos;avez pas de compte ?{" "}
              <button onClick={() => setView("signup")} className="text-vert hover:underline">
                Créez-en un
              </button>
            </p>
          </div>
        )}

        {/* FORGOT PASSWORD FORM */}
        {view === "forgot" && (
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-vert mb-1">Email</label>
              <input name="email" value={formData.email} onChange={handleInputChange} type="email" required
                className="w-full px-4 py-2 border border-creme-dark rounded-xl focus:outline-none focus:border-vert focus:ring-2 focus:ring-vert/20" />
            </div>

            <Button className="w-full" type="button" disabled={isLoading} onClick={handleSendCode}>
              {isLoading ? "Envoi en cours..." : "Envoyer le code"}
            </Button>

            <p className="text-center text-[12px] text-gris mt-4">
              Vous avez un compte ?{" "}
              <button onClick={() => setView("login")} className="text-vert hover:underline">
                Connectez-vous
              </button>
            </p>
          </div>
        )}

        {/* RESET PASSWORD FORM */}
        {view === "reset" && (
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-vert mb-1">Code de vérification</label>
              <input name="code" value={formData.code} onChange={handleInputChange} type="text" placeholder="6 chiffres"
                maxLength={6}
                className="w-full px-4 py-2 border border-creme-dark rounded-xl focus:outline-none focus:border-vert focus:ring-2 focus:ring-vert/20 text-center tracking-widest text-lg" />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-vert mb-1">Nouveau mot de passe</label>
              <input name="newPassword" value={formData.newPassword} onChange={handleInputChange} type="password"
                className="w-full px-4 py-2 border border-creme-dark rounded-xl focus:outline-none focus:border-vert focus:ring-2 focus:ring-vert/20" />
            </div>

            {formData.newPassword && (
              <div className={`text-[11px] ${passwordError ? "text-red-500" : "text-green-600"}`}>
                {passwordError || "✓ Mot de passe valide"}
              </div>
            )}

            <div>
              <label className="block text-[12px] font-medium text-vert mb-1">Confirmer le mot de passe</label>
              <input name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} type="password"
                className="w-full px-4 py-2 border border-creme-dark rounded-xl focus:outline-none focus:border-vert focus:ring-2 focus:ring-vert/20" />
            </div>

            <Button className="w-full" type="button" disabled={isLoading} onClick={handleResetPassword}>
              {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
            </Button>
          </div>
        )}

        {/* SIGNUP STEP 1: Form + send code */}
        {view === "signup" && !successMessage && (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <p className="section-eyebrow mb-1">Nouveau client</p>
              <h2 className="font-display text-2xl text-vert">Créer votre compte</h2>
              <p className="text-gris text-[12px] mt-1">Rejoignez Fornaro pour des produits frais et locaux</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className={`w-8 h-1.5 rounded-full transition-all ${!formData.code ? "bg-matcha" : "bg-creme-dark"}`} />
              <div className={`w-8 h-1.5 rounded-full transition-all ${formData.code ? "bg-matcha" : "bg-creme-dark"}`} />
            </div>
            <p className="text-center text-[11px] text-gris mb-4">
              {!formData.code ? "Étape 1 sur 2 — Vos informations" : "Étape 2 sur 2 — Vérification"}
            </p>

            {!formData.code ? (
              <>
                {/* Step 1: Basic info + send code */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-[11px] font-medium text-gris mb-1">Prénom</label>
                      <input name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" required
                        className="input-field" placeholder="Jean" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] font-medium text-gris mb-1">Nom</label>
                      <input name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" required
                        className="input-field" placeholder="Dupont" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gris mb-1">Email</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} type="email" required
                      className="input-field" placeholder="jean@exemple.fr" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gris mb-1">Adresse de livraison</label>
                    <input name="address" value={formData.address} onChange={handleInputChange} type="text" required
                      className="input-field" placeholder="12 rue des Fleurs, 75001 Paris" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gris mb-1">Mot de passe</label>
                    <input name="password" value={formData.password} onChange={handleInputChange} type="password" required
                      className="input-field" placeholder="Min. 8 caractères, 1 majuscule, 1 chiffre" />
                    {formData.password && (
                      <div className={`text-[10px] mt-1 ${passwordError ? "text-red-500" : "text-green-600"}`}>
                        {passwordError || "✓ Mot de passe valide"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gris mb-1">Confirmer le mot de passe</label>
                    <input name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} type="password" required
                      className="input-field" placeholder="Même mot de passe" />
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-[10px] text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                    )}
                  </div>
                </div>

                <Button className="w-full mt-5" type="button" disabled={isLoading} onClick={handleSendCode}>
                  {isLoading ? "Envoi du code..." : "Recevoir mon code de vérification"}
                </Button>
              </>
            ) : (
              <>
                {/* Step 2: Verify code */}
                <div className="bg-creme rounded-2xl p-4 mb-4 text-center">
                  <p className="text-[11px] text-gris mb-1">Code envoyé à</p>
                  <p className="text-vert font-medium text-sm">{formData.email}</p>
                  <button
                    onClick={() => { setFormData(prev => ({ ...prev, code: "" })); setSuccessMessage(null); }}
                    className="text-[11px] text-matcha hover:underline mt-2"
                  >
                    Changer d&apos;email
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-[11px] font-medium text-gris mb-2 text-center">Code de vérification</label>
                  <input name="code" value={formData.code} onChange={handleInputChange} type="text" placeholder="000000"
                    maxLength={6}
                    className="input-field text-center tracking-[0.3em] text-lg" />
                </div>

                <Button className="w-full" type="button" disabled={isLoading} onClick={handleSignup}>
                  {isLoading ? "Création..." : "Créer mon compte"}
                </Button>

                <p className="text-center text-[11px] text-gris mt-3">
                  Pas reçu de code ?{" "}
                  <button onClick={handleSendCode} className="text-matcha hover:underline" disabled={isLoading}>
                    Renvoyer
                  </button>
                </p>
              </>
            )}

            <div className="border-t border-creme-dark mt-5 pt-4 text-center">
              <p className="text-[11px] text-gris">
                Vous avez déjà un compte ?{" "}
                <button onClick={() => setView("login")} className="text-vert hover:underline font-medium">
                  Connectez-vous
                </button>
              </p>
            </div>
          </div>
        )}

        {/* SIGNUP STEP 2: Code entry after email confirmation sent */}
        {view === "signup" && successMessage && (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <p className="section-eyebrow mb-1">Nouveau client</p>
              <h2 className="font-display text-2xl text-vert">Vérifiez votre email</h2>
              <p className="text-gris text-[12px] mt-1">Un code de vérification a été envoyé</p>
            </div>

            {/* Confirmation badge */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-matcha/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-matcha" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-vert font-medium text-sm">{formData.email}</p>
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-medium text-gris mb-2 text-center">Entrez le code reçu</label>
              <input name="code" value={formData.code} onChange={handleInputChange} type="text" placeholder="000000"
                maxLength={6}
                className="input-field text-center tracking-[0.3em] text-lg" />
            </div>

            <Button className="w-full" type="button" disabled={isLoading} onClick={handleSignup}>
              {isLoading ? "Création..." : "Créer mon compte"}
            </Button>

            <p className="text-center text-[11px] text-gris mt-3">
              Pas reçu ?{" "}
              <button onClick={handleSendCode} className="text-matcha hover:underline" disabled={isLoading}>
                Renvoyer le code
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
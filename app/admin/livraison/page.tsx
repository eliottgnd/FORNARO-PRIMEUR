"use client";

import { useState, useEffect } from "react";
import { AnimateIn } from "@/components/layout/AnimateIn";
import { Truck, Clock, MapPin, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";

export default function Livraison() {
  const [settings, setSettings] = useState({
    heureLimit: "20:00",
    heureLivraison: "07:00",
    fraisLivraison: "3.90",
    minimumCommande: "15.00",
    zonesActives: ["Biarritz", "Hendaye"],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { showToast } = useToast();

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/delivery-settings");
      if (res.ok) {
        const data = await res.json();
        // Map DB keys to state keys
        setSettings({
          heureLimit: data.heureLimit || "20:00",
          heureLivraison: data.heureLivraison || "07:00",
          fraisLivraison: data.fraisLivraison || "3.90",
          minimumCommande: data.minimumCommande || "15.00",
          zonesActives: data.zonesActives
            ? JSON.parse(data.zonesActives)
            : ["Biarritz", "Hendaye"],
        });
      }
    } catch (e) {
      console.error("Failed to fetch delivery settings:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleCityInput = async (val: string) => {
    setCityQuery(val);
    if (val.length >= 2) {
      try {
        const res = await fetch(
          `/api/admin/cities?q=${encodeURIComponent(val)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setCitySuggestions(data);
          setShowSuggestions(true);
        }
      } catch (e) {
        console.error("Autocomplete error:", e);
      }
    } else {
      setCitySuggestions([]);
      setShowSuggestions(false);
    }
  };

  const addZone = (zone: string) => {
    if (!settings.zonesActives.includes(zone)) {
      setSettings((s) => ({
        ...s,
        zonesActives: [...s.zonesActives, zone],
      }));
    }
    setCityQuery("");
    setCitySuggestions([]);
    setShowSuggestions(false);
  };

  const removeZone = (zone: string) => {
    setSettings((s) => ({
      ...s,
      zonesActives: s.zonesActives.filter((z) => z !== zone),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...settings,
        zonesActives: JSON.stringify(settings.zonesActives),
      };
      const res = await fetch("/api/admin/delivery-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast("Paramètres sauvegardés avec succès !");
      } else {
        showToast("Erreur lors de la sauvegarde", "error");
      }
    } catch (e) {
      showToast("Erreur réseau", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <AnimateIn>
        <p className="section-eyebrow mb-2">Admin</p>
        <h1 className="font-display text-3xl md:text-4xl text-vert mb-8 md:mb-10">
          Paramètres de livraison
        </h1>
      </AnimateIn>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-vert" size={24} />
          <p className="text-gris text-sm">Chargement des paramètres...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
            {/* Zones */}
            <AnimateIn delay={0.1} className="md:col-span-2 mb-8 md:mb-30">
              <div className="bg-white rounded-3xl border border-creme-dark p-5 md:p-6 pb-10 md:pb-12 relative z-20 overflow-visible">
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <div className="w-10 h-10 rounded-xl bg-creme flex items-center justify-center text-matcha">
                    <MapPin size={18} />
                  </div>
                  <h2 className="font-display text-lg md:text-xl text-vert">
                    Zones de livraison
                  </h2>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="relative max-w-md">
                    <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                      Ajouter une ville
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cityQuery}
                        onChange={(e) => handleCityInput(e.target.value)}
                        onFocus={() =>
                          cityQuery.length >= 2 && setShowSuggestions(true)
                        }
                        placeholder="Ex: Biarritz, Bayonne..."
                        className="input-field w-full"
                      />
                      {showSuggestions && citySuggestions.length > 0 && (
                        <ul className="absolute z-[100] w-full mt-1 bg-white border border-creme-dark rounded-xl shadow-2xl max-h-60 overflow-auto py-2 block">
                          {citySuggestions.map((city) => (
                            <li
                              key={city}
                              onClick={() => addZone(city)}
                              className="px-4 py-2 hover:bg-creme cursor-pointer text-sm text-gris hover:text-vert transition-colors block"
                            >
                              {city}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap relative z-10">
                    {settings.zonesActives.map((zone) => (
                      <span
                        key={zone}
                        className="px-4 py-2 rounded-full text-[12px] md:text-[13px] font-medium bg-matcha text-white border border-matcha flex items-center gap-2 animate-in fade-in zoom-in duration-200"
                      >
                        {zone}
                        <button
                          onClick={() => removeZone(zone)}
                          className="hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                        >
                          <span className="text-xs">×</span>
                        </button>
                      </span>
                    ))}
                    {settings.zonesActives.length === 0 && (
                      <p className="text-gris text-sm italic">
                        Aucune zone de livraison définie.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </AnimateIn>

            {/* Horaires */}
            <AnimateIn delay={0.2}>
              <div className="bg-white rounded-3xl border border-creme-dark p-5 md:p-6">
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <div className="w-10 h-10 rounded-xl bg-creme flex items-center justify-center text-matcha">
                    <Clock size={18} />
                  </div>
                  <h2 className="font-display text-lg md:text-xl text-vert">
                    Horaires
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                      Heure limite de commande
                    </label>
                    <input
                      type="time"
                      value={settings.heureLimit}
                      onChange={(e) =>
                        setSettings({ ...settings, heureLimit: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                      Heure de livraison
                    </label>
                    <input
                      type="time"
                      value={settings.heureLivraison}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          heureLivraison: e.target.value,
                        })
                      }
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </AnimateIn>

            {/* Tarifs */}
            <AnimateIn delay={0.3}>
              <div className="bg-white rounded-3xl border border-creme-dark p-5 md:p-6">
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <div className="w-10 h-10 rounded-xl bg-creme flex items-center justify-center text-matcha">
                    <Truck size={18} />
                  </div>
                  <h2 className="font-display text-lg md:text-xl text-vert">
                    Tarifs
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                      Frais de livraison (€)
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      value={settings.fraisLivraison}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          fraisLivraison: e.target.value,
                        })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                      Minimum de commande (€)
                    </label>
                    <input
                      type="number"
                      step="0.50"
                      value={settings.minimumCommande}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          minimumCommande: e.target.value,
                        })
                      }
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>

          {/* Sauvegarder */}
          <AnimateIn delay={0.25}>
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 w-full sm:w-auto justify-center"
                disabled={isSaving}
              >
                <Save size={16} />
                {isSaving ? "Sauvegarde..." : "Sauvegarder les paramètres"}
              </Button>
            </div>
          </AnimateIn>
        </>
      )}
    </div>
  );
}

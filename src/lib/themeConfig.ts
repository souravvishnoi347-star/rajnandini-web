export interface ThemeConfig {
  announcement: {
    enabled: boolean;
    text: string;
    secondaryText: string;
    bgColor: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    description: string;
    primaryBtnText: string;
    primaryBtnLink: string;
    secondaryBtnText: string;
    secondaryBtnLink: string;
    modelImage1: string;
    modelImage2: string;
    modelImage3: string;
  };
  trustStrip: {
    item1: string;
    item2: string;
    item3: string;
    item4: string;
  };
  sections: {
    section1Tag: string;
    section1Title: string;
    section2Tag: string;
    section2Title: string;
  };
  offers: {
    banner1Text: string;
    banner2Text: string;
  };
  branding: {
    primaryColor: string;
  };
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  announcement: {
    enabled: true,
    text: "✨ FESTIVE & BRIDAL WEDDING SALE: FLAT 50% OFF ON SELECTED LEHENGAS",
    secondaryText: "🚚 FREE SHIPPING ACROSS INDIA • CASH ON DELIVERY AVAILABLE",
    bgColor: "#a81c24",
  },
  hero: {
    badge: "Festive & Bridal '26 Collection",
    headline: "Royal Ethnic Wear",
    subheadline: "Rajnandini Haridwar",
    description: "Kurtis, Kurti Sets, Pure Sarees, Regal Lehengas, Purses & Handcrafted Jutis.",
    primaryBtnText: "SHOP FIRST ARRIVAL",
    primaryBtnLink: "/products/rani-pink-embroidered-flared-anarkali-suit-set-with-dupatta-rj-suit-001",
    secondaryBtnText: "EXPLORE KURTI SETS",
    secondaryBtnLink: "/collections/kurti-sets",
    modelImage1: "/products/lancha.png",
    modelImage2: "/products/product 1.png",
    modelImage3: "/products/one piece dress.png",
  },
  trustStrip: {
    item1: "FREE SHIPPING ALL OVER INDIA",
    item2: "100% PURE FABRIC ASSURANCE",
    item3: "CUSTOM BLOUSE & FALL-PICO",
    item4: "7 DAYS EASY EXCHANGE",
  },
  sections: {
    section1Tag: "FESTIVE & EVERYDAY WEAR",
    section1Title: "KURTIS, ANARKALI SUIT SETS & SHARARAS",
    section2Tag: "DEV BHOOMI HARIDWAR WEAVES",
    section2Title: "ROYAL BRIDAL LEHENGAS & PURE BANARASI SAREES",
  },
  offers: {
    banner1Text: "BUY 2 AT ₹1999",
    banner2Text: "BUY 3 AT ₹2499",
  },
  branding: {
    primaryColor: "#a81c24",
  },
};

const THEME_STORAGE_KEY = "rajnandini_theme_config";

export const ThemeService = {
  getTheme(): ThemeConfig {
    if (typeof window === "undefined") return DEFAULT_THEME_CONFIG;
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_THEME_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn("Could not load theme config:", e);
    }
    return DEFAULT_THEME_CONFIG;
  },

  saveTheme(config: Partial<ThemeConfig>): void {
    if (typeof window === "undefined") return;
    const current = this.getTheme();
    const merged = { ...current, ...config };
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event("rajnandini_theme_updated"));
  },

  resetTheme(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(THEME_STORAGE_KEY);
    window.dispatchEvent(new Event("rajnandini_theme_updated"));
  },
};

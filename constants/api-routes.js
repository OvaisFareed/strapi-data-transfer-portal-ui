export const localAPIRoutes = {
    CREATE: '/api/strapi/create/?path=',
    CREATE_MANY: '/api/strapi/create-many/?path=',
    DELETE_MANY: '/api/strapi/delete-many/?path=',
    DELETE_ALL_MEDIA: '/api/strapi/delete-all-media/?path=',
    GET: '/api/strapi/get/?path=',
    UPDATE: '/api/strapi/update/?path=',
    UPDATE_MEDIA_INFO: '/api/strapi/update-media-info/?path=',
    UPLOAD: '/api/strapi/upload/?path=',
}

export const mediaAPIRoutes = {
    GET: "/upload/files",
    POST: "/upload",
}

export const strapiAPIRoutesForCollections = {
    ARTICLE_SLIDES: "/articles-slides",
    ARTICLES: "/articles",
    BANNERS: "/banners",
    BLOGS: "/blogs",
    BOARDS: "/boards",
    BUTTONS: '/buttons',
    CHECKLISTS: "/checklists",
    CONTACT_CARD: "/contact-cards",
    COUNTRY_LIST: "/country-lists",
    CURRENCY_BUFFERS: "/currency-buffers",
    CURRENCY_CHARTS: "/currency-charts",
    CURRENCY_CHART_CONFIG: "/currency-chart-configs",
    CURRENCY_DROPDOWN: "/currency-dropdowns",
    CURRENCY_LIST: "/currency-lists",
    ECONOMIC_EVENT_LOGS: "/economic-events-logs",
    ECONOMIC_EVENT_WITH_DATE: "/economic-events-with-dates",
    FAQs: "/faqs",
    FAQ_KEY: "/faq-keys",
    FX_DAILY: "/fx-dailies",
    FX_ECONOMIC_TABLE: "/fx-daily-economic-tables",
    FX_FORECAST_TABLE: "/fx-forecast-tables",
    FX_MARKET_UPDATE: "/fx-daily-market-updates",
    FX_RATES_TABLE: "/fx-daily-rates-tables",
    FX_SECTIONS: "/fx-sections",
    FX_TRADING_TABLE: "/fx-daily-trading-tables",
    FX_WEEKLY: "/fx-weeklies",
    GLOBAL_PAYMENT_TAB_CONTENT: "/tab-contents",
    HOW_IT_WORKS: "/how-it-works",
    IMAGE_SECTION: "/image-sections",
    INSDUSTRY_SOLUTIONS: "/industry-solution-posts",
    JOB_OPENINGS: "/job-postings",
    LANDING_PAGES: "/landing-pages",
    LANDING_PAGE_HEADER: "/landing-page-headers",
    LANDING_PAGE_WIDGET: "/landing-page-widgets",
    LET_US_WATCH: "/let-us-watches",
    MTFX_FEATURE: "/mtfx-features",
    MTFX_FEES: "/mtfx-fees",
    NAV_MENU_ITEMS: "/nav-menu-items",
    NEWSLETTERS: "/newsletters",
    REGULATORY_INFORMATION_TAB_CONTENT: "/regulatory-information-tab-contents",
    RISK_MANAGEMENT_TABS: "/risk-management-tabs",
    STYLES: "/styles",
    TAB_ITEMS: "/tab-items",
    TABLE_CONTENT: "/table-contents",
    TESTIMONIALS: "/testimonials",
    TESTING: "/testings",
    TESTING_LOGS: "/testing-logs",
    TOOLS: "/tools",
};

export const strapiAPIRoutesForSingleTypes = {
    ABOUT_US: "/about-us",
    BATCH_PAYMENTS: "/batch-payment",
    BLOG_PRESSROOM: "/blog-and-press-room",
    BLOGS: "/bp-blog",
    BLOGS_CSS: "/blogs-css",
    BUSINESS: "/business",
    BUSINESS_LAYOUT: "/layout",
    CAREER: "/career",
    COMPARE_CHART: "/compare-chart",
    COOKIE_POLICY: "/cookie-policy",
    CURRENCY_CONVERSION: "/currency-conversion",
    CURRENCY_UPDATE: "/currency-update",
    CUSTOMER_TESTIMONIAL: "/customer-testimonial",
    DAILY_ECONOMIC_TABLE: "/daily-economic-table",
    DAILY_MARKET_UPDATE_TABLE: "/daily-market-update-table",
    DAILY_TRADING_TABLE: "/daily-trading-table",
    E_SIGN_CONSENT_AGREEMENT: "/e-sign-consent-agreement",
    DEFAULT_CURRENCY_CODE: "/default-currency-code",
    FAQ_PAGE: "/faq-page",
    FORWARD_CONTRACT: "/forward-contract",
    FX_DAILY_PAGE: "/fx-daily-page",
    FX_DAILY_UPDATE: "/fx-daily-update",
    FX_DAILY_V3: "/fx-daily-v3",
    FX_FORECAST: "/cu-fx-forecast",
    FX_FORECAST_V2: "/fx-forecast-v2",
    FX_MONTHLY: "/cu-fx-monthly",
    FX_MONTHLY_CAD: "/fx-monthly-v3",
    FX_MONTHLY_US: "/fx-monthly-us",
    FX_MONTHLY_V2: "/fx-monthly-v2",
    FX_PAYMENT: "/fx-payment",
    FX_WEEKLY_PAGE: "/fx-weekly-page",
    GLOBAL_PAYMENT_SOLUTION: "/global-payment-solution",
    GLOBAL_CSS: "/global-css",
    HOME_V2: "/home-v2",
    HOME: "/main",
    INCOMING_PAYMENT: "/incoming-payment",
    INTERNATIONAL_PAYMENT: "/international-payment",
    INSDUSTRY_SOLUTION: "/industry-solution",
    IS_LEGAL: "/is-legal",
    IS_MEDICAL: "/is-medical",
    IS_MINIG: "/is-mining",
    IS_ONLINE_SELLER: "/is-online-seller",
    IS_TECHNOLOGY_COMPANY: "/is-technology-company",
    IS_TRAVEL: "/is-travel",
    LIVE_CURRENCY_RATE_PAIR: "/live-currency-rate-pair",
    LIVE_EXCHANGE_RATES_DEFAULT: "/live-exchange-rates-default",
    MAIN: "/main",
    MAIN_FOOTER_V2: "/main-footer-v2",
    MAIN_FOOTER: "/main-footer",
    MARKET_ORDER: "/market-order",
    MEDIUM_BUSINESS: "/medium-business",
    MULTI_CURRENCY_ACCOUNT: "/multi-currency-account",
    MULTINATIONAL: "/multinational",
    ONLINE_SELLER: "/online-seller",
    PARTNER_WITH_US: "/partner-with-us",
    POST_LAYOUT: "/post-layout",
    PRESS_ROOM: "/bp-pressroom",
    PRIVACY_POLICY: "/privacy-policy",
    REGULATORY_INFORMATION: "/regulatory-information",
    RISK_MANAGEMENT: "/risk-management",
    SAFE_HARBOR_POLICY: "/safe-harbor-policy",
    SITE_CONFIG: "/site-config",
    SITE_MAP: "/site-map",
    SMALL_BUSINESS: "/small-business",
    TERMS_OF_USE: "/terms-of-use",
    TEST: "/test",
    TEST_CSS: "/test-html",
    TOOLS_INDEX: "/tools-index",
    TOOLS_CURRENCY_RATE_ALERT: "/tools-currency-rate-alert",
    TOOLS_CURRENCY_CHART: "/tools-currency-chart",
    TOOLS_DAILY_EXCHANGE_RATE_LOOKUP: "/tools-daily-exchange-rate-lookup",
    TOOLS_ECONOMIC_CALENDAR: "/tools-economic-calendar",
    TOOLS_FX_MARKET_UPDATE: "/tools-fx-market-update",
    TOOLS_HISTORICAL_RATE: "/tools-historical-rate",
    TOOLS_LIVE_EXCHANGE_RATE: "/tools-live-exchange-rate",
    TOOLS_RATE_CALCULATOR: "/tools-rate-calculator",
    TOP_BANNER: "/top-banner",
    TRANSFER_MONEY: "/transfer-money",
}

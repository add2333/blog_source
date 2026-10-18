export const languages = ["en", "zh"] as const;
export type Lang = (typeof languages)[number];

export const defaultLang: Lang = "en";

/** UI strings. Post titles and bodies stay in whatever language you wrote them. */
export const ui = {
  en: {
    home: "Home",
    blog: "Blog",
    tags: "Tags",
    categories: "Categories",
    about: "About",
    search: "Search",
    contents: "Contents",
    authors: "Authors",
    affiliations: "Affiliations",
    published: "Published",
    updated: "Updated",
    readingTime: "Reading time",
    minutes: "{n} min",
    minRead: "{n} min read",
    allPosts: "← All posts",
    recentPosts: "Recent posts",
    heroLede: "Notes on LaTeX, machine learning and everything I keep forgetting.",
    heroReadBlog: "Read the blog",
    heroAboutMe: "About me",
    searchPlaceholder: "Search posts…",
    searchNoscript: "Search needs JavaScript. You can also browse",
    builtWith: "Built with",
    sitemap: "Sitemap",
    notFoundBlurb: "That page has moved or never existed.",
    toggleTheme: "Toggle colour theme",
    toggleContents: "Collapse or expand the table of contents",
    switchLanguage: "Switch language",
  },
  zh: {
    home: "首页",
    blog: "文章",
    tags: "标签",
    categories: "分类",
    about: "关于",
    search: "搜索",
    contents: "目录",
    authors: "作者",
    affiliations: "单位",
    published: "发布于",
    updated: "更新于",
    readingTime: "阅读时长",
    minutes: "{n} 分钟",
    minRead: "约 {n} 分钟",
    allPosts: "← 全部文章",
    recentPosts: "最新文章",
    heroLede: "关于我总在忘记的一切。",
    heroReadBlog: "阅读文章",
    heroAboutMe: "关于我",
    searchPlaceholder: "搜索文章…",
    searchNoscript: "搜索需要 JavaScript，也可以直接浏览",
    builtWith: "基于",
    sitemap: "站点地图",
    notFoundBlurb: "这个页面不存在，或者已经搬家了。",
    toggleTheme: "切换明暗主题",
    toggleContents: "收起或展开目录",
    switchLanguage: "切换语言",
  },
} satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof (typeof ui)["en"];

/** Fills `{name}` placeholders, e.g. t("zh", "minRead", { n: 3 }). */
export function t(lang: Lang, key: UIKey, values: Record<string, string | number> = {}): string {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    ui[lang][key],
  );
}

/** Both languages at once, for the <Lang> component (pure CSS switching). */
export function both(key: UIKey, values: Record<string, string | number> = {}) {
  return { en: t("en", key, values), zh: t("zh", key, values) };
}

// services/newsApi.ts

export type NewsApiArticle = {
  title: string;
  url: string;
  publishedAt: string;
  urlToImage: string;
  source: {
    name: string;
  };
}

export type NewsArticle = {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
};

export default async function fetchNews(): Promise<NewsArticle[]> {
  try {
    // Set revalidate option to 86400 seconds (24 hours)
    const res = await fetch(`https://newsapi.org/v2/top-headlines?category=business&apiKey=${process.env.NEWS_API_KEY}`, {
      next: {
        revalidate: 86400, // Revalidate every 24 hours (60 * 60 * 24)
      },
    });

    if (!res.ok) {
      throw new Error(`News API error: ${res.status}`);
    }

    const data: { articles: NewsApiArticle[] } = await res.json();

    return data.articles.map((article) => ({
      title: article.title,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      imageUrl: article.urlToImage
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}
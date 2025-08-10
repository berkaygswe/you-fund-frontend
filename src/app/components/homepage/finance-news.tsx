import fetchNews from "@/services/newsApi";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, Building2, TrendingUp, ImageIcon, ArrowUpRight } from "lucide-react";
import NewsImage from "./news-image";

export default async function FinanceNews() {
  const articles = await fetchNews();

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return publishedDate.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
          <p className="text-muted-foreground mb-2">No finance news available</p>
          <p className="text-sm text-muted-foreground">Please check back later</p>
        </div>
      ) : (
        <>
          {/* Featured Article */}
          {articles.length > 0 && (
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">Featured</span>
              </div>
              <article className="group cursor-pointer">
                <a
                  href={articles[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block space-y-4 p-6 rounded-xl border hover:bg-muted/50 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex gap-6">
                    {/* Image Section */}
                    <div className="flex-shrink-0">
                      {articles[0].imageUrl ? (
                        <NewsImage 
                          src={articles[0].imageUrl}
                          alt={articles[0].title}
                          className="w-32 h-24 sm:w-40 sm:h-28 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-32 h-24 sm:w-40 sm:h-28 rounded-lg bg-muted flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-3 text-lg">
                          {articles[0].title}
                        </h3>
                        <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate max-w-[120px]">{articles[0].source}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(articles[0].publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </article>
            </div>
          )}

          {/* Recent Articles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Recent News</h3>
              <Badge variant="secondary" className="text-xs">
                {articles.length - 1} more
              </Badge>
            </div>
            
            <div className="space-y-3">
              {articles.slice(1, 7).map((article, index) => (
                <article key={index} className="group cursor-pointer">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block space-y-3 p-4 rounded-lg hover:bg-muted/50 transition-all duration-200"
                  >
                    <div className="flex gap-4">
                      {/* Image Section */}
                      <div className="flex-shrink-0">
                        {article.imageUrl ? (
                          <NewsImage 
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-20 h-16 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-20 h-16 rounded-md bg-muted flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content Section */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2 text-sm">
                            {article.title}
                          </h4>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span className="truncate max-w-[100px]">{article.source}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(article.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>

          {/* View All Button */}
          <div className="pt-2">
            <button className="w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border rounded-lg hover:bg-muted/50">
              <span>View All Financial News</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
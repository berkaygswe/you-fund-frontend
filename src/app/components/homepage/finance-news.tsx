import fetchNews from "@/services/newsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Clock, Building2, TrendingUp, ImageIcon } from "lucide-react";
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
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <CardTitle className="text-xl font-bold">Finance News</CardTitle>
          <Badge variant="secondary" className="ml-auto">
            {articles.length} articles
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {articles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No finance news available at the moment.</p>
          </div>
        ) : (
          articles.map((article, index) => (
            <div key={index}>
              <article className="group cursor-pointer">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block space-y-3 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Image Section */}
                    <div className="flex-shrink-0">
                      {article.imageUrl ? (
                        <NewsImage 
                          src={article.imageUrl}
                          alt={article.title}
                        />
                      ) : (
                        <div className="w-24 h-16 sm:w-32 sm:h-20 rounded-md bg-muted flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-medium leading-tight group-hover:text-primary transition-colors line-clamp-3">
                          {article.title}
                        </h3>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate max-w-[120px]">{article.source}</span>
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
              {index < articles.length - 1 && <Separator className="my-2" />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
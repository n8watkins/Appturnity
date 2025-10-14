export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | React.ComponentType; // Allow both markdown strings and MDX components
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  featured?: boolean;
}
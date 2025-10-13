import Post1MDX, { frontmatter as post1Meta } from './post-1.mdx';
import Post2MDX, { frontmatter as post2Meta } from './post-2.mdx';
import post3 from './post-3';
import post4 from './post-4';
import post5 from './post-5';
import post6 from './post-6';
import Post7MDX, { frontmatter as post7Meta } from './post-7.mdx';
import post8 from './post-8';
import post9 from './post-9';
import post10 from './post-10';

// Convert MDX posts to BlogPost format
const post1 = {
  ...post1Meta,
  content: Post1MDX,
  featured: post1Meta.featured || false,
};

const post2 = {
  ...post2Meta,
  content: Post2MDX,
  featured: post2Meta.featured || false,
};

const post7 = {
  ...post7Meta,
  content: Post7MDX,
  featured: post7Meta.featured || false,
};

// Export all posts as an array
export const allBlogPosts = [
  post1,
  post2,
  post3,
  post4,
  post5,
  post6,
  post7,
  post8,
  post9,
  post10
];

// Re-export the BlogPost type for convenience
export type { BlogPost } from './types';

// Helper functions for working with blog posts
export function getBlogPostBySlug(slug: string) {
  return allBlogPosts.find(post => post.slug === slug);
}

export function getBlogPostsByCategory(category: string) {
  return allBlogPosts.filter(post => post.category === category);
}

export function getBlogPostsByTag(tag: string) {
  return allBlogPosts.filter(post => post.tags.includes(tag));
}

export function getAllCategories(): string[] {
  return Array.from(new Set(allBlogPosts.map(post => post.category)));
}

export function getAllTags(): string[] {
  const tags = allBlogPosts.flatMap(post => post.tags);
  return Array.from(new Set(tags));
}
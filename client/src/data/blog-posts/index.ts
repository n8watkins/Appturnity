// Temporarily using .ts files instead of MDX to test
import post1 from "./post-1";
import post2 from "./post-2";
import post3 from "./post-3";
import post4 from "./post-4";
import post5 from "./post-5";
import post6 from "./post-6";
import post7 from "./post-7";
import post8 from "./post-8";
import post9 from "./post-9";
import post10 from "./post-10";

// Export all posts as an array
export const allBlogPosts = [post1, post2, post3, post4, post5, post6, post7, post8, post9, post10];

// Re-export the BlogPost type for convenience
export type { BlogPost } from "./types";

// Helper functions for working with blog posts
export function getBlogPostBySlug(slug: string) {
  return allBlogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: string) {
  return allBlogPosts.filter((post) => post.category === category);
}

export function getBlogPostsByTag(tag: string) {
  return allBlogPosts.filter((post) => post.tags.includes(tag));
}

export function getAllCategories(): string[] {
  return Array.from(new Set(allBlogPosts.map((post) => post.category)));
}

export function getAllTags(): string[] {
  const tags = allBlogPosts.flatMap((post) => post.tags);
  return Array.from(new Set(tags));
}

import { BlogMetadata } from "./blogMetadata";
import type { ComponentType } from "react";

export interface BlogPost extends BlogMetadata {
  content: string | ComponentType;
}

// Map of blog post IDs to their lazy-loaded content
const blogContentCache = new Map<string, BlogPost>();

// Dynamically import blog content when needed
export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
  // Check cache first
  const cached = Array.from(blogContentCache.values()).find((post) => post.slug === slug);
  if (cached) return cached;

  try {
    // Dynamically import the full blog posts data
    const { allBlogPosts } = await import("./blog-posts");
    const post = allBlogPosts.find((p) => p.slug === slug);

    if (post) {
      blogContentCache.set(post.id, post);
      return post;
    }

    return null;
  } catch (error) {
    console.debug("Error loading blog post:", error);
    return null;
  }
}

// Load multiple posts (for related posts)
export async function loadBlogPosts(slugs: string[]): Promise<BlogPost[]> {
  const posts = await Promise.all(slugs.map((slug) => loadBlogPost(slug)));
  return posts.filter((post): post is BlogPost => post !== null);
}

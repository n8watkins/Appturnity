import { useState, useMemo, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ArrowLeft, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';
import { getMetadataBySlug, blogMetadata } from '@/data/blogMetadata';
import { loadBlogPost, BlogPost as BlogPostType } from '@/data/blogLoader';
import { Button } from '@/components/ui/button';
import BlogContent from '@/components/BlogContent';
import { formatBlogDate } from '@/lib/dateUtils';
import LazyImage from '@/components/LazyImage';
import ReadingProgress from '@/components/ReadingProgress';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function BlogPost() {
  const [, params] = useRoute('/blog/:slug');
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const metadata = params?.slug ? getMetadataBySlug(params.slug) : null;

  // Load post content dynamically
  useEffect(() => {
    if (params?.slug) {
      setLoading(true);
      loadBlogPost(params.slug).then(loadedPost => {
        setPost(loadedPost);
        setLoading(false);
      });
    }
  }, [params?.slug]);

  // Optimized related posts algorithm with scoring and memoization
  const relatedPosts = useMemo(() => {
    if (!post) return [];

    return blogMetadata
      .filter(p => p.id !== post.id)
      .map(p => {
        let score = 0;
        // Category match is worth 3 points
        if (p.category === post.category) score += 3;
        // Each matching tag is worth 1 point
        score += p.tags.filter(tag => post.tags.includes(tag)).length;
        return { post: p, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ post }) => post);
  }, [post]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-lg text-slate-600">Loading article...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Helmet>
          <title>Article Not Found | Appturnity</title>
          <meta name="description" content="This article could not be found. Browse our blog for other helpful content." />
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Article Not Found</h1>
          <p className="text-lg text-slate-600 mb-8">
            Sorry, we couldn't find the article you're looking for.
          </p>
          <Link href="/blog">
            <a>
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/blog/${post.slug}`;
  const shareText = post.title;

  // Helper to check if content is string (markdown) or component (MDX)
  const contentIsString = typeof post.content === 'string';
  const contentString = contentIsString ? post.content : '';

  // Schema.org structured data for article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.seoDescription,
    "image": post.image,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization",
      "name": post.author,
      "url": window.location.origin
    },
    "publisher": {
      "@type": "Organization",
      "name": "Appturnity",
      "url": window.location.origin,
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.svg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": shareUrl
    },
    "keywords": post.seoKeywords.join(", "),
    "articleSection": post.category,
    "wordCount": contentIsString ? contentString.split(/\s+/).length : 0
  };

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgress />
      <Helmet>
        <title>{post.seoTitle} | Appturnity</title>
        <meta name="description" content={post.seoDescription} />
        <meta name="keywords" content={post.seoKeywords.join(', ')} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:title" content={post.seoTitle} />
        <meta property="og:description" content={post.seoDescription} />
        <meta property="og:image" content={post.image} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={shareUrl} />
        <meta name="twitter:title" content={post.seoTitle} />
        <meta name="twitter:description" content={post.seoDescription} />
        <meta name="twitter:image" content={post.image} />

        {/* Canonical URL */}
        <link rel="canonical" href={shareUrl} />

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      {/* Simple Header with Appturnity Branding */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/blog">
              <a className="inline-flex items-center gap-3 text-slate-600 hover:text-primary transition-colors text-sm font-medium">
                <ArrowLeft className="h-4 w-4" />
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">Appturnity</span>
                  <span>Blog</span>
                </div>
              </a>
            </Link>
            <Link href="/">
              <a className="text-sm text-slate-600 hover:text-primary transition-colors">
                Visit Appturnity.com
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-12 pb-8 border-b border-slate-200"
        >
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatBlogDate(post.date)}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
            <span>·</span>
            <span>By {post.author}</span>
          </div>
        </motion.header>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="my-12"
        >
          <LazyImage
            src={post.image}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-2xl shadow-lg"
          />
        </motion.div>

        {/* Main Content Grid with Sidebars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Left Sidebar - Sticky */}
          <aside className="lg:col-span-2 space-y-6">
            <div className="sticky top-24">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-xl p-4 mb-6"
              >
                <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📊</span> Quick Stats
                </h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-slate-500">Read Time:</span>
                    <span className="block text-lg font-bold text-primary">{post.readTime}</span>
                  </div>
                  {contentIsString && (
                    <div className="text-sm">
                      <span className="text-slate-500">Words:</span>
                      <span className="block text-lg font-bold text-primary">
                        {contentString.split(/\s+/).length.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="text-slate-500">Category:</span>
                    <span className="block text-lg font-bold text-primary">{post.category}</span>
                  </div>
                </div>
              </motion.div>

              {/* Table of Contents - Only for markdown posts */}
              {contentIsString && contentString.match(/^## .+$/gm) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
                >
                  <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📝</span> Contents
                  </h3>
                  <nav className="space-y-1">
                    {contentString.match(/^## .+$/gm)?.slice(0, 5).map((heading, idx) => (
                      <a
                        key={idx}
                        href={`#${heading.slice(3).toLowerCase().replace(/\s+/g, '-')}`}
                        className="block text-sm text-slate-600 hover:text-primary hover:pl-2 transition-all py-1"
                      >
                        {heading.slice(3)}
                      </a>
                    ))}
                  </nav>
                </motion.div>
              )}
            </div>
          </aside>

          {/* Main Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-8"
          >
            <BlogContent content={post.content} />
          </motion.div>

          {/* Right Sidebar - Sticky */}
          <aside className="lg:col-span-2 space-y-6">
            <div className="sticky top-24">
              {/* Key Takeaways */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 mb-6"
              >
                <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span> Key Points
                </h3>
                <ul className="space-y-2">
                  <li className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Save thousands yearly</span>
                  </li>
                  <li className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Own your assets</span>
                  </li>
                  <li className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>No platform limits</span>
                  </li>
                </ul>
              </motion.div>

              {/* Social Share Floating */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
              >
                <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🚀</span> Share
                </h3>
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-lg transition-colors text-sm font-medium"
                  >
                    <Twitter className="h-4 w-4" />
                    Tweet
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] rounded-lg transition-colors text-sm font-medium"
                  >
                    <Linkedin className="h-4 w-4" />
                    Share
                  </a>
                </div>
              </motion.div>

              {/* Quick Action */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-4 text-white"
              >
                <h3 className="font-bold text-sm mb-2">Ready to save?</h3>
                <p className="text-xs mb-3 text-white/90">
                  Calculate your savings vs website builders
                </p>
                <Link href="/#pricing">
                  <a>
                    <Button size="sm" variant="secondary" className="w-full bg-white text-primary hover:bg-white/90">
                      Calculate →
                    </Button>
                  </a>
                </Link>
              </motion.div>
            </div>
          </aside>
        </div>

        {/* Tags Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-slate-200"
        >
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Tagged in</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link key={tag} href="/blog">
                <a className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm font-medium transition-colors">
                  <Tag className="h-3.5 w-3.5" />
                  {tag}
                </a>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 pt-8 border-t border-slate-200"
        >
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Share this article</h3>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077B5] hover:bg-[#006399] text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </a>
          </div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <NewsletterSignup />
        </motion.div>

        {/* Appturnity CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 p-8 bg-gradient-to-br from-primary to-blue-600 rounded-2xl shadow-lg"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-white/20 rounded-full">
              <span className="text-white font-bold">Appturnity</span>
              <span className="text-white/80">Custom Development</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Ready to Build Your Custom Website?</h3>
            <p className="text-white/90 mb-6 text-lg">
              Join hundreds of businesses who chose Appturnity over expensive monthly subscriptions.
              Calculate how much you can save with a custom website.
            </p>
            <Link href="/#pricing">
              <a>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90 font-semibold"
                >
                  Calculate Your Savings with Appturnity →
                </Button>
              </a>
            </Link>
          </div>
        </motion.div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 py-16 mt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="max-w-7xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 text-center">
                Continue Reading
              </h2>
              <p className="text-center text-slate-600 mb-10">
                More insights from the <span className="font-semibold text-primary">Appturnity</span> blog
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map(relatedPost => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <a className="group block bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                      <LazyImage
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="aspect-video group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-6">
                        <span className="inline-block mb-3 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                          {relatedPost.category}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-slate-600 line-clamp-3">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}

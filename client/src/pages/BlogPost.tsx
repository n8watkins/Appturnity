import { useState, useMemo, useEffect, lazy, Suspense } from "react";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, ArrowLeft, Share2, Linkedin, Facebook, X } from "lucide-react";
import { getMetadataBySlug, blogMetadata } from "@/data/blogMetadata";
import { loadBlogPost, BlogPost as BlogPostType } from "@/data/blogLoader";
import { Button } from "@/components/ui/button";
import BlogContent from "@/components/BlogContent";
import { formatBlogDate } from "@/lib/dateUtils";
import LazyImage from "@/components/LazyImage";
import ReadingProgress from "@/components/ReadingProgress";
import NewsletterSignup from "@/components/NewsletterSignup";
import TopBanner from "@/components/TopBanner";
import BlogNavbar from "@/components/BlogNavbar";
import Footer from "@/components/Footer";

const ChatWidget = lazy(() => import("@/components/ChatWidget"));

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStickyTitle, setShowStickyTitle] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const metadata = params?.slug ? getMetadataBySlug(params.slug) : null;

  // Load post content dynamically
  useEffect(() => {
    if (params?.slug) {
      setLoading(true);
      loadBlogPost(params.slug).then((loadedPost) => {
        setPost(loadedPost);
        setLoading(false);
      });
    }
  }, [params?.slug]);

  // Scroll listener for sticky title and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      // Handle sticky title
      const articleHeader = document.getElementById("article-header");
      if (articleHeader) {
        const headerBottom = articleHeader.getBoundingClientRect().bottom;
        setShowStickyTitle(headerBottom < 80); // Show when article header goes above navbar
      }

      // Handle active section tracking for table of contents
      if (typeof post?.content === "string") {
        const headings = post.content.match(/^## .+$/gm);
        if (headings) {
          const headingElements = headings
            .map((heading) => {
              const text = heading.slice(3);
              const id = text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
              const element = document.getElementById(id);
              if (element) {
                const rect = element.getBoundingClientRect();
                return { id, top: rect.top };
              }
              return null;
            })
            .filter(Boolean);

          // Find the section that's currently in view (closest to top of viewport)
          const activeElement = headingElements.find((el) => el && el.top > 0 && el.top < 300);
          if (activeElement) {
            setActiveSection(activeElement.id);
          } else if (headingElements.length > 0) {
            // If scrolled past all sections, highlight the last one
            const lastVisible = headingElements.filter((el) => el && el.top < 300).pop();
            if (lastVisible) {
              setActiveSection(lastVisible.id);
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post]);

  // Optimized related posts algorithm with scoring and memoization
  const relatedPosts = useMemo(() => {
    if (!post) return [];

    return blogMetadata
      .filter((p) => p.id !== post.id)
      .map((p) => {
        let score = 0;
        // Category match is worth 3 points
        if (p.category === post.category) score += 3;
        // Each matching tag is worth 1 point
        score += p.tags.filter((tag) => post.tags.includes(tag)).length;
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
          <meta
            name="description"
            content="This article could not be found. Browse our blog for other helpful content."
          />
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
  const contentIsString = typeof post.content === "string";
  const contentString = contentIsString ? post.content : "";

  // Schema.org structured data for article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
      url: window.location.origin,
    },
    publisher: {
      "@type": "Organization",
      name: "Appturnity",
      url: window.location.origin,
      logo: {
        "@type": "ImageObject",
        url: `${window.location.origin}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": shareUrl,
    },
    keywords: post.seoKeywords.join(", "),
    articleSection: post.category,
    wordCount:
      contentIsString && typeof contentString === "string" ? contentString.split(/\s+/).length : 0,
  };

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgress />
      <Helmet>
        <title>{post.seoTitle} | Appturnity</title>
        <meta name="description" content={post.seoDescription} />
        <meta name="keywords" content={post.seoKeywords.join(", ")} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:title" content={post.seoTitle} />
        <meta property="og:description" content={post.seoDescription} />
        <meta property="og:image" content={post.image} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        {post.tags.map((tag) => (
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
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      {/* Top Banner */}
      <TopBanner />

      {/* Blog Navbar */}
      <BlogNavbar />

      {/* Sticky Title Bar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: showStickyTitle ? 0 : -100, opacity: showStickyTitle ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-lg"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <span className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-bold flex-shrink-0">
                {post.category}
              </span>
              <h2 className="text-base md:text-lg font-bold text-slate-900 truncate">
                {post.title}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 flex-shrink-0">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{post.readTime}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Article Header */}
      <article className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.header
          id="article-header"
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
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8">{post.excerpt}</p>

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
          className="my-8 max-w-4xl mx-auto"
        >
          <LazyImage
            src={post.image}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-xl shadow-lg max-h-[450px]"
          />
        </motion.div>

        {/* Main Content Grid with Sidebars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Left Sidebar - Sticky */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="sticky top-40">
              {/* Table of Contents - Only for markdown posts */}
              {contentIsString &&
                typeof contentString === "string" &&
                contentString.match(/^## .+$/gm) && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-xl text-slate-900 mb-5 flex items-center gap-2">
                      <span className="text-primary text-2xl">≡</span>
                      Table of Contents
                    </h3>
                    <nav className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                      {contentString.match(/^## .+$/gm)?.map((heading: string, idx: number) => {
                        const text = heading.slice(3);
                        const id = text
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "");
                        const isActive = activeSection === id;
                        return (
                          <a
                            key={idx}
                            href={`#${id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById(id)?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }}
                            className={`block text-base transition-all py-2.5 px-3 rounded-lg border-l-3 leading-snug ${
                              isActive
                                ? "text-primary bg-blue-50 pl-4 border-primary font-semibold"
                                : "text-slate-600 hover:text-primary hover:bg-blue-50/50 hover:pl-4 border-transparent hover:border-primary"
                            }`}
                          >
                            {text}
                          </a>
                        );
                      })}
                    </nav>
                  </div>
                )}
            </div>
          </aside>

          {/* Main Article Content */}
          <div className="lg:col-span-6">
            <BlogContent content={post.content} />
          </div>

          {/* Right Sidebar - Sticky */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="sticky top-40 space-y-5">
              {/* Social Share */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Share Article</h3>
                <div className="flex gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center p-3 bg-black hover:bg-black/90 text-white rounded-lg transition-all hover:scale-105"
                    aria-label="Share on X"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center p-3 bg-[#0A66C2] hover:bg-[#095196] text-white rounded-lg transition-all hover:scale-105"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center p-3 bg-[#0866FF] hover:bg-[#0654CC] text-white rounded-lg transition-all hover:scale-105"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-primary/10 to-blue-50 rounded-xl shadow-sm border border-primary/20 p-6">
                <h3 className="font-bold text-lg text-slate-900 mb-2">Get Updates</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Subscribe to our newsletter for the latest articles and insights
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Quick Action */}
              <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">Ready to Get Started?</h3>
                <p className="text-sm mb-4 text-white/90 leading-relaxed">
                  Calculate your savings with a custom website
                </p>
                <Link href="/#pricing">
                  <a>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full bg-white text-primary hover:bg-white/90 font-semibold py-2.5"
                    >
                      View Pricing
                    </Button>
                  </a>
                </Link>
              </div>
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
            {post.tags.map((tag) => (
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
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-black hover:bg-black/90 text-white rounded-lg transition-all hover:scale-105 text-sm font-medium"
            aria-label="Share on X"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>
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
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Build Your Custom Website?
            </h3>
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
                  Calculate Your Savings with Appturnity
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
                More insights from the{" "}
                <span className="font-semibold text-primary">Appturnity</span> blog
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
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
                        <p className="text-slate-600 line-clamp-3">{relatedPost.excerpt}</p>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />

      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </div>
  );
}

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Calendar, Clock, Tag, Search, ArrowRight } from 'lucide-react';
import { blogMetadata, getAllCategories, getAllTags } from '@/data/blogMetadata';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatBlogDate, formatBlogDateShort } from '@/lib/dateUtils';
import LazyImage from '@/components/LazyImage';
import NewsletterSignup from '@/components/NewsletterSignup';
import TopBanner from '@/components/TopBanner';
import BlogNavbar from '@/components/BlogNavbar';
import BlogFooter from '@/components/BlogFooter';

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const categories = ['All', ...getAllCategories()];
  const tags = getAllTags();

  // Filter posts based on search, category, and tag
  const filteredPosts = useMemo(() => {
    return blogMetadata.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [searchQuery, selectedCategory, selectedTag]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedTag]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const featuredPost = blogMetadata.find(post => post.featured) || blogMetadata[0];

  // Pagination helpers
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Top Banner */}
      <TopBanner />
      {/* Blog Navbar */}
      <BlogNavbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Appturnity Blog Branding */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-2xl font-bold text-primary">Appturnity</span>
              <span className="text-slate-600">Blog</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
              Web Development Insights & Resources
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              From <span className="font-semibold text-primary">Appturnity</span> — Expert guides, tutorials, and strategies to help you build better websites and grow your business online. Learn how to save money and own your digital presence.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-full border-2 border-slate-200 focus:border-primary"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12">
          {/* Main Content */}
          <div>
            {/* Featured Post */}
            {!searchQuery && !selectedTag && selectedCategory === 'All' && (
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Article</h2>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <a className="group block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <LazyImage
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="aspect-video group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatBlogDate(featuredPost.date)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {featuredPost.readTime}
                        </span>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                          {featuredPost.category}
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                        {featuredPost.title}
                      </h3>
                      <p className="text-lg text-slate-600 mb-6">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all">
                        Read Article
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </a>
                </Link>
              </motion.div>
            )}

            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex items-center gap-3 flex-wrap">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedTag('');
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            {(searchQuery || selectedTag || selectedCategory !== 'All') && (
              <div className="mb-6 text-slate-600">
                Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag('')}
                    className="ml-2 text-primary hover:underline"
                  >
                    Clear tag filter
                  </button>
                )}
              </div>
            )}

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {currentPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <a className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all h-full flex flex-col">
                      <LazyImage
                        src={post.image}
                        alt={post.title}
                        className="aspect-video group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center gap-3 mb-3 text-sm text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatBlogDateShort(post.date)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {post.readTime}
                          </span>
                        </div>
                        <span className="inline-block mb-3 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold w-fit">
                          {post.category}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 mb-4 line-clamp-3 flex-grow">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                            >
                              <Tag className="h-3 w-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all mt-auto">
                          Read More
                          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </a>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && filteredPosts.length > 0 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="disabled:opacity-50"
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    // Show ellipsis
                    const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                    const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                    if (showEllipsisBefore || showEllipsisAfter) {
                      return (
                        <span key={page} className="px-3 py-2 text-slate-400">
                          ...
                        </span>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        onClick={() => goToPage(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-slate-600 mb-4">No articles found matching your criteria.</p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedTag('');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Popular Tags */}
            <motion.div
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedTag === tag
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <NewsletterSignup variant="compact" />
            </motion.div>

            {/* CTA Card */}
            <motion.div
              className="bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg p-6 text-white"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-3">Ready to Build Your Website?</h3>
              <p className="text-white/90 mb-6">
                Get a custom website that you own, with no monthly fees. See how much you can save.
              </p>
              <Link href="/#pricing">
                <a>
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-primary hover:bg-white/90"
                  >
                    Calculate Your Savings →
                  </Button>
                </a>
              </Link>
            </motion.div>

            {/* Recent Articles */}
            <motion.div
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Articles</h3>
              <div className="space-y-4">
                {blogMetadata.slice(0, 5).map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <a className="block group">
                      <h4 className="font-medium text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <span className="text-xs text-slate-500">
                        {formatBlogDateShort(post.date)}
                      </span>
                    </a>
                  </Link>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Blog Footer */}
      <BlogFooter />
    </div>
  );
}

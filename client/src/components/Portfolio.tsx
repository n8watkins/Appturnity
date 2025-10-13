import { ExternalLink, Code } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string;
  features: string[];
  link: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "GuardCastAI",
    description:
      "An AI-powered security automation service designed to monitor, detect, and respond to threats in real time. Built with modern UI and seamless backend integrations.",
    image: "/guardcast.webp",
    features: ["Contact Forms", "SEO", "Mobile Responsive", "User Authentication", "Advanced Animations"],
    link: "https://guardcast-a4457.web.app/",
  },
  {
    id: 2,
    title: "Community Homepage",
    description:
      "A streamlined web application that automated business processes, saving the client 20+ hours per week.",
    image: "/riverwood.webp",
    features: ["Contact Forms", "SEO", "Mobile Responsive", "Analytics", "Blog Integration", "CRM"],
    link: "https://riverwoodranch.web.app/",
  },
];

const allFeatures = [
  "Contact Forms",
  "SEO",
  "Mobile Responsive",
  "User Authentication",
  "Advanced Animations",
  "Analytics",
  "Blog Integration",
  "CRM",
];

export default function Portfolio() {
  const [selectedFeature, setSelectedFeature] = useState<string>("All");

  const filteredItems = selectedFeature === "All"
    ? portfolioItems
    : portfolioItems.filter(item => item.features.includes(selectedFeature));

  return (
    <section id="portfolio" className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 scroll-mt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="px-4 py-2 bg-gradient-to-r from-primary to-purple-600 rounded-full">
              <p className="text-white font-semibold text-sm">Real Projects, Real Results</p>
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Work That <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500">Speaks for Itself</span>
          </h2>
          <p className="text-xl text-slate-300">
            Enterprise-grade solutions. Custom-built. Owned by our clients.
          </p>
        </motion.div>

        {/* Feature Filters */}
        <motion.div
          className="flex flex-wrap gap-2 justify-center mb-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            variant={selectedFeature === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFeature("All")}
            className={selectedFeature === "All"
              ? "bg-primary hover:bg-primary/90"
              : "bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-600"}
          >
            All Projects
          </Button>
          {allFeatures.map((feature) => (
            <Button
              key={feature}
              variant={selectedFeature === feature ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFeature(feature)}
              className={selectedFeature === feature
                ? "bg-primary hover:bg-primary/90"
                : "bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-600"}
            >
              {feature}
            </Button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50 group-hover:opacity-100"></div>

              <Card className="relative overflow-hidden h-full flex flex-col bg-slate-800/90 backdrop-blur-sm border border-slate-700 group-hover:border-primary/50 transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                  {/* Image glow overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover scale-110 transition-transform duration-700 group-hover:scale-125"
                  />
                </div>

                <CardHeader>
                  <CardTitle className="text-white text-2xl">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap gap-2 mt-3">
                      {item.features.map((feature, featureIndex) => {
                        const gradients = [
                          "from-blue-500 to-cyan-500",
                          "from-purple-500 to-pink-500",
                          "from-green-500 to-emerald-500",
                          "from-orange-500 to-red-500"
                        ];
                        const gradient = gradients[featureIndex % gradients.length];

                        return (
                          <span
                            key={feature}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${gradient} text-white shadow-lg`}
                          >
                            {feature}
                          </span>
                        );
                      })}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-grow space-y-4">
                  <p className="text-slate-300 leading-relaxed">{item.description}</p>
                </CardContent>

                <CardFooter className="mt-auto">
                  <Button asChild size="sm" className="group/btn relative overflow-hidden">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <span className="relative z-10">Visit Live Site</span>
                      <ExternalLink size={16} className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-500"></span>
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

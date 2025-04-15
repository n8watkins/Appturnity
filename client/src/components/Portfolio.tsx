import { ExternalLink, Code } from "lucide-react";
import { motion } from "framer-motion";
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
  tags: string[];
  link: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "GuardCastAI",
    description:
      "An AI-powered security automation service designed to monitor, detect, and respond to threats in real time. Built with modern UI and seamless backend integrations.",
    image: "/src/public/portfolio-assets/guardcast.png",
    tags: ["AI", "Automation", "Security", "Real-Time"],
    link: "https://guardcast-a4457.web.app/",
  },
  {
    id: 2,
    title: "Riverwood Ranch",
    description:
      "A streamlined web application that automated business processes, saving the client 20+ hours per week.",
    image: "/src/public/portfolio-assets/riverwood.png",
    tags: ["Web App", "Business Solutions", "Automation"],
    link: "https://riverwood-c3409.web.app/",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-20 bg-white scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
            Our Work
          </h2>
          <p className="text-lg text-slate-600">
            Check out the quality we deliver t our clients.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{item.description}</p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1"
                    >
                      <span>Visit Site</span>
                      <ExternalLink size={16} />
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

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Code, 
  CheckCircle, 
  TrendingUp, 
  ClipboardCheck, 
  Wrench, 
  GraduationCap, 
  Network, 
  Smartphone,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import heroImage from "@/assets/team-collaboration.png";
import processImage from "@/assets/process-bg.jpg";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

const Home = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const services = [
    {
      icon: Code,
      title: "Ongoing Software Development",
      description: "Multi-language support: Java, Python, JavaScript, C, C#",
      featured: true,
    },
    {
      icon: Smartphone,
      title: "Software Development",
      description: "Enterprise software, web apps, and mobile applications",
      featured: false,
    },
    {
      icon: GraduationCap,
      title: "IT Training & Consulting",
      description: "Expert guidance and knowledge transfer for your team",
      featured: false,
    },
    {
      icon: Wrench,
      title: "Hardware Maintenance & Provider",
      description: "Complete hardware solutions and maintenance services",
      featured: false,
    },
    {
      icon: Network,
      title: "Network Installation & Maintenance",
      description: "Robust network infrastructure for reliable connectivity",
      featured: false,
    },
    {
      icon: ClipboardCheck,
      title: "Software QA Service Provider",
      description: "Comprehensive quality assurance and testing services",
      featured: false,
    },
  ];

  const process = [
    {
      number: "01",
      title: "Discover & Plan",
      description: "We dive deep into your business goals and technical needs",
    },
    {
      number: "02",
      title: "Design & Develop",
      description: "Agile development with continuous feedback and iteration",
    },
    {
      number: "03",
      title: "Test & Refine",
      description: "Rigorous testing ensures quality and performance",
    },
    {
      number: "04",
      title: "Launch & Support",
      description: "Ongoing support to keep your systems running smoothly",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.08),transparent_50%)]" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Available for new projects
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-[1.1]">
                Tech Partners for{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Bold Ideas
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                We don't just build software—we become an extension of your team, 
                delivering the agility and expertise you need to scale.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg h-14 px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Link to="/contact">
                    Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="text-lg h-14 px-8 border-2 hover:border-primary hover:text-primary transition-all"
                >
                  <Link to="/services">Explore Services</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fade-in lg:animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50" />
              <img
                src={heroImage}
                alt="Team collaboration"
                className="relative rounded-2xl shadow-2xl ring-1 ring-border hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-20 space-y-4">
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold tracking-wide uppercase">
              Our Services
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Services Built for Growth
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Flexible, scalable solutions that evolve with your business needs
            </p>
          </div>
          
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                  >
                    <Card
                      className={`relative group hover:shadow-2xl transition-all duration-500 h-full border-2 hover:border-primary/20 ${
                        service.featured ? "border-accent bg-accent/5" : "hover:-translate-y-2"
                      }`}
                    >
                      {service.featured && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <span className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            ⭐ Most Popular
                          </span>
                        </div>
                      )}
                      <CardContent className="p-8 space-y-5">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <service.icon className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                        <Link
                          to="/services"
                          className="inline-flex items-center text-primary font-semibold group-hover:gap-2 transition-all pt-2"
                        >
                          Learn more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 hidden md:flex bg-background shadow-lg border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 hidden md:flex bg-background shadow-lg border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
              onClick={scrollNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {services.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-primary/30 hover:bg-primary/50"
                  }`}
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* View All Button */}
          <div className="text-center mt-16">
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="text-lg h-14 px-8 border-2 hover:border-accent hover:bg-accent hover:text-accent-foreground transition-all hover:scale-105 shadow-md"
            >
              <Link to="/services">
                View All Services <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url(${processImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20 space-y-4">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase">
              How We Work
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">Our Process</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A proven approach that delivers results, every time
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {process.map((step, index) => (
              <div 
                key={index} 
                className="relative group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6">
                  <div className="text-8xl font-bold bg-gradient-to-br from-primary/20 to-accent/20 bg-clip-text text-transparent absolute -top-2 -left-2">
                    {step.number}
                  </div>
                  <div className="relative z-10 pt-12 space-y-4">
                    <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-accent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--accent)/0.2),transparent_70%)]" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            <Card className="border-0 shadow-2xl bg-background/10 backdrop-blur-xl text-primary-foreground">
              <CardContent className="p-12 lg:p-16 space-y-8">
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle 
                      key={i} 
                      className="h-7 w-7 text-accent fill-accent animate-fade-in" 
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                
                <blockquote className="text-2xl lg:text-4xl font-semibold leading-relaxed text-center">
                  "JTech transformed our product development. Their team integrated seamlessly 
                  with ours and delivered features faster than we thought possible."
                </blockquote>
                
                <div className="flex flex-col items-center space-y-6 pt-6">
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
                  <div className="text-center space-y-2">
                    <p className="font-bold text-xl">Sarah Chen</p>
                    <p className="text-primary-foreground/80 font-medium">CTO, ScaleLabs</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-12 pt-4">
                    <div className="flex items-center gap-3 bg-background/10 backdrop-blur-sm px-6 py-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-accent" />
                      <span className="font-semibold text-lg">40% faster delivery</span>
                    </div>
                    <div className="flex items-center gap-3 bg-background/10 backdrop-blur-sm px-6 py-3 rounded-full">
                      <CheckCircle className="h-6 w-6 text-accent" />
                      <span className="font-semibold text-lg">100% on-time</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <Card className="relative overflow-hidden border-0 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--accent)/0.3),transparent_60%)]" />
            
            <CardContent className="relative p-12 lg:p-20 text-center space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight">
                  Ready to Build Something Great?
                </h2>
                <p className="text-xl lg:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
                  Let's discuss how we can help accelerate your growth with the right 
                  technology solutions.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg h-14 px-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <Link to="/contact">
                    Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-primary-foreground hover:bg-primary-foreground/90 text-primary border-0 text-lg h-14 px-10 shadow-xl hover:scale-105 transition-all"
                >
                  <Link to="/about">
                    Learn More About Us
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;

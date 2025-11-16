import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code,
  Users,
  RefreshCw,
  Shield,
  TrendingUp,
  Headphones,
  CheckCircle,
  ArrowRight,
  ClipboardCheck,
  Wrench,
  GraduationCap,
  Network,
  Smartphone,
  Sparkles,
  Zap,
  Target,
} from "lucide-react";

const Services = () => {
  const mainServices = [
    {
      icon: Code,
      title: "Ongoing Software Development",
      description: "Multi-Language Development Support",
      details:
        "Continuous development and support for your software projects in any language - Java, Python, JavaScript, C, C#, and more.",
      features: [
        "Java Development",
        "Python Development",
        "JavaScript/Node.js Development",
        "C/C# Development",
        "Continuous Feature Development",
        "Code Maintenance & Updates",
      ],
      featured: true,
    },
    {
      icon: Smartphone,
      title: "Software Development",
      description: "Enterprise-Level Solutions",
      details:
        "From web applications to mobile apps, we build enterprise-grade software tailored to your business needs.",
      features: [
        "Enterprise Software Solutions",
        "Web Applications",
        "Mobile Apps (iOS & Android)",
        "API Development & Integration",
        "Custom Software Solutions",
      ],
      featured: false,
    },
    {
      icon: GraduationCap,
      title: "IT Training & Consulting",
      description: "Expert Guidance & Knowledge Transfer",
      details:
        "Professional IT training and strategic consulting to empower your team with the latest technology skills.",
      features: [
        "Technology Consulting",
        "Team Training Programs",
        "Best Practices Workshops",
        "Technology Assessment",
        "Strategic IT Planning",
      ],
      featured: false,
    },
    {
      icon: Wrench,
      title: "Hardware Maintenance & Provider",
      description: "Complete Hardware Solutions",
      details:
        "Reliable hardware procurement, installation, and maintenance services to keep your business infrastructure running smoothly.",
      features: [
        "Hardware Procurement",
        "Installation & Configuration",
        "Preventive Maintenance",
        "Repairs & Upgrades",
        "Hardware Asset Management",
      ],
      featured: false,
    },
    {
      icon: Network,
      title: "Network Installation & Maintenance",
      description: "Robust Network Infrastructure",
      details:
        "Professional network setup, configuration, and ongoing maintenance to ensure reliable connectivity for your business.",
      features: [
        "Network Design & Installation",
        "Router & Switch Configuration",
        "Network Security Setup",
        "Performance Monitoring",
        "Troubleshooting & Support",
      ],
      featured: false,
    },
    {
      icon: ClipboardCheck,
      title: "Software QA Service Provider",
      description: "Comprehensive Quality Assurance",
      details:
        "Thorough testing services to ensure your software is reliable, secure, and delivers exceptional user experience.",
      features: [
        "Manual & Automated Testing",
        "Performance Testing",
        "Security & Vulnerability Testing",
        "User Acceptance Testing",
        "Continuous QA Support",
      ],
      featured: false,
    },
  ];

  const benefits = [
    {
      icon: RefreshCw,
      title: "Agile & Adaptive",
      description: "We pivot quickly based on your changing needs",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security practices built in",
    },
    {
      icon: TrendingUp,
      title: "Scalable Solutions",
      description: "Built to grow from startup to enterprise",
    },
    {
      icon: Headphones,
      title: "Always Available",
      description: "Support when you need it, not just 9-5",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      {/* Hero Section */}
      <section className="container mx-auto mb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/5 to-transparent -z-10 rounded-3xl blur-3xl" />
        <div className="text-center max-w-4xl mx-auto space-y-8 py-12">
          <div className="inline-block">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold inline-flex items-center gap-2 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Professional IT Services in Ethiopia
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight animate-fade-in">
            Services Built for <span className="text-primary">Growth</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Comprehensive technology solutions tailored to Ethiopian businesses. 
            From software development to IT infrastructure, we provide the expertise you need to succeed.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link to="/contact">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="container mx-auto mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive technology solutions designed to meet your business needs
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          {mainServices.map((service, index) => (
            <Card
              key={index}
              className={`relative group overflow-hidden ${
                service.featured
                  ? "border-primary border-2 shadow-2xl"
                  : "hover:shadow-xl transition-all hover-scale"
              }`}
            >
              {service.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Most Popular
                  </span>
                </div>
              )}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
              <CardHeader className="relative z-10">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                <p className="text-base font-semibold text-primary">{service.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">{service.details}</p>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    What's Included:
                  </h4>
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 group-hover/item:scale-150 transition-transform" />
                        <span className="text-muted-foreground text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full" variant={service.featured ? "default" : "outline"}>
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="container mx-auto mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose JTech?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the JTech difference with our commitment to excellence and innovation
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-all hover-scale group border-2 border-transparent hover:border-primary/20">
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl inline-block group-hover:scale-110 transition-transform">
                  <benefit.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-bold text-lg">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How We Work Section */}
      <section className="container mx-auto mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How We Work</h2>
            <p className="text-xl text-muted-foreground">
              Our proven process ensures successful project delivery
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                step: "01",
                title: "Discover",
                description: "We listen to your needs, analyze your requirements, and develop a tailored solution strategy.",
              },
              {
                icon: Code,
                step: "02",
                title: "Develop",
                description: "Our expert team builds your solution using best practices and cutting-edge technologies.",
              },
              {
                icon: Zap,
                step: "03",
                title: "Deploy",
                description: "We launch your solution and provide ongoing support to ensure continued success.",
              },
            ].map((process, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all">
                <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                  {process.step}
                </div>
                <CardContent className="pt-8 pb-6 relative z-10">
                  <div className="p-3 bg-primary/10 rounded-lg inline-block mb-4">
                    <process.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{process.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto">
        <Card className="bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
          <CardContent className="p-12 md:p-16 text-center space-y-8 relative z-10">
            <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
              <Sparkles className="h-12 w-12" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Transform Your Business?</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Let's discuss your project and explore how our services can help you achieve your goals. 
              Get a free consultation with our expert team.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button
                asChild
                size="lg"
                className="bg-background text-primary hover:bg-background/90 text-base font-semibold h-12 px-8 shadow-xl hover:shadow-2xl hover-scale"
              >
                <Link to="/contact">
                  Schedule a Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/30 text-white text-base h-12 px-8"
              >
                <Link to="/about">Learn About Our Team</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Services;

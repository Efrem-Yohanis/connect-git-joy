import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lightbulb, Handshake, Award, TrendingUp, Target, Eye, ArrowRight, Sparkles, Rocket, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import teamCeo from "@/assets/team-ceo.jpg";
import teamEngineer from "@/assets/team-engineer.jpg";
import teamDeveloper from "@/assets/team-developer.jpg";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We deliver what we promise with honesty and professionalism",
    },
    {
      icon: Heart,
      title: "Honest",
      description: "We believe in transparency and truthfulness in all our interactions",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We embrace creativity and new ideas to solve real-world problems",
    },
    {
      icon: Handshake,
      title: "Collaboration",
      description: "We believe in teamwork, both within our organization and with our clients",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for quality in everything we do",
    },
    {
      icon: TrendingUp,
      title: "Empowerment",
      description: "We use technology to uplift people and communities",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">About Us</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Building the Future of Technology
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed animate-fade-in">
              A technology startup with a powerful vision — to bridge the digital gap and bring innovative IT solutions closer to people and businesses across <span className="text-primary font-semibold">Ethiopia</span> and beyond.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
              <Button size="lg" asChild className="hover-scale shadow-lg">
                <Link to="/contact">
                  <Rocket className="mr-2 h-5 w-5" />
                  Get Started
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="hover-scale shadow-lg">
                <Link to="/services">
                  Explore Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story & Mission/Vision */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
            {/* Our Story */}
            <div className="relative">
              <Card className="hover:shadow-2xl transition-all duration-500 hover-scale border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
                <CardContent className="p-10 space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-primary to-primary/60 rounded-xl shadow-lg">
                      <Award className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Our Story</h2>
                  </div>
                  <div className="space-y-5 text-muted-foreground leading-relaxed text-base">
                    <p className="text-lg">
                      Our story began with two passionate technologists who dared to dream bigger. From a humble rural beginning, we saw how technology could transform lives and communities.
                    </p>
                    <p>
                      After years of experience in the IT industry, we realized one simple truth: to make a real impact, we needed to build something of our own.
                    </p>
                    <div className="p-6 bg-primary/10 rounded-xl border-l-4 border-primary">
                      <p className="font-semibold text-foreground text-lg italic">
                        "At JTech, we believe that technology is not just about machines — it's about people, potential, and progress."
                      </p>
                    </div>
                    <p>
                      Every project is more than just a technical task — it's a step toward creating equal access to digital opportunity. We work to empower local businesses, train young professionals, and build solutions that make technology an engine for social and economic development.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mission & Vision */}
            <div className="space-y-8">
              <Card className="group hover:shadow-2xl transition-all duration-500 hover-scale border-primary/20 bg-gradient-to-br from-card to-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                <CardContent className="p-10 space-y-5 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Target className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-3xl font-bold">Our Mission</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    To bridge the technology gap by delivering reliable, modern, and affordable IT solutions that drive growth, innovation, and empowerment for individuals, businesses, and communities.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 hover-scale border-accent/20 bg-gradient-to-br from-card to-accent/5 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                <CardContent className="p-10 space-y-5 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-accent to-primary rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Eye className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-3xl font-bold">Our Vision</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    To become one of Ethiopia's leading technology solution providers, recognized for quality, innovation, and a commitment to empowering the next generation of digital leaders.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-transparent via-muted/30 to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(var(--accent-rgb),0.1),transparent_50%)]" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Our Principles</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do and shape our company culture
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-primary/10 bg-gradient-to-br from-card to-primary/5 relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="pt-10 pb-8 space-y-5 text-center relative z-10">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                      <div className="relative p-5 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Our Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Talented professionals dedicated to delivering exceptional results and driving innovation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              {
                name: "Dawit Alemayehu",
                role: "Founder & CEO",
                bio: "Young tech entrepreneur passionate about driving digital transformation in Africa.",
                image: teamCeo,
              },
              {
                name: "Selam Bekele",
                role: "Head of Engineering",
                bio: "Innovative engineer building cutting-edge solutions for modern businesses.",
                image: teamEngineer,
              },
              {
                name: "Yonas Tesfaye",
                role: "Lead Developer",
                bio: "Creative problem-solver turning ambitious ideas into powerful software.",
                image: teamDeveloper,
              },
            ].map((member, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-primary/10 bg-gradient-to-br from-card to-primary/5"
              >
                <CardContent className="pt-10 pb-8 space-y-6 text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-all group-hover:blur-3xl" />
                    <div className="relative inline-block">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-32 h-32 rounded-full object-cover shadow-2xl relative z-10 ring-4 ring-background group-hover:ring-primary/30 group-hover:scale-110 transition-all duration-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{member.name}</h3>
                    <p className="text-primary font-semibold text-lg">{member.role}</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed px-4">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground border-0 overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <CardContent className="p-12 md:p-20 text-center space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <Rocket className="w-5 h-5" />
                <span className="text-sm font-semibold">Ready to Start?</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Start Your Project Today
              </h2>
              
              <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto leading-relaxed">
                Ready to transform your business with innovative technology solutions? Let's build something amazing together.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center pt-6">
                <Button size="lg" asChild className="bg-background text-primary hover:bg-background/90 shadow-2xl hover:shadow-3xl hover-scale text-lg px-8 py-6">
                  <Link to="/contact">
                    Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-2 border-white text-white hover:bg-white hover:text-primary shadow-xl hover-scale text-lg px-8 py-6">
                  <Link to="/services">
                    View Services
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-8 justify-center items-center text-primary-foreground/95 pt-8 text-base">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  <span>Addis Ababa, Ethiopia</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📧</span>
                  <span>info@jtech.et</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📞</span>
                  <span>+251 11 XXX XXXX</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;

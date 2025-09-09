import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-pulse" />
          <div
            className="absolute top-40 right-20 w-24 h-24 bg-secondary/10 rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-32 left-1/4 w-16 h-16 bg-primary/8 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/3 right-1/3 w-20 h-20 bg-emerald-100/30 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute bottom-1/4 right-10 w-12 h-12 bg-primary/6 rounded-full animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10">
          {/* Logo and Brand */}
          <div className="space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6 animate-bounce shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group">
              <div className="text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-200">
                Z
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fade-in bg-300% animate-gradient-x">
              ZeroMed
            </h1>
            <p
              className="text-xl md:text-2xl text-muted-foreground font-medium animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Global Healthcare Accessibility Mapping Platform
            </p>
          </div>

          {/* Mission Statement */}
          <div className="space-y-6 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <p className="text-lg md:text-xl text-foreground leading-relaxed animate-slide-up">
              A passionate initiative to democratize healthcare accessibility data. Explore comprehensive hospital
              coverage across 60+ major cities worldwide with real-time data, interactive visualizations, and detailed
              coverage analysis.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up"
              style={{ animationDelay: "0.6s" }}
            >
              <Link href="/map">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold group relative overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <span className="relative z-10 text-white">🗺️ Explore Health Map</span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg bg-transparent hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                📊 View Statistics
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card
            className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-up border-0 shadow-md hover:shadow-primary/10"
            style={{ animationDelay: "0.8s" }}
          >
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center mx-auto group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <div className="text-2xl animate-bounce" style={{ animationDelay: "1s" }}>
                  🗺️
                </div>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
                Interactive Mapping
              </h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Explore hospital locations across 60+ major cities worldwide with our interactive map powered by
                OpenStreetMap data.
              </p>
            </CardContent>
          </Card>

          <Card
            className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-up border-0 shadow-md hover:shadow-primary/10"
            style={{ animationDelay: "1s" }}
          >
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-xl flex items-center justify-center mx-auto group-hover:bg-gradient-to-br group-hover:from-secondary/20 group-hover:to-secondary/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <div className="text-2xl animate-bounce" style={{ animationDelay: "1.2s" }}>
                  📊
                </div>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
                Coverage Analysis
              </h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Advanced healthcare coverage analysis with 20-minute driving time isochrones using OpenRouteService API.
              </p>
            </CardContent>
          </Card>

          <Card
            className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-up border-0 shadow-md hover:shadow-primary/10"
            style={{ animationDelay: "1.2s" }}
          >
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center mx-auto group-hover:bg-gradient-to-br group-hover:from-red-200 group-hover:to-red-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <div className="text-2xl animate-bounce" style={{ animationDelay: "1.4s" }}>
                  🏥
                </div>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
                Comprehensive Data
              </h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Detailed hospital information including contact details, services, accessibility features, and emergency
                capabilities.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-r from-muted/30 to-muted/50 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 grid-rows-4 h-full gap-4">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="bg-primary rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "3s",
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in" style={{ animationDelay: "1.4s" }}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground animate-slide-up">Built with Passion</h2>
            <p
              className="text-lg text-muted-foreground leading-relaxed animate-slide-up"
              style={{ animationDelay: "1.6s" }}
            >
              ZeroMed is a passion project dedicated to improving healthcare accessibility awareness globally. We
              believe that understanding healthcare coverage patterns is crucial for informed decision-making by
              communities, policymakers, and healthcare organizations. Our platform combines open data sources with
              cutting-edge mapping technology to provide valuable insights into global hospital distribution,
              accessibility, and coverage gaps across major metropolitan areas worldwide.
            </p>
            <div className="pt-4 animate-fade-in" style={{ animationDelay: "1.8s" }}>
              <p className="text-sm text-muted-foreground">
                Hospital data from OpenStreetMap • Coverage analysis via OpenRouteService • Mapping powered by MapTiler
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
          <div
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 animate-fade-in"
            style={{ animationDelay: "2s" }}
          >
            <div className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-sm font-bold text-white">Z</span>
              </div>
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                ZeroMed
              </span>
            </div>
            <p className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              © 2024 ZeroMed. A passion project for healthcare accessibility.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

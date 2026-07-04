import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, Clock, Users, ArrowRight, Award } from 'lucide-react';
import heroCampus from '../../assets/images/hero_campus.png';

export const Home: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 lg:pt-32">
        <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 rounded-full border bg-muted/60 px-3 py-1 text-sm font-medium">
              <span className="text-primary font-semibold">New Release v1.2</span>
              <span className="h-4 w-px bg-border" />
              <span className="text-muted-foreground">CBSE & State Board Ready</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
              Transforming Indian Education with{' '}
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                Modern Management
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              An enterprise-grade, fast, and open-source school ERP built specifically for Indian schools, universities, and coaching institutes. Simplify admissions, attendance, fees, examinations, and library tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
              >
                Book a Free Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
              >
                Explore Modules
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary to-violet-600 opacity-30 blur-2xl" />
            <div className="relative border rounded-2xl overflow-hidden shadow-2xl bg-card">
              <img
                src={heroCampus}
                alt="Indian College Campus Hub"
                className="w-full h-80 sm:h-96 object-cover object-center"
              />
              <div className="p-6 bg-muted/30 border-t flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Delhi Public School Dwarka</h4>
                  <p className="text-xs text-muted-foreground">Active Campus branch</p>
                </div>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Award className="h-5 w-5" />
                  <span className="text-sm font-bold">ERP Top Rated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/20 py-10">
        <div className="container max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h2 className="text-3xl font-extrabold text-primary">120+</h2>
            <p className="text-sm text-muted-foreground mt-1">Institutions Onboarded</p>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-primary">50,000+</h2>
            <p className="text-sm text-muted-foreground mt-1">Active Students</p>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-primary">99.9%</h2>
            <p className="text-sm text-muted-foreground mt-1">System Uptime</p>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-primary">₹0</h2>
            <p className="text-sm text-muted-foreground mt-1">Licensing Fees (Open-Source)</p>
          </div>
        </div>
      </section>

      {/* Core Highlights */}
      <section className="container max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need To Run Your School</h2>
          <p className="text-muted-foreground">
            A comprehensive suite of modules designed to eliminate paper work and boost efficiency for administration, teachers, students, and parents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="border rounded-xl p-6 bg-card hover:shadow-lg transition-shadow space-y-4">
            <div className="p-3 bg-primary/10 text-primary w-fit rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg">Student Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage complete student profiles, roll assignments, blood groups, parent mappings, and sibling linkings.
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-card hover:shadow-lg transition-shadow space-y-4">
            <div className="p-3 bg-primary/10 text-primary w-fit rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg">Attendance Entry</h3>
            <p className="text-sm text-muted-foreground">
              Simple attendance sheets for teachers, monthly visual calendars, automatic reports, and parents alerts.
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-card hover:shadow-lg transition-shadow space-y-4">
            <div className="p-3 bg-primary/10 text-primary w-fit rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg">Exam & Marks System</h3>
            <p className="text-sm text-muted-foreground">
              Create mid-term and finals, record marks in bulk, publish reports, and calculate class percentiles.
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-card hover:shadow-lg transition-shadow space-y-4">
            <div className="p-3 bg-primary/10 text-primary w-fit rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg">Fee Ledgers & Payments</h3>
            <p className="text-sm text-muted-foreground">
              Set due fee bills for classes, record payments, calculate partial balances, and print receipt numbers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="container max-w-7xl mx-auto px-4">
        <div className="relative border rounded-2xl overflow-hidden bg-primary/10 px-8 py-12 md:py-20 text-center space-y-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl max-w-2xl mx-auto">
            Ready to upgrade your school administration?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get started with our free demo instance or download the repository to deploy on your own server.
          </p>
          <div className="flex justify-center gap-4 relative z-10">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
              Sign Up For Demo
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Target, Lightbulb, Users, Heart } from 'lucide-react';
import aboutClassroom from '../../assets/images/about_classroom.png';
import { ConnectWithUsSection } from '../../components/layout/footer/ConnectWithUsSection';

export const About: React.FC = () => {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-16 space-y-20">
      {/* Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Our Mission & Story</h1>
        <p className="text-lg text-muted-foreground">
          VidyaSanchar was born with a single objective: to democratize educational enterprise software for every school, college, and coaching center in India.
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src={aboutClassroom}
            alt="Indian teachers and students using a modern digital education platform"
            className="rounded-2xl border shadow-xl object-cover h-96 w-full"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Empowering Educators Across Bharat</h2>
          <p className="text-muted-foreground">
            Most school management software systems are either too expensive or too complex for small-to-medium schools, especially in Tier-2 and Tier-3 cities in India. 
          </p>
          <p className="text-muted-foreground">
            We built a 100% free and open-source platform using modern technologies. VidyaSanchar empowers teachers to focus on teaching, provides parents with clear insights, and simplifies administration, all through a secure and responsive dashboard.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="border rounded-xl p-6 bg-card space-y-3">
          <div className="p-3 bg-primary/10 text-primary w-fit rounded-lg">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg">Goal-Oriented</h3>
          <p className="text-sm text-muted-foreground">
            Designed to increase productivity by automating routine processes like roll calls and fee collections.
          </p>
        </div>

        <div className="border rounded-xl p-6 bg-card space-y-3">
          <div className="p-3 bg-primary/10 text-primary w-fit rounded-lg">
            <Lightbulb className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg">Open Innovation</h3>
          <p className="text-sm text-muted-foreground">
            Built using open source software, allowing custom modifications and preventing vendor lock-in.
          </p>
        </div>

        <div className="border rounded-xl p-6 bg-card space-y-3">
          <div className="p-3 bg-primary/10 text-primary w-fit rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg">Localized Support</h3>
          <p className="text-sm text-muted-foreground">
            Fully compatible with Indian grading frameworks (CBSE, ICSE, State Boards) and local currencies.
          </p>
        </div>

        <div className="border rounded-xl p-6 bg-card space-y-3">
          <div className="p-3 bg-primary/10 text-primary w-fit rounded-lg">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg">Parent Inclusion</h3>
          <p className="text-sm text-muted-foreground">
            Fosters communication, keeping parents up-to-date with their child's classroom performance.
          </p>
        </div>
      </section>

      {/* Connect With Us Section */}
      <ConnectWithUsSection />
    </div>
  );
};

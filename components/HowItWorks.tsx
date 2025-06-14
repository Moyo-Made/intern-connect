"use client"

import { UserPlus, Search, Send, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      step: "01",
      title: "Create Your Profile",
      description: "Sign up and build your comprehensive profile with skills, experience, and preferences. Our AI analyzes your data to provide personalized recommendations.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      delay: "0"
    },
    {
      icon: Search,
      step: "02", 
      title: "Discover Opportunities",
      description: "Browse through our curated database of internships from top tech companies. Use smart filters to find roles that perfectly match your goals.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      delay: "200"
    },
    {
      icon: Send,
      step: "03",
      title: "Apply Instantly",
      description: "Apply to multiple internships with our one-click system. Your profile information is automatically formatted for each application.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      delay: "400"
    },
    {
      icon: CheckCircle,
      step: "04",
      title: "Get Hired",
      description: "Track your applications, receive interview invitations, and get real-time updates. Our success rate speaks for itself - 85% of users land internships.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      delay: "600"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Works</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Land your dream tech internship in just 4 simple steps. It's that easy!
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-1">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-orange-200 rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-full animate-pulse opacity-50"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div 
                  key={index}
                  className={`group text-center animate-fade-in-up`}
                  style={{ animationDelay: `${step.delay}ms` }}
                >
                  {/* Step Number */}
                  <div className="relative mb-16">
                    <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-xl relative z-10`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg z-20">
                      <span className="text-sm font-bold text-gray-700">{step.step}</span>
                    </div>
                    
                    {/* Connecting Arrow (hidden on mobile) */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 -right-12 z-0">
                        <ArrowRight className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-6 ${step.bgColor} rounded-2xl border border-transparent hover:border-white hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Start Your Journey
            </button>
            <button className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300">
              Watch Demo
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Join 10,000+ students who've already found their dream internships
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
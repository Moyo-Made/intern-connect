"use client"

import { useState } from 'react';
import { ArrowRight, Sparkles, Users, Building2 } from "lucide-react"

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
    
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden pt-6" >
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-blue-300/40 rounded-full animate-float`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-full px-6 py-3 mb-8 text-blue-700 hover:bg-white/90 hover:border-blue-300 transition-all duration-300 cursor-pointer shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Connecting Dreams to Opportunities</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-7xl font-black text-slate-800 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Bridge the Gap
              </span>
              <br />
              <span className="text-slate-700">Between Students</span>
              <br />
              <span className="text-slate-700">& Internships</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
              Discover your perfect tech internship match. Connect with innovative companies, 
              showcase your skills, and launch your career with just one click.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button 
                className="group relative px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl text-base hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  Get Started as Student
                  <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </div>
              </button>

              <button className="group px-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-700 font-bold rounded-xl text-base hover:bg-white hover:border-blue-300 hover:text-blue-800 transform hover:scale-105 transition-all duration-300 shadow-sm">
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6" />
                  Join as Company
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl font-black text-blue-600 mb-2">1000+</div>
                <div className="text-slate-600 font-medium">Students Connected</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl font-black text-blue-600 mb-2">500+</div>
                <div className="text-slate-600 font-medium">Partner Companies</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl font-black text-blue-600 mb-2">95%</div>
                <div className="text-slate-600 font-medium">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
            50% { transform: translateY(-15px) rotate(180deg); opacity: 0.6; }
          }
          .animate-float {
            animation: float 7s ease-in-out infinite;
          }
        `}</style>
      </section>
    </>
  );
};

export default HeroSection;
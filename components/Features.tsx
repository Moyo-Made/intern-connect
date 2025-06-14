// components/Features.jsx
import { Search, MousePointer, Bell, Zap, Shield, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Search,
      title: "Discover Tech Internships Easily",
      description: "Browse through hundreds of tech internships from top companies. Our smart filtering system helps you find opportunities that match your skills and interests.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100"
    },
    {
      icon: MousePointer,
      title: "Apply with 1 Click",
      description: "Streamlined application process that saves you time. Create your profile once and apply to multiple internships with just one click.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100"
    },
    {
      icon: Bell,
      title: "Real-time Status Updates",
      description: "Stay informed every step of the way. Get instant notifications about application status, interview invitations, and important updates.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100"
    }
  ];

  const additionalFeatures = [
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description: "Our intelligent algorithm matches you with the most relevant opportunities based on your skills, preferences, and career goals.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Verified Companies",
      description: "All companies on our platform are verified and vetted to ensure legitimate and quality internship opportunities.",
      color: "from-red-500 to-rose-500"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow students, share experiences, and get advice from our vibrant community of interns and professionals.",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Why Choose Internconnect
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Features Built for 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Success</span>
          </h2>
		  <div className='max-w-2xl mx-auto'>

          <p className="text-lg text-gray-600 leading-relaxed">
            Everything you need to find, apply, and secure your dream internship in one powerful platform
          </p>
		  </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className={`group relative p-8 ${feature.bgColor} ${feature.hoverColor} rounded-3xl border border-transparent hover:border-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div className="w-full h-full bg-gradient-to-br from-current to-transparent rounded-full blur-2xl"></div>
                </div>
                
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>
                
                {/* Hover Effect Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                  <div className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center`}>
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl transform rotate-1"></div>
          <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-3xl font-bold text-gray-900 mb-3">
                Even More Amazing Features
              </h3>
              <p className="text-lg text-gray-600">
                Discover additional tools and features designed to accelerate your career journey
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {additionalFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="text-center group cursor-pointer">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
"use client"

import { useState } from 'react';
import { Menu, X, LogIn, UserPlus, Zap } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState<false | 'student' | 'company' | 'select'>(false);
  const [showSignupModal, setShowSignupModal] = useState<false | 'student' | 'company' | 'select'>(false);

  interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    userType: 'student' | 'company';
  }

  const LoginModal = ({ isOpen, onClose, title, userType }: LoginModalProps) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 transform transition-all">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 text-black rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>

            {title.includes('Sign Up') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {userType === 'student' ? 'Full Name' : 'Company Name'}
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder={userType === 'student' ? 'Enter your full name' : 'Enter company name'}
                  />
                </div>
                
                {userType === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 text-blackffff border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter your university"
                    />
                  </div>
                )}

                {userType === 'company' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 ">Industry</label>
                    <select className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ">
                      <option>Select industry</option>
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                      <option>Education</option>
                      <option>Other</option>
                    </select>
                  </div>
                )}
              </>
            )}
            
            <button className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200">
              {title.includes('Login') ? 'Sign In' : 'Create Account'}
            </button>
            
            <div className="text-center text-sm text-gray-600">
              {title.includes('Login') ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => {
                  onClose();
                  if (title.includes('Login')) {
                    setShowSignupModal('select');
                  } else {
                    setShowLoginModal('select');
                  }
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                {title.includes('Login') ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  interface UserTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    action: 'login' | 'signup';
  }

  const UserTypeModal = ({ isOpen, onClose, action }: UserTypeModalProps) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Account Type</h2>
            <p className="text-gray-600">Select how you want to use Internconnect</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => {
                onClose();
                if (action === 'login') {
                  setShowLoginModal('student');
                } else {
                  setShowSignupModal('student');
                }
              }}
              className="w-full p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">I'm a Student</h3>
                  <p className="text-sm text-gray-600">Looking for internship opportunities</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => {
                onClose();
                if (action === 'login') {
                  setShowLoginModal('company');
                } else {
                  setShowSignupModal('company');
                }
              }}
              className="w-full p-6 border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">I'm a Company</h3>
                  <p className="text-sm text-gray-600">Looking to hire talented interns</p>
                </div>
              </div>
            </button>
          </div>
          
          <button 
            onClick={onClose}
            className="mt-6 w-full py-3 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InternConnect
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">How it Works</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={() => setShowLoginModal('select')}
                className="flex items-center space-x-2 px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
              <button 
                onClick={() => setShowSignupModal('select')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">How it Works</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
                <div className="flex flex-col space-y-2 pt-4">
                  <button 
                    onClick={() => setShowLoginModal('select')}
                    className="flex items-center justify-center space-x-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                  <button 
                    onClick={() => setShowSignupModal('select')}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <UserTypeModal 
        isOpen={showLoginModal === 'select'} 
        onClose={() => setShowLoginModal(false)} 
        action="login"
      />
      <UserTypeModal 
        isOpen={showSignupModal === 'select'} 
        onClose={() => setShowSignupModal(false)} 
        action="signup"
      />
      <LoginModal 
        isOpen={showLoginModal === 'student'} 
        onClose={() => setShowLoginModal(false)} 
        title="Student Login"
        userType="student"
      />
      <LoginModal 
        isOpen={showLoginModal === 'company'} 
        onClose={() => setShowLoginModal(false)} 
        title="Company Login"
        userType="company"
      />
      <LoginModal 
        isOpen={showSignupModal === 'student'} 
        onClose={() => setShowSignupModal(false)} 
        title="Student Sign Up"
        userType="student"
      />
      <LoginModal 
        isOpen={showSignupModal === 'company'} 
        onClose={() => setShowSignupModal(false)} 
        title="Company Sign Up"
        userType="company"
      />
    </>
  );
};

export default Header;
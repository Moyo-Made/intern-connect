import { X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  userType: "student" | "company";
  onSwitchToSignup: () => void;
}

const LoginModal = ({
  isOpen,
  onClose,
  title,
  userType,
  onSwitchToSignup,
}: LoginModalProps) => {
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your password"
            />
          </div>

          {title.includes("Sign Up") && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {userType === "student" ? "Full Name" : "Company Name"}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder={
                    userType === "student"
                      ? "Enter your full name"
                      : "Enter company name"
                  }
                />
              </div>

              {userType === "student" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your university"
                  />
                </div>
              )}

              {userType === "company" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
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
            {title.includes("Login") ? "Sign In" : "Create Account"}
          </button>

          <div className="text-center text-sm text-gray-600">
            {title.includes("Login")
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={onSwitchToSignup}
              className="text-blue-600 hover:underline font-medium"
            >
              {title.includes("Login") ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
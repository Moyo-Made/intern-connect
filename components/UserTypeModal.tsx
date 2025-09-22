import { UserPlus, Zap } from "lucide-react";

interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: "login" | "signup";
  onSelectStudent: () => void;
  onSelectCompany: () => void;
}

const UserTypeModal = ({
  isOpen,
  onClose,
  action,
  onSelectStudent,
  onSelectCompany,
}: UserTypeModalProps) => {
  if (!isOpen) return null;

  const handleStudentSelect = () => {
    onSelectStudent();
  };

  const handleCompanySelect = () => {
    onSelectCompany();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Choose Your Account Type
          </h2>
          <p className="text-gray-600">
            Select how you want to use Internconnect
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleStudentSelect}
            className="w-full p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">I'm a Student</h3>
                <p className="text-sm text-gray-600">
                  Looking for internship opportunities
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleCompanySelect}
            className="w-full p-6 border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">I'm a Company</h3>
                <p className="text-sm text-gray-600">
                  Looking to hire talented interns
                </p>
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

export default UserTypeModal;
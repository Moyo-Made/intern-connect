"use client";

import { useState } from "react";
import { Menu, X, LogIn, UserPlus, Zap } from "lucide-react";
import LoginModal from "./LoginModal";
import UserTypeModal from "./UserTypeModal";
import RegisterModal from "./auth/RegisterModal";

interface HeaderProps {
	showLoginModal: false | "student" | "company" | "select";
	setShowLoginModal: React.Dispatch<
		React.SetStateAction<false | "student" | "company" | "select">
	>;
	showSignupModal: false | "student" | "company" | "select";
	setShowSignupModal: React.Dispatch<
		React.SetStateAction<false | "student" | "company" | "select">
	>;
}

const Header = ({
	showLoginModal,
	setShowLoginModal,
	showSignupModal,
	setShowSignupModal,
}: HeaderProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleSwitchToSignup = () => {
		setShowLoginModal(false);
		setShowSignupModal("select");
	};

	const handleSwitchToLogin = () => {
		setShowSignupModal(false);
		setShowLoginModal("select");
	};

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-white/20">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<div className="flex items-center space-x-3">
							<div className="relative">
								<svg
									width="32"
									height="32"
									viewBox="0 0 32 32"
									className="text-slate-800"
								>
									<circle
										cx="12"
										cy="16"
										r="8"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										className="text-blue-600"
									/>
									<circle
										cx="20"
										cy="16"
										r="8"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										className="text-slate-700"
									/>
									<circle
										cx="16"
										cy="16"
										r="2"
										fill="currentColor"
										className="text-blue-600"
									/>
								</svg>
							</div>
							<div className="flex flex-col">
								<span className="text-xl font-bold text-slate-800 leading-none">
									InternConnect
								</span>
							</div>
						</div>

						{/* Desktop Navigation */}
						<nav className="hidden md:flex items-center space-x-8">
							<a
								href="#features"
								className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
							>
								Features
							</a>
							<a
								href="#how-it-works"
								className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
							>
								How it Works
							</a>
							<a
								href="#about"
								className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
							>
								About
							</a>
							<a
								href="#contact"
								className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
							>
								Contact
							</a>
						</nav>

						{/* Auth Buttons */}
						<div className="hidden md:flex items-center space-x-3">
							<button
								onClick={() => setShowLoginModal("select")}
								className="flex items-center space-x-2 px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
							>
								<LogIn className="w-4 h-4" />
								<span>Login</span>
							</button>
							<button
								onClick={() => setShowSignupModal("select")}
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
							{isMenuOpen ? (
								<X className="w-6 h-6 text-black" />
							) : (
								<Menu className="w-6 h-6 text-black" />
							)}
						</button>
					</div>

					{/* Mobile Menu */}
					{isMenuOpen && (
						<div className="md:hidden mt-4 py-4 border-t border-gray-200">
							<nav className="flex flex-col space-y-4">
								<a
									href="#features"
									className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
								>
									Features
								</a>
								<a
									href="#how-it-works"
									className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
								>
									How it Works
								</a>
								<a
									href="#about"
									className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
								>
									About
								</a>
								<a
									href="#contact"
									className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
								>
									Contact
								</a>
								<div className="flex flex-col space-y-2 pt-4">
									<button
										onClick={() => setShowLoginModal("select")}
										className="flex items-center justify-center space-x-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
									>
										<LogIn className="w-4 h-4" />
										<span>Login</span>
									</button>
									<button
										onClick={() => setShowSignupModal("select")}
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
				isOpen={showLoginModal === "select"}
				onClose={() => setShowLoginModal(false)}
				action="login"
				onSelectStudent={() => {
					setShowLoginModal("student");
				}}
				onSelectCompany={() => {
					setShowLoginModal("company");
				}}
			/>
			<UserTypeModal
				isOpen={showSignupModal === "select"}
				onClose={() => setShowSignupModal(false)}
				action="signup"
				onSelectStudent={() => {
					setShowSignupModal("student");
				}}
				onSelectCompany={() => {
					setShowSignupModal("company");
				}}
			/>
			{/* LOGIN MODALS */}
			<LoginModal
				isOpen={showLoginModal === "student"}
				onClose={() => setShowLoginModal(false)}
				userType="STUDENT"
				onSwitchToSignup={handleSwitchToSignup}
			/>
			<LoginModal
				isOpen={showLoginModal === "company"}
				onClose={() => setShowLoginModal(false)}
				userType="COMPANY"
				onSwitchToSignup={handleSwitchToSignup}
			/>
			{/* SIGNUP MODALS */}
			<RegisterModal
				isOpen={showSignupModal === "student"}
				onClose={() => setShowSignupModal(false)}
				userType="STUDENT"
				onSwitchToSignup={handleSwitchToLogin}
			/>
			<RegisterModal
				isOpen={showSignupModal === "company"}
				onClose={() => setShowSignupModal(false)}
				userType="COMPANY"
				onSwitchToSignup={handleSwitchToLogin}
			/>
		</>
	);
};

export default Header;

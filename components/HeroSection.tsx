"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Users, Building2, Zap } from "lucide-react";

const HeroSection = ({
	onOpenStudentSignup,
	onOpenCompanySignup,
}: {
	onOpenStudentSignup: () => void;
	onOpenCompanySignup: () => void;
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [currentQuip, setCurrentQuip] = useState(0);

	// Professional rotating value props
	const quips = [
		"Trusted by 500+ companies",
		"Direct industry connections",
		"Verified opportunities only",
		"Career-focused matching",
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentQuip((prev) => (prev + 1) % quips.length);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden pt-6">
				<div className="absolute inset-0">
					<div className="absolute top-20 left-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-pulse transform rotate-12"></div>
					<div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-100/30 rounded-[60%_40%_30%_70%] blur-3xl animate-pulse delay-1000"></div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-50/50 rounded-[40%_60%_60%_40%] blur-3xl animate-pulse delay-500"></div>
				</div>

				<div className="absolute inset-0 overflow-hidden">
					<Users
						className="absolute top-1/4 left-1/4 w-5 h-5 text-blue-300/40 animate-pulse"
						style={{ animationDelay: "1s", animationDuration: "4s" }}
					/>
					<Building2
						className="absolute top-1/3 right-1/3 w-4 h-4 text-indigo-300/50 animate-pulse"
						style={{ animationDelay: "2s" }}
					/>
					<Zap
						className="absolute bottom-1/3 left-1/5 w-4 h-4 text-blue-300/40 animate-pulse"
						style={{ animationDelay: "0.5s", animationDuration: "5s" }}
					/>

					{[...Array(8)].map((_, i) => (
						<div
							key={i}
							className="absolute w-1 h-1 bg-blue-300/30 rounded-full animate-float"
							style={{
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
								animationDelay: `${Math.random() * 5}s`,
								animationDuration: `${6 + Math.random() * 2}s`,
							}}
						></div>
					))}
				</div>

				<div className="relative z-10 container mx-auto px-6 py-20">
					<div className="text-center max-w-5xl mx-auto">
						<div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-full px-6 py-3 mb-8 text-blue-700 hover:bg-white/90 hover:border-blue-300 transition-all duration-300 cursor-pointer shadow-sm group">
							<div className="relative">
								<Zap className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
							</div>
							<span className="text-sm font-medium">{quips[currentQuip]}</span>
						</div>

						<h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-6 leading-tight">
							<span className="text-blue-600">Launch Your</span>
							<br />
							<span className="text-slate-700">Tech Career With</span>
							<br />
							<span className="text-slate-700 relative">
								Real Opportunities
								<div className="absolute -top-1 -right-6 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
							</span>
						</h1>

						<p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
							Connect with vetted companies actively hiring interns. Our
							intelligent matching system pairs your skills with opportunities
							that actually lead to full-time offers.
							<br />
							<span className="text-blue-600 font-semibold">
								No more application black holes.
							</span>
						</p>

						<div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
							<button
								className="group relative px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl text-base hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
								onMouseEnter={() => setIsHovered(true)}
								onMouseLeave={() => setIsHovered(false)}
								onClick={onOpenStudentSignup}
							>
								<div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								<div className="relative flex items-center gap-3">
									<Users className="w-6 h-6" />
									Find My Internship
									<ArrowRight
										className={`w-5 h-5 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
									/>
								</div>
							</button>

							<button
								className="group px-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-700 font-bold rounded-xl text-base hover:bg-white hover:border-blue-300 hover:text-blue-800 transform hover:scale-105 transition-all duration-300 shadow-sm"
								onClick={onOpenCompanySignup}
							>
								<div className="flex items-center gap-3">
									<Building2 className="w-6 h-6" />
									Hire Top Talent
									<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
								</div>
							</button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
							<div className="bg-white/60 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
								<div className="text-3xl font-black text-blue-600 mb-2">
									2,500+
								</div>
								<div className="text-slate-600 font-medium">
									Students Placed
								</div>
								<div className="text-xs text-slate-400 mt-1">Since 2022</div>
							</div>
							<div className="bg-white/60 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
								<div className="text-3xl font-black text-blue-600 mb-2">
									500+
								</div>
								<div className="text-slate-600 font-medium">
									Partner Companies
								</div>
								<div className="text-xs text-slate-400 mt-1">
									Including Fortune 500
								</div>
							</div>
							<div className="bg-white/60 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
								<div className="text-3xl font-black text-blue-600 mb-2">
									89%
								</div>
								<div className="text-slate-600 font-medium">
									Conversion to Full-Time
								</div>
								<div className="text-xs text-slate-400 mt-1">
									Within 6 months
								</div>
							</div>
						</div>

						<div className="mt-12 max-w-4xl mx-auto">
							<div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
								<div className="text-sm text-slate-500 font-medium">
									Trusted by students from:
								</div>
								<div className="flex gap-6 text-sm text-slate-400">
									<span>Lagos State University</span>
									<span>University of Ibadan</span>
									<span>University of Lagos</span>
									<span>200+ Universities</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<style jsx>{`
					@keyframes float {
						0%,
						100% {
							transform: translateY(0px) scale(1);
							opacity: 0.2;
						}
						50% {
							transform: translateY(-12px) scale(1.1);
							opacity: 0.4;
						}
					}
					.animate-float {
						animation: float 8s ease-in-out infinite;
					}
				`}</style>
			</section>
		</>
	);
};

export default HeroSection;

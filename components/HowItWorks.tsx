"use client";

import { UserPlus, Search, Send, CheckCircle, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HowItWorks = () => {
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.1 }
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => observer.disconnect();
	}, []);
	const steps = [
		{
			icon: UserPlus,
			step: "01",
			title: "Set Up Your Profile",
			description:
				"Upload your resume, add your projects, tell us what you're looking for. Takes 5 minutes, not 5 hours.",
			bgColor: "bg-blue-50",
			iconBg: "bg-blue-500",
			delay: "0",
		},
		{
			icon: Search,
			step: "02",
			title: "Browse Real Opportunities",
			description:
				"See actual internships from actual companies. No 'unpaid marketing intern' nonsense here.",
			bgColor: "bg-emerald-50",
			iconBg: "bg-emerald-500",
			delay: "200",
		},
		{
			icon: Send,
			step: "03",
			title: "Apply (For Real)",
			description:
				"One click, your info gets sent directly to hiring managers. No black hole applications.",
			bgColor: "bg-orange-50",
			iconBg: "bg-orange-500",
			delay: "400",
		},
		{
			icon: CheckCircle,
			step: "04",
			title: "Actually Get Hired",
			description:
				"Companies respond within days, not weeks. 78% of our users get interviews within 2 weeks.",
			bgColor: "bg-slate-50",
			iconBg: "bg-slate-500",
			delay: "600",
		},
	];

	return (
		<section
			id="how-it-works"
			className="py-20 bg-slate-50 relative"
			ref={sectionRef}
		>
			<div className="container mx-auto px-6 relative">
				<div className="text-center max-w-4xl mx-auto mb-16">
					<div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-full px-6 py-3 mb-8 text-blue-700 hover:bg-white/90 hover:border-blue-300 transition-all duration-300 cursor-pointer shadow-sm group">
						<div className="relative">
							<Sparkles className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
						</div>
						<span className="text-sm font-medium">How It Actually Works</span>
					</div>

					<h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-6 leading-tight">
						Stop Overthinking It.
						<br />
						<span className="text-blue-600">Here's How Simple It Is</span>
					</h2>

					<div className="max-w-3xl mx-auto">
						<p className="text-xl text-slate-600 leading-relaxed">
							Four steps. That's it. No endless forms, no waiting months for
							responses, no sacrificing your firstborn to the application gods.
						</p>
					</div>
				</div>

				<div className="relative">
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
						{steps.map((step, index) => {
							const IconComponent = step.icon;
							return (
								<div
									key={index}
									className={`group text-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
									style={{ animationDelay: `${step.delay}ms` }}
								>
									{/* Step Icon with Number */}
									<div className="relative mb-6">
										<div
											className={`w-16 h-16 ${step.iconBg} rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-sm relative z-10`}
										>
											<IconComponent className="w-8 h-8 text-white" />
										</div>
										<div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg z-20 border-2 border-slate-100">
											<span className="text-sm font-bold text-slate-700">
												{step.step}
											</span>
										</div>
									</div>

									{/* Content */}
									<div
										className={`p-6 ${step.bgColor} rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1`}
									>
										<h3 className="text-xl font-bold text-slate-800 mb-3">
											{step.title}
										</h3>
										<p className="text-slate-600 leading-relaxed">
											{step.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className="mt-16 text-center">
					<div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto">
						<h3 className="text-2xl font-bold text-slate-800 mb-6">
							The Numbers Don't Lie
						</h3>
						<div className="grid md:grid-cols-3 gap-8">
							<div>
								<div className="text-3xl font-black text-blue-600 mb-2">
									2.3 days
								</div>
								<div className="text-slate-600">Average response time</div>
							</div>
							<div>
								<div className="text-3xl font-black text-emerald-600 mb-2">
									78%
								</div>
								<div className="text-slate-600">
									Get interviews within 2 weeks
								</div>
							</div>
							<div>
								<div className="text-3xl font-black text-orange-600 mb-2">
									89%
								</div>
								<div className="text-slate-600">Say it beats LinkedIn</div>
							</div>
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="text-center mt-16">
					<div className="inline-flex flex-col sm:flex-row gap-4">
						<button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
							Yeah, Let's Do This
						</button>
						<button className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300">
							Show Me Proof
						</button>
					</div>
					<p className="text-sm text-slate-500 mt-4">
						2,500+ students have already escaped the application hellscape
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

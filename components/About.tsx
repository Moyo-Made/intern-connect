"use client";

import {
	Target,
	Users,
	Award,
	TrendingUp,
	Heart,
	Globe,
	Code,
	Lightbulb,
} from "lucide-react";

const About = () => {
	const stats = [
		{
			icon: Users,
			number: "50K+",
			label: "Students Helped",
			color: "from-blue-500 to-blue-600",
		},
		{
			icon: Award,
			number: "500+",
			label: "Partner Companies",
			color: "from-blue-600 to-blue-700",
		},
		{
			icon: TrendingUp,
			number: "85%",
			label: "Success Rate",
			color: "from-blue-500 to-blue-600",
		},
		{
			icon: Globe,
			number: "25+",
			label: "Countries",
			color: "from-blue-600 to-blue-700",
		},
	];

	const values = [
		{
			icon: Target,
			title: "Mission-Driven",
			description: "...",
			color: "from-blue-500 to-blue-600",
		},
		{
			icon: Heart,
			title: "Student-First",
			description: "...",
			color: "from-emerald-500 to-emerald-600",
		},
		{
			icon: Code,
			title: "Innovation-Focused",
			description: "...",
			color: "from-slate-500 to-slate-600",
		},
		{
			icon: Lightbulb,
			title: "Growth-Oriented",
			description: "...",
			color: "from-orange-500 to-orange-600",
		},
	];

	return (
		<section
			id="about"
			className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden"
		>
			<div className="absolute inset-0">
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
			</div>

			<div className="container mx-auto px-6 relative">
				<div className="text-center max-w-4xl mx-auto mb-16">
					<div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
						<Heart className="w-4 h-4" />
						Our Story
					</div>
					<h2 className="text-3xl md:text-4xl font-bold mb-6">
						About
						<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
							{" "}
							Internconnect
						</span>
					</h2>
					<div className="max-w-2xl mx-auto">
						<p className="text-lg text-gray-300 leading-relaxed mb-8">
							We're on a mission to democratize access to tech internships and
							empower the next generation of innovators. Founded by former
							interns who experienced the struggle firsthand, we're building the
							platform we wish we had.
						</p>
					</div>
				</div>

				{/* Stats Section */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
					{stats.map((stat, index) => {
						const IconComponent = stat.icon;
						return (
							<div key={index} className="text-center group">
								<div
									className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
								>
									<IconComponent className="w-6 h-6 text-white" />
								</div>
								<div className="text-2xl md:text-3xl font-bold text-white mb-2">
									{stat.number}
								</div>
								<div className="text-gray-400 text-sm">{stat.label}</div>
							</div>
						);
					})}
				</div>

				<div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
					<div>
						<h3 className="text-3xl font-bold text-white mb-6">Our Journey</h3>
						<div className="space-y-4 text-gray-300 leading-relaxed">
							<p>
								It started with a simple frustration: why was finding a tech
								internship so complicated? Hours spent navigating different
								company websites, filling out repetitive applications, and
								waiting in silence for responses that rarely came.
							</p>
							<p>
								As computer science students ourselves, we knew there had to be
								a better way. In 2022, we built the first version of
								Internconnect in our dorm room - a simple platform that
								connected students with internship opportunities.
							</p>
							<p>
								Today, we've grown into a comprehensive career platform trusted
								by students from over 1,000 universities worldwide. But our core
								mission remains the same: making internship discovery and
								application as simple as possible.
							</p>
						</div>
					</div>
					<div className="relative">
						<div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10">
							<div className="text-center">
								<div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
									<Code className="w-12 h-12 text-white" />
								</div>
								<h4 className="text-2xl font-bold text-white mb-2">
									Built by Students
								</h4>
								<p className="text-gray-400">For Students</p>
							</div>
						</div>
					</div>
				</div>

				{/* Values Section */}
				<div>
					<div className="text-center mb-10">
						<h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
							What Drives Us
						</h3>
						<p className="text-lg text-gray-300">
							The values that guide everything we do
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						{values.map((value, index) => {
							const IconComponent = value.icon;
							return (
								<div key={index} className="group">
									<div className="p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105">
										<div
											className={`w-12 h-12 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
										>
											<IconComponent className="w-6 h-6 text-white" />
										</div>
										<h4 className="text-xl font-bold text-white mb-2 group-hover:text-gray-200 transition-colors">
											{value.title}
										</h4>
										<p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
											{value.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className="text-center mt-16">
					<div className="inline-flex flex-col sm:flex-row gap-4">
						<button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
							Join Our Mission
						</button>
						<button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
							Meet the Team
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;

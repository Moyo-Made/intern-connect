import {
	Search,
	Users,
	Target,
	BookOpen,
	Briefcase,
	Clock,
	Award,
	TrendingUp,
	BarChart3,
} from "lucide-react";

const Features = () => {
	const features = [
		{
			icon: Search,
			title: "Smart Job Matching",
			description:
				"Our algorithm actually works (unlike your ex). Match with companies based on your skills, not just keywords.",
			bgColor: "bg-blue-50",
			iconBg: "bg-blue-500",
			stats: "94% match accuracy",
		},
		{
			icon: Users,
			title: "Direct Company Access",
			description:
				"Skip the black hole applications. Connect directly with hiring managers who are actively looking.",
			bgColor: "bg-emerald-50",
			iconBg: "bg-emerald-500",
			stats: "500+ active recruiters",
		},
		{
			icon: BarChart3,
			title: "Application Analytics",
			description: "Track your application performance like a data scientist. See what's working, what's not, and optimize your job hunt.",
			bgColor: "bg-purple-50",
			iconBg: "bg-purple-500",
			stats: "3x higher success rate",
		  }
	];

	const additionalFeatures = [
		{
			icon: Clock,
			title: "Application Tracking",
			description:
				"Never wonder 'did I apply here?' again. Track everything in one place.",
			color: "text-slate-600",
		},
		{
			icon: BookOpen,
			title: "Interview Prep",
			description:
				"Company-specific interview questions from students who actually got hired.",
			color: "text-slate-600",
		},
		{
			icon: Award,
			title: "Skill Verification",
			description:
				"Prove you can actually code. No more 'proficient in Excel' nonsense.",
			color: "text-slate-600",
		},
		{
			icon: Target,
			title: "Salary Transparency",
			description:
				"Know what you're worth. Real salary data from real interns.",
			color: "text-slate-600",
		},
		{
			icon: TrendingUp,
			title: "Career Analytics",
			description:
				"See which skills are actually in demand (spoiler: it's not blockchain).",
			color: "text-slate-600",
		},
		{
			icon: Briefcase,
			title: "Portfolio Showcase",
			description: "Show off your projects without the cringe LinkedIn posts.",
			color: "text-slate-600",
		},
	];

	return (
		<section id="features" className="py-20 bg-slate-50">
			<div className="container mx-auto px-6">
				<div className="text-center max-w-4xl mx-auto mb-16">
					<div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-full px-6 py-3 mb-8 text-blue-700 hover:bg-white/90 hover:border-blue-300 transition-all duration-300 cursor-pointer shadow-sm group">
						<div className="relative">
							<Target className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
						</div>
						<span className="text-sm font-medium">
							Why We're Actually Different
						</span>
					</div>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-6 leading-tight">
						Built by Students Who
						<br />
						<span className="text-blue-600">Got Tired of Rejection</span>
					</h2>

					<div className="max-w-3xl mx-auto">
						<p className="text-xl text-slate-600 leading-relaxed">
							We've been where you are. Sending applications into the void,
							getting ghosted by recruiters, and wondering if your computer
							science degree was worth the debt.
							<span className="font-semibold text-slate-700">
								{" "}
								So we built something better.
							</span>
						</p>
					</div>
				</div>

				{/* Main Features */}
				<div className="grid lg:grid-cols-3 gap-8 mb-20">
					{features.map((feature, index) => {
						const IconComponent = feature.icon;
						return (
							<div
								key={index}
								className={`group relative ${feature.bgColor} p-8 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
							>
								<div
									className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6 shadow-sm`}
								>
									<IconComponent className="w-7 h-7 text-white" />
								</div>

								<h3 className="text-2xl font-bold text-slate-800 mb-4">
									{feature.title}
								</h3>
								<p className="text-slate-600 leading-relaxed mb-4 text-lg">
									{feature.description}
								</p>

								<div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
									{feature.stats}
								</div>
							</div>
						);
					})}
				</div>

				<div className="relative mb-20">
					<div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200">
						<div className="text-center mb-12">
							<h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
								The Stuff That Actually Matters
							</h3>
							<p className="text-lg text-slate-600 max-w-2xl mx-auto">
								No fluff, no buzzwords. Just the tools you need to land an
								internship that doesn't suck.
							</p>
						</div>

						<div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8">
							{additionalFeatures.map((feature, index) => {
								const IconComponent = feature.icon;
								return (
									<div
										key={index}
										className="group cursor-pointer hover:bg-slate-50 p-6 rounded-xl transition-colors"
									>
										<div className="flex items-start space-x-4">
											<div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mt-1 group-hover:bg-slate-200 transition-colors">
												<IconComponent className="w-5 h-5 text-slate-600" />
											</div>
											<div>
												<h4 className="text-lg font-semibold text-slate-800 mb-2">
													{feature.title}
												</h4>
												<p className="text-slate-600 leading-relaxed text-sm">
													{feature.description}
												</p>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				<div className="text-center bg-blue-600 rounded-2xl p-8 text-white">
					<div className="max-w-3xl mx-auto">
						<h3 className="text-2xl font-bold mb-4">
							"Finally, a platform that doesn't make me want to throw my laptop"
						</h3>
						<p className="text-blue-100 text-lg mb-6">
							- Moyo Made, LASU CS '24, now at Google
						</p>
						<div className="grid grid-cols-3 gap-8 text-center">
							<div>
								<div className="text-3xl font-black text-white">78%</div>
								<div className="text-blue-100 text-sm">
									Get interviews within 2 weeks
								</div>
							</div>
							<div>
								<div className="text-3xl font-black text-white">3.2x</div>
								<div className="text-blue-100 text-sm">
									Faster than traditional job boards
								</div>
							</div>
							<div>
								<div className="text-3xl font-black text-white">89%</div>
								<div className="text-blue-100 text-sm">
									Say it's better than LinkedIn
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Features;

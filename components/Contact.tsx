"use client";

import { Mail, MessageCircle, Send, Coffee } from "lucide-react";
import { useState } from "react";

const Contact = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
		type: "student",
	});

	const handleInputChange = (e: { target: { name: any; value: any } }) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		console.log("Form submitted:", formData);
		alert("Got it! We'll get back to you within 24 hours.");
		setFormData({
			name: "",
			email: "",
			message: "",
			type: "student",
		});
	};

	return (
		<section id="contact" className="py-20 bg-slate-50">
			<div className="container mx-auto px-6">
				{/* Section Header */}
				<div className="text-center max-w-4xl mx-auto mb-16">
					<div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-full px-6 py-3 mb-8 text-blue-700 hover:bg-white/90 hover:border-blue-300 transition-all duration-300 cursor-pointer shadow-sm group">
						<div className="relative">
							<Coffee className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
						</div>
						<span className="text-sm font-medium">Let's Talk</span>
					</div>

					<h2 className="text-4xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-6 leading-tight">
						Questions? Ideas?
						<br />
						<span className="text-blue-600">Just Say Hi</span>
					</h2>

					<div className="max-w-3xl mx-auto">
						<p className="text-xl text-slate-600 leading-relaxed">
							We're real people who actually read our emails. No chatbots, no
							corporate nonsense.
							<span className="font-semibold text-slate-700">
								{" "}
								Just humans helping humans.
							</span>
						</p>
					</div>
				</div>

				{/* Main Contact Section */}
				<div className="max-w-4xl mx-auto">
					<div className="grid lg:grid-cols-2 gap-12">
						{/* Contact Form */}
						<div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
							<div className="mb-8">
								<h3 className="text-2xl font-bold text-slate-800 mb-2">
									Drop us a line
								</h3>
								<p className="text-slate-600">
									We'll get back to you within 24 hours (usually way faster)
								</p>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								{/* User Type */}
								<div>
									<label className="block text-sm font-semibold text-slate-700 mb-3">
										I'm a...
									</label>
									<div className="grid grid-cols-2 gap-3">
										<label className="relative cursor-pointer">
											<input
												type="radio"
												name="type"
												value="student"
												checked={formData.type === "student"}
												onChange={handleInputChange}
												className="sr-only"
											/>
											<div
												className={`p-4 rounded-xl border-2 transition-all duration-200 ${
													formData.type === "student"
														? "border-blue-500 bg-blue-50 text-blue-700"
														: "border-slate-200 hover:border-slate-300 text-slate-600"
												}`}
											>
												<div className="text-center">
													<span className="text-lg font-medium">Student</span>
													<p className="text-xs mt-1">
														Looking for internships
													</p>
												</div>
											</div>
										</label>

										<label className="relative cursor-pointer">
											<input
												type="radio"
												name="type"
												value="company"
												checked={formData.type === "company"}
												onChange={handleInputChange}
												className="sr-only"
											/>
											<div
												className={`p-4 rounded-xl border-2 transition-all duration-200 ${
													formData.type === "company"
														? "border-blue-500 bg-blue-50 text-blue-700"
														: "border-slate-200 hover:border-slate-300 text-slate-600"
												}`}
											>
												<div className="text-center">
													<span className="text-lg font-medium">Company</span>
													<p className="text-xs mt-1">Hiring interns</p>
												</div>
											</div>
										</label>
									</div>
								</div>

								{/* Name and Email */}
								<div className="grid md:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-semibold text-slate-700 mb-2"
										>
											Name
										</label>
										<input
											type="text"
											id="name"
											name="name"
											value={formData.name}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-3 border text-slate-800 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
											placeholder="Your name"
										/>
									</div>
									<div>
										<label
											htmlFor="email"
											className="block text-sm font-semibold text-slate-700 mb-2"
										>
											Email
										</label>
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-3 text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
											placeholder="your@email.com"
										/>
									</div>
								</div>

								{/* Message */}
								<div>
									<label
										htmlFor="message"
										className="block text-sm font-semibold text-slate-700 mb-2"
									>
										What's on your mind?
									</label>
									<textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleInputChange}
										required
										rows={5}
										className="w-full px-4 py-3 text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
										placeholder="Tell us what's up..."
									></textarea>
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									className="w-full bg-blue-600 text-white font-semibold py-4 px-4 rounded-xl hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
								>
									<Send className="w-5 h-5" />
									Send Message
								</button>
							</form>
						</div>

						{/* Contact Info */}
						<div className="space-y-8">
							{/* Direct Contact */}
							<div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
								<h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
									<MessageCircle className="w-5 h-5 text-blue-600" />
									Other Ways to Reach Us
								</h3>

								<div className="space-y-6">
									<div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
										<div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
											<Mail className="w-5 h-5 text-white" />
										</div>
										<div>
											<h4 className="font-semibold text-slate-800">Email</h4>
											<p className="text-slate-600 text-sm mb-2">
												For general inquiries and support
											</p>
											<p className="text-blue-600 font-medium">
												hello@internconnect.com
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* FAQ */}
							<div className="bg-slate-800 rounded-2xl p-8 text-white">
								<h3 className="text-xl font-bold mb-6">Quick Answers</h3>
								<div className="space-y-4">
									<div>
										<h4 className="font-semibold mb-2 text-slate-200">
											Is it really free for students?
										</h4>
										<p className="text-slate-300 text-sm">
											Yep, completely free. We make money from companies, not
											students.
										</p>
									</div>
									<div>
										<h4 className="font-semibold mb-2 text-slate-200">
											How fast do you respond?
										</h4>
										<p className="text-slate-300 text-sm">
											Usually within a few hours. We're pretty good about this.
										</p>
									</div>
									<div>
										<h4 className="font-semibold mb-2 text-slate-200">
											Can companies contact students directly?
										</h4>
										<p className="text-slate-300 text-sm">
											Only with your permission. No spam, no surprises.
										</p>
									</div>
								</div>
							</div>

							{/* Testimonial */}
							<div className="bg-blue-600 rounded-2xl p-8 text-white text-center">
								<p className="text-lg font-medium mb-4">
									"These guys actually care. Got a response in 20 minutes on a
									Sunday."
								</p>
								<p className="text-blue-200">- Ade, UNILAG</p>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Note */}
				<div className="text-center mt-16 max-w-2xl mx-auto">
					<p className="text-slate-500">
						We read every single message. No automated responses, no ticket
						systems. Just real people who genuinely want to help you succeed.
					</p>
				</div>
			</div>
		</section>
	);
};

export default Contact;

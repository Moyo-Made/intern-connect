"use client";

import About from "@/components/About";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Header from "@/components/Nav";
import React, { useState } from "react";

const page = () => {
	const [showLoginModal, setShowLoginModal] = useState<
		false | "student" | "company" | "select"
	>(false);
	const [showSignupModal, setShowSignupModal] = useState<
		false | "student" | "company" | "select"
	>(false);
	return (
		<div style={{ fontFamily: "Satoshi, sans-serif" }}>
			<link
				href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
				rel="stylesheet"
			/>
			<Header
				showLoginModal={showLoginModal}
				setShowLoginModal={setShowLoginModal}
				showSignupModal={showSignupModal}
				setShowSignupModal={setShowSignupModal}
			/>
			<HeroSection
				onOpenStudentSignup={() => setShowSignupModal("student")}
				onOpenCompanySignup={() => setShowSignupModal("company")}
			/>
			<Features />
			<HowItWorks />
			<About />
			<Contact />
		</div>
	);
};

export default page;

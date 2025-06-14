import About from "@/components/About";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Header from "@/components/Nav";
import React from "react";

const page = () => {
	return (
		<div style={{fontFamily: 'Satoshi, sans-serif'}}>
			{/* Add Satoshi font */}
			<link
				href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
				rel="stylesheet"
			/>
			<Header />
			<HeroSection />
      <Features />
      <HowItWorks />
      <About />
      <Contact />
		</div>
	);
};

export default page;

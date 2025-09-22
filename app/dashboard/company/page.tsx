import CompanyDashboard from "@/components/CompanyDashboard";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

const page = () => {
	return (
		<ProtectedRoute userType="COMPANY">
			<CompanyDashboard />
		</ProtectedRoute>
	);
};

export default page;

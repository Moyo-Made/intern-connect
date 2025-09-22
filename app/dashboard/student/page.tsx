import ProtectedRoute from "@/components/ProtectedRoute";
import StudentDashboard from "@/components/StudentDashboard";
import React from "react";

const page = () => {
	return (
		<ProtectedRoute userType="STUDENT">
			<StudentDashboard />
		</ProtectedRoute>
	);
};

export default page;

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
	children: React.ReactNode;
	userType?: "STUDENT" | "COMPANY";
}

export default function ProtectedRoute({
	children,
	userType,
}: ProtectedRouteProps) {
	const { isAuthenticated, isLoading, user, error } = useAuth();
	const router = useRouter();
	const [hasRedirected, setHasRedirected] = useState(false);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);

	useEffect(() => {
		// Wait for initial auth check to complete
		if (isLoading && !initialLoadComplete) {
			return;
		}

		// Mark initial load as complete when loading finishes
		if (!isLoading && !initialLoadComplete) {
			setInitialLoadComplete(true);
		}

		// Only redirect if we've completed initial load and haven't already redirected
		if (!initialLoadComplete || hasRedirected) {
			return;
		}

		// Check authentication
		if (!isAuthenticated) {
			setHasRedirected(true);
			router.replace("/");
			return;
		}

		// Check user type mismatch
		if (userType && user?.user.userType !== userType) {
			setHasRedirected(true);
			const correctDashboard =
				user?.user.userType === "STUDENT"
					? "/dashboard/student"
					: "/dashboard/company";
			router.replace(correctDashboard);
			return;
		}

	}, [
		isLoading,
		isAuthenticated,
		user,
		userType,
		router,
		hasRedirected,
		error,
		initialLoadComplete,
	]);

	// Show loading while auth context is checking OR during initial load
	if (isLoading || !initialLoadComplete) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
					<p className="text-gray-600">
						{!initialLoadComplete
							? "Verifying authentication..."
							: "Loading..."}
					</p>
				</div>
			</div>
		);
	}

	// Show loading if we're about to redirect
	if (hasRedirected) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
					<p className="text-gray-600">Redirecting...</p>
				</div>
			</div>
		);
	}

	// Final auth check before rendering
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
					<p className="text-gray-600">Authentication required...</p>
				</div>
			</div>
		);
	}

	// Check user type match one final time
	if (userType && user?.user.userType !== userType) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
					<p className="text-gray-600">Redirecting to correct dashboard...</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}

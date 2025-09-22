import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
	errors?: Record<string, string[]>;
}

export async function GET(request: NextRequest) {
	try {
		// Get token from Authorization header
		const authHeader = request.headers.get("authorization");

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return Response.json(
				{
					success: false,
					message: "No valid authorization token provided",
				},
				{ status: 401 }
			);
		}

		const token = authHeader.substring(7); // Remove 'Bearer ' prefix

		// Verify and decode token
		const decoded = await verifyToken(token);

		if (!decoded) {
			return Response.json(
				{
					success: false,
					message: "Invalid or expired token",
				},
				{ status: 401 }
			);
		}

		// Get user and profile from database
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				email: true,
				userType: true,
				isVerified: true,
				createdAt: true,
			},
		});

		if (!user) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		// Get profile based on user type
		let profile = null;

		if (user.userType === "STUDENT") {
			profile = await prisma.studentProfile.findUnique({
				where: { userId: user.id },
			});
		} else if (user.userType === "COMPANY") {
			profile = await prisma.companyProfile.findUnique({
				where: { userId: user.id },
			});
		}

		return Response.json({
			success: true,
			message: "User data retrieved successfully",
			data: {
				user,
				profile,
			},
		});
	} catch (error) {
		console.error("Auth verification error:", error);

		return Response.json(
			{
				success: false,
				message: "Token verification failed",
			},
			{ status: 401 }
		);
	}
}

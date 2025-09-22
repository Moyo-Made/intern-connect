import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { internshipSchema } from "@/lib/validation";

export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
	errors?: Record<string, string[]>;
}

export async function POST(request: NextRequest) {
	try {
		// Get and verify token
		const authHeader = request.headers.get("Authorization");
		if (!authHeader?.startsWith("Bearer ")) {
			return Response.json(
				{
					success: false,
					message: "Authentication required",
				},
				{ status: 401 }
			);
		}

		const token = authHeader.substring(7);
		const decoded = verifyToken(token);

		if (!decoded || decoded.userType !== "COMPANY") {
			return Response.json(
				{
					success: false,
					message: "Only companies can post internships",
				},
				{ status: 403 }
			);
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = internshipSchema.safeParse(body);

		if (!validationResult.success) {
			return Response.json(
				{
					success: false,
					message: "Validation failed",
					errors: validationResult.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const data = validationResult.data;

		// Create internship
		const internship = await prisma.internship.create({
			data: {
				title: data.title,
				description: data.description,
				location: data.location,
				requirements: Array.isArray(data.requirements)
					? data.requirements
					: data.requirements.split(",").map((r) => r.trim()),
				
				duration: data.duration,
				companyId: decoded.userId,
				isRemote: data.location.toLowerCase().includes("remote"),
				isActive: true,
			},
		});

		return Response.json(
			{
				success: true,
				message: "Internship posted successfully",
				data: internship,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Post internship error:", error);
		return Response.json(
			{
				success: false,
				message: "Internal server error. Please try again later.",
			},
			{ status: 500 }
		);
	}
}

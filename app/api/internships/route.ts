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

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const location = searchParams.get("location");
		const isRemote = searchParams.get("isRemote");
		
		const skip = (page - 1) * limit;

		// Build where clause based on filters
		const where: any = {
			isActive: true,
		};

		if (location) {
			where.location = {
				contains: location,
				mode: "insensitive",
			};
		}

		if (isRemote !== null) {
			where.isRemote = isRemote === "true";
		}

		// Get internships with company info
		const [internships, total] = await Promise.all([
			prisma.internship.findMany({
				where,
				skip,
				take: limit,
				orderBy: {
					createdAt: "desc",
				},
				include: {
					company: {
						select: {
							companyName: true,
							description: true,
							location: true,
						},
					},
				},
			}),
			prisma.internship.count({ where }),
		]);

		return Response.json(
			{
				success: true,
				message: "Internships fetched successfully",
				data: {
					internships,
					pagination: {
						current: page,
						total: Math.ceil(total / limit),
						count: internships.length,
						totalCount: total,
					},
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Get internships error:", error);
		return Response.json(
			{
				success: false,
				message: "Internal server error. Please try again later.",
			},
			{ status: 500 }
		);
	}
}

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { internshipSchema } from "@/lib/validation";

// PUT - Update internship
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
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
					message: "Only companies can update internships",
				},
				{ status: 403 }
			);
		}

		const internshipId = params.id;

		// Check if internship exists and belongs to the company
		const existingInternship = await prisma.internship.findUnique({
			where: { id: internshipId },
		});

		if (!existingInternship) {
			return Response.json(
				{
					success: false,
					message: "Internship not found",
				},
				{ status: 404 }
			);
		}

		if (existingInternship.companyId !== decoded.userId) {
			return Response.json(
				{
					success: false,
					message: "You can only update your own internships",
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

		// Update internship
		const updatedInternship = await prisma.internship.update({
			where: { id: internshipId },
			data: {
				title: data.title,
				description: data.description,
				location: data.location,
				requirements: Array.isArray(data.requirements)
					? data.requirements
					: data.requirements.split(",").map((r) => r.trim()),
				duration: data.duration,
				stipend: data.stipend,
				isRemote: data.location.toLowerCase().includes("remote"),
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
		});

		return Response.json(
			{
				success: true,
				message: "Internship updated successfully",
				data: updatedInternship,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Update internship error:", error);
		return Response.json(
			{
				success: false,
				message: "Internal server error. Please try again later.",
			},
			{ status: 500 }
		);
	}
}

// DELETE - Delete internship
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
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
					message: "Only companies can delete internships",
				},
				{ status: 403 }
			);
		}

		const internshipId = params.id;

		// Check if internship exists and belongs to the company
		const existingInternship = await prisma.internship.findUnique({
			where: { id: internshipId },
			include: {
				_count: {
					select: {
						applications: true,
					},
				},
			},
		});

		if (!existingInternship) {
			return Response.json(
				{
					success: false,
					message: "Internship not found",
				},
				{ status: 404 }
			);
		}

		if (existingInternship.companyId !== decoded.userId) {
			return Response.json(
				{
					success: false,
					message: "You can only delete your own internships",
				},
				{ status: 403 }
			);
		}

		// Check if internship has applications
		if (existingInternship._count.applications > 0) {
			return Response.json(
				{
					success: false,
					message:
						"Cannot delete internship with existing applications. Consider marking it as inactive instead.",
				},
				{ status: 400 }
			);
		}

		// Delete internship
		await prisma.internship.delete({
			where: { id: internshipId },
		});

		return Response.json(
			{
				success: true,
				message: "Internship deleted successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Delete internship error:", error);
		return Response.json(
			{
				success: false,
				message: "Internal server error. Please try again later.",
			},
			{ status: 500 }
		);
	}
}

// GET - Get single internship (optional - for viewing details)
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const internshipId = params.id;

		const internship = await prisma.internship.findUnique({
			where: {
				id: internshipId,
				isActive: true, // Only show active internships for public viewing
			},
			include: {
				company: {
					select: {
						companyName: true,
						description: true,
						location: true,
					},
				},
				_count: {
					select: {
						applications: true,
					},
				},
			},
		});

		if (!internship) {
			return Response.json(
				{
					success: false,
					message: "Internship not found",
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{
				success: true,
				message: "Internship fetched successfully",
				data: internship,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Get internship error:", error);
		return Response.json(
			{
				success: false,
				message: "Internal server error. Please try again later.",
			},
			{ status: 500 }
		);
	}
}

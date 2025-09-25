import { getStudentIdFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
	try {
		const studentId = await getStudentIdFromToken(request);
		const { internshipId } = params;

		const application = await prisma.application.findUnique({
			where: {
				studentId_internshipId: {
					studentId,
					internshipId,
				},
			},
			select: {
				id: true,
				status: true,
				appliedAt: true,
			},
		});

		return Response.json({
			success: true,
			data: {
				hasApplied: !!application,
				application: application || null,
			},
		});
	} catch (error) {
		console.error("Application status check error:", error);
		return Response.json(
			{
				success: false,
				message: "Failed to check application status",
			},
			{ status: 500 }
		);
	}
}

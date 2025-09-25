import { getStudentIdFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const studentId = await getStudentIdFromToken(request);
    
    const requestData = await request.json();

    const {
      firstName,
      lastName,
      phone,
      university,
      major,
      graduationYear,
      bio,
      portfolioUrl,
      linkedinUrl,
      githubUrl,
      profilePictureUrl,
    } = requestData;

    const updatedProfile = await prisma.studentProfile.update({
      where: { userId: studentId },
      data: {
        firstName,
        lastName,
        phone,
        university,
        major,
        graduationYear: parseInt(graduationYear),
        bio,
        portfolioUrl,
        linkedinUrl,
        githubUrl,
        profilePictureUrl, // This should have the URL
      },
    });

    return Response.json({
      success: true,
      data: updatedProfile,
    });
	} catch (error: any) {

		// Handle specific Prisma errors
		if (error.code === "P2025") {
			return Response.json(
				{
					success: false,
					message: "Student profile not found",
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{
				success: false,
				message: "Failed to update profile",
			},
			{ status: 500 }
		);
	}
}

import { getStudentIdFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {
	  const { internshipId, coverLetter } = await request.json();
	  
	  // Get student ID from your auth system
	  const studentId = await getStudentIdFromToken(request);
	  
	  // Validation
	  if (!internshipId) {
		return Response.json({
		  success: false,
		  message: "Internship ID is required"
		}, { status: 400 });
	  }
	  
	  // Check if internship exists and is active
	  const internship = await prisma.internship.findUnique({
		where: { id: internshipId, isActive: true }
	  });
	  
	  if (!internship) {
		return Response.json({
		  success: false,
		  message: "Internship not found or no longer available"
		}, { status: 404 });
	  }
	  
	  // Check if already applied
	  const existingApplication = await prisma.application.findUnique({
		where: {
		  studentId_internshipId: {
			studentId,
			internshipId
		  }
		}
	  });
	  
	  if (existingApplication) {
		return Response.json({
		  success: false,
		  message: "You have already applied to this internship"
		}, { status: 409 });
	  }
	  
	  // Create application
	  const application = await prisma.application.create({
		data: {
		  studentId,
		  internshipId,
		  coverLetter: coverLetter || null,
		},
		include: {
		  internship: {
			select: {
			  title: true,
			  company: {
				select: {
				  companyName: true
				}
			  }
			}
		  }
		}
	  });
	  
	  return Response.json({
		success: true,
		message: "Application submitted successfully",
		data: application
	  }, { status: 201 });
	  
	} catch (error: any) {
	  console.error("Application creation error:", error);
	  
	  if (error.code === 'P2002') { // Prisma unique constraint error
		return Response.json({
		  success: false,
		  message: "You have already applied to this internship"
		}, { status: 409 });
	  }
	  
	  return Response.json({
		success: false,
		message: "Failed to submit application. Please try again."
	  }, { status: 500 });
	}
  }
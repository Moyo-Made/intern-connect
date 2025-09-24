import { getCompanyIdFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	try {
	  const companyId = await getCompanyIdFromToken(request); // You'll need this helper
	  const { searchParams } = new URL(request.url);
	  const page = parseInt(searchParams.get("page") || "1");
	  const limit = parseInt(searchParams.get("limit") || "50");
	  const status = searchParams.get("status"); // Filter by status if needed
	  
	  const skip = (page - 1) * limit;
	  
	  const where: any = {
		internship: {
		  companyId, // Only get applications for this company's internships
		  isActive: true,
		},
	  };
	  
	  if (status) {
		where.status = status.toUpperCase();
	  }
	  
	  const applications = await prisma.application.findMany({
		where,
		skip,
		take: limit,
		orderBy: { appliedAt: "desc" },
		include: {
		  student: {
			select: {
			  userId: true,
			  firstName: true,
			  lastName: true,
			  university: true,
			  major: true,
			  user: {
				select: {
				  email: true,
				},
			  },
			},
		  },
		  internship: {
			select: {
			  id: true,
			  title: true,
			},
		  },
		},
	  });
	  
	  // Transform data for easier frontend consumption
	  const transformedApplications = applications.map(app => ({
		id: app.id,
		status: app.status.toLowerCase(),
		appliedAt: app.appliedAt,
		coverLetter: app.coverLetter,
		studentName: `${app.student.firstName} ${app.student.lastName}`,
		email: app.student.user.email,
		university: app.student.university,
		major: app.student.major,
		internshipTitle: app.internship.title,
		studentId: app.student.userId,
	  }));
	  
	  return Response.json({
		success: true,
		data: { applications: transformedApplications }
	  });
	  
	} catch (error) {
	  console.error()
	}
  }
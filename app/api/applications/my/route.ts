import { getStudentIdFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	try {
	  // Get student ID from token
	  const studentId = await getStudentIdFromToken(request);
	  
	  const { searchParams } = new URL(request.url);
	  const page = parseInt(searchParams.get("page") || "1");
	  const limit = parseInt(searchParams.get("limit") || "50");
	  const status = searchParams.get("status");
	  
	  const skip = (page - 1) * limit;

  
	  // Build where clause
	  const where: any = {
		studentId,
	  };
  
	  if (status) {
		where.status = status.toUpperCase();
	  }
  
	  // Get applications with internship and company details
	  const [applications, total] = await Promise.all([
		prisma.application.findMany({
		  where,
		  skip,
		  take: limit,
		  orderBy: {
			appliedAt: "desc", // Most recent first
		  },
		  include: {
			internship: {
			  select: {
				id: true,
				title: true,
				location: true,
				isRemote: true,
				company: {
				  select: {
					companyName: true,
					location: true,
				  },
				},
			  },
			},
		  },
		}),
		prisma.application.count({ where }),
	  ]);
  
	  // Transform data for frontend (optional, for cleaner structure)
	  const transformedApplications = applications.map(app => ({
		id: app.id,
		status: app.status,
		appliedAt: app.appliedAt,
		coverLetter: app.coverLetter,
		internship: {
		  id: app.internship.id,
		  title: app.internship.title,
		  location: app.internship.location,
		  isRemote: app.internship.isRemote,
		  company: {
			companyName: app.internship.company.companyName,
			location: app.internship.company.location,
		  },
		},
	  }));
  
	  return Response.json(
		{
		  success: true,
		  message: "Applications fetched successfully",
		  data: {
			applications: transformedApplications,
			pagination: {
			  current: page,
			  total: Math.ceil(total / limit),
			  count: applications.length,
			  totalCount: total,
			},
		  },
		},
		{ status: 200 }
	  );
  
	} catch (error: any) {
	  console.error("Get my applications error:", error);
	  
	  // Handle authentication errors specifically
	  if (error.message.includes('token') || error.message.includes('student')) {
		return Response.json(
		  {
			success: false,
			message: "Authentication required",
		  },
		  { status: 401 }
		);
	  }
	  
	  return Response.json(
		{
		  success: false,
		  message: "Failed to fetch applications. Please try again.",
		},
		{ status: 500 }
	  );
	}
  }
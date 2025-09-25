import { NextRequest } from "next/server";
import { getCompanyIdFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
	try {
	  const companyId = await getCompanyIdFromToken(request);
	  
	  // Get all stats in parallel
	  const [
		activeInternships,
		totalApplications,
		pendingReviews,
		acceptedApplications,
	  ] = await Promise.all([
		// Active internships count
		prisma.internship.count({
		  where: { companyId, isActive: true },
		}),
		
		// Total applications for this company's internships
		prisma.application.count({
		  where: {
			internship: { companyId },
		  },
		}),
		
		// Pending applications
		prisma.application.count({
		  where: {
			internship: { companyId },
			status: 'PENDING',
		  },
		}),
		
		// Accepted applications (hired)
		prisma.application.count({
		  where: {
			internship: { companyId },
			status: 'ACCEPTED',
		  },
		}),
	  ]);
  
	  return Response.json({
		success: true,
		data: {
		  activeInternships,
		  totalApplications,
		  pendingReviews,
		  hired: acceptedApplications,
		},
	  });
	  
	} catch (error) {
	  console.error("Dashboard stats error:", error);
	  return Response.json({
		success: false,
		message: "Failed to fetch dashboard stats",
	  }, { status: 500 });
	}
  }
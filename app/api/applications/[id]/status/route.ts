import { getCompanyIdFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest, { params }: any) {
	const { status } = await request.json(); // "ACCEPTED" or "REJECTED"
	const companyId = await getCompanyIdFromToken(request);
	
	// Update application status with company authorization check
	const application = await prisma.application.update({
	  where: { 
		id: params.id,
		internship: { companyId } // Ensure company owns this internship
	  },
	  data: { status: status.toUpperCase() },
	});
	
	return Response.json({ success: true, data: application });
  }
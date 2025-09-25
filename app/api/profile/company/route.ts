import { getCompanyIdFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
	try {
	  const companyId = await getCompanyIdFromToken(request);
	  const { companyName, website, description, logoUrl } = await request.json();
	  
	  const updatedProfile = await prisma.companyProfile.update({
		where: { userId: companyId },
		data: {
		  companyName,
		  website,
		  description,
		  logoUrl,
		},
	  });
	  
	  return Response.json({
		success: true,
		data: updatedProfile
	  });
	  
	} catch (error) {
	  return Response.json({
		success: false,
		message: "Failed to update profile"
	  }, { status: 500 });
	}
  }
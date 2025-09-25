import { getStudentIdFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
	try {
		const userId = await getStudentIdFromToken(request);
		const { skills } = await request.json();

		let skillRecords: string[] = [];
		if (skills && skills.length > 0) {
			skillRecords = await Promise.all(
				skills.map(async (skillName: string) => {
					const skill = await prisma.skill.upsert({
						where: { name: skillName },
						create: { name: skillName },
						update: {},
						select: { id: true },
					});
					return skill.id;
				})
			);
		}

		await prisma.$transaction(async (tx) => {
			// Delete existing skills
			await tx.userSkill.deleteMany({
				where: { userId },
			});

			if (skillRecords.length > 0) {
				await tx.userSkill.createMany({
					data: skillRecords.map((skillId: string) => ({
						userId,
						skillId,
					})),
				});
			}
		});

		return Response.json({ success: true });
	} catch (error) {
		console.error("Skills update error:", error);
		return Response.json(
			{
				success: false,
				message: "Failed to update skills",
			},
			{ status: 500 }
		);
	}
}

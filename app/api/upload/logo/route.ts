import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("logo") as File;
		const uploadType = (formData.get("type") as string) || "company-logo";

		// Convert file to buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Determine folder and transformations based on type
		const getUploadConfig = (type: string) => {
			switch (type) {
				case "student-avatar":
					return {
						folder: "student-avatars",
						transformation: [
							{ width: 200, height: 200, crop: "fill", gravity: "face" },
							{ quality: "auto", fetch_format: "auto" },
						],
					};
				case "student-resume":
					return {
						folder: "student-resumes",
						transformation: [{ quality: "auto", fetch_format: "auto" }],
					};
				case "company-logo":
				default:
					return {
						folder: "company-logos",
						transformation: [
							{ width: 300, height: 300, crop: "limit" },
							{ quality: "auto", fetch_format: "auto" },
						],
					};
			}
		};

		const config = getUploadConfig(uploadType);

		const uploadResult = await new Promise<UploadApiResponse>(
			(resolve, reject) => {
				cloudinary.uploader
					.upload_stream(config, (error, result) => {
						if (error) {
							reject(error);
						} else if (result) {
							resolve(result);
						} else {
							reject(new Error("Upload failed with no result"));
						}
					})
					.end(buffer);
			}
		);

		const responseData =
			uploadType === "student-avatar"
				? { profilePictureUrl: uploadResult.secure_url }
				: uploadType === "student-resume"
					? { resumeUrl: uploadResult.secure_url }
					: { logoUrl: uploadResult.secure_url };

		return Response.json({
			success: true,
			data: responseData,
		});
	} catch (error) {
		console.error("Upload error:", error);
		return Response.json(
			{
				success: false,
				message: "Failed to upload image",
			},
			{ status: 500 }
		);
	}
}

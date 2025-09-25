import { CompanyProfile, StudentProfile } from "@/types/interface";
import { RegistrationData, LoginData, InternshipData } from "./validation";

const API_BASE = "/api";

export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
	errors?: Record<string, string[]>;
}

// Generic API call function
async function apiCall<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> {
	try {
		const response = await fetch(`${API_BASE}${endpoint}`, {
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			...options,
		});

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("API call failed:", error);
		return {
			success: false,
			message: "Network error. Please check your connection.",
		};
	}
}

// Token management for client-side
export const tokenManager = {
	set: (token: string) => {
		if (typeof window !== "undefined") {
			localStorage.setItem("authToken", token);
		}
	},

	get: (): string | null => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("authToken");
		}
		return null;
	},

	remove: () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("authToken");
		}
	},

	// Get Authorization header
	getAuthHeader: (): Record<string, string> => {
		const token = tokenManager.get();
		return token ? { Authorization: `Bearer ${token}` } : {};
	},
};

// Authenticated API calls
export const authenticatedApiCall = <T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> => {
	return apiCall(endpoint, {
		...options,
		headers: {
			...tokenManager.getAuthHeader(),
			...options.headers,
		},
	});
};

export const internshipsApi = {
	// Post new internship
	create: async (internshipData: InternshipData): Promise<ApiResponse> => {
		return authenticatedApiCall("/internships", {
			method: "POST",
			body: JSON.stringify(internshipData),
		});
	},

	// Get all internships
	getAll: async (filters?: {
		page?: number;
		limit?: number;
		location?: string;
		isRemote?: boolean;
		search?: string;
	}): Promise<ApiResponse> => {
		const params = new URLSearchParams();

		if (filters?.page) params.append("page", filters.page.toString());
		if (filters?.limit) params.append("limit", filters.limit.toString());
		if (filters?.location) params.append("location", filters.location);
		if (filters?.isRemote !== undefined)
			params.append("isRemote", filters.isRemote.toString());
		if (filters?.search) params.append("search", filters.search);

		const queryString = params.toString();
		const url = queryString ? `/internships?${queryString}` : "/internships";

		return authenticatedApiCall(url, {
			method: "GET",
		});
	},

	update: async (
		id: string,
		data: Partial<InternshipData>
	): Promise<ApiResponse> => {
		return authenticatedApiCall(`/internships/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	},

	delete: async (id: string): Promise<ApiResponse> => {
		return authenticatedApiCall(`/internships/${id}`, {
			method: "DELETE",
		});
	},
};

// Auth API functions
export const authApi = {
	// Register new user
	register: async (userData: RegistrationData): Promise<ApiResponse> => {
		return apiCall("/auth/register", {
			method: "POST",
			body: JSON.stringify(userData),
		});
	},

	// Login user
	login: async (credentials: LoginData): Promise<ApiResponse> => {
		return apiCall("/auth/login", {
			method: "POST",
			body: JSON.stringify(credentials),
		});
	},

	// Get current user
	me: async (): Promise<ApiResponse> => {
		return authenticatedApiCall("/auth/me", {
			method: "GET",
		});
	},

	logout: async (): Promise<ApiResponse> => {
		return apiCall("/auth/logout", {
			method: "POST",
		});
	},
};

export const applicationsApi = {
	create: async (applicationData: {
		internshipId: string;
		coverLetter?: string;
	}): Promise<ApiResponse> => {
		return authenticatedApiCall("/applications", {
			method: "POST",
			body: JSON.stringify(applicationData),
		});
	},

	getStatus: async (internshipId: string): Promise<ApiResponse> => {
		return authenticatedApiCall(`/applications/status/${internshipId}`, {
			method: "GET",
		});
	},

	// Get all user applications
	getMyApplications: async (): Promise<ApiResponse> => {
		return authenticatedApiCall("/applications/my", {
			method: "GET",
		});
	},

	getCompanyApplications: async (filters?: {
		page?: number;
		limit?: number;
		status?: string;
	}): Promise<ApiResponse> => {
		const params = new URLSearchParams();
		if (filters?.page) params.append("page", filters.page.toString());
		if (filters?.limit) params.append("limit", filters.limit.toString());
		if (filters?.status) params.append("status", filters.status);

		const queryString = params.toString();
		const url = queryString
			? `/applications/company?${queryString}`
			: "/applications/company";

		return authenticatedApiCall(url, { method: "GET" });
	},

	updateStatus: async (
		applicationId: string,
		status: string
	): Promise<ApiResponse> => {
		return authenticatedApiCall(`/applications/${applicationId}/status`, {
			method: "PATCH",
			body: JSON.stringify({ status }),
		});
	},
};

export const dashboardApi = {
	getStats: async (): Promise<ApiResponse> => {
		return authenticatedApiCall("/dashboard/stats", {
			method: "GET",
		});
	},
};

export const profileApi = {
	updateCompanyProfile: async (
		data: Partial<CompanyProfile>
	): Promise<ApiResponse> => {
		return authenticatedApiCall("/profile/company", {
			method: "PUT",
			body: JSON.stringify(data),
		});
	},

	uploadImage: async (
		file: File,
		type: "company-logo" | "student-avatar" = "company-logo"
	): Promise<ApiResponse> => {
		const formData = new FormData();
		formData.append("logo", file);
		formData.append("type", type);

		return authenticatedApiCall("/upload/logo", {
			method: "POST",
			body: formData,
		});
	},

	updateStudentProfile: async (
		data: Partial<StudentProfile>
	): Promise<ApiResponse> => {
		return authenticatedApiCall("/profile/student", {
			method: "PUT",
			body: JSON.stringify(data),
		});
	},

	updateStudentSkills: async (skills: string[]): Promise<ApiResponse> => {
		return authenticatedApiCall("/profile/student/skills", {
			method: "PUT",
			body: JSON.stringify({ skills }),
		});
	},
};

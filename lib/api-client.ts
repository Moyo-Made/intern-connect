import { RegistrationData, LoginData } from "./validation";

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
			localStorage.setItem("token", token);
		}
	},

	get: (): string | null => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("token");
		}
		return null;
	},

	remove: () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("token");
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

	// Get current user (NEW!)
	me: async (): Promise<ApiResponse> => {
		return authenticatedApiCall("/auth/me", {
			method: "GET",
		});
	},

	// Logout user (if you implement server-side logout)
	logout: async (): Promise<ApiResponse> => {
		return apiCall("/auth/logout", {
			method: "POST",
		});
	},
};

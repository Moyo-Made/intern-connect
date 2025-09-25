"use client";

import {
	createContext,
	useContext,
	useReducer,
	useEffect,
	useCallback,
	ReactNode,
} from "react";
import { authApi, tokenManager } from "@/lib/api-client";
import { RegistrationData, LoginData } from "@/lib/validation";
import { AuthState, AuthUser } from "@/types/interface";

type AuthAction =
	| { type: "AUTH_START" }
	| { type: "AUTH_SUCCESS"; payload: AuthUser }
	| { type: "AUTH_ERROR"; payload: string }
	| { type: "AUTH_LOGOUT" }
	| { type: "CLEAR_ERROR" };

const initialState: AuthState = {
	user: null,
	isLoading: true,
	isAuthenticated: false,
	error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
	switch (action.type) {
		case "AUTH_START":
			return {
				...state,
				isLoading: true,
				error: null,
			};

		case "AUTH_SUCCESS":
			return {
				...state,
				isLoading: false,
				isAuthenticated: true,
				user: action.payload,
				error: null,
			};

		case "AUTH_ERROR":
			return {
				...state,
				isLoading: false,
				isAuthenticated: false,
				user: null,
				error: action.payload,
			};

		case "AUTH_LOGOUT":
			return {
				...state,
				isLoading: false,
				isAuthenticated: false,
				user: null,
				error: null,
			};

		case "CLEAR_ERROR":
			return {
				...state,
				error: null,
			};

		default:
			return state;
	}
}

interface AuthContextType extends AuthState {
	login: (
		credentials: LoginData
	) => Promise<{ success: boolean; message: string }>;
	register: (
		userData: RegistrationData
	) => Promise<{ success: boolean; message: string }>;
	logout: () => void;
	clearError: () => void;
	checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(authReducer, initialState);

	const checkAuthStatus = async () => {
		// Check both token sources
		let token = tokenManager.get();

		if (!token) {
			dispatch({ type: "AUTH_ERROR", payload: "No token found" });
			return;
		}

		try {
			// Use your API client instead of raw fetch
			const result = await authApi.me();

			if (result.success && result.data) {
				dispatch({
					type: "AUTH_SUCCESS",
					payload: {
						user: result.data.user,
						profile: result.data.profile,
						logoUrl: result.data.logoUrl
					},
				});
			} else {
				tokenManager.remove();
				dispatch({
					type: "AUTH_ERROR",
					payload: result.message || "Token verification failed",
				});
			}
		} catch (error) {
			console.error("💥 Auth check error:", error);
			tokenManager.remove();
			dispatch({
				type: "AUTH_ERROR",
				payload: "Network error during auth check",
			});
		}
	};

	const login = async (credentials: LoginData) => {
		dispatch({ type: "AUTH_START" });

		try {
			const response = await authApi.login(credentials);

			if (response.success && response.data) {
				// Save token in multiple places for reliability
				if (tokenManager?.set) {
					tokenManager.set(response.data.token);
				}

				dispatch({
					type: "AUTH_SUCCESS",
					payload: {
						user: response.data.user,
						profile: response.data.profile,
						logoUrl: response.data.logoUrl
					},
				});

				return {
					success: true,
					message: "Login successful!",
					redirectPath:
						response.data.user.userType === "STUDENT"
							? "/dashboard/student"
							: "/dashboard/company",
				};
			} else {
				dispatch({ type: "AUTH_ERROR", payload: response.message });
				return { success: false, message: response.message };
			}
		} catch (error) {
			console.error("💥 Login error:", error);
			const message = "Login failed. Please try again.";
			dispatch({ type: "AUTH_ERROR", payload: message });
			return { success: false, message };
		}
	};

	const register = async (userData: RegistrationData) => {
		dispatch({ type: "AUTH_START" });

		try {
			const response = await authApi.register(userData);

			if (response.success && response.data) {
				// Save token in multiple places
				if (tokenManager?.set) {
					tokenManager.set(response.data.token);
				}

				dispatch({
					type: "AUTH_SUCCESS",
					payload: {
						user: response.data.user,
						profile: response.data.profile,
						logoUrl: response.data.logoUrl
					},
				});

				return {
					success: true,
					message: "Account registration successful!",
					redirectPath:
						response.data.user.userType === "STUDENT"
							? "/dashboard/student"
							: "/dashboard/company",
				};
			} else {
				dispatch({ type: "AUTH_ERROR", payload: response.message });
				return { success: false, message: response.message };
			}
		} catch (error) {
			const message = "Registration failed. Please try again.";
			dispatch({ type: "AUTH_ERROR", payload: message });
			return { success: false, message };
		}
	};

	const logout = useCallback(() => {
		// Clear all token storage
		if (tokenManager?.remove) {
			tokenManager.remove();
		}

		dispatch({ type: "AUTH_LOGOUT" });
	}, []);

	const clearError = useCallback(() => {
		dispatch({ type: "CLEAR_ERROR" });
	}, []);

	// Check auth status on mount
	useEffect(() => {
		checkAuthStatus();
	}, []);

	const contextValue: AuthContextType = {
		...state,
		login,
		register,
		logout,
		clearError,
		checkAuthStatus,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}

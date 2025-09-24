import { UserType } from "@prisma/client";

export interface User {
	id: string;
	email: string;
	userType: UserType;
	isVerified: boolean;
	createdAt: string;
}

export interface StudentProfile {
	id: string;
	firstName: string;
	lastName: string;
	university: string;
	major: string;
	graduationYear: number;
	phone?: string;
	resumeUrl?: string;
	bio?: string;
	portfolioUrl?: string;
	linkedinUrl?: string;
	githubUrl?: string;
	skills: string[]
}

export interface CompanyProfile {
	id: string;
	companyName: string;
	industry: string;
	location: string;
	website?: string;
	description?: string;
	companySize: string;
	logoUrl?: string;
	phoneNumber?: number;
}

export interface AuthUser {
	user: User;
	profile: StudentProfile | CompanyProfile;
}

export interface AuthState {
	user: AuthUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	error: string | null;
}

export interface Company {
	companyName: string;
}

export interface Internship {
	id: string;
	title: string;
	company: Company | string;
}

export interface ApplyModalProps {
	internship: Internship;
	isOpen: boolean;
	onClose: () => void;
}

export interface ApplicationData {
	internshipId: string;
	coverLetter?: string;
}

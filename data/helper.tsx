import { CheckCircle, Clock, XCircle } from "lucide-react";

export const getStatusColor = (isActive: boolean) => {
	return isActive
		? "bg-green-100 text-green-800 rounded-full"
		: "bg-gray-100 text-gray-800 rounded-full";
};

export const getApplicationStatusColor = (status: string) => {
	switch (status) {
		case "accepted":
			return "bg-green-100 text-green-800";
		case "rejected":
			return "bg-red-100 text-red-800";
		case "pending": 
			return "bg-yellow-100 text-yellow-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export const getApplicationStatusIcon = (status: string) => {
	switch (status) {
		case "accepted":
			return <CheckCircle className="w-4 h-4 text-green-500" />;
		case "rejected":
			return <XCircle className="w-4 h-4 text-red-500" />;
		case "pending": 
			return <Clock className="w-4 h-4 text-yellow-500" />;
		default:
			return <Clock className="w-4 h-4 text-gray-500" />;
	}
};

export const formatDate = (isoDate: string | number | Date) => {
	const date = new Date(isoDate);
	const day = date.getDate();
	const month = date.toLocaleDateString('en-US', { month: 'long' });
	const year = date.getFullYear();
	return `${day}, ${month}, ${year}`;
  };
  

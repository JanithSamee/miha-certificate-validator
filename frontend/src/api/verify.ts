export interface VerificationResponse {
	valid: boolean;
	message?: string;
	data?: {
		name: string;
		studentId: string;
		courseName: string;
		dateOfIssue: string;
	};
}

export const verifyTokenWithBackend = async (
	token: string,
): Promise<VerificationResponse> => {
	try {
		const response = await fetch("/.netlify/functions/verifyCertificate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ token }),
		});

		if (!response.ok) {
			throw new Error("Failed to communicate with verification server.");
		}

		return await response.json();
	} catch (error) {
		return { valid: false, message: (error as Error).message };
	}
};

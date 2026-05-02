import React, { useState } from "react";
import axios from "axios";

interface CertificateData {
	name: string;
	studentId: string;
	dateOfIssue: string;
	courseName: string;
}

export default function App() {
	const [cid, setCid] = useState("");
	const [certificate, setCertificate] = useState<CertificateData | null>(
		null,
	);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleVerify = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setCertificate(null);

		if (!cid.trim()) {
			setError("Please enter a valid Certificate ID.");
			return;
		}

		setLoading(true);

		try {
			const baseUrl =
				import.meta.env.VITE_API_URL || "http://localhost:5000/api";
			const response = await axios.get(`${baseUrl}/verify/${cid}`);
			setCertificate(response.data);
		} catch (err: any) {
			if (err.response && err.response.data && err.response.data.error) {
				setError(err.response.data.error);
			} else {
				setError(err.message || "Failed to verify certificate");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#0f448c] text-white font-sans flex flex-col">
			{/* Navigation Bar */}
			<nav className="w-full bg-[#05105c] px-8 py-5 flex items-center justify-between shadow-lg">
				<div className="flex items-center gap-3">
					{/* Mock Shield/Logo Icon + Title */}
					<div className="flex items-center justify-center font-bold text-xl tracking-wide text-white">
						<span className="text-yellow-400 mr-2 border-2 border-yellow-400 rounded-sm px-1 text-sm">
							MIHA
						</span>
						MIHA - Navigate To Victory
					</div>
				</div>
				<div className="hidden sm:flex gap-8 text-sm font-semibold uppercase tracking-widest text-gray-300">
					<a href="#" className="hover:text-white transition-colors">
						Home
					</a>
					<a
						href="#"
						className="text-white border-b-2 border-white pb-1">
						Verify
					</a>
					<a href="#" className="hover:text-white transition-colors">
						Contact
					</a>
				</div>
			</nav>

			{/* Main Content Area */}
			<main className="flex-grow flex flex-col items-center justify-center p-6 pb-20">
				{/* Description Text */}
				<div className="mb-10 text-center max-w-2xl mt-8">
					<p className="text-white text-lg leading-relaxed">
						Enter the Certificate ID (CID) below to verify the
						authenticity of
						<br />
						the document and view student credentials.
					</p>
				</div>

				{/* Verification Card */}
				<div className="w-full max-w-[480px] bg-white text-gray-900 rounded-md shadow-2xl p-8">
					<form
						onSubmit={handleVerify}
						className="flex flex-col gap-6">
						<div>
							<label
								htmlFor="cid"
								className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
								Certificate ID
							</label>
							<input
								type="text"
								id="cid"
								value={cid}
								onChange={(e) => setCid(e.target.value)}
								placeholder="E.G., MIHA-1001"
								className="w-full px-4 py-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 uppercase transition-all"
							/>
						</div>
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-[#f5a623] hover:bg-[#e0961c] text-gray-900 font-bold py-4 rounded uppercase tracking-wider transition duration-300 disabled:opacity-60 flex justify-center items-center gap-2 shadow-sm">
							{loading ? "Verifying..." : "Verify Certificate"}
						</button>
					</form>

					{/* Error / Rate Limit Message Display */}
					{error && (
						<div className="mt-6 p-4 bg-red-50 text-red-700 rounded border-l-4 border-red-500 shadow-sm">
							<p className="text-sm font-semibold">{error}</p>
						</div>
					)}

					{/* Successful Result Display */}
					{certificate && (
						<div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-inner">
							<div className="flex items-center gap-2 mb-5 border-b border-gray-300 pb-3">
								<span className="bg-green-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-sm">
									✓
								</span>
								<h3 className="text-lg font-bold text-[#05105c] uppercase tracking-wide">
									Verified Record
								</h3>
							</div>

							<div className="space-y-5 text-sm">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex flex-col">
										<span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
											Student Name
										</span>
										<span className="text-base font-semibold text-gray-900">
											{certificate.name}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
											Student ID
										</span>
										<span className="text-base font-semibold text-gray-900">
											{certificate.studentId}
										</span>
									</div>
								</div>
								<div className="flex flex-col">
									<span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
										Course Name
									</span>
									<span className="text-base font-semibold text-gray-900">
										{certificate.courseName}
									</span>
								</div>
								<div className="flex flex-col">
									<span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
										Date of Issue
									</span>
									<span className="text-base font-semibold text-gray-900">
										{certificate.dateOfIssue}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</main>

			{/* Footer */}
			<footer className="w-full bg-[#030a40] py-8 px-4 text-center">
				<p className="text-white text-sm font-medium tracking-wide">
					&copy; {new Date().getFullYear()} MIHA - Navigate To
					Victory. All rights reserved.
				</p>
				<p className="text-gray-400 text-xs mt-2 font-light">
					Secure Certificate Verification System
				</p>
			</footer>
		</div>
	);
}

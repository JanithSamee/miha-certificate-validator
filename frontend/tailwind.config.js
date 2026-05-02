/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"miha-blue": "#040b8a", // Extracted from your logo
				"miha-yellow": "#ffde00", // Extracted from your logo
			},
		},
	},
	plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				base: {
					50: '#F0FAF7',
					100: '#D4F2E9',
					200: '#A2E2CF',
					300: '#38B28E',
					400: '#2A8469',
					500: '#1B5544',
					600: '#11362B',
					700: '#0B231C',
					800: '#06130F',
					900: '#040C09'
				},
				primary: '#89E8CB',
				secondary: '#129C72',
				accent: '#3DF4BA'
			}
		}
	},
	plugins: []
};

/*
Original color pallete was:
50: "#F0FAF7",
100: "#D1EFE8",
200: "#A4E0D2",
300: "#49C1A5",
400: "#39A78D",
500: "#2D836F",
600: "#19483D",
700: "#103028",
800: "#081814",
900: "#06130F",
*/

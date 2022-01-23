const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
	darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
		plugin(({ addUtilities }) => {
			addUtilities({
				'.no-scrollbar::-webkit-scrollbar': {
					'display': 'none'
				},
				'.no-scrollbar': {
					'-ms-overflow-style': 'none',
					'scrollbar-width': 'none'
				}
			})
		})
	],
}

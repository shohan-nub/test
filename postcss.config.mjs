// Turbopack already compiles Tailwind through its globals.css loader.
const config = {
  plugins: process.env.TURBOPACK ? {} : { "@tailwindcss/postcss": {} },
};

export default config;

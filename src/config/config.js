export const config = {
  env: {
      name: import.meta.env.MODE,
      isProd: import.meta.env.MODE === "production",
      isDev: import.meta.env.MODE === "development",
  },
}
export const config = {
  env: {
      name: process.env.NODE_ENV,
      isProd: process.env.NODE_ENV === "production",
      isDev: process.env.NODE_ENV === "development",
  },
}
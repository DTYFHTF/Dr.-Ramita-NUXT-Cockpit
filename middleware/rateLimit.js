// // middleware/rateLimit.js
// import rateLimit from 'express-rate-limit'

// export default rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // Limit each IP to 5 requests per window
//   handler: (_, res) => {
//     res.status(429).json({
//       code: 429,
//       message: 'Too many requests, please try again later'
//     })
//   }
// })

// // nuxt.config.js
// export default {
//   // ... other config
//   nitro: {
//     plugins: ['~/server/middleware/rateLimit.js']
//   }
// }
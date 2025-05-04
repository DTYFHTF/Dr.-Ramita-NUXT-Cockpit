// server/api/book.post.js (additional)
// Trigger confirmation email


// await $fetch(`${config.cockpitUrl}/api/collections/save/emails`, {
//     method: 'POST',
//     body: {
//       data: {
//         template: 'booking-confirmation',
//         to: body.patient_email,
//         variables: {
//           name: body.patient_name,
//           date: new Date(body.date).toLocaleDateString(),
//           time: new Date(body.date).toLocaleTimeString()
//         }
//       },
//       token: config.cockpitToken
//     }
//   })
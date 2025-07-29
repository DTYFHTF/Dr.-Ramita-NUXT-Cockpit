// server/api/book.js
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig()
  
    // Validate required fields
    if(!body.patient_name || !body.patient_email || !body.phone) {
      throw createError({ statusCode: 400, message: 'Missing required fields' })
    }
  
    // Check slot availability
    const existing = await $fetch(`${config.cockpitUrl}/api/collections/get/consultations`, {
      params: {
        token: config.public.cockpitToken,
        filter: {
          date: body.date,
          '$or': [
            { status: 'pending' },
            { status: 'confirmed' }
          ]
        }
      }
    })
  
    if(existing.length > 0) {
      throw createError({ statusCode: 409, message: 'Slot already booked' })
    }
  
    // Save booking
    const booking = await $fetch(`${config.cockpitUrl}/api/collections/save/consultations`, {
      method: 'POST',
      body: {
        data: {
          ...body,
          status: 'pending'
        },
        token: config.public.cockpitToken
      }
    })
  
    return { success: true, bookingId: booking._id }
  })
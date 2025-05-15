import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  console.log('API hit'); // Test log to confirm endpoint is being hit

  const config = useRuntimeConfig();
  const apiUrl = `${config.public.cockpitUrl}/api/content/items/glossary?api-token=${config.cockpitToken}`;

  try {
    const response = await $fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response) {
      throw new Error('Failed to fetch glossary terms');
    }

    const resolvedTerms = await Promise.all(
      response.map(async (term) => {
        const resolvedTerm = {
          ...term,
          slug: term.slug || term.title.toLowerCase().replace(/\s+/g, '-'), // Ensure slug is correct
          details: term.details.map((detail) => {
            return {
              ...detail,
            };
          }),
        };

        return resolvedTerm;
      })
    );

    return resolvedTerms;
  } catch (error) {
    console.error('Error fetching glossary terms:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch glossary terms',
    });
  }
});

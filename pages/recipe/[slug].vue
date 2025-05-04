<template>
    Hello World! 
</template>

<script setup>
const route = useRoute();
const { data: recipe, error } = await useAsyncData(`recipe-${route.params.slug}`, 
  () => $fetch(`/api/recipes/${route.params.slug}`)
);

if (!recipe.value) {
  throw createError({ statusCode: 404, message: 'Recipe not found' })
}

useHead({
  title: recipe.value.title,
  meta: [{
    name: 'description',
    content: recipe.value.metaDescription
  }],
  link: [{
    rel: 'canonical',
    href: `https://yourdomain.com/recipes/${route.params.slug}`
  }]
});
</script>


<template>
    <!-- <article class="container mx-auto px-4 py-12 max-w-4xl">
      <div v-if="pending" class="space-y-8">
        <div class="h-96 bg-gray-100 rounded-lg animate-pulse"></div>
        <div class="space-y-4">
          <div class="h-8 bg-gray-100 w-2/3 rounded"></div>
          <div class="h-4 bg-gray-100 w-1/4 rounded"></div>
        </div>
      </div>
  
      <div v-else> -->
        <!-- Hero Section -->
        <!-- <div class="mb-12">
          <img 
            :src="recipe.featuredImage.path" 
            :alt="recipe.featuredImage.alt"
            class="w-full h-96 object-cover rounded-lg shadow-lg"
          >
        </div>
   -->
        <!-- Header -->
        <!-- <header class="mb-12 text-center">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">{{ recipe.title }}</h1>
          <div class="meta flex justify-center gap-6 text-gray-600">
            <div class="flex items-center gap-2">
              <ClockIcon class="w-5 h-5" />
              <span>{{ recipe.preparationTime }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UserGroupIcon class="w-5 h-5" />
              <span>{{ recipe.servings }} servings</span>
            </div>
          </div>
        </header> -->
  
        <!-- Content Grid -->
        <!-- <div class="grid lg:grid-cols-3 gap-12"> -->
          <!-- Ingredients & Benefits -->
          <!-- <div class="lg:col-span-1 space-y-8">
            <SectionCard title="Ingredients">
              <ul class="space-y-3">
                <li 
                  v-for="(ingredient, index) in recipe.ingredients" 
                  :key="index"
                  class="flex items-start gap-3"
                >
                  <CheckCircleIcon class="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <span class="text-gray-700">{{ ingredient }}</span>
                </li>
              </ul>
            </SectionCard>
  
            <SectionCard title="Health Benefits">
              <ul class="space-y-3">
                <li 
                  v-for="(benefit, index) in recipe.healthBenefits" 
                  :key="index"
                  class="flex items-start gap-3"
                >
                  <HeartIcon class="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span class="text-gray-700">{{ benefit }}</span>
                </li>
              </ul>
            </SectionCard>
          </div> -->
  
          <!-- Instructions -->
          <!-- <div class="lg:col-span-2">
            <SectionCard title="Instructions">
              <div 
                class="prose max-w-none"
                v-html="recipe.instructions"
              ></div>
            </SectionCard>
          </div>
        </div>
      </div>
    </article> -->
    Hello World! This is the recipe page for {{ recipe.title }}.
  </template>
  
  <script setup>
  definePageMeta({
    layout: 'default'
  })
  
  const route = useRoute()
  const { data: recipe, pending } = await useAsyncData(`recipe-${route.params.id}`, () => 
    $fetch(`/api/recipes/${route.params.id}`))
  </script>
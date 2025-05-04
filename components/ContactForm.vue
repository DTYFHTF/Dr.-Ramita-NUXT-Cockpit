<template>
  <form class="contact-form border rounded p-4 shadow">
    <h2 class="text-xl font-bold mb-4">Contact Us</h2>
    <div class="mb-4">
      <label for="name" class="block text-sm font-bold mb-2">Name</label>
      <input id="name" type="text" class="w-full border rounded p-2" />
    </div>
    <div class="mb-4">
      <label for="email" class="block text-sm font-bold mb-2">Email</label>
      <input id="email" type="email" class="w-full border rounded p-2" />
    </div>
    <div class="mb-4">
      <label for="message" class="block text-sm font-bold mb-2">Message</label>
      <textarea id="message" class="w-full border rounded p-2"></textarea>
    </div>
    <button type="submit" class="bg-green-700 text-white rounded px-4 py-2 shadow">Send</button>
  </form>
</template>
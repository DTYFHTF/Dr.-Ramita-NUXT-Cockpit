<template>
  <section class="social-media-follow py-5">
    <div class="container">
      <div class="text-center">
        <h2 class="section-title mb-2">Follow Us On Social Media</h2>
        <p class="section-subtitle mb-4">Come, be a part of our journey</p>
        
        <div class="social-icons">
          <a 
            v-for="social in socialLinks" 
            :key="social.name"
            :href="social.url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="social-icon"
            :class="social.class"
          >
            <i :class="social.icon"></i>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  socialLinks: {
    type: Array,
    default: () => [
      {
        name: 'Instagram',
        url: 'https://instagram.com/patanjaliayurved',
        icon: 'bi bi-instagram',
        class: 'instagram'
      },
      {
        name: 'Facebook',
        url: 'https://facebook.com/patanjaliayurved',
        icon: 'bi bi-facebook',
        class: 'facebook'
      },
      {
        name: 'Twitter',
        url: 'https://twitter.com/patanjaliayurved',
        icon: 'bi bi-twitter',
        class: 'twitter'
      },
      {
        name: 'YouTube',
        url: 'https://youtube.com/patanjaliayurved',
        icon: 'bi bi-youtube',
        class: 'youtube'
      },
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/company/patanjaliayurved',
        icon: 'bi bi-linkedin',
        class: 'linkedin'
      }
    ]
  }
});
</script>

<style scoped>
.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.social-icon:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  color: white;
  text-decoration: none;
}

.social-icon.instagram {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
}

.social-icon.facebook {
  background-color: #1877f2;
}

.social-icon.twitter {
  background-color: #1da1f2;
}

.social-icon.youtube {
  background-color: #ff0000;
}

.social-icon.linkedin {
  background-color: #0077b5;
}

@media (max-width: 576px) {
  .social-icon {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
  }
  
  .social-icons {
    gap: 1rem;
  }
}
</style>

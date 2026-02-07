<template>
  <div class="faq-page">
    <div class="hero-section">
      <div class="container">
        <h1>Frequently Asked Questions</h1>
        <p class="tagline">Find answers to common questions about Rishipath</p>
      </div>
    </div>

    <div class="container">
      <!-- Loading State -->
      <div v-if="faqsLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading FAQs...</span>
        </div>
      </div>

      <template v-else>
        <div class="faq-search">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search for answers..." 
            class="search-input"
          >
        </div>

        <div class="faq-categories">
          <button 
            v-for="cat in categories" 
            :key="cat"
            :class="['category-btn', { active: selectedCategory === cat }]"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <div class="faq-content">
        <div v-for="(category, index) in filteredFaqs" :key="index" class="faq-category-section">
          <h2>{{ category.name }}</h2>
          
          <div class="faq-items">
            <div 
              v-for="(faq, faqIndex) in category.items" 
              :key="faqIndex" 
              class="faq-item"
              :class="{ active: activeFaq === `${index}-${faqIndex}` }"
            >
              <button 
                class="faq-question" 
                @click="toggleFaq(`${index}-${faqIndex}`)"
              >
                <span>{{ faq.question }}</span>
                <span class="icon">{{ activeFaq === `${index}-${faqIndex}` ? '−' : '+' }}</span>
              </button>
              <transition name="slide">
                <div v-if="activeFaq === `${index}-${faqIndex}`" class="faq-answer" v-html="faq.answer"></div>
              </transition>
            </div>
          </div>
        </div>
        </div>

        <div class="still-questions">
          <h2>Still Have Questions?</h2>
          <p>If you couldn't find the answer you're looking for, we're here to help!</p>
          <NuxtLink to="/contact" class="btn-contact">Contact Us</NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface FaqItem {
  id?: number;
  category?: string;
  question: string;
  answer: string;
  order?: number;
  is_active?: boolean;
}

interface FaqCategory {
  name: string;
  items: FaqItem[];
}

const brand = useBrand();
const config = useRuntimeConfig();

definePageMeta({
})

useHead({
  title: `FAQ - ${brand.fullName}`,
  meta: [
    { name: 'description', content: `Frequently Asked Questions about ${brand.fullName} - Ayurvedic products, consultations, shipping, returns, and more.` }
  ]
})

const searchQuery = ref('');
const selectedCategory = ref('All');
const activeFaq = ref<string | null>(null);

// Fetch FAQs from API
const { data: faqResponse, pending: faqsLoading } = await useFetch<{ success: boolean; data: Record<string, FaqItem[]> }>(
  `${config.public.apiBase}/faqs`
);

// Transform API data to match component structure
const faqData = computed<FaqCategory[]>(() => {
  if (!faqResponse.value?.success || !faqResponse.value?.data) {
    return staticFallbackFaqs; // Use fallback if API fails
  }

  const grouped = faqResponse.value.data;
  return Object.entries(grouped).map(([category, items]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize
    items: items
  }));
});

// Generate categories dynamically from FAQ data
const categories = computed(() => {
  const cats = ['All', ...faqData.value.map(cat => cat.name)];
  return [...new Set(cats)]; // Remove duplicates
});

// Static fallback FAQs (in case API fails)
const staticFallbackFaqs: FaqCategory[] = [
  {
    name: 'General',
    items: [
      {
        question: 'What is Rishipath?',
        answer: `Rishipath is a comprehensive Ayurvedic wellness platform offering authentic products, personalized consultations, educational courses, and resources. We bridge ancient Ayurvedic wisdom with modern convenience, helping you achieve natural health and balance.`
      },
      {
        question: 'What is Ayurveda?',
        answer: `Ayurveda is a 5,000-year-old holistic healing system from India that means "Science of Life." It focuses on preventing illness and promoting wellness through balance in diet, lifestyle, herbs, yoga, and meditation. Ayurveda treats each person as unique, with their own constitution (Prakriti) and needs.`
      },
      {
        question: 'Is Ayurveda safe?',
        answer: `When practiced correctly under qualified guidance, Ayurveda is generally safe. However, always consult with a healthcare professional before starting any new supplements or treatments, especially if you're pregnant, nursing, taking medications, or have medical conditions. Read our <a href="/medical-disclaimer">Medical Disclaimer</a> for important information.`
      },
      {
        question: 'Do I need to know about Ayurveda to use your products?',
        answer: `No! We provide detailed product descriptions, usage guidelines, and educational resources to help beginners. Our consultation services can also guide you to the right products for your needs. Start with our beginner articles or book a consultation for personalized guidance.`
      },
      {
        question: 'Are your products certified and tested?',
        answer: `We source products from reputable manufacturers who follow good manufacturing practices (GMP). Many of our products are certified by relevant authorities and undergo third-party testing. Check individual product pages for specific certifications and quality information.`
      }
    ]
  },
  {
    name: 'Products',
    items: [
      {
        question: 'How do I choose the right products for me?',
        answer: `The best approach is to:<br>
        1. Book a consultation with an Ayurvedic practitioner for personalized recommendations<br>
        2. Read product descriptions and ingredients carefully<br>
        3. Start with products for your specific concerns (digestion, stress, immunity, etc.)<br>
        4. Check our blog articles for guidance on common issues<br>
        5. Contact our support team for product recommendations`
      },
      {
        question: 'What if I have allergies or sensitivities?',
        answer: `Always check product ingredients and labels carefully. If you have known allergies, consult your healthcare provider before using new products. Natural ingredients can still cause allergic reactions in sensitive individuals. Start with small amounts to test tolerance.`
      },
      {
        question: 'Can I take Ayurvedic products with my medications?',
        answer: `Some Ayurvedic herbs can interact with prescription medications. <strong>Always inform your doctor and pharmacist about all supplements you're taking.</strong> During consultations, our practitioners will ask about your medications and provide appropriate guidance. See our <a href="/medical-disclaimer">Medical Disclaimer</a> for more information.`
      },
      {
        question: 'How long does it take to see results?',
        answer: `Results vary by individual, product, and condition. Ayurveda focuses on gradual, sustainable healing rather than quick fixes. Some people notice improvements within days, while others may need weeks or months of consistent use. Patience and consistency are key in Ayurvedic practice.`
      },
      {
        question: 'How should I store Ayurvedic products?',
        answer: `Follow storage instructions on each product label. Generally:<br>
        • Keep in a cool, dry place away from direct sunlight<br>
        • Close containers tightly after use<br>
        • Keep oils away from heat<br>
        • Check expiration dates regularly<br>
        • Store out of reach of children and pets`
      },
      {
        question: 'Are your products suitable for vegetarians/vegans?',
        answer: `Many of our products are vegetarian or vegan, but not all. Each product page lists ingredients and dietary information. Use our filters to find vegan/vegetarian products, or contact us for specific recommendations.`
      }
    ]
  },
  {
    name: 'Orders & Shipping',
    items: [
      {
        question: 'How do I place an order?',
        answer: `Simply:<br>
        1. Browse products and add items to your cart<br>
        2. Click the cart icon and review your items<br>
        3. Click "Proceed to Checkout"<br>
        4. Create an account or log in<br>
        5. Enter shipping information<br>
        6. Choose payment method (Razorpay or Cash on Delivery)<br>
        7. Review and confirm your order`
      },
      {
        question: 'What payment methods do you accept?',
        answer: `We accept:<br>
        • Credit/Debit Cards (via Razorpay)<br>
        • UPI (via Razorpay)<br>
        • Net Banking (via Razorpay)<br>
        • Digital Wallets (via Razorpay)<br>
        • Cash on Delivery (COD) - available for eligible orders<br><br>
        All online payments are securely processed through Razorpay.`
      },
      {
        question: 'Is Cash on Delivery (COD) available?',
        answer: `Yes, COD is available for eligible orders based on location and order value. The COD option will be displayed at checkout if available for your address. COD orders may have additional handling fees.`
      },
      {
        question: 'How much is shipping?',
        answer: `Shipping charges are calculated based on:<br>
        • Order value (free shipping on orders above certain amounts)<br>
        • Delivery location<br>
        • Product weight and dimensions<br><br>
        Exact shipping costs are displayed during checkout. See our <a href="/shipping-policy">Shipping Policy</a> for details.`
      },
      {
        question: 'How long does delivery take?',
        answer: `Typical delivery times:<br>
        • Metro cities: 2-5 business days<br>
        • Other cities: 3-7 business days<br>
        • Remote areas: 5-10 business days<br><br>
        You'll receive tracking information once your order ships. Some products may require additional processing time.`
      },
      {
        question: 'Can I track my order?',
        answer: `Yes! Once shipped, you'll receive:<br>
        • Order confirmation email with tracking number<br>
        • Tracking updates via email/SMS<br>
        • Order tracking in your account dashboard<br><br>
        Log in to your account and go to "My Orders" to track all your shipments.`
      },
      {
        question: 'What if my order arrives damaged or incorrect?',
        answer: `We're sorry if this happens! Please:<br>
        1. Take photos of the damaged/incorrect items and packaging<br>
        2. Contact us at ${brand.email} within 48 hours of delivery<br>
        3. Include your order number and photos<br>
        4. We'll arrange replacement or refund promptly<br><br>
        See our <a href="/return-policy">Return Policy</a> for complete details.`
      },
      {
        question: 'Can I cancel or modify my order?',
        answer: `You can cancel or modify orders before they're shipped. Contact us immediately at ${brand.email} with your order number. Once shipped, cancellation isn't possible, but you can return items per our <a href="/return-policy">Return Policy</a>.`
      },
      {
        question: 'What is your return policy?',
        answer: `We offer returns within 7 days of delivery for unopened, unused products in original packaging. Certain items like opened supplements or personal care products may not be eligible. See our complete <a href="/return-policy">Return Policy</a> for terms and conditions.`
      }
    ]
  },
  {
    name: 'Consultations',
    items: [
      {
        question: 'What happens during an Ayurvedic consultation?',
        answer: `During a consultation, our practitioner will:<br>
        1. Assess your current health concerns and goals<br>
        2. Determine your Ayurvedic constitution (Prakriti)<br>
        3. Identify any imbalances (Vikriti)<br>
        4. Discuss your diet, lifestyle, and daily routines<br>
        5. Provide personalized recommendations for herbs, diet, lifestyle, and practices<br>
        6. Answer your questions<br><br>
        Consultations are typically 45-60 minutes and can be done via video call.`
      },
      {
        question: 'How do I book a consultation?',
        answer: `To book a consultation:<br>
        1. Visit our <a href="/booking">Booking page</a><br>
        2. Browse available practitioners and their specializations<br>
        3. Select a practitioner and available time slot<br>
        4. Complete booking form with health information<br>
        5. Make payment to confirm your appointment<br>
        6. Receive confirmation email with consultation details`
      },
      {
        question: 'Are consultations online or in-person?',
        answer: `Currently, all consultations are conducted online via video call (Google Meet, Zoom, or similar platforms). This allows us to serve clients anywhere in India and provides convenience and flexibility. You'll receive meeting details after booking.`
      },
      {
        question: 'How much does a consultation cost?',
        answer: `Consultation fees vary by practitioner's experience and specialization. Prices are clearly displayed on each practitioner's profile on our booking page. Initial consultations typically range from ₹500 to ₹2,000. Follow-up consultations are often available at reduced rates.`
      },
      {
        question: 'Can I get a consultation for my child?',
        answer: `Yes, but please consult your child's pediatrician first before booking an Ayurvedic consultation. Mention your child's age when booking so the practitioner can prepare appropriately. Some practitioners specialize in pediatric Ayurveda.`
      },
      {
        question: 'What should I prepare for my consultation?',
        answer: `Before your consultation:<br>
        • Make a list of current health concerns and questions<br>
        • Note any medications, supplements, or treatments you're currently using<br>
        • Describe your typical daily routine, diet, and sleep patterns<br>
        • Have recent medical reports available if relevant<br>
        • Ensure good internet connection for video call<br>
        • Be in a quiet, private space for the session`
      },
      {
        question: 'Will I receive a written plan after consultation?',
        answer: `Yes, most practitioners provide a written summary of recommendations including dietary guidelines, lifestyle suggestions, and herbal recommendations. This is typically emailed to you within 24-48 hours after your consultation.`
      },
      {
        question: 'Can I have follow-up consultations?',
        answer: `Absolutely! Follow-up consultations are recommended to track progress and adjust recommendations. Many practitioners offer follow-up sessions at reduced rates. Schedule follow-ups through your practitioner or via our booking page.`
      }
    ]
  },
  {
    name: 'Courses & Events',
    items: [
      {
        question: 'What courses do you offer?',
        answer: `We offer courses on various topics including:<br>
        • Introduction to Ayurveda<br>
        • Ayurvedic Nutrition and Cooking<br>
        • Herbal Medicine Basics<br>
        • Yoga and Meditation<br>
        • Seasonal Wellness and Detox<br>
        • Self-Care Practices<br>
        • Dosha-Specific Wellness<br><br>
        Visit our <a href="/courses">Courses page</a> for current offerings.`
      },
      {
        question: 'Are courses self-paced or scheduled?',
        answer: `We offer both:<br>
        • <strong>Self-paced courses:</strong> Access anytime, learn at your own speed, lifetime access<br>
        • <strong>Live courses:</strong> Scheduled sessions with real-time interaction and Q&A<br><br>
        Course format is indicated on each course page.`
      },
      {
        question: 'Do I get a certificate after completing a course?',
        answer: `Yes, most of our courses offer a certificate of completion. Requirements vary by course—some require completing all modules, while others may include quizzes or assignments. Certificate details are specified on each course page.`
      },
      {
        question: 'How do I access my purchased courses?',
        answer: `After purchasing a course:<br>
        1. Log in to your account<br>
        2. Go to "My Courses" section in your dashboard<br>
        3. Click on the course to access content<br>
        4. Start learning!<br><br>
        You'll also receive an email with access instructions.`
      },
      {
        question: 'What are wellness events?',
        answer: `We host various wellness events including:<br>
        • Webinars on Ayurvedic topics<br>
        • Meditation and yoga sessions<br>
        • Cooking demonstrations<br>
        • Seasonal wellness workshops<br>
        • Q&A sessions with experts<br><br>
        Some events are free, others require registration. Check our <a href="/events">Events page</a> for upcoming programs.`
      },
      {
        question: 'How do I register for events?',
        answer: `Browse our <a href="/events">Events page</a>, select an event you're interested in, and click "Register." Some events are free and open to all, while others may require a fee. You'll receive event details and access information via email after registration.`
      }
    ]
  },
  {
    name: 'Account & Privacy',
    items: [
      {
        question: 'Do I need an account to shop?',
        answer: `Yes, you need to create an account to complete purchases, book consultations, and access courses. Creating an account allows you to:<br>
        • Track orders and shipments<br>
        • Save your wishlist<br>
        • Access purchase history<br>
        • Manage consultations and courses<br>
        • Receive personalized recommendations`
      },
      {
        question: 'How do I create an account?',
        answer: `Click "Login/Register" in the top navigation, then select "Create Account." Provide your name, email, and password. You'll receive a verification email to activate your account. Once verified, you can start shopping!`
      },
      {
        question: 'I forgot my password. How do I reset it?',
        answer: `On the login page, click "Forgot Password." Enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password.`
      },
      {
        question: 'How do I update my account information?',
        answer: `Log in to your account and go to "Account Settings" or "Profile." You can update your:<br>
        • Name and contact details<br>
        • Email address<br>
        • Password<br>
        • Shipping addresses<br>
        • Communication preferences`
      },
      {
        question: 'Is my personal information secure?',
        answer: `Yes, we take data security seriously. We use industry-standard encryption (SSL) for all transactions, secure servers, and follow strict privacy practices. We never share your personal information with third parties without consent. Read our <a href="/privacy-policy">Privacy Policy</a> for details.`
      },
      {
        question: 'How is my payment information protected?',
        answer: `All online payments are processed through Razorpay, a PCI-DSS compliant payment gateway. We do not store your complete card details on our servers. Your payment information is encrypted and securely handled by Razorpay.`
      },
      {
        question: 'Can I delete my account?',
        answer: `Yes, you can request account deletion by contacting us at ${brand.email}. Please note that some information may be retained for legal, tax, or security purposes as outlined in our <a href="/privacy-policy">Privacy Policy</a>.`
      },
      {
        question: 'Do you send promotional emails?',
        answer: `We send newsletters, product updates, and promotional offers to subscribers. You can:<br>
        • Unsubscribe using the link in any email<br>
        • Update email preferences in your account settings<br>
        • Contact us to manage your communication preferences<br><br>
        We never spam and respect your inbox.`
      }
    ]
  }
];

const filteredFaqs = computed(() => {
  let filtered = faqData.value;

  // Filter by category
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter((cat: FaqCategory) => cat.name === selectedCategory.value);
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.map((category: FaqCategory) => ({
      ...category,
      items: category.items.filter((faq: FaqItem) => 
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query)
      )
    })).filter((category: FaqCategory) => category.items.length > 0);
  }

  return filtered;
});

const toggleFaq = (id: string) => {
  activeFaq.value = activeFaq.value === id ? null : id;
};
</script>

<style scoped lang="scss">
.faq-page {
  background: var(--surface-muted);
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, var(--brand-forest) 0%, var(--brand-forest-dark) 100%);
  color: var(--text-inverse);
  padding: 4rem 0 3rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  // Ensure text is always visible
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.15);
    pointer-events: none;
  }

  .container {
    position: relative;
    z-index: 1;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    font-weight: 700;
    color: var(--text-inverse);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .tagline {
    font-size: 1.2rem;
    color: var(--text-inverse);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
}

.faq-search {
  margin-bottom: 2rem;

  .search-input {
    width: 100%;
    padding: 1rem 1.5rem;
    font-size: 1rem;
    border: 2px solid var(--border-default);
    border-radius: 50px;
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: var(--accent-primary);
    }
  }
}

.faq-categories {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  justify-content: center;

  .category-btn {
    padding: 0.75rem 1.5rem;
    background: var(--surface-primary);
    border: 2px solid var(--border-default);
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;

    &:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }

    &.active {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
      color: var(--text-inverse);
    }
  }
}

.faq-content {
  .faq-category-section {
    background: var(--surface-primary);
    padding: 2.5rem;
    margin-bottom: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    h2 {
      color: var(--accent-primary);
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid rgba(var(--accent-primary-rgb), 0.2);
    }
  }

  .faq-items {
    .faq-item {
      border-bottom: 1px solid var(--border-default);
      margin-bottom: 1rem;

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      .faq-question {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem 0;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
        transition: color 0.3s ease;

        &:hover {
          color: var(--accent-primary);
        }

        .icon {
          font-size: 1.5rem;
          color: var(--accent-primary);
          font-weight: 300;
          margin-left: 1rem;
          flex-shrink: 0;
        }
      }

      .faq-answer {
        padding: 0 0 1.5rem 0;
        color: var(--text-primary);
        line-height: 1.8;
        font-size: 1rem;

        :deep(a) {
          color: var(--accent-primary);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s ease;

          &:hover {
            border-bottom-color: var(--accent-primary);
          }
        }

        :deep(strong) {
          font-weight: 600;
          color: var(--accent-primary-hover);
        }

        :deep(br) {
          display: block;
          content: "";
          margin: 0.5rem 0;
        }
      }
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.still-questions {
  background: linear-gradient(135deg, var(--brand-forest) 0%, var(--brand-forest-dark) 100%);
  color: var(--text-inverse);
  padding: 3rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 3rem;

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    opacity: 0.95;
  }

  .btn-contact {
    display: inline-block;
    padding: 1rem 2.5rem;
    background: var(--surface-primary);
    color: var(--accent-primary);
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 0 2rem;

    h1 {
      font-size: 2rem;
    }

    .tagline {
      font-size: 1rem;
    }
  }

  .faq-categories {
    .category-btn {
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
    }
  }

  .faq-content {
    .faq-category-section {
      padding: 1.5rem;

      h2 {
        font-size: 1.5rem;
      }
    }

    .faq-items .faq-item {
      .faq-question {
        font-size: 1rem;
        padding: 1rem 0;

        .icon {
          font-size: 1.2rem;
        }
      }

      .faq-answer {
        font-size: 0.95rem;
      }
    }
  }

  .still-questions {
    padding: 2rem 1.5rem;

    h2 {
      font-size: 1.5rem;
    }

    p {
      font-size: 1rem;
    }
  }
}
.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.3em;
}</style>

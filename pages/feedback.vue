<template>
  <div class="feedback-page">
    <div class="feedback-container">
      <h1>Submit Your Feedback</h1>
      <form @submit.prevent="submitFeedback" class="feedback-form">
        <div class="form-group">
          <label for="title" class="form-label">Title<span class="required">*</span></label>
          <input 
            type="text" 
            id="title" 
            v-model="title" 
            class="form-input"
            placeholder="Enter feedback title"
            required 
          />
        </div>
        <div class="form-group">
          <label for="description" class="form-label">Description<span class="required">*</span></label>
          <textarea 
            id="description" 
            v-model="description" 
            class="form-textarea"
            placeholder="Describe your feedback in detail"
            rows="5"
            required
          ></textarea>
        </div>
        <button type="submit" class="btn btn-smooth-success">Submit Feedback</button>
      </form>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { postContentItem } from '@/composables/useApi';

export default {
  data() {
    return {
      title: '',
      description: '',
      successMessage: '',
      errorMessage: '',
    };
  },
  methods: {
    async submitFeedback() {
      try {
        const response = await postContentItem('feedback', {
          title: this.title,
          description: this.description,
        });
        if (response) {
          this.successMessage = 'Feedback submitted successfully!';
          this.title = '';
          this.description = '';
        }
      } catch (error) {
        this.errorMessage = 'Failed to submit feedback. Please try again later.';
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.feedback-page {
  min-height: 80vh;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-light);
}

.feedback-container {
  max-width: 600px;
  width: 100%;
  background: var(--background-white);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
}

.feedback-container h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.btn {
  width: 100%;
  margin-top: 1rem;
}

.success-message {
  color: var(--color-success);
  text-align: center;
  font-weight: 600;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  border-left: 4px solid var(--color-success);
}

.error-message {
  color: var(--color-error);
  text-align: center;
  font-weight: 600;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border-left: 4px solid var(--color-error);
}
</style>
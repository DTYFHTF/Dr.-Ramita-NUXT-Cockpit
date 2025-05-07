<template>
  <div class="feedback-form">
    <h1>Submit Your Feedback</h1>
    <form @submit.prevent="submitFeedback">
      <div>
        <label for="title">Title</label>
        <input type="text" id="title" v-model="title" required />
      </div>
      <div>
        <label for="description">Description</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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

<style scoped>
.feedback-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}
.feedback-form h1 {
  text-align: center;
}
.feedback-form div {
  margin-bottom: 15px;
}
.feedback-form label {
  display: block;
  margin-bottom: 5px;
}
.feedback-form input,
.feedback-form textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.feedback-form button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.feedback-form button:hover {
  background-color: #0056b3;
}
.success-message {
  color: green;
  text-align: center;
}
.error-message {
  color: red;
  text-align: center;
}
</style>
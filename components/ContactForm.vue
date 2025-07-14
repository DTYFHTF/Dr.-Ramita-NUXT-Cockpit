<template>
  <form class="contact-form bg-white border rounded-lg p-6 shadow-sm">
    <h2 class="text-xl font-bold mb-6 text-center" style="color: var(--text-primary);">Contact Us</h2>
    
    <div class="form-group">
      <label for="name" class="form-label">Name<span class="required">*</span></label>
      <input 
        id="name" 
        type="text" 
        class="form-input" 
        placeholder="Enter your full name"
        required 
      />
    </div>
    
    <div class="form-group">
      <label for="email" class="form-label">Email<span class="required">*</span></label>
      <input 
        id="email" 
        type="email" 
        class="form-input" 
        placeholder="Enter your email address"
        required 
      />
    </div>
    
    <div class="form-group">
      <label for="message" class="form-label">Message<span class="required">*</span></label>
      <textarea 
        id="message" 
        class="form-textarea" 
        placeholder="Enter your message"
        rows="5"
        required
      ></textarea>
    </div>
    
    <button type="submit" class="btn btn-primary">
      Send Message
    </button>
  </form>
</template>

<style lang="scss" scoped>
.contact-form {
  background: var(--background-white);
  border: 2px solid var(--border-color);
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
  
  &:last-of-type {
    margin-bottom: 2rem;
  }
}

.btn {
  width: 100%;
}
</style>
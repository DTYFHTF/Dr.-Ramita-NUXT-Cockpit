<template>
  <div class="legal-page">
    <div class="container">
      <div class="legal-content">
        <h1>{{ title }}</h1>
        <p class="last-updated">Last Updated: {{ lastUpdated }}</p>

        <div v-if="$slots.notice" class="important-notice">
          <slot name="notice" />
        </div>

        <div class="content-body">
          <slot />
        </div>

        <div v-if="$slots.acknowledgement" class="acknowledgement">
          <slot name="acknowledgement" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  lastUpdated: string;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.legal-page {
  min-height: 100vh;
  padding: 4rem 0;
  background: var(--surface-muted);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.legal-content {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h1 {
    color: var(--accent-primary);
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .last-updated {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 2rem;
    font-style: italic;
  }

  .important-notice {
    background: #f8d7da;
    border-left: 4px solid #dc3545;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border-radius: 4px;

    :deep(p) {
      margin-bottom: 0.75rem;
      color: #721c24;
      line-height: 1.6;

      &:last-child {
        margin-bottom: 0;
      }
    }

    :deep(strong) {
      font-weight: 600;
    }
  }

  .acknowledgement {
    background: #d4edda;
    border-left: 4px solid #28a745;
    padding: 1.5rem;
    margin-top: 2rem;
    border-radius: 4px;

    :deep(p) {
      margin: 0;
      color: #155724;
      font-size: 1.05rem;
      line-height: 1.6;
    }

    :deep(strong) {
      font-weight: 600;
    }
  }

  .content-body {
    :deep(section) {
      margin-bottom: 2.5rem;

      h2 {
        color: var(--accent-primary);
        font-size: 1.5rem;
        margin-bottom: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(var(--accent-primary-rgb), 0.1);
      }

      h3 {
        color: var(--accent-primary-hover);
        font-size: 1.2rem;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        font-weight: 600;
      }

      p {
        line-height: 1.8;
        color: var(--text-dark);
        margin-bottom: 1rem;
      }

      ul, ol {
        margin-left: 1.5rem;
        line-height: 1.8;
        
        li {
          margin-bottom: 0.5rem;
          color: var(--text-dark);

          ul, ol {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
        }

        strong {
          color: var(--accent-primary);
          font-weight: 600;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .legal-page {
    padding: 2rem 0;
  }

  .legal-content {
    padding: 1.5rem;

    h1 {
      font-size: 2rem;
    }

    .content-body :deep(section) {
      h2 {
        font-size: 1.25rem;
      }

      h3 {
        font-size: 1.1rem;
      }
    }
  }
}
</style>

// ~/stores/glossary.ts
import { defineStore } from 'pinia';
import { useApi } from '@/composables/useApi';

export interface GlossaryTerm {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  description: string;
  details: Array<{ title: string; description: string }>;
  relatedTerms: string[];
  linkable: boolean;
  occurrenceLimit: number;
}

interface GlossaryStoreState {
  terms: GlossaryTerm[];
}

export const useGlossaryStore = defineStore('glossary', {
  state: (): GlossaryStoreState => ({
    terms: []
  }),

  actions: {
    async loadTerms() {
      if (this.terms.length > 0) return;

      try {
        const apiUrl = '/api/glossary'; // Use the server-side API endpoint

        const response = await $fetch(apiUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });


        if (!response) {
          throw new Error('Failed to fetch glossary terms');
        }

        const baseUrl = useRuntimeConfig().public.cockpitUrl; // Get the base URL

        this.terms = response.map((entry: any) => {
          return {
            title: entry.title,
            slug: entry.slug,
            excerpt: entry.excerpt || '',
            category: entry.category || 'No Category', // Added category field
            description: entry.description || '',
            details: entry.details.map((detail: any) => ({
              ...detail,
            })),
            relatedTerms: entry.relatedTerms || [],
            linkable: entry.linkable !== false,
            occurrenceLimit: entry.occurrenceLimit || 1,
          };
        });

      } catch (error) {
        console.error('Glossary store error:', error);
        this.terms = [];
        throw error;
      }
    },
  },

  getters: {
    getTermBySlug: (state) => (slug: string) => {
      const normalizedSlug = slug.toLowerCase().trim();
      const term = state.terms.find(term => term.slug.toLowerCase().trim() === normalizedSlug);
      return term;
    }
  }
});
import { ref, computed } from 'vue';
import type { Category } from '@/types';

export function useHierarchicalCategories() {
  const rawCategories = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Build hierarchical structure from flat category list

  // Helper to normalize IDs to string
  const normalizeId = (id: string | number | null | undefined) => id != null ? String(id) : null;

  const buildCategoryTree = (categories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // First pass: create a map of all categories (normalize id)
    categories.forEach(category => {
      const idStr = normalizeId(category.id)!;
      categoryMap.set(idStr, {
        ...category,
        id: idStr,
        parent_id: normalizeId(category.parent_id),
        children: []
      });
    });

    // Second pass: build the tree structure (normalize parent_id)
    categories.forEach(category => {
      const idStr = normalizeId(category.id)!;
      const parentIdStr = normalizeId(category.parent_id);
      const categoryWithChildren = categoryMap.get(idStr)!;
      
      if (parentIdStr && categoryMap.has(parentIdStr)) {
        // Add to parent's children
        const parent = categoryMap.get(parentIdStr)!;
        parent.children = parent.children || [];
        parent.children.push(categoryWithChildren);
        
        // Set parent reference
        categoryWithChildren.parent = parent;
      } else {
        // This is a root category (level 1)
        rootCategories.push(categoryWithChildren);
      }
    });

    // Sort categories by name within each level
    const sortCategoriesRecursively = (cats: Category[]) => {
      cats.sort((a, b) => a.name.localeCompare(b.name));
      cats.forEach(cat => {
        if (cat.children && cat.children.length > 0) {
          sortCategoriesRecursively(cat.children);
        }
      });
    };

    sortCategoriesRecursively(rootCategories);
    return rootCategories;
  };

  // Computed hierarchical categories
  const hierarchicalCategories = computed(() => {
    if (!rawCategories.value.length) return [];
    
    // Check if categories already have nested children
    const hasNestedChildren = rawCategories.value.some(cat => 
      Array.isArray(cat.children) && cat.children.length > 0
    );
    
    if (hasNestedChildren) {
      // Already hierarchical - return as-is
      return rawCategories.value;
    } else {
      // Flat structure - build tree
      return buildCategoryTree(rawCategories.value);
    }
  });

  // Get categories by level
  const getCategoriesByLevel = (level: 1 | 2 | 3): Category[] => {
    return rawCategories.value.filter(cat => cat.level === level);
  };

  // Get all descendant categories for a given category
  const getDescendantCategories = (categoryId: string): Category[] => {
    const findDescendants = (categories: Category[]): Category[] => {
      const descendants: Category[] = [];
      
      categories.forEach(category => {
        if (category.parent_id === categoryId) {
          descendants.push(category);
          // Recursively get children of this category
          descendants.push(...findDescendants(rawCategories.value));
        }
      });
      
      return descendants;
    };

    return findDescendants(rawCategories.value);
  };

  // Get category path (breadcrumb) for a given category
  const getCategoryPath = (categoryId: string): Category[] => {
    const category = rawCategories.value.find(cat => cat.id === categoryId);
    if (!category) return [];

    const path: Category[] = [category];
    let currentCategory = category;

    // Traverse up the hierarchy
    while (currentCategory.parent_id) {
      const parent = rawCategories.value.find(cat => cat.id === currentCategory.parent_id);
      if (parent) {
        path.unshift(parent);
        currentCategory = parent;
      } else {
        break;
      }
    }

    return path;
  };

  // Find category by ID
  const findCategoryById = (categoryId: string): Category | undefined => {
    return rawCategories.value.find(cat => cat.id === categoryId);
  };

  // Get full category path as string (for display)
  const getCategoryFullPath = (categoryId: string): string => {
    const path = getCategoryPath(categoryId);
    return path.map(cat => cat.name).join(' › ');
  };

  // Recursively normalize category data while preserving hierarchy
  const normalizeCategory = (cat: any): Category => ({
    id: String(cat.id),
    name: cat.name || 'Unnamed Category',
    slug: cat.slug,
    products_count: cat.products_count || 0,
    icon: cat.icon || 'mdi:tag',
    level: cat.level || 1,
    parent_id: cat.parent_id ? String(cat.parent_id) : null,
    full_path: cat.full_path,
    children: Array.isArray(cat.children) ? cat.children.map(normalizeCategory) : []
  });

  // Fetch categories from API
  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      
      const response = await $fetch(`${config.public.apiBase}/categories`, {
        headers: { Accept: 'application/json' }
      }) as any;


      // Handle both array and object responses
      const data = Array.isArray(response) ? response : response.data || response.categories || [];
      
      // Check if backend already returns nested structure
      const hasNestedChildren = data.some((cat: any) => Array.isArray(cat.children) && cat.children.length > 0);
      
      if (hasNestedChildren) {
        // Backend returns nested structure - use it directly with normalization
        rawCategories.value = data.map(normalizeCategory);
      } else {
        // Backend returns flat structure - normalize and let buildCategoryTree handle it
        rawCategories.value = data.map((cat: any) => ({
          id: String(cat.id),
          name: cat.name || 'Unnamed Category',
          slug: cat.slug,
          products_count: cat.products_count || 0,
          icon: cat.icon || 'mdi:tag',
          level: cat.level || 1,
          parent_id: cat.parent_id ? String(cat.parent_id) : null,
          full_path: cat.full_path,
          children: []
        }));
      }

    } catch (e: any) {
      error.value = e?.data?.message || e?.message || 'Failed to fetch categories';
      rawCategories.value = [];
    } finally {
      loading.value = false;
    }
  };

  // Get children categories for a specific parent
  const getChildrenCategories = (parentId: string): Category[] => {
    return rawCategories.value.filter(cat => cat.parent_id === parentId);
  };

  // Check if category has children
  const hasChildren = (categoryId: string): boolean => {
    return rawCategories.value.some(cat => cat.parent_id === categoryId);
  };

  // Flatten hierarchical categories back to a flat list
  const flattenCategories = (categories?: Category[]): Category[] => {
    const cats = categories || hierarchicalCategories.value;
    const flattened: Category[] = [];

    const flatten = (categoryList: Category[]) => {
      categoryList.forEach(category => {
        flattened.push(category);
        if (category.children && category.children.length > 0) {
          flatten(category.children);
        }
      });
    };

    flatten(cats);
    return flattened;
  };

  return {
    // State
    rawCategories,
    loading,
    error,

    // Computed
    hierarchicalCategories,

    // Methods
    fetchCategories,
    buildCategoryTree,
    getCategoriesByLevel,
    getDescendantCategories,
    getCategoryPath,
    getCategoryFullPath,
    findCategoryById,
    getChildrenCategories,
    hasChildren,
    flattenCategories
  };
}

// Utility function to convert flat categories to hierarchical for compatibility
export function convertToHierarchical(flatCategories: any[]): Category[] {
  return flatCategories.map(cat => ({
    id: String(cat.id),
    name: cat.name || 'Unnamed Category',
    slug: cat.slug,
    products_count: cat.products_count || 0,
    icon: cat.icon || 'mdi:tag',
    level: cat.level || 1,
    parent_id: cat.parent_id ? String(cat.parent_id) : null,
    full_path: cat.full_path,
    children: []
  }));
}

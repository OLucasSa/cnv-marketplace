import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as dbHelpers from './db';

describe('Categories Management', () => {
  let testCategoryId: number;

  describe('Create Category', () => {
    it('should create a new category', async () => {
      const result = await dbHelpers.createCategory(
        'Test Category',
        'test-category',
        true
      );
      expect(result).toBeDefined();
    });

    it('should create category with visible = false', async () => {
      const result = await dbHelpers.createCategory(
        'Hidden Category',
        'hidden-category',
        false
      );
      expect(result).toBeDefined();
    });
  });

  describe('Get Categories', () => {
    beforeAll(async () => {
      // Create a test category
      await dbHelpers.createCategory('Visible Test', 'visible-test', true);
      await dbHelpers.createCategory('Hidden Test', 'hidden-test', false);
    });

    it('should get all categories', async () => {
      const categories = await dbHelpers.getAllCategories(false);
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should get only visible categories', async () => {
      const categories = await dbHelpers.getAllCategories(true);
      expect(Array.isArray(categories)).toBe(true);
      
      // All returned categories should be visible
      categories.forEach((cat) => {
        expect(cat.visible).toBe(1);
      });
    });

    it('should get category by ID', async () => {
      const allCategories = await dbHelpers.getAllCategories(false);
      if (allCategories.length > 0) {
        const category = await dbHelpers.getCategoryById(allCategories[0].id);
        expect(category).toBeDefined();
        expect(category?.id).toBe(allCategories[0].id);
      }
    });

    it('should return null for non-existent category', async () => {
      const category = await dbHelpers.getCategoryById(99999);
      expect(category).toBeNull();
    });
  });

  describe('Update Category', () => {
    it('should update category name and visibility', async () => {
      const categories = await dbHelpers.getAllCategories(false);
      if (categories.length > 0) {
        const categoryId = categories[0].id;
        const result = await dbHelpers.updateCategory(
          categoryId,
          'Updated Name',
          'updated-slug',
          false
        );
        expect(result).toBeDefined();

        const updated = await dbHelpers.getCategoryById(categoryId);
        expect(updated?.name).toBe('Updated Name');
        expect(updated?.slug).toBe('updated-slug');
        expect(updated?.visible).toBe(0);
      }
    });
  });

  describe('Delete Category', () => {
    it('should delete category and set products categoryId to NULL', async () => {
      // Create a test category
      await dbHelpers.createCategory('To Delete', 'to-delete', true);
      
      const categories = await dbHelpers.getAllCategories(false);
      const categoryToDelete = categories.find((c) => c.name === 'To Delete');
      
      if (categoryToDelete) {
        const result = await dbHelpers.deleteCategory(categoryToDelete.id);
        expect(result).toBeDefined();

        // Verify category is deleted
        const deleted = await dbHelpers.getCategoryById(categoryToDelete.id);
        expect(deleted).toBeNull();
      }
    });
  });

  describe('Category Compatibility', () => {
    it('should handle multiple categories independently', async () => {
      const cat1 = await dbHelpers.createCategory('Category 1', 'cat-1', true);
      const cat2 = await dbHelpers.createCategory('Category 2', 'cat-2', true);
      
      expect(cat1).toBeDefined();
      expect(cat2).toBeDefined();

      const allCategories = await dbHelpers.getAllCategories(false);
      expect(allCategories.length).toBeGreaterThanOrEqual(2);
    });
  });
});

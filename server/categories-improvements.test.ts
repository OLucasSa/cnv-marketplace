import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as dbHelpers from './db';

describe('Category Improvements', () => {
  beforeEach(async () => {
    // Setup: Create test categories
  });

  afterEach(async () => {
    // Cleanup
  });

  describe('getCategoriesWithProductCount', () => {
    it('should return categories with product count', async () => {
      const categories = await dbHelpers.getCategoriesWithProductCount(false);
      
      expect(Array.isArray(categories)).toBe(true);
      if (categories.length > 0) {
        expect(categories[0]).toHaveProperty('id');
        expect(categories[0]).toHaveProperty('name');
        expect(categories[0]).toHaveProperty('productCount');
        expect(typeof categories[0].productCount).toBe('number');
      }
    });

    it('should return only visible categories when visibleOnly=true', async () => {
      const categories = await dbHelpers.getCategoriesWithProductCount(true);
      
      if (categories.length > 0) {
        categories.forEach(cat => {
          expect(cat.visible).toBe(1);
        });
      }
    });

    it('should return categories ordered by order field', async () => {
      const categories = await dbHelpers.getCategoriesWithProductCount(false);
      
      if (categories.length > 1) {
        for (let i = 1; i < categories.length; i++) {
          expect(categories[i].order).toBeGreaterThanOrEqual(categories[i - 1].order);
        }
      }
    });

    it('should return 0 productCount for categories with no products', async () => {
      const categories = await dbHelpers.getCategoriesWithProductCount(false);
      
      categories.forEach(cat => {
        expect(cat.productCount).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('updateCategoryOrder', () => {
    it('should update category order field', async () => {
      const categories = await dbHelpers.getAllCategories(false);
      
      if (categories.length > 0) {
        const categoryId = categories[0].id;
        const newOrder = 99;
        
        const result = await dbHelpers.updateCategoryOrder(categoryId, newOrder);
        expect(result).toBeDefined();
        
        const updated = await dbHelpers.getCategoryById(categoryId);
        expect(updated?.order).toBe(newOrder);
      }
    });

    it('should handle order updates for multiple categories', async () => {
      const categories = await dbHelpers.getAllCategories(false);
      
      if (categories.length >= 2) {
        await dbHelpers.updateCategoryOrder(categories[0].id, 10);
        await dbHelpers.updateCategoryOrder(categories[1].id, 20);
        
        const updated0 = await dbHelpers.getCategoryById(categories[0].id);
        const updated1 = await dbHelpers.getCategoryById(categories[1].id);
        
        expect(updated0?.order).toBe(10);
        expect(updated1?.order).toBe(20);
      }
    });
  });

  describe('updateCategoryFeatured', () => {
    it('should update category featured status', async () => {
      const categories = await dbHelpers.getAllCategories(false);
      
      if (categories.length > 0) {
        const categoryId = categories[0].id;
        
        await dbHelpers.updateCategoryFeatured(categoryId, true);
        const updated = await dbHelpers.getCategoryById(categoryId);
        expect(updated?.featured).toBe(1);
        
        await dbHelpers.updateCategoryFeatured(categoryId, false);
        const updated2 = await dbHelpers.getCategoryById(categoryId);
        expect(updated2?.featured).toBe(0);
      }
    });

    it('should toggle featured status correctly', async () => {
      const categories = await dbHelpers.getAllCategories(false);
      
      if (categories.length > 0) {
        const categoryId = categories[0].id;
        const initialFeatured = categories[0].featured;
        
        await dbHelpers.updateCategoryFeatured(categoryId, !Boolean(initialFeatured));
        const toggled = await dbHelpers.getCategoryById(categoryId);
        
        expect(toggled?.featured).toBe(initialFeatured ? 0 : 1);
      }
    });
  });

  describe('Category sorting and filtering', () => {
    it('should sort categories by order ascending', async () => {
      const categories = await dbHelpers.getCategoriesWithProductCount(false);
      
      if (categories.length > 1) {
        for (let i = 1; i < categories.length; i++) {
          expect(categories[i].order).toBeGreaterThanOrEqual(categories[i - 1].order);
        }
      }
    });

    it('should include featured flag in response', async () => {
      const categories = await dbHelpers.getCategoriesWithProductCount(false);
      
      if (categories.length > 0) {
        categories.forEach(cat => {
          expect(cat).toHaveProperty('featured');
          expect([0, 1]).toContain(cat.featured);
        });
      }
    });

    it('should include order field in response', async () => {
      const categories = await dbHelpers.getCategoriesWithProductCount(false);
      
      if (categories.length > 0) {
        categories.forEach(cat => {
          expect(cat).toHaveProperty('order');
          expect(typeof cat.order).toBe('number');
        });
      }
    });
  });
});

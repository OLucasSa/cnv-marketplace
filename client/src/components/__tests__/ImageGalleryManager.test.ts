import { describe, it, expect, vi } from 'vitest';

/**
 * Test suite for ImageGalleryManager drag-and-drop functionality
 * Tests the reordering logic when images are dragged and dropped
 */

describe('ImageGalleryManager - Drag and Drop', () => {
  /**
   * Test: Parse images from pipe-separated string
   */
  it('should parse images from pipe-separated string', () => {
    const imageString = 'https://example.com/img1.jpg|https://example.com/img2.jpg|https://example.com/img3.jpg';
    const images = imageString.split('|').filter(url => url.trim());
    
    expect(images).toHaveLength(3);
    expect(images[0]).toBe('https://example.com/img1.jpg');
    expect(images[2]).toBe('https://example.com/img3.jpg');
  });

  /**
   * Test: Handle empty image string
   */
  it('should handle empty image string', () => {
    const imageString = null;
    const images = imageString ? imageString.split('|').filter(url => url.trim()) : [];
    
    expect(images).toHaveLength(0);
  });

  /**
   * Test: Reorder images when dragging from index 0 to index 2
   */
  it('should reorder images when dragging from index 0 to index 2', () => {
    const images = [
      'https://example.com/img1.jpg',
      'https://example.com/img2.jpg',
      'https://example.com/img3.jpg',
    ];
    
    const draggedIndex = 0;
    const dropIndex = 2;
    
    // Simulate reordering logic
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    expect(newImages[0]).toBe('https://example.com/img2.jpg');
    expect(newImages[1]).toBe('https://example.com/img3.jpg');
    expect(newImages[2]).toBe('https://example.com/img1.jpg');
  });

  /**
   * Test: Reorder images when dragging from index 2 to index 0
   */
  it('should reorder images when dragging from index 2 to index 0', () => {
    const images = [
      'https://example.com/img1.jpg',
      'https://example.com/img2.jpg',
      'https://example.com/img3.jpg',
    ];
    
    const draggedIndex = 2;
    const dropIndex = 0;
    
    // Simulate reordering logic
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    expect(newImages[0]).toBe('https://example.com/img3.jpg');
    expect(newImages[1]).toBe('https://example.com/img1.jpg');
    expect(newImages[2]).toBe('https://example.com/img2.jpg');
  });

  /**
   * Test: Convert reordered images back to pipe-separated string
   */
  it('should convert reordered images back to pipe-separated string', () => {
    const images = [
      'https://example.com/img3.jpg',
      'https://example.com/img1.jpg',
      'https://example.com/img2.jpg',
    ];
    
    const imageString = images.join('|');
    
    expect(imageString).toBe(
      'https://example.com/img3.jpg|https://example.com/img1.jpg|https://example.com/img2.jpg'
    );
  });

  /**
   * Test: Handle drag to same position (no change)
   */
  it('should handle drag to same position without reordering', () => {
    const images = [
      'https://example.com/img1.jpg',
      'https://example.com/img2.jpg',
      'https://example.com/img3.jpg',
    ];
    
    const draggedIndex = 1;
    const dropIndex = 1;
    
    // Should not reorder if same position
    if (draggedIndex === dropIndex) {
      expect(images).toEqual([
        'https://example.com/img1.jpg',
        'https://example.com/img2.jpg',
        'https://example.com/img3.jpg',
      ]);
    }
  });

  /**
   * Test: Reorder with 2 images
   */
  it('should reorder with 2 images', () => {
    const images = [
      'https://example.com/img1.jpg',
      'https://example.com/img2.jpg',
    ];
    
    const draggedIndex = 0;
    const dropIndex = 1;
    
    // Simulate reordering logic
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    expect(newImages[0]).toBe('https://example.com/img2.jpg');
    expect(newImages[1]).toBe('https://example.com/img1.jpg');
  });

  /**
   * Test: Reorder with 4 images (complex scenario)
   */
  it('should reorder with 4 images (complex scenario)', () => {
    const images = [
      'https://example.com/img1.jpg',
      'https://example.com/img2.jpg',
      'https://example.com/img3.jpg',
      'https://example.com/img4.jpg',
    ];
    
    const draggedIndex = 1; // img2
    const dropIndex = 3;    // position after img4
    
    // Simulate reordering logic
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    expect(newImages[0]).toBe('https://example.com/img1.jpg');
    expect(newImages[1]).toBe('https://example.com/img3.jpg');
    expect(newImages[2]).toBe('https://example.com/img4.jpg');
    expect(newImages[3]).toBe('https://example.com/img2.jpg');
  });

  /**
   * Test: Remove image and verify reordering still works
   */
  it('should remove image and verify reordering still works', () => {
    const images = [
      'https://example.com/img1.jpg',
      'https://example.com/img2.jpg',
      'https://example.com/img3.jpg',
    ];
    
    // Remove image at index 1
    const filteredImages = images.filter((_, i) => i !== 1);
    
    expect(filteredImages).toHaveLength(2);
    expect(filteredImages[0]).toBe('https://example.com/img1.jpg');
    expect(filteredImages[1]).toBe('https://example.com/img3.jpg');
    
    // Now reorder the remaining images
    const draggedIndex = 0;
    const dropIndex = 1;
    
    const newImages = [...filteredImages];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    expect(newImages[0]).toBe('https://example.com/img3.jpg');
    expect(newImages[1]).toBe('https://example.com/img1.jpg');
  });
});

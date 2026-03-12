import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as dbHelpers from './db';

describe('Site Settings - Logo and Banner', () => {
  const testSettingKey = 'test-banner';
  const testImageUrl = 'https://example.com/test-banner.png';
  const testImageKey = 'banner/test-12345-test-banner.png';

  beforeAll(async () => {
    // Clean up before tests
    try {
      await dbHelpers.deleteSiteSetting(testSettingKey);
    } catch (e) {
      // Ignore if doesn't exist
    }
  });

  afterAll(async () => {
    // Clean up after tests
    try {
      await dbHelpers.deleteSiteSetting(testSettingKey);
    } catch (e) {
      // Ignore if doesn't exist
    }
  });

  it('should set a site setting (banner/logo)', async () => {
    const result = await dbHelpers.setSiteSetting(
      testSettingKey,
      testImageUrl,
      testImageKey
    );
    expect(result).toBeDefined();
  });

  it('should retrieve a site setting', async () => {
    // First set it
    await dbHelpers.setSiteSetting(testSettingKey, testImageUrl, testImageKey);

    // Then retrieve it
    const setting = await dbHelpers.getSiteSetting(testSettingKey);
    expect(setting).toBeDefined();
    expect(setting?.settingKey).toBe(testSettingKey);
    expect(setting?.imageUrl).toBe(testImageUrl);
    expect(setting?.imageKey).toBe(testImageKey);
  });

  it('should update an existing site setting', async () => {
    // Set initial value
    await dbHelpers.setSiteSetting(testSettingKey, testImageUrl, testImageKey);

    // Update it
    const newImageUrl = 'https://example.com/updated-banner.png';
    const newImageKey = 'banner/updated-12345-banner.png';
    await dbHelpers.setSiteSetting(testSettingKey, newImageUrl, newImageKey);

    // Verify update
    const setting = await dbHelpers.getSiteSetting(testSettingKey);
    expect(setting?.imageUrl).toBe(newImageUrl);
    expect(setting?.imageKey).toBe(newImageKey);
  });

  it('should delete a site setting', async () => {
    // Set it first
    await dbHelpers.setSiteSetting(testSettingKey, testImageUrl, testImageKey);

    // Delete it
    await dbHelpers.deleteSiteSetting(testSettingKey);

    // Verify it's gone
    const setting = await dbHelpers.getSiteSetting(testSettingKey);
    expect(setting).toBeNull();
  });

  it('should return null for non-existent setting', async () => {
    const setting = await dbHelpers.getSiteSetting('non-existent-key-12345');
    expect(setting).toBeNull();
  });

  it('should handle multiple settings independently', async () => {
    const bannerKey = 'banner-test';
    const logoKey = 'logo-test';
    const bannerUrl = 'https://example.com/banner.png';
    const logoUrl = 'https://example.com/logo.png';

    try {
      // Set banner
      await dbHelpers.setSiteSetting(bannerKey, bannerUrl, 'banner-key-123');

      // Set logo
      await dbHelpers.setSiteSetting(logoKey, logoUrl, 'logo-key-456');

      // Retrieve both
      const banner = await dbHelpers.getSiteSetting(bannerKey);
      const logo = await dbHelpers.getSiteSetting(logoKey);

      expect(banner?.imageUrl).toBe(bannerUrl);
      expect(logo?.imageUrl).toBe(logoUrl);
    } finally {
      // Clean up
      await dbHelpers.deleteSiteSetting(bannerKey);
      await dbHelpers.deleteSiteSetting(logoKey);
    }
  });
});

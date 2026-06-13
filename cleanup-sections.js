/**
 * Firebase Realtime Database Cleanup Script
 * Removes deprecated sections from the South Wallet app
 * 
 * Sections to remove:
 * - electricity (الكهرباء والماء)
 * - government (خدمات حكومية)
 * - internet (الإنترنت)
 * - wallet-services (خدمات المحفظة الخاصة)
 * - health (الصحة)
 * - education (التعليم)
 * - food-delivery (الطعام والتوصيل)
 * - travel (السفر والسياحة)
 * - shopping (التسوق)
 */

const DATABASE_URL = 'https://southern-portfolio-default-rtdb.firebaseio.com';

// Paths to remove from adminSettings/visibility/sections/
const sectionsToRemove = [
  'electricity',
  'government',
  'internet',
  'wallet-services',
  'health',
  'education',
  'food-delivery',
  'travel',
  'shopping',
];

async function removeSection(path) {
  const url = `${DATABASE_URL}/${path}.json`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (response.ok) {
      console.log(`✅ Removed: ${path}`);
    } else {
      const text = await response.text();
      console.log(`⚠️  Failed to remove ${path}: ${response.status} - ${text}`);
    }
  } catch (err) {
    console.error(`❌ Error removing ${path}:`, err.message);
  }
}

async function cleanupVisibilitySections() {
  console.log('\n🧹 Cleaning up adminSettings/visibility/sections...');
  for (const section of sectionsToRemove) {
    await removeSection(`adminSettings/visibility/sections/${section}`);
  }
}

async function cleanupOwnerSettingsSections() {
  console.log('\n🧹 Cleaning up ownerSettings/sections...');
  // First, fetch existing sections to find ones to remove by name
  try {
    const response = await fetch(`${DATABASE_URL}/ownerSettings/sections.json`);
    if (response.ok) {
      const data = await response.json();
      if (data && typeof data === 'object') {
        for (const [key, value] of Object.entries(data)) {
          if (value && typeof value === 'object' && value.name) {
            const nameMatch = sectionsToRemove.some(
              s => value.name === s || value.id === s || value.sectionId === s
            );
            if (nameMatch) {
              await removeSection(`ownerSettings/sections/${key}`);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('❌ Error fetching ownerSettings/sections:', err.message);
  }
}

async function cleanupAdminSettingsApiProviders() {
  console.log('\n🧹 Cleaning up adminSettings/apiProviders (deprecated sections)...');
  try {
    const response = await fetch(`${DATABASE_URL}/adminSettings/apiProviders.json`);
    if (response.ok) {
      const data = await response.json();
      if (data && typeof data === 'object') {
        for (const [key, value] of Object.entries(data)) {
          if (value && typeof value === 'object' && value.sectionId) {
            if (sectionsToRemove.includes(value.sectionId)) {
              await removeSection(`adminSettings/apiProviders/${key}`);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('❌ Error fetching adminSettings/apiProviders:', err.message);
  }
}

async function cleanupProvidersInDeprecatedCategories() {
  console.log('\n🧹 Cleaning up providers in deprecated categories...');
  try {
    const response = await fetch(`${DATABASE_URL}/adminSettings/providers.json`);
    if (response.ok) {
      const data = await response.json();
      if (data && typeof data === 'object') {
        for (const [key, value] of Object.entries(data)) {
          if (value && typeof value === 'object' && value.categoryId) {
            if (sectionsToRemove.includes(value.categoryId)) {
              await removeSection(`adminSettings/providers/${key}`);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('❌ Error fetching adminSettings/providers:', err.message);
  }
}

async function main() {
  console.log('🚀 Starting Firebase cleanup for deprecated sections...');
  console.log('Sections to remove:', sectionsToRemove.join(', '));

  await cleanupVisibilitySections();
  await cleanupOwnerSettingsSections();
  await cleanupAdminSettingsApiProviders();
  await cleanupProvidersInDeprecatedCategories();

  console.log('\n✅ Firebase cleanup complete!');
}

main();

/**
 * Initialize Qdrant vector database with Dubai locations
 * Run this script once after setting up Qdrant Cloud
 *
 * Usage: npm run init-qdrant
 */

// IMPORTANT: Load environment variables FIRST before any imports
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Now import services (after env vars are loaded)
import { qdrantService } from '../src/lib/services/qdrant';
import { getAllLocations } from '../src/lib/data/locations';

async function initializeQdrant() {
  console.log('🚀 Initializing Qdrant vector database...\n');

  // Verify environment variables
  console.log('Environment check:');
  console.log(`- GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing'}`);
  console.log(`- QDRANT_URL: ${process.env.QDRANT_URL ? '✓ Set' : '✗ Missing'}`);
  console.log(`- QDRANT_API_KEY: ${process.env.QDRANT_API_KEY ? '✓ Set' : '✗ Missing'}\n`);

  try {
    // Step 1: Create collection
    console.log('Step 1: Creating collection...');
    await qdrantService.initializeCollection();
    console.log('✓ Collection created successfully\n');

    // Step 2: Load sample locations
    console.log('Step 2: Loading Dubai locations...');
    const locations = getAllLocations();
    console.log(`✓ Loaded ${locations.length} locations\n`);

    // Step 3: Generate embeddings and insert
    console.log('Step 3: Generating embeddings and inserting to Qdrant...');
    console.log('This may take a few minutes...\n');

    await qdrantService.bulkAddLocations(locations);
    console.log(`✓ Successfully added ${locations.length} locations to Qdrant\n`);

    console.log('✅ Qdrant initialization complete!');
    console.log('\nYou can now use semantic search in the application.');
    console.log('Try queries like:');
    console.log('  - "romantic sunset spots"');
    console.log('  - "authentic cultural experiences"');
    console.log('  - "family-friendly attractions"');
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    console.error('\nPlease check:');
    console.error('1. Your QDRANT_URL and QDRANT_API_KEY in .env.local');
    console.error('2. Your Qdrant cluster is running');
    console.error('3. Your GEMINI_API_KEY is valid (for embeddings)');
    process.exit(1);
  }
}

// Run initialization
initializeQdrant();

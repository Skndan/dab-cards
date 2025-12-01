#!/usr/bin/env tsx

/**
 * RustFS Configuration Test Script
 *
 * Tests the rustfs storage module by:
 * 1. Importing the module (validates required env vars)
 * 2. Uploading a test file
 * 3. Generating a signed download URL
 * 4. Deleting the test file
 */

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables from .env.local
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Validate only RustFS environment variables
function validateRustFSEnv() {
  const required = [
    'RUSTFS_ENDPOINT',
    'RUSTFS_ACCESS_KEY',
    'RUSTFS_SECRET_KEY',
    'RUSTFS_BUCKET_NAME',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required RustFS environment variables: ${missing.join(', ')}\n` +
      'Please ensure these are set in your .env.local file.'
    );
  }
}

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step: number, message: string) {
  log(`\n[${step}/5] ${message}`, 'cyan');
}

function logSuccess(message: string) {
  log(`✓ ${message}`, 'green');
}

function logError(message: string) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message: string) {
  log(`⚠ ${message}`, 'yellow');
}

async function runTest() {
  log('\n========================================', 'blue');
  log('  RustFS Configuration Test', 'blue');
  log('========================================\n', 'blue');

  const testKey = `test-files/rustfs-test-${Date.now()}.txt`;
  const testContent = `RustFS test file created at ${new Date().toISOString()}`;
  let uploadedUrl: string | null = null;
  let signedUrl: string | null = null;

  try {
    // Step 1: Validate RustFS environment variables
    logStep(1, 'Validating RustFS environment variables...');
    
    try {
      validateRustFSEnv();
      logSuccess('Environment variables validated:');
      console.log('  - RUSTFS_ENDPOINT: ✓ ' + process.env.RUSTFS_ENDPOINT);
      console.log('  - RUSTFS_ACCESS_KEY: ✓ ' + (process.env.RUSTFS_ACCESS_KEY?.substring(0, 10) + '...'));
      console.log('  - RUSTFS_SECRET_KEY: ✓ (hidden)');
      console.log('  - RUSTFS_BUCKET_NAME: ✓ ' + process.env.RUSTFS_BUCKET_NAME);
      console.log('  - RUSTFS_REGION: ' + (process.env.RUSTFS_REGION || 'us-east-1 (default)'));
    } catch (validationError: unknown) {
      const errorMessage = validationError instanceof Error ? validationError.message : String(validationError);
      logError(errorMessage);
      process.exit(1);
    }

    // Step 2: Import the rustfs module
    logStep(2, 'Importing rustfs module...');
    
    let rustfs: typeof import('./lib/storage/rustfs') | null = null;
    try {
      rustfs = await import('./lib/storage/rustfs.js');
      logSuccess('RustFS module imported successfully');
    } catch (importError: unknown) {
      const errorMessage = importError instanceof Error ? importError.message : String(importError);
      logError(`Failed to import rustfs module: ${errorMessage}`);
      process.exit(1);
    }

    // Step 3: Upload a test file
    logStep(3, 'Uploading test file...');
    try {
      const buffer = Buffer.from(testContent, 'utf-8');
      uploadedUrl = await rustfs.uploadFile({
        key: testKey,
        file: buffer,
        contentType: 'text/plain',
        metadata: {
          test: 'true',
          timestamp: Date.now().toString(),
        },
      });
      
      logSuccess(`File uploaded successfully`);
      console.log(`  Key: ${testKey}`);
      console.log(`  URL: ${uploadedUrl}`);
    } catch (uploadError: unknown) {
      const errorMessage = uploadError instanceof Error ? uploadError.message : String(uploadError);
      logError(`Failed to upload file: ${errorMessage}`);
      throw uploadError;
    }

    // Step 4: Generate signed download URL
    logStep(4, 'Generating signed download URL...');
    try {
      signedUrl = await rustfs.getSignedDownloadUrl(testKey, 300); // 5 minutes
      logSuccess('Signed URL generated successfully');
      console.log(`  URL: ${signedUrl?.substring(0, 80)}...`);
      console.log('  Expires in: 5 minutes');
    } catch (signedUrlError: unknown) {
      const errorMessage = signedUrlError instanceof Error ? signedUrlError.message : String(signedUrlError);
      logError(`Failed to generate signed URL: ${errorMessage}`);
      throw signedUrlError;
    }

    // Step 5: Delete the test file
    logStep(5, 'Deleting test file...');
    try {
      await rustfs.deleteFile(testKey);
      logSuccess('Test file deleted successfully');
    } catch (deleteError: unknown) {
      const errorMessage = deleteError instanceof Error ? deleteError.message : String(deleteError);
      logWarning(`Failed to delete test file: ${errorMessage}`);
      logWarning(`You may need to manually delete: ${testKey}`);
    }

    // Final summary
    log('\n========================================', 'blue');
    log('  Test Summary', 'blue');
    log('========================================', 'blue');
    logSuccess('All tests passed!');
    log('\nRustFS is configured correctly and functioning properly.', 'green');
    log('========================================\n', 'blue');
    
    process.exit(0);

  } catch (error: unknown) {
    log('\n========================================', 'red');
    log('  Test Failed', 'red');
    log('========================================', 'red');
    const errorMessage = error instanceof Error ? error.message : String(error);
    logError(`Error: ${errorMessage}`);
    
    if (error instanceof Error && error.stack) {
      log('\nStack trace:', 'yellow');
      console.log(error.stack);
    }
    
    log('\n========================================\n', 'red');
    process.exit(1);
  }
}

// Run the test
runTest().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  logError(`Unexpected error: ${errorMessage}`);
  process.exit(1);
});
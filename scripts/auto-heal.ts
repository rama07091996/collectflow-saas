import { SelfHealingEngine } from '../src/lib/self-healing-engine';

/**
 * Standalone Antigravity Auto-Heal CLI Script
 * Usage: npx ts-node scripts/auto-heal.ts "Error: Prisma schema validation P1012"
 */
function main() {
  const errorInput = process.argv.slice(2).join(' ') || 'Error: Prisma schema validation P1012 references';

  console.log('\n======================================================');
  console.log('🤖 ANTIGRAVITY AUTONOMOUS SELF-HEALING ENGINE');
  console.log('======================================================\n');
  console.log(`Analyzing error input:\n"${errorInput}"\n`);

  const diagnosis = SelfHealingEngine.diagnoseError(errorInput);

  console.log(`\x1b[36m[DIAGNOSIS]\x1b[0m Type: ${diagnosis.errorType} (Confidence: ${(diagnosis.confidenceScore * 100).toFixed(0)}%)`);
  console.log(`\x1b[33m[ROOT CAUSE]\x1b[0m ${diagnosis.rootCause}`);
  console.log(`\x1b[32m[SUGGESTED CODE PATCH]\x1b[0m:\n${diagnosis.suggestedPatch}\n`);
  console.log(`\x1b[35m[AFFECTED FILES]\x1b[0m: ${diagnosis.affectedFiles.join(', ')}`);
  console.log('======================================================\n');
}

main();

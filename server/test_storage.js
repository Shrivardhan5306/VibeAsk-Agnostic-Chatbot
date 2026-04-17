import { Storage } from './src/db/storage.js';

async function testStorage() {
  const userId = 'test_user_from_script';
  console.log('Testing create question...');
  const questionId = await Storage.saveQuestion(userId, 'What is the speed of light?', 'physics');
  console.log('Inserted question ID:', questionId);

  if (questionId) {
    console.log('Testing performance insert...');
    await Storage.savePerformance(userId, questionId, true, 45, 95);
    console.log('Performance saved successfully.');
  }
  process.exit(0);
}

testStorage().catch(err => {
  console.error(err);
  process.exit(1);
});

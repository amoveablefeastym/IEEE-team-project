import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// The emulator provides a default project ID and credentials via environment when run with firebase emulators:start
// This script assumes the Firestore emulator is running on localhost:8088 and Firebase Admin SDK will pick up the emulator.

async function main() {
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8088';
  // Initialize admin app (no credentials required for emulator)
  initializeApp({ projectId: process.env.FIREBASE_PROJECT || 'ieee-studyspace' })
  const db = getFirestore()

  console.log('Seeding emulator with sample data...')

  // QA sample
  const qaRef = db.collection('qa')
  const q1 = await qaRef.add({
    title: 'How to prepare for CS final?',
    text: 'What should I focus on for the final? Any past exams recommended?',
    authorName: 'Freshman A',
    authorId: 'user_1',
    isForUpperclassmen: true,
    tags: ['exam_prep','general'],
    votes: 3,
    voters: { 'user_2': 1, 'user_3': 1, 'user_4': 1 },
    replyCount: 1,
    createdAt: new Date()
  })

  await q1.collection('replies').add({
    text: 'Practice past finals and ask upperclassmen for common pitfalls.',
    authorName: 'Upperclass B',
    authorId: 'user_2',
    createdAt: new Date()
  })

  const q2 = await qaRef.add({
    title: 'Confused about pointers',
    text: 'Can someone explain pointer arithmetic with simple examples?',
    authorName: 'Student C',
    authorId: 'user_5',
    isForUpperclassmen: false,
    tags: ['pointers','concepts'],
    votes: 1,
    voters: { 'user_6': 1 },
    replyCount: 0,
    createdAt: new Date()
  })

  console.log('Seeding complete.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

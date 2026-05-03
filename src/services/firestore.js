import { db } from '../firebase'
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  collectionGroup,
  doc,
  setDoc,
  updateDoc,
  increment,
} from 'firebase/firestore'

// -- Chat/messages (class-level) --
export function subscribeToClassMessages(onUpdate) {
  const messagesCol = collection(db, 'classChat')
  const messagesQuery = query(messagesCol, orderBy('createdAt', 'asc'))

  // Listen to messages and replies (replies are subcollections named 'replies')
  const unsubMessages = onSnapshot(messagesQuery, (ms) => {
    const messages = {}
    ms.docs.forEach((d) => {
      messages[d.id] = { id: d.id, ...(d.data() || {}), replies: [] }
    })

    // After we collect base messages, read all replies via collectionGroup
    const repliesQuery = query(collectionGroup(db, 'replies'), orderBy('createdAt', 'asc'))
    const unsubReplies = onSnapshot(repliesQuery, (rs) => {
      // clear replies
      Object.values(messages).forEach((m) => (m.replies = []))
      rs.docs.forEach((r) => {
        // parent message id is two levels up from the replies subcollection
        const parentId = r.ref.parent.parent ? r.ref.parent.parent.id : null
        if (parentId && messages[parentId]) {
          messages[parentId].replies.push({ id: r.id, ...(r.data() || {}) })
        }
      })

      const arr = Object.values(messages).sort((a, b) => {
        const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0
        const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0
        return ta - tb
      })
      onUpdate(arr)
    })

    // Return a combined unsubscribe (messages listener will keep replies active)
    // Note: we don't return unsubReplies here to the caller; instead return a function that unsubscribes both
    // We'll keep unsubReplies in closure
  ;(function keep(){})();
    // When unsubMessages is called later we also want to stop unsubReplies - achieve by returning a function that calls both
    const combinedUnsub = () => {
      unsubMessages()
      unsubReplies()
    }
    // Attach combinedUnsub so caller can call it
    subscribeToClassMessages._lastUnsub = combinedUnsub
  })

  // Return a function that will unsubscribe both listeners
  return () => {
    if (typeof subscribeToClassMessages._lastUnsub === 'function') subscribeToClassMessages._lastUnsub()
    else unsubMessages()
  }
}

export async function sendClassMessage({ text, anonymous, authorName, authorId, avatarBg, initials, badge }) {
  const messagesCol = collection(db, 'classChat')
  return addDoc(messagesCol, {
    text,
    anonymous: !!anonymous,
    authorName: authorName || null,
    authorId: authorId || null,
    avatarBg: avatarBg || null,
    initials: initials || null,
    badge: badge || null,
    createdAt: serverTimestamp(),
  })
}

export async function sendClassReply(parentId, { text, anonymous, authorName, authorId, avatarBg, initials, badge }) {
  const repliesCol = collection(db, `classChat/${parentId}/replies`)
  const docRef = await addDoc(repliesCol, {
    text,
    anonymous: !!anonymous,
    authorName: authorName || null,
    authorId: authorId || null,
    avatarBg: avatarBg || null,
    initials: initials || null,
    badge: badge || null,
    createdAt: serverTimestamp(),
  })
  return docRef
}

// -- Q&A --
export function subscribeToQuestions(onUpdate) {
  const q = query(collection(db, 'qa'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }))
    onUpdate(items)
  })
}

export async function postQuestion({ title, text, authorName, authorId, isForUpperclassmen = false, tags = [] }) {
  const col = collection(db, 'qa')
  return addDoc(col, {
    title,
    text,
    authorName: authorName || null,
    authorId: authorId || null,
    isForUpperclassmen: !!isForUpperclassmen,
    tags: tags || [],
    votes: 0,
    replyCount: 0,
    createdAt: serverTimestamp(),
  })
}

export async function addQuestionReply(questionId, { text, authorName, authorId, anonymous }) {
  const repliesCol = collection(db, `qa/${questionId}/replies`)
  const r = await addDoc(repliesCol, {
    text,
    authorName: authorName || null,
    authorId: authorId || null,
    anonymous: !!anonymous,
    createdAt: serverTimestamp(),
  })
  // increment replyCount on question
  const qDoc = doc(db, 'qa', questionId)
  await updateDoc(qDoc, { replyCount: increment(1) })
  return r
}

import {
  useQuery,
  hashQueryKey,
  QueryClient,
  QueryClientProvider as QueryClientProviderBase,
} from 'react-query'
import {
  getFirestore,
  onSnapshot,
  doc,
  collection,
  query,
  where,
  orderBy,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  limit,
} from 'firebase/firestore'
import { firebaseApp } from './firebase'

// Initialize Firestore
const db = getFirestore(firebaseApp)

// React Query client
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, //prevents from re-rendering when changing tabs.
    },
  },
})

/**** USERS ****/

// Subscribe to user data
// Note: This is called automatically in `auth.js` and data is merged into `auth.user`
export function useUser(uid) {
  // Manage data fetching with React Query: https://react-query.tanstack.com/overview
  return useQuery(
    // Unique query key: https://react-query.tanstack.com/guides/query-keys
    ['user', { uid }],
    // Query function that subscribes to data and auto-updates the query cache
    createQuery(() => doc(db, 'users', uid)),
    // Only call query function if we have a `uid`
    { enabled: !!uid },
  )
}

// Fetch user data once (non-hook)
// Useful if you need to fetch data from outside of a component
export function getUser(uid) {
  return getDoc(doc(db, 'users', uid)).then(format)
}

// Create a new user
export function createUser(uid, data) {
  return setDoc(doc(db, 'users', uid), data, { merge: true })
}

// Update an existing user
export function updateUser(uid, data) {
  return updateDoc(doc(db, 'users', uid), data)
}

/**** Collections ****/
export function useSchools() {
  return useQuery(
    ['/Schools'],
    createQuery(() =>
      query(collection(db, '/Schools'), orderBy('school', 'asc')),
    ),
  )
}

export function useCourses() {
  return useQuery(
    ['/Series'],
    // When fetching once there is no need to use `createQuery` to setup a subscription
    // Just fetch normally using `getDoc` so that we return a promise
    createQuery(() =>
      query(collection(db, '/Series'), orderBy('seriesName', 'asc')),
    ),
    { staleTime: 20 * 60 * 1000 }, // 20 minutes
  )
}

export const useCreators = () => {
  return useQuery(
    ['/Artists'],
    createQuery(() =>
      query(collection(db, '/Artists'), orderBy('name', 'asc')),
    ),
    { staleTime: 20 * 60 * 1000 }, // 20 minute
  )
}

export function useLearningPaths() {
  return useQuery(
    ['/LearningPaths'],
    createQuery(() => query(collection(db, '/LearningPaths'))),
    { staleTime: 20 * 60 * 1000 }, // 20 minute
  )
}

export function useCourseByUID(uid) {
  return useQuery(
    ['/Series', { uid }],
    createQuery(() =>
      query(collection(db, '/Series'), where('uid', '==', uid), limit(1)),
    ),
  )
}
export function useCreatorByUID(uid) {
  return useQuery(
    ['/Artists', { uid }],
    createQuery(() =>
      query(collection(db, '/Artists'), where('uid', '==', uid), limit(1)),
    ),
  )
}

export function useVideoProgress(id) {
  return useQuery(
    ['video-progress', { id }],
    createQuery(() => doc(db, 'user-progress', id)),
    { enabled: !!id },
  )
}
export function useVideoProgressOnce(id) {
  return useQuery(
    ['video-progress', { id }],
    // When fetching once there is no need to use `createQuery` to setup a subscription
    // Just fetch normally using `getDoc` so that we return a promise
    () => getDoc(doc(db, 'user-progress', id)).then(format),
    { enabled: !!id },
  )
}
export function getUserProgress(uid) {
  return getDoc(doc(db, 'user-progress', uid)).then(format)
}

// Subscribe to all items by owner
export function useUserProgressByOwner(owner) {
  return useQuery(
    ['user-progress', { owner }],
    createQuery(() =>
      query(
        collection(db, 'user-progress'),
        where('owner', '==', owner),
        orderBy('createdAt', 'desc'),
      ),
    ),
    {
      enabled: !!owner,
    },
  )
}

// Subscribe to all items by owner
export function useUserProgressByCourse(owner, videoIds) {
  return useQuery(
    ['user-progress', { owner }],
    createQuery(() =>
      query(
        collection(db, 'user-progress'),
        where('owner', '==', owner),
        where('videoId', 'in', videoIds),
        orderBy('createdAt', 'desc'),
      ),
    ),
    {
      enabled: !!owner,
      refetchOnWindowFocus: 'always',
    },
  )
}

export function useVideosByCourseId(courseId) {
  return useQuery(
    ['/Videos', courseId],
    createQuery(() =>
      query(collection(db, '/Videos'), where('homeSeries', '==', courseId)),
    ),
    { enabled: !!courseId },
  )
}

export function useVideoProgressByVideoId(owner, videoId) {
  return useQuery(
    ['user-progress', { owner }],
    createQuery(() =>
      query(
        collection(db, 'user-progress'),
        where('owner', '==', owner),
        where('videoId', '==', videoId),
        limit(1),
      ),
    ),
    { enabled: !!owner },
  )
}

export function useUserWatchlistByOwner(owner) {
  return useQuery(
    ['user-watchlist', { owner }],
    createQuery(() =>
      query(
        collection(db, 'user-watchlist'),
        where('owner', '==', owner),
        orderBy('createdAt', 'desc'),
      ),
    ),
    { enabled: !!owner },
  )
}

export function useWatchlistById(owner, courseId) {
  return useQuery(
    ['user-watchlist'],
    createQuery(() =>
      query(
        collection(db, 'user-watchlist'),
        where('owner', '==', owner),
        where('courseId', '==', courseId),
        limit(1),
      ),
    ),
    { enabled: !!owner },
  )
}

export function useDownloadsById(owner, courseId) {
  return useQuery(
    ['user-downloads'],
    createQuery(() =>
      query(
        collection(db, 'user-downloads'),
        where('owner', '==', owner),
        where('courseId', '==', courseId),
        limit(1),
      ),
    ),
    { enabled: !!owner },
  )
}

export function useUserDownloadsByOwner(owner) {
  return useQuery(
    ['user-downloads', { owner }],
    createQuery(() =>
      query(
        collection(db, 'user-downloads'),
        where('owner', '==', owner),
        orderBy('createdAt', 'desc'),
      ),
    ),
    { enabled: !!owner },
  )
}
// Create a new item
export function createVideoProgress(data) {
  const docRef = addDoc(collection(db, 'user-progress'), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return docRef
}

export function createWatchlistCourse(data) {
  const docRef = addDoc(collection(db, 'user-watchlist'), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return docRef
}

export function createDownloadCourse(data) {
  const docRef = addDoc(collection(db, 'user-downloads'), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return docRef
}

export function updateDownloads(id, data) {
  return updateDoc(doc(db, 'user-downloads', id), data)
}

// Update an item
export function updateVideoProgress(id, data) {
  return updateDoc(doc(db, 'user-progress', id), data)
}

// Delete an item
export function deleteVideoProgress(id) {
  return deleteDoc(doc(db, 'user-progress', id))
}

export function deleteWatchlistCourse(id) {
  return deleteDoc(doc(db, 'user-watchlist', id))
}

export function deleteDownloadsCourse(ids) {
  return deleteDoc(doc(db, 'user-downloads', ids))
}

/**** ITEMS ****/
/* Example query functions (modify to your needs) */

// Subscribe to item data
export function useItem(id) {
  return useQuery(
    ['item', { id }],
    createQuery(() => doc(db, 'items', id)),
    { enabled: !!id },
  )
}
// Fetch item data once
export function useItemOnce(id) {
  return useQuery(
    ['item', { id }],
    // When fetching once there is no need to use `createQuery` to setup a subscription
    // Just fetch normally using `getDoc` so that we return a promise
    () => getDoc(doc(db, 'items', id)).then(format),
    { enabled: !!id },
  )
}

// Subscribe to all items by owner
export function useItemsByOwner(owner) {
  return useQuery(
    ['items', { owner }],
    createQuery(() =>
      query(
        collection(db, 'items'),
        where('owner', '==', owner),
        orderBy('createdAt', 'desc'),
      ),
    ),
    { enabled: !!owner },
  )
}

// Create a new item
export function createItem(data) {
  return addDoc(collection(db, 'items'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

// Update an item
export function updateItem(id, data) {
  return updateDoc(doc(db, 'items', id), data)
}

// Delete an item
export function deleteItem(id) {
  return deleteDoc(doc(db, 'items', id))
}

export function deleteUser(id) {
  return deleteDoc(doc(db, 'users', id))
}

/**** HELPERS ****/

// Store Firestore unsubscribe functions
const unsubs = {}

export function createQuery(getRef) {
  // Create a query function to pass to `useQuery`
  return async ({ queryKey }) => {
    let unsubscribe
    let firstRun = true
    // Wrap `onSnapshot` with a promise so that we can return initial data
    const data = await new Promise((resolve, reject) => {
      unsubscribe = onSnapshot(
        getRef(),
        // Success handler resolves the promise on the first run.
        // For subsequent runs we manually update the React Query cache.
        (response) => {
          const data = format(response)
          if (firstRun) {
            firstRun = false
            resolve(data)
          } else {
            client.setQueryData(queryKey, data)
          }
        },
        // Error handler rejects the promise on the first run.
        // We can't manually trigger an error in React Query, so on a subsequent runs we
        // invalidate the query so that it re-fetches and rejects if error persists.
        (error) => {
          if (firstRun) {
            firstRun = false
            reject(error)
          } else {
            client.invalidateQueries(queryKey)
          }
        },
      )
    })

    // Unsubscribe from an existing subscription for this `queryKey` if one exists
    // Then store `unsubscribe` function so it can be called later
    const queryHash = hashQueryKey(queryKey)
    unsubs[queryHash] && unsubs[queryHash]()
    unsubs[queryHash] = unsubscribe

    return data
  }
}

// Automatically remove Firestore subscriptions when all observing components have unmounted
client.queryCache.subscribe(({ type, query }) => {
  if (
    type === 'observerRemoved' &&
    query.getObserversCount() === 0 &&
    unsubs[query.queryHash]
  ) {
    // Call stored Firestore unsubscribe function
    unsubs[query.queryHash]()
    delete unsubs[query.queryHash]
  }
})

export function format(response) {
  // Converts doc into object that contains data and `doc.id`
  const formatDoc = (doc) => ({ id: doc.id, ...doc.data() })
  if (response.docs) {
    // Handle a collection of docs
    return response.docs.map(formatDoc)
  } else {
    // Handle a single doc
    return response.exists() ? formatDoc(response) : null
  }
}

// React Query context provider that wraps our app
export function QueryClientProvider(props) {
  return (
    <QueryClientProviderBase client={client}>
      {props.children}
    </QueryClientProviderBase>
  )
}

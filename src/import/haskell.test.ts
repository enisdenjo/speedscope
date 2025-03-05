import {checkProfileSnapshot} from '../lib/test-utils.js'

test('importFromHaskell', async () => {
  await checkProfileSnapshot('./sample/profiles/haskell/simple.prof')
})

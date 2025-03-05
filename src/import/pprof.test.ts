import {checkProfileSnapshot} from '../lib/test-utils.js'

test('importAsPprofProfile', async () => {
  await checkProfileSnapshot('./sample/profiles/pprof/simple.prof')
})

import {memoizeByShallowEquality, noop} from '../lib/utils.js'
import {Profile, Frame} from '../lib/profile.js'
import {Flamechart} from '../lib/flamechart.js'
import {
  createMemoizedFlamechartRenderer,
  FlamechartViewContainerProps,
  useFlamechartSetters,
} from './flamechart-view-container.js'
import {
  getCanvasContext,
  createGetColorBucketForFrame,
  createGetCSSColorForFrame,
  getFrameToColorBucket,
} from '../app-state/getters.js'
import {FlamechartWrapper} from './flamechart-wrapper.js'
import {h} from 'preact'
import {memo} from 'preact/compat'
import {useTheme} from './themes/theme.js'
import {FlamechartID} from '../app-state/profile-group.js'
import {flattenRecursionAtom, glCanvasAtom} from '../app-state/index.js'
import {useAtom} from '../lib/atom.js'

const getCalleeProfile = memoizeByShallowEquality<
  {
    profile: Profile
    frame: Frame
    flattenRecursion: boolean
  },
  Profile
>(({profile, frame, flattenRecursion}) => {
  let p = profile.getProfileForCalleesOf(frame)
  return flattenRecursion ? p.getProfileWithRecursionFlattened() : p
})

const getCalleeFlamegraph = memoizeByShallowEquality<
  {
    calleeProfile: Profile
    getColorBucketForFrame: (frame: Frame) => number
  },
  Flamechart
>(({calleeProfile, getColorBucketForFrame}) => {
  return new Flamechart({
    getTotalWeight: calleeProfile.getTotalNonIdleWeight.bind(calleeProfile),
    forEachCall: calleeProfile.forEachCallGrouped.bind(calleeProfile),
    formatValue: calleeProfile.formatValue.bind(calleeProfile),
    getColorBucketForFrame,
  })
})

const getCalleeFlamegraphRenderer = createMemoizedFlamechartRenderer()

export const CalleeFlamegraphView = memo((ownProps: FlamechartViewContainerProps) => {
  const {activeProfileState} = ownProps
  const {profile, sandwichViewState} = activeProfileState
  const flattenRecursion = useAtom(flattenRecursionAtom)
  const glCanvas = useAtom(glCanvasAtom)
  const theme = useTheme()

  if (!profile) throw new Error('profile missing')
  if (!glCanvas) throw new Error('glCanvas missing')
  const {callerCallee} = sandwichViewState
  if (!callerCallee) throw new Error('callerCallee missing')
  const {selectedFrame} = callerCallee

  const frameToColorBucket = getFrameToColorBucket(profile)
  const getColorBucketForFrame = createGetColorBucketForFrame(frameToColorBucket)
  const getCSSColorForFrame = createGetCSSColorForFrame({theme, frameToColorBucket})
  const canvasContext = getCanvasContext({theme, canvas: glCanvas})

  const flamechart = getCalleeFlamegraph({
    calleeProfile: getCalleeProfile({profile, frame: selectedFrame, flattenRecursion}),
    getColorBucketForFrame,
  })
  const flamechartRenderer = getCalleeFlamegraphRenderer({canvasContext, flamechart})

  return (
    <FlamechartWrapper
      theme={theme}
      renderInverted={false}
      flamechart={flamechart}
      flamechartRenderer={flamechartRenderer}
      canvasContext={canvasContext}
      getCSSColorForFrame={getCSSColorForFrame}
      {...useFlamechartSetters(FlamechartID.SANDWICH_CALLEES)}
      {...callerCallee.calleeFlamegraph}
      // This overrides the setSelectedNode specified in useFlamechartSettesr
      setSelectedNode={noop}
    />
  )
})

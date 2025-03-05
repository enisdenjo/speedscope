import {h} from 'preact'
import {getCanvasContext} from '../app-state/getters.js'
import {memo, useMemo} from 'preact/compat'
import {useActiveProfileState} from '../app-state/active-profile-state.js'
import {useTheme} from './themes/theme.js'
import {
  dragActiveAtom,
  errorAtom,
  flattenRecursionAtom,
  glCanvasAtom,
  hashParamsAtom,
  loadingAtom,
  profileGroupAtom,
  viewModeAtom,
} from '../app-state/index.js'
import {useAtom} from '../lib/atom.js'
import {ProfileSearchContextProvider} from './search-view.js'
import {Application} from './application.js'

export const ApplicationContainer = memo(() => {
  const canvas = useAtom(glCanvasAtom)
  const theme = useTheme()
  const canvasContext = useMemo(
    () => (canvas ? getCanvasContext({theme, canvas}) : null),
    [theme, canvas],
  )

  return (
    <ProfileSearchContextProvider>
      <Application
        activeProfileState={useActiveProfileState()}
        canvasContext={canvasContext}
        setGLCanvas={glCanvasAtom.set}
        setLoading={loadingAtom.set}
        setError={errorAtom.set}
        setProfileGroup={profileGroupAtom.setProfileGroup}
        setDragActive={dragActiveAtom.set}
        setViewMode={viewModeAtom.set}
        setFlattenRecursion={flattenRecursionAtom.set}
        setProfileIndexToView={profileGroupAtom.setProfileIndexToView}
        profileGroup={useAtom(profileGroupAtom)}
        theme={theme}
        flattenRecursion={useAtom(flattenRecursionAtom)}
        viewMode={useAtom(viewModeAtom)}
        hashParams={useAtom(hashParamsAtom)}
        glCanvas={canvas}
        dragActive={useAtom(dragActiveAtom)}
        loading={useAtom(loadingAtom)}
        error={useAtom(errorAtom)}
      />
    </ProfileSearchContextProvider>
  )
})

import {beta} from './beta.js'
import {delta} from './delta.js'

export function alpha() {
  ;(function () {
    for (let i = 0; i < 1000; i++) {
      beta()
      delta()
    }
  })()
}

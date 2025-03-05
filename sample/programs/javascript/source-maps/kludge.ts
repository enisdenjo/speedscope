import {alpha} from './alpha.js'

export class Kludge {
  constructor() {
    alpha()
    console.log(this.floop)
  }

  zap() {
    alpha()
  }

  get floop(): number {
    alpha()
    return 1
  }
}

import * as React from 'react'
import { styled, setup } from 'goober'

export default function(ele: string, other: Function | {}) {
  return styled(ele, typeof other === 'function' ? other : null)
}

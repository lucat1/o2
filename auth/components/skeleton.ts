import styled from '@emotion/styled'
import { darken, lighten } from 'polished'

import Theme from '../types/theme'

export interface SkeletonProps {
  width: number | string
  height: number | string
}

const Skeleton = styled.div<{ theme?: Theme } & SkeletonProps>`
  display: inline-block;
  background: ${({ theme }) =>
    theme.dark
      ? lighten(0.1)(theme.background)
      : darken(0.1)(theme.background)};
  border-radius: 4px;
  width: ${props =>
    typeof props.width === 'string' ? props.width : props.width + 'rem'};
  height: ${props =>
    typeof props.height === 'string' ? props.height : props.height + 'rem'};
`

export default Skeleton

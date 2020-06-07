import * as React from 'react'

const NotFound: React.FC<React.SVGProps<SVGSVGElement>> = (
  props: React.SVGProps<SVGSVGElement>
) => (
  <svg viewBox='0 0 797.5 834.5' {...props}>
    <ellipse cx={308.5} cy={780} rx={308.5} ry={54.5} fill='#3f3d56' />
    <circle cx={496} cy={301.5} r={301.5} fill='#3f3d56' />
    <circle cx={496} cy={301.5} r={248.9} opacity={0.1} />
    <circle cx={496} cy={301.5} r={204} opacity={0.1} />
    <circle cx={496} cy={301.5} r={146.3} opacity={0.1} />
    <path d='M197 328s-24 67-13 91 27 46 27 46-6-132-14-137z' fill='#d0cde1' />
    <path d='M197 328s-24 67-13 91 27 46 27 46-6-132-14-137z' opacity={0.1} />
    <path
      d='M214 483l-3 18v5a981 981 0 01-10 85c1 0-28 37-16 95l3 59s28 1 28-8l-2-17c0-5 4-5 2-8l-3-4s4-4 3-5 8-63 8-63 10-10 10-15v-5l4-12 24-55 10 39 10 55s6 50 16 70l19 61c0-2 30-6 29-14l-18-119 4-164z'
      fill='#2f2e41'
    />
    <path
      d='M190 740s-24 47-8 49 22 1 29-6l18-13a23 23 0 0011-22c0-4-2-7-6-8-10-1-23-10-23-10zm131 34s-24 47-8 49 22 2 29-6l18-12a23 23 0 0011-22c-1-5-2-8-6-9-11 0-23-10-23-10z'
      fill='#2f2e41'
    />
    <circle cx={295.9} cy={215.4} r={36.9} fill='#ffb8b8' />
    <path d='M272 228s-26 48-28 48l47 16 16-51z' fill='#ffb8b8' />
    <path
      d='M313 281s-53-29-58-28-62 50-61 70 8 53 8 53 3 93 8 94-1 17 1 17 123 0 124-3-22-203-22-203z'
      fill='#d0cde1'
    />
    <path d='M342 489s17 51 3 49-21-44-21-44z' fill='#ffb8b8' />
    <path
      d='M297 278s-32 7-27 50 15 88 15 88l32 71 4 14 24-7-18-101s-6-109-14-113a34 34 0 00-16-2z'
      fill='#d0cde1'
    />
    <path opacity={0.1} d='M278 415l40 72-34-76-6 4z' />
    <path
      d='M333 205v-3l5 1a6 6 0 00-2-4l6-1a64 64 0 00-43-26c-13-2-28 0-36 10-5 5-7 11-9 17-4 11-5 24 3 33 7 9 20 11 32 12 4 1 9 1 12-1a30 30 0 00-1-13 9 9 0 01-1-4c0-3 5-4 9-4s7 1 10-1l1-7c1-7 14-8 14-9z'
      fill='#2f2e41'
    />
    <circle cx={559} cy={744.5} r={43} fill='#c792ea' />
    <circle cx={54} cy={729.5} r={43} fill='#c792ea' />
    <circle cx={54} cy={672.5} r={31} fill='#c792ea' />
    <circle cx={54} cy={624.5} r={22} fill='#c792ea' />
  </svg>
)

if (process.env.NODE_ENV !== 'production') {
  NotFound.displayName = 'NotFound'
}

export default NotFound

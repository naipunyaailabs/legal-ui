'use client'

import { useId } from 'react'
import clsx from 'clsx'

type Star = [x: number, y: number, dim?: boolean, blur?: boolean]

const stars: Array<Star> = [
  [4, 4, true, true],
  [4, 44, true],
  [36, 22],
  [50, 146, true, true],
  [64, 43, true, true],
  [76, 30, true],
  [101, 116],
  [140, 36, true],
  [149, 134],
  [162, 74, true],
  [171, 96, true, true],
  [210, 56, true, true],
  [235, 90],
  [275, 82, true, true],
  [306, 6],
  [307, 64, true, true],
  [380, 68, true],
  [380, 108, true, true],
  [391, 148, true, true],
  [405, 18, true],
  [412, 86, true, true],
  [426, 210, true, true],
  [427, 56, true, true],
  [538, 138],
  [563, 88, true, true],
  [611, 154, true, true],
  [637, 150],
  [651, 146, true],
  [682, 70, true, true],
  [683, 128],
  [781, 82, true, true],
  [785, 158, true],
  [832, 146, true, true],
  [852, 89],
]

const constellations: Array<Array<Star>> = [
  [
    [247, 103],
    [261, 86],
    [307, 104],
    [357, 36],
  ],
  [
    [586, 120],
    [516, 100],
    [491, 62],
    [440, 107],
    [477, 180],
    [516, 100],
  ],
  [
    [733, 100],
    [803, 120],
    [879, 113],
    [823, 164],
    [803, 120],
  ],
]

function Star({
  blurId,
  point: [cx, cy, dim, blur],
}: {
  blurId: string
  point: Star
}) {
  // Determine the size of the star - some will be bigger, some normal
  const isBigStar = Math.random() > 0.7; // 30% chance of being a big star
  const radius = dim ? (isBigStar ? 1.2 : 0.5) : (isBigStar ? 2 : 1);
  
  return (
    <g className="opacity-100">
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        style={{
          transformOrigin: `${cx / 16}rem ${cy / 16}rem`,
          opacity: dim ? 1 : 1,
          fill: 'white',
        }}
        filter={blur ? `url(#${blurId})` : undefined}
      />
    </g>
  )
}

function Constellation({
  points,
  blurId,
}: {
  points: Array<Star>
  blurId: string
}) {
  const uniquePoints = points.filter(
    (point, pointIndex) =>
      points.findIndex((p) => String(p) === String(point)) === pointIndex,
  )

  return (
    <>
      <path
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        fill="transparent"
        d={`M ${points.join('L')}`}
      />
      {uniquePoints.map((point, pointIndex) => (
        <Star key={pointIndex} point={point} blurId={blurId} />
      ))}
    </>
  )
}

export function StarField({ className }: { className?: string }) {
  let blurId = useId()

  return (
    <svg
      viewBox="0 0 881 211"
      fill="white"
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute w-full h-full overflow-visible opacity-90',
        className,
      )}
    >
      <defs>
        <filter id={blurId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
        </filter>
      </defs>
      <g>
        {constellations.map((points, constellationIndex) => (
          <Constellation
            key={constellationIndex}
            points={points}
            blurId={blurId}
          />
        ))}
        {stars.map((point, pointIndex) => (
          <Star key={pointIndex} point={point} blurId={blurId} />
        ))}
      </g>
    </svg>
  )
}
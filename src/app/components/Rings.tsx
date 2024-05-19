const dash = (n: number) => `${n * 100}, 100`

const Rings = ({
  move = 0.5,
  exercise = 0.75,
  stand = 0.875,
  size = 72,
  ...props
}) => (
  <svg
    viewBox="0 0 36 36"
    width={size}
    height={size}
    className="rings"
    {...props}
  >
    <g className="move">
      <circle strokeWidth={3} r={16} className="background" />
      <circle
        strokeWidth={3}
        r={16}
        className="completed"
        strokeDasharray={dash(move)}
      />
    </g>
    <g className="exercise">
      <circle strokeWidth={4} r={16} className="background" />
      <circle
        strokeWidth={4}
        r={16}
        className="completed"
        strokeDasharray={dash(exercise)}
      />
    </g>
    <g className="stand">
      <circle strokeWidth={6} r={16} className="background" />
      <circle
        strokeWidth={6}
        r={16}
        className="completed"
        strokeDasharray={dash(stand)}
      />
    </g>
    <style jsx>{`
      .rings {
        --move: #fa114f;
        --exercise: #92e82a;
        --stand: #1eeaef;
      }
      .rings g {
        transform-origin: 50%;
      }
      .rings circle {
        fill: none;
        transform: translateX(50%) translateY(50%);
      }
      .background {
        opacity: 0.25;
      }
      .completed {
        stroke-linecap: round;
      }
      .move {
        stroke: var(--move);
        transform: scale(1) rotate(-90deg);
      }
      .exercise {
        stroke: var(--exercise);
        transform: scale(0.75) rotate(-90deg);
      }
      .stand {
        stroke: var(--stand);
        transform: scale(0.5) rotate(-90deg);
      }
    `}</style>
  </svg>
)

export default Rings
function ScoreGrid({ count }) {
  const completed = Math.floor(count / 100)
  const current = count % 100

  return (
    <div className={`sg-wrapper${count > 0 && current === 0 ? ' sg-wrapper--complete' : ''}`}>
      {completed > 0 && (
        <div className="sg-completed">
          {Array.from({ length: Math.min(completed, 10) }, (_, i) => (
            <div key={i} className="sg-icon sg-icon--filled" />
          ))}
          {completed > 10 && <span className="sg-more">+{completed - 10} more</span>}
          <span className="sg-label">{completed} full grid{completed !== 1 ? 's' : ''}</span>
        </div>
      )}
      <div
        className="sg-grid"
        role="img"
        aria-label={`Score visualizer: ${current} out of 100 blocks${completed > 0 ? `, ${completed} full grids completed` : ''}`}
      >
        {Array.from({ length: 100 }, (_, i) => (
          <div
            key={i}
            className={
              'sg-block' +
              (i < current ? ' sg-block--filled' : ' sg-block--empty') +
              (i === current - 1 ? ' sg-block--new' : '')
            }
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}

export default ScoreGrid

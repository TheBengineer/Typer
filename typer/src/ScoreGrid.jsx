function ScoreGrid({count}) {
    const thousands = Math.floor(count / 1000)
    const hundreds = Math.floor((count % 1000) / 100)
    const tens = Math.floor((count % 100) / 10)
    const ones = count % 10

    const onesJustCarried = count > 0 && count % 10 === 0
    const tensJustCarried = count > 0 && count % 100 === 0 && count % 1000 !== 0

    return (
        <div
            className="sg-pv"
            role="img"
            aria-label={`Score: ${count}. ${thousands} thousands, ${hundreds} hundreds, ${tens} tens, ${ones} ones`}
        >
            <div className="sg-pv-cols">
                {/* Thousands — digit only, no visual */}
                <div className="sg-pv-col">
                    <span className="sg-pv-label">Thousands</span>
                    <span className="sg-pv-digit">{thousands}</span>
                </div>

                {/* Hundreds — row of 10 blocks, each = 100 */}
                <div className="sg-pv-col sg-pv-col-hundreds">
                    <span className="sg-pv-label">Hundreds</span>
                    <span className="sg-pv-digit">{hundreds}</span>
                    <div className="sg-pv-col-label">each = 100</div>
                    <div className="sg-pv-hundreds-row">
                        {Array.from({length: 10}, (_, i) => (
                            <div
                                key={i}
                                className={
                                    'sg-pv-hblock' +
                                    (i < hundreds ? ' sg-pv-hblock--filled' : ' sg-pv-hblock--empty') +
                                    (i === hundreds - 1 && tensJustCarried ? ' sg-pv-hblock--new' : '')
                                }
                                aria-hidden="true"
                            >
                                {(i + 1) * 100}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tens — 10x10 grid, each row = 10 */}
                <div className="sg-pv-col sg-pv-col-tens">
                    <span className="sg-pv-label">Tens</span>
                    <span className="sg-pv-digit">{tens}</span>
                    <div className="sg-pv-col-label">x10</div>
                    <div className={`sg-pv-tens${tensJustCarried ? ' sg-pv-tens--just-carried' : ''}`}>
                        {Array.from({length: 100}, (_, i) => {
                            const row = Math.floor(i / 10)
                            const isFilled = row < tens
                            return (
                                <div
                                    key={i}
                                    className={
                                        'sg-pv-tdot' +
                                        (isFilled ? ' sg-pv-tdot--filled' : ' sg-pv-tdot--empty') +
                                        (row === tens - 1 && isFilled && i % 10 === 0 ? ' sg-pv-tdot--new-row' : '')
                                    }
                                    aria-hidden="true"
                                />
                            )
                        })}
                    </div>
                </div>

                {/* Ones — column of 10, each dot = 1 */}
                <div className={`sg-pv-col sg-pv-col-ones${onesJustCarried ? ' sg-pv-col-ones--just-carried' : ''}`}>
                    <span className="sg-pv-label">Ones</span>
                    <span className="sg-pv-digit">{ones}</span>
                    <div className="sg-pv-col-label">x1</div>
                    <div className="sg-pv-ones-row">
                        {Array.from({length: 10}, (_, i) => {
                            const isFilled = i >= 10 - ones
                            return (
                                <div
                                    key={i}
                                    className={
                                        'sg-pv-dot' +
                                        (isFilled ? ' sg-pv-dot--filled' : ' sg-pv-dot--empty') +
                                        (i === 10 - ones ? ' sg-pv-dot--new' : '')
                                    }
                                    aria-hidden="true"
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScoreGrid

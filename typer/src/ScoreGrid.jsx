function ScoreGrid({count}) {
    const thousands = Math.floor(count / 1000)
    const hundreds = Math.floor((count % 1000) / 100)
    const tens = Math.floor((count % 100) / 10)
    const ones = count % 10

    const onesJustCarried = count > 0 && count % 10 === 0
    const tensJustCarried = count > 0 && count % 100 === 0 && count % 1000 !== 0
    const hundredsJustCarried = count > 0 && count % 1000 === 0

    return (
        <div
            className="sg-pv"
            role="img"
            aria-label={`Score: ${count}. ${thousands} thousands, ${hundreds} hundreds, ${tens} tens, ${ones} ones`}
        >
            {/* Column labels */}
            <div className="sg-pv-labels">
                <span className="sg-pv-label">Thousands</span>
                <span className="sg-pv-label">Hundreds</span>
                <span className="sg-pv-label">Tens</span>
                <span className="sg-pv-label">Ones</span>
            </div>

            {/* Digit values above each column */}
            <div className="sg-pv-digits">
                <span className="sg-pv-digit">{thousands}</span>
                <span className="sg-pv-digit">{hundreds}</span>
                <span className="sg-pv-digit">{tens}</span>
                <span className="sg-pv-digit">{ones}</span>
            </div>

            <div className="sg-pv-cols">
                {/* === THOUSANDS: row of 10 blocks, each = 1000 === */}
                <div className={`sg-pv-thousands${hundredsJustCarried ? ' sg-pv-thousands--just-carried' : ''}`}>
                    <div className="sg-pv-col-label">each = 1000</div>
                    <div className="sg-pv-thousands-row">
                        {Array.from({length: 10}, (_, i) => (
                            <div
                                key={i}
                                className={
                                    'sg-pv-thblock' +
                                    (i < thousands ? ' sg-pv-thblock--filled' : ' sg-pv-thblock--empty') +
                                    (i === thousands - 1 && hundredsJustCarried ? ' sg-pv-thblock--new' : '')
                                }
                                aria-hidden="true"
                            >
                                {(i + 1) * 1000}
                            </div>
                        ))}
                    </div>
                </div>

                {/* === HUNDREDS: row of 10 compressed blocks, each = 100 === */}
                <div className="sg-pv-hundreds">
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

                {/* === TENS: 10x10 grid, each row = 10 === */}
                <div className="sg-pv-tens-wrap">
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

                {/* === ONES: column of 10, each dot = 1 === */}
                <div className={`sg-pv-ones${onesJustCarried ? ' sg-pv-ones--just-carried' : ''}`}>
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

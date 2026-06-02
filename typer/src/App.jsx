import {useState, useRef, useEffect} from 'react'
import confetti from 'canvas-confetti'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    const [letter, setLetter] = useState('A')
    const [typedLetter, setTypedLetter] = useState('')
    const [failed, setFailed] = useState(false)

    const [useNumbers, setUseNumbers] = useState(false)
    const [hintLetters, setHintLetters] = useState(true)
    const [wrongKey, setWrongKey] = useState('')

    const canvasRef = useRef(null)
    const peopleRef = useRef([])
    const colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#ff6b81']

    const srRef = useRef(null)

    useEffect(() => {
        const all = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        srRef.current = Object.fromEntries(
            all.split('').map(ch => [ch, { ease: 2.5, interval: 0, nextDue: 0 }])
        )
    }, [])

    function pickNext() {
        const pool = srRef.current
        if (!pool) return 'A'
        let best = null
        let bestTime = Infinity
        for (const ch in pool) {
            if (!useNumbers && ch >= '0' && ch <= '9') continue
            const due = pool[ch].nextDue
            if (due < bestTime) {
                bestTime = due
                best = ch
            }
        }
        return best || 'A'
    }

    function srCorrect(ch) {
        const card = srRef.current[ch]
        if (!card) return
        if (card.interval === 0) {
            card.interval = 1
        } else {
            card.interval = Math.round(card.interval * card.ease)
        }
        card.ease = Math.min(3.5, card.ease + 0.1)
        card.nextDue = Date.now() + card.interval * 2000
    }

    function srWrong(ch) {
        const card = srRef.current[ch]
        if (!card) return
        card.interval = 0
        card.ease = Math.max(1.3, card.ease - 0.2)
        card.nextDue = Date.now()
    }

    function spawnPerson(ch) {
        const cvs = canvasRef.current
        if (!cvs) return
        const rect = cvs.getBoundingClientRect()
        const btn = document.querySelector(`#keyboard button[data-key="${ch}"]`)
        let sx = cvs.width / 2
        let sy = 0
        if (btn) {
            const br = btn.getBoundingClientRect()
            sx = br.left + br.width / 2 - rect.left
            sy = br.top - rect.top
        }
        peopleRef.current.push({
            x: sx,
            y: sy,
            targetY: cvs.height - 20,
            dir: Math.random() < 0.5 ? 1 : -1,
            speed: 0.5 + Math.random() * 0.5,
            frame: 0,
            color: colors[Math.floor(Math.random() * colors.length)],
            dropping: true
        })
    }

    useEffect(() => {
        const cvs = canvasRef.current
        if (!cvs) return
        const ctx = cvs.getContext('2d')
        let animId

        function resize() {
            const parent = cvs.parentElement
            cvs.width = parent.clientWidth
            cvs.height = parent.clientHeight
        }
        resize()
        window.addEventListener('resize', resize)

        function drawPerson(p) {
            const s = p.dir
            const legSwing = Math.sin(p.frame * 0.15) * 8
            ctx.strokeStyle = p.color
            ctx.lineWidth = 2.5
            ctx.lineCap = 'round'

            // head
            ctx.beginPath()
            ctx.arc(p.x, p.y - 24, 7, 0, Math.PI * 2)
            ctx.stroke()
            ctx.fillStyle = p.color
            ctx.fill()

            // body
            ctx.beginPath()
            ctx.moveTo(p.x, p.y - 17)
            ctx.lineTo(p.x, p.y - 2)
            ctx.stroke()

            // left leg
            ctx.beginPath()
            ctx.moveTo(p.x, p.y - 2)
            ctx.lineTo(p.x - 6 - legSwing * s, p.y + 10)
            ctx.stroke()

            // right leg
            ctx.beginPath()
            ctx.moveTo(p.x, p.y - 2)
            ctx.lineTo(p.x + 6 + legSwing * s, p.y + 10)
            ctx.stroke()

            // arms
            ctx.beginPath()
            ctx.moveTo(p.x, p.y - 14)
            ctx.lineTo(p.x - 8 + legSwing * s * 0.5, p.y - 6)
            ctx.moveTo(p.x, p.y - 14)
            ctx.lineTo(p.x + 8 - legSwing * s * 0.5, p.y - 6)
            ctx.stroke()
        }

        function tick() {
            ctx.clearRect(0, 0, cvs.width, cvs.height)
            const people = peopleRef.current
            for (let i = people.length - 1; i >= 0; i--) {
                const p = people[i]
                if (p.dropping) {
                    p.y += 4
                    if (p.y >= p.targetY) {
                        p.y = p.targetY
                        p.dropping = false
                    }
                } else {
                    p.x += p.dir * p.speed
                    p.frame++
                }
                if (p.x < -30 || p.x > cvs.width + 30) {
                    people.splice(i, 1)
                    continue
                }
                drawPerson(p)
            }
            animId = requestAnimationFrame(tick)
        }
        tick()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    function newLetter() {
        setLetter(pickNext())
    }

    function checkLetter(typedLetter) {
        if (typedLetter === letter) {
            srCorrect(letter)
            setCount(count + 1)
            newLetter()
            setFailed(false)
            setWrongKey('')
            spawnPerson(letter)
            confetti({particleCount: 100, spread: 70, origin: {y: 0.6}})
        } else {
            srWrong(letter)
            setFailed(true)
            setWrongKey(typedLetter)
        }
    }

    function handleKeyDown(e) {
        const key = e.key.toUpperCase()
        setTypedLetter(key)
        checkLetter(key)
    }

    return (
        <div onKeyDown={handleKeyDown} tabIndex={0} style={{outline: 'none'}}>
            <div className="hero">
                <h1>Typer</h1>
            </div>
            <section id="center">
                <div style={{
                    fontSize: '120px',
                    fontWeight: 'bold',
                    color: failed ? 'red' : 'black',
                    height: '120px',
                    marginTop: '40px'
                }}>{letter}</div>
            </section>
            <section id="typed">
                <div style={{fontSize: '20px', fontWeight: 'bold', color: failed ? 'red' : 'black'}}>{typedLetter}</div>
            </section>
            <section id="keyboard" style={{position: 'relative'}}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    margin: '40px auto',
                    padding: '20px'
                }}>
                    <div style={{display: 'flex', gap: '6px'}}>
                        <div style={{width: '56px'}} />
                        {['1','2','3','4','5','6','7','8','9','0'].map(key => (
                            <button key={key} data-key={key} style={{
                                width: '50px', height: '50px', fontSize: '20px', fontWeight: 'bold',
                                border: '2px solid var(--border)', borderRadius: '8px',
                                background: key === letter ? 'var(--accent-bg)' : key === wrongKey ? '#ff000020' : 'var(--bg)',
                                color: key === letter ? 'var(--accent)' : key === wrongKey ? 'red' : 'var(--text)',
                                cursor: 'pointer', transition: 'all 0.2s',
                                borderColor: key === letter ? 'var(--accent-border)' : key === wrongKey ? 'red' : 'var(--border)'
                            }} onClick={() => { setTypedLetter(key); checkLetter(key) }}>
                                {key}
                            </button>
                        ))}
                        <button style={{
                            width: '76px', height: '50px', fontSize: '12px', fontWeight: 'bold',
                            border: '2px solid var(--border)', borderRadius: '8px',
                            background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer'
                        }} onClick={() => { setTypedLetter('\b'); checkLetter('\b') }}>
                            ⌫
                        </button>
                    </div>
                    <div style={{display: 'flex', gap: '6px'}}>
                        <button style={{
                            width: '62px', height: '50px', fontSize: '12px', fontWeight: 'bold',
                            border: '2px solid var(--border)', borderRadius: '8px',
                            background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer'
                        }} onClick={() => { setTypedLetter('\t'); checkLetter('\t') }}>
                            Tab
                        </button>
                        {['Q','W','E','R','T','Y','U','I','O','P'].map(key => (
                            <button key={key} data-key={key} style={{
                                width: '50px', height: '50px', fontSize: '20px', fontWeight: 'bold',
                                border: '2px solid var(--border)', borderRadius: '8px',
                                background: key === letter ? 'var(--accent-bg)' : key === wrongKey ? '#ff000020' : 'var(--bg)',
                                color: key === letter ? 'var(--accent)' : key === wrongKey ? 'red' : 'var(--text)',
                                cursor: 'pointer', transition: 'all 0.2s',
                                borderColor: key === letter ? 'var(--accent-border)' : key === wrongKey ? 'red' : 'var(--border)'
                            }} onClick={() => { setTypedLetter(key); checkLetter(key) }}>
                                {key}
                            </button>
                        ))}
                    </div>
                    <div style={{display: 'flex', gap: '6px', paddingLeft: '32px'}}>
                        <button style={{
                            width: '78px', height: '50px', fontSize: '11px', fontWeight: 'bold',
                            border: '2px solid var(--border)', borderRadius: '8px',
                            background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer'
                        }} onClick={() => { setTypedLetter('\x00'); checkLetter('\x00') }}>
                            Caps
                        </button>
                        {['A','S','D','F','G','H','J','K','L'].map(key => (
                            <button key={key} data-key={key} style={{
                                width: '50px', height: '50px', fontSize: '20px', fontWeight: 'bold',
                                border: '2px solid var(--border)', borderRadius: '8px',
                                background: key === letter ? 'var(--accent-bg)' : key === wrongKey ? '#ff000020' : 'var(--bg)',
                                color: key === letter ? 'var(--accent)' : key === wrongKey ? 'red' : 'var(--text)',
                                cursor: 'pointer', transition: 'all 0.2s',
                                borderColor: key === letter ? 'var(--accent-border)' : key === wrongKey ? 'red' : 'var(--border)'
                            }} onClick={() => { setTypedLetter(key); checkLetter(key) }}>
                                {key}
                            </button>
                        ))}
                        <button style={{
                            width: '78px', height: '50px', fontSize: '12px', fontWeight: 'bold',
                            border: '2px solid var(--border)', borderRadius: '8px',
                            background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer'
                        }} onClick={() => { setTypedLetter('\n'); checkLetter('\n') }}>
                            Enter
                        </button>
                    </div>
                    <div style={{display: 'flex', gap: '6px', paddingLeft: '56px'}}>
                        <button style={{
                            width: '104px', height: '50px', fontSize: '12px', fontWeight: 'bold',
                            border: '2px solid var(--border)', borderRadius: '8px',
                            background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer'
                        }} onClick={() => { setTypedLetter('shift'); checkLetter('shift') }}>
                            Shift
                        </button>
                        {['Z','X','C','V','B','N','M'].map(key => (
                            <button key={key} data-key={key} style={{
                                width: '50px', height: '50px', fontSize: '20px', fontWeight: 'bold',
                                border: '2px solid var(--border)', borderRadius: '8px',
                                background: key === letter ? 'var(--accent-bg)' : key === wrongKey ? '#ff000020' : 'var(--bg)',
                                color: key === letter ? 'var(--accent)' : key === wrongKey ? 'red' : 'var(--text)',
                                cursor: 'pointer', transition: 'all 0.2s',
                                borderColor: key === letter ? 'var(--accent-border)' : key === wrongKey ? 'red' : 'var(--border)'
                            }} onClick={() => { setTypedLetter(key); checkLetter(key) }}>
                                {key}
                            </button>
                        ))}
                        <button style={{
                            width: '104px', height: '50px', fontSize: '12px', fontWeight: 'bold',
                            border: '2px solid var(--border)', borderRadius: '8px',
                            background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer'
                        }} onClick={() => { setTypedLetter('shift'); checkLetter('shift') }}>
                            Shift
                        </button>
                    </div>
                    <div style={{display: 'flex', gap: '6px'}}>
                        <button style={{
                            width: '70px', height: '50px', fontSize: '12px', fontWeight: 'bold',
                            border: '2px solid var(--border)', borderRadius: '8px',
                            background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer'
                        }} onClick={() => { setTypedLetter('ctrl'); checkLetter('ctrl') }}>
                            Ctrl
                        </button>
                        <button style={{
                            width: '70px', height: '50px', fontSize: '12px', fontWeight: 'bold',
                            border: '2px solid var(--border)', borderRadius: '8px',
                            background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer'
                        }} onClick={() => { setTypedLetter('alt'); checkLetter('alt') }}>
                            Alt
                        </button>
                        <button style={{
                            width: '240px', height: '50px', fontSize: '14px', fontWeight: 'bold',
                            border: '2px solid var(--border)', borderRadius: '8px',
                            background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer'
                        }} onClick={() => { setTypedLetter(' '); checkLetter(' ') }}>
                            Space
                        </button>
                        <button style={{
                            width: '70px', height: '50px', fontSize: '12px', fontWeight: 'bold',
                            border: '2px solid var(--border)', borderRadius: '8px',
                            background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer'
                        }} onClick={() => { setTypedLetter('alt'); checkLetter('alt') }}>
                            Alt
                        </button>
                        <button style={{
                            width: '70px', height: '50px', fontSize: '12px', fontWeight: 'bold',
                            border: '2px solid var(--border)', borderRadius: '8px',
                            background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer'
                        }} onClick={() => { setTypedLetter('ctrl'); checkLetter('ctrl') }}>
                            Ctrl
                        </button>
                    </div>
                </div>
                <canvas ref={canvasRef} style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    pointerEvents: 'none', zIndex: 1
                }} />
            </section>
            <section id="control">
                <div>
                    <label>
                        <input type="checkbox" checked={useNumbers} onChange={() => setUseNumbers(!useNumbers)}/>
                        Use Numbers
                    </label>
                    <label>
                        <input type="checkbox" checked={hintLetters} onChange={() => setHintLetters(!hintLetters)}/>
                        Hint Letters
                    </label>
                </div>
            </section>
        </div>
    )
}

export default App

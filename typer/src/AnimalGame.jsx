import {useState, useRef, useEffect, useCallback} from 'react'
import confetti from 'canvas-confetti'
import animals from './AnimalData.js'

function AnimalGame() {
    const [currentAnimal, setCurrentAnimal] = useState(null)
    const [typedLetters, setTypedLetters] = useState('')
    const [score, setScore] = useState(0)
    const [failed, setFailed] = useState(false)
    const [wrongKey, setWrongKey] = useState('')
    const [loaded, setLoaded] = useState(false)
    const [imgError, setImgError] = useState(false)
    const [unlockedCount, setUnlockedCount] = useState(4)

    const srRef = useRef(null)
    const walkingAnimalsRef = useRef([])
    const canvasRef = useRef(null)
    const animalShownAtRef = useRef(null)
    const failedTimeoutRef = useRef(null)
    const colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#ff6b81']
    const imageCacheRef = useRef({})
    const verifiedQueue = useRef([])
    const BATCH_SIZE = 8

    const unlocked = animals.slice(0, unlockedCount)

    function loadState() {
        try {
            const raw = localStorage.getItem('animal_sr')
            if (raw) return JSON.parse(raw)
        } catch { /* ignore */ }
        return null
    }

    function saveState() {
        const data = {
            cards: srRef.current,
            unlockedCount,
            score
        }
        try {
            localStorage.setItem('animal_sr', JSON.stringify(data))
        } catch { /* ignore */ }
    }

    // Initialize SR on mount
    useEffect(() => {
        const saved = loadState()
        if (saved?.cards) {
            srRef.current = saved.cards
            setUnlockedCount(saved.unlockedCount ?? 4)
            setScore(saved.score ?? 0)
        } else {
            const init = {}
            for (const a of animals) {
                init[a.name] = { ease: 2.5, interval: 0, nextDue: 0 }
            }
            srRef.current = init
        }
        // Pick first animal
        const pool = srRef.current
        const uname = animals.slice(0, saved?.unlockedCount ?? 4).map(a => a.name)
        let best = null
        let bestTime = Infinity
        for (const name of uname) {
            const due = pool[name]?.nextDue ?? 0
            if (due < bestTime) {
                bestTime = due
                best = name
            }
        }
        const animal = animals.find(a => a.name === (best || animals[0].name))
        setCurrentAnimal(animal || animals[0])
        animalShownAtRef.current = Date.now()

        refillQueue(saved?.unlockedCount ?? 4)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function verifyAnimal(a) {
        return new Promise((resolve) => {
            if (imageCacheRef.current[a.url]) {
                resolve(true)
                return
            }
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
                imageCacheRef.current[a.url] = img
                resolve(true)
            }
            img.onerror = () => resolve(false)
            img.src = a.url
        })
    }

    async function refillQueue(upTo) {
        const limit = upTo ?? unlockedCount
        const batch = animals.slice(0, limit)
        const queuedUrls = new Set(verifiedQueue.current.map(a => a.url))
        const unverified = batch.filter(a => !queuedUrls.has(a.url) && !verifiedQueue.current.some(v => v.url === a.url))

        for (const a of unverified) {
            if (verifiedQueue.current.length >= BATCH_SIZE) break
            const ok = await verifyAnimal(a)
            if (ok) {
                verifiedQueue.current.push(a)
            }
        }
    }

    function pickNext() {
        const pool = srRef.current
        if (!pool) return animals[0]
        if (verifiedQueue.current.length < 3) refillQueue()

        const candidates = verifiedQueue.current
        if (candidates.length === 0) {
            return unlocked[0] || animals[0]
        }
        let best = null
        let bestTime = Infinity
        for (const a of candidates) {
            const due = pool[a.name]?.nextDue ?? 0
            if (due < bestTime) {
                bestTime = due
                best = a
            }
        }
        const chosen = best || candidates[0]
        verifiedQueue.current = verifiedQueue.current.filter(a => a !== chosen)
        setTimeout(() => refillQueue(), 100)
        return chosen
    }

    // Save on score change
    useEffect(() => {
        if (srRef.current) saveState()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [score])

    // Save on unlock count change
    useEffect(() => {
        if (srRef.current) saveState()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unlockedCount])

    // Pre-load image when currentAnimal changes
    useEffect(() => {
        if (!currentAnimal) return
        setLoaded(false)
        setImgError(false)
        setTypedLetters('')
        setFailed(false)
        setWrongKey('')
        animalShownAtRef.current = Date.now()

        if (imageCacheRef.current[currentAnimal.url]) {
            setLoaded(true)
            return
        }
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
            imageCacheRef.current[currentAnimal.url] = img
            setLoaded(true)
        }
        img.onerror = () => {
            setImgError(true)
            setLoaded(true)
        }
        img.src = currentAnimal.url
    }, [currentAnimal])

    // Canvas animation loop
    useEffect(() => {
        const cvs = canvasRef.current
        if (!cvs) return
        const ctx = cvs.getContext('2d')
        let animId

        function resize() {
            const parent = cvs.parentElement
            if (!parent) return
            cvs.width = parent.clientWidth
            cvs.height = parent.clientHeight
        }
        resize()
        window.addEventListener('resize', resize)

        function tick() {
            ctx.clearRect(0, 0, cvs.width, cvs.height)
            const walkers = walkingAnimalsRef.current
            for (let i = walkers.length - 1; i >= 0; i--) {
                const p = walkers[i]
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
                if (p.x < 10 || p.x > cvs.width - 10) {
                    p.dir *= -1
                }
                // Draw animal image
                if (p.img) {
                    ctx.save()
                    // Flip image based on direction
                    if (p.dir < 0) {
                        ctx.translate(p.x + 25, 0)
                        ctx.scale(-1, 1)
                        ctx.drawImage(p.img, 0, p.y - 10, 50, 50)
                    } else {
                        ctx.drawImage(p.img, p.x, p.y - 10, 50, 50)
                    }
                    ctx.restore()
                } else {
                    // Fallback: draw colored circle with first letter
                    ctx.beginPath()
                    ctx.arc(p.x + 25, p.y + 15, 20, 0, Math.PI * 2)
                    ctx.fillStyle = p.color
                    ctx.fill()
                    ctx.fillStyle = '#fff'
                    ctx.font = 'bold 16px sans-serif'
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    ctx.fillText(p.animal[0].toUpperCase(), p.x + 25, p.y + 15)
                }
            }
            animId = requestAnimationFrame(tick)
        }
        tick()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    function preloadImage(url) {
        if (imageCacheRef.current[url]) return imageCacheRef.current[url]
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => { imageCacheRef.current[url] = img }
        img.src = url
        imageCacheRef.current[url] = img
        return img
    }

    function spawnWalkingAnimal(animal) {
        const cvs = canvasRef.current
        if (!cvs) return
        const sx = cvs.width / 2
        const sy = 0
        const img = imageCacheRef.current[animal.url] || preloadImage(animal.url)
        walkingAnimalsRef.current.push({
            animal: animal.name,
            x: sx - 25,
            y: sy,
            targetY: cvs.height - 60,
            dir: Math.random() < 0.5 ? 1 : -1,
            speed: 0.5 + Math.random() * 0.5,
            frame: 0,
            dropping: true,
            img: img,
            color: colors[Math.floor(Math.random() * colors.length)]
        })
    }

    function srCorrect(name) {
        const card = srRef.current[name]
        if (!card) return
        const elapsed = Date.now() - (animalShownAtRef.current || Date.now())
        if (elapsed > 5000) {
            card.interval = 0
            card.ease = Math.max(1.3, card.ease - 0.1)
        } else if (card.interval === 0) {
            card.interval = 1
        } else {
            card.interval = Math.round(card.interval * card.ease)
            card.ease = Math.min(3.5, card.ease + 0.1)
        }
        card.nextDue = Date.now() + card.interval * 2000
        tryUnlock()
        saveState()
    }

    function srWrong(name) {
        const card = srRef.current[name]
        if (!card) return
        card.interval = 0
        card.ease = Math.max(1.3, card.ease - 0.2)
        card.nextDue = Date.now()
        saveState()
    }

    function tryUnlock() {
        const mastered = unlocked.every(a => {
            const card = srRef.current[a.name]
            return card && card.interval >= 1
        })
        if (mastered && unlockedCount < animals.length) {
            const next = unlockedCount + 4
            const newCount = Math.min(next, animals.length)
            setUnlockedCount(newCount)
            setTimeout(() => refillQueue(newCount), 50)
        }
    }

    const handleKeyDown = useCallback((e) => {
        if (!currentAnimal) return
        const key = e.key.toLowerCase()
        if (key.length !== 1 || !/[a-z]/.test(key)) return
        e.preventDefault()

        const target = currentAnimal.name
        const nextIdx = typedLetters.length

        if (nextIdx >= target.length) return

        if (key === target[nextIdx]) {
            const newTyped = typedLetters + key
            setTypedLetters(newTyped)
            setFailed(false)
            setWrongKey('')

            if (newTyped.length === target.length) {
                // Full name completed
                srCorrect(currentAnimal.name)
                setScore(s => s + 1)
                spawnWalkingAnimal(currentAnimal)
                animalShownAtRef.current = Date.now()
                confetti({particleCount: 100, spread: 70, origin: {y: 0.6}})
                // Pick next animal
                const next = pickNext()
                setCurrentAnimal(next)
                setTypedLetters('')
            }
        } else {
            srWrong(currentAnimal.name)
            setFailed(true)
            setWrongKey(key)
            if (failedTimeoutRef.current) clearTimeout(failedTimeoutRef.current)
            failedTimeoutRef.current = setTimeout(() => {
                setFailed(false)
                setWrongKey('')
            }, 200)
        }
    }, [currentAnimal, typedLetters])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (failedTimeoutRef.current) clearTimeout(failedTimeoutRef.current)
        }
    }, [])

    // Focus on mount
    useEffect(() => {
        const el = canvasRef.current?.parentElement?.querySelector('[tabindex="0"]')
        if (el) el.focus()
    }, [])

    if (!currentAnimal) {
        return (
            <div className="animal-game">
                <div className="animal-loading"><div className="animal-spinner" /></div>
            </div>
        )
    }

    const targetName = currentAnimal.name
    const letterSpans = targetName.split('').map((letter, i) => {
        let cls = 'animal-letter'
        if (i < typedLetters.length) {
            cls += ' animal-letter--completed'
        } else if (i === typedLetters.length) {
            cls += failed ? ' animal-letter--wrong' : ' animal-letter--current'
        } else {
            cls += ' animal-letter--future'
        }
        return (
            <span key={i} className={cls}>
                {letter.toUpperCase()}
            </span>
        )
    })

    return (
        <div onKeyDown={handleKeyDown} tabIndex={0} className="game-container">
            <div className="animal-game">
                {/* Image */}
                {!loaded ? (
                    <div className="animal-loading"><div className="animal-spinner" /></div>
                ) : imgError ? (
                    <div className="animal-image-error">🐾</div>
                ) : (
                    <img
                        className="animal-image"
                        src={currentAnimal.url}
                        alt={currentAnimal.name}
                        onError={() => { setImgError(true); setLoaded(true) }}
                    />
                )}

                {/* Letter prompt */}
                <div className="animal-prompt">
                    {letterSpans}
                </div>

                {/* Score */}
                <div className="animal-score">
                    Score: {score}
                </div>

                {/* Canvas for walking animals - positioned in a container below */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '500px',
                    height: '120px',
                    marginTop: '10px',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--accent-bg)'
                }}>
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: 1
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default AnimalGame

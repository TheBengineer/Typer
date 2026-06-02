import {useState} from 'react'
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

    function newLetter() {
        const pool = useNumbers
            ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const ch = pool[Math.floor(Math.random() * pool.length)]
        setLetter(ch)
    }

    function checkLetter(typedLetter) {
        if (typedLetter === letter) {
            setCount(count + 1)
            newLetter()
            setFailed(false)
            setWrongKey('')
            confetti({particleCount: 100, spread: 70, origin: {y: 0.6}})
        } else {
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
            <section id="keyboard">
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
                            <button key={key} style={{
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
                            <button key={key} style={{
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
                            <button key={key} style={{
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
                            <button key={key} style={{
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

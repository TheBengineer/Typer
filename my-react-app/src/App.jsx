import {useState} from 'react'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    const [letter, setLetter] = useState('A')
    const [typedLetter, setTypedLetter] = useState('')
    const [failed, setFailed] = useState(false)

    const [useNumbers, setUseNumbers] = useState(false)
    const [hintLetters, setHintLetters] = useState(true)

    function newLetter() {
        const randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 65)
        setLetter(randomLetter)
    }

    function checkLetter(typedLetter) {
        if (typedLetter === letter) {
            setCount(count + 1)
            newLetter()
            setFailed(false)
        } else {
            setFailed(true)
        }
    }

    function handleKeyDown(e) {
        const key = e.key.toUpperCase()
        console.log(key)
        setTypedLetter(key)
        checkLetter()
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
                    height: '120px'
                }}>{letter}</div>
            </section>
            <section id="typed">
                <div style={{fontSize: '20px', fontWeight: 'bold', color: failed ? 'red' : 'black'}}>{typedLetter}</div>
            </section>
            <section id="keyboard">
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '8px',
                    maxWidth: '800px',
                    margin: '40px auto',
                    padding: '20px'
                }}>
                    {Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)).map(key => (
                        <button
                            key={key}
                            style={{
                                width: '50px',
                                height: '50px',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                border: '2px solid var(--border)',
                                borderRadius: '8px',
                                background: key === letter ? 'var(--accent-bg)' : 'var(--bg)',
                                color: key === letter ? 'var(--accent)' : 'var(--text)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                borderColor: key === letter ? 'var(--accent-border)' : 'var(--border)'
                            }}
                            onClick={() => {
                                setTypedLetter(key)
                                checkLetter(key)
                            }}
                        >
                            {key}
                        </button>
                    ))}
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

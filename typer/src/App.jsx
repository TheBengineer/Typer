import {useState, useEffect} from 'react'
import TypingGame from './TypingGame.jsx'
import './App.css'

function App() {
    const [count, setCount] = useState(() => {
        try {
            const match = document.cookie.match(/(?:^| )typer_sr=([^;]*)/)
            if (match) return JSON.parse(decodeURIComponent(match[1]))?.score ?? 0
        } catch { /* ignore */ }
        return 0
    })
    const [letter, setLetter] = useState('A')
    const [typedLetter, setTypedLetter] = useState('')
    const [failed, setFailed] = useState(false)
    const [wrongKey, setWrongKey] = useState('')

    return (
        <>
            <div className="hero">
                <h1>Typer</h1>
            </div>
            <TypingGame
                count={count}
                setCount={setCount}
                letter={letter}
                setLetter={setLetter}
                typedLetter={typedLetter}
                setTypedLetter={setTypedLetter}
                failed={failed}
                setFailed={setFailed}
                wrongKey={wrongKey}
                setWrongKey={setWrongKey}
            />
            <section id="footer">
                <div>
                    <a href="https://github.com/thebengineer/typer" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <br/>
                    <a href="https://thebengineer.net" target="_blank" rel="noopener noreferrer">TheBengineer.net</a>
                </div>
            </section>
        </>
    )
}

export default App

import {useState, useEffect, useRef} from 'react'
import TabBar from './TabBar.jsx'
import TypingGame from './TypingGame.jsx'
import AnimalGame from './AnimalGame.jsx'
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

    const [activeTab, setActiveTab] = useState(() => {
        return window.location.hash.slice(1) || 'typing'
    })

    useEffect(() => {
        const onHashChange = () => {
            const tab = window.location.hash.slice(1) || 'typing'
            if (['typing', 'placeholder'].includes(tab)) {
                setActiveTab(tab)
            } else {
                window.location.hash = ''
            }
        }
        window.addEventListener('hashchange', onHashChange)
        onHashChange()
        return () => window.removeEventListener('hashchange', onHashChange)
    }, [])

    const handleTabChange = (tabId) => {
        window.location.hash = tabId
    }

    const gameContainerRef = useRef(null)

    useEffect(() => {
        if (activeTab === 'typing' && gameContainerRef.current) {
            const gameDiv = gameContainerRef.current.querySelector('[tabindex="0"]')
            if (gameDiv) gameDiv.focus()
        }
    }, [activeTab])

    return (
        <>
            <TabBar
                tabs={[
                    {id: 'typing', label: 'Typer'},
                    {id: 'placeholder', label: 'Other Game'}
                ]}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />
            <div ref={gameContainerRef}>
                {activeTab === 'typing' ? (
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
                ) : (
                    <AnimalGame />
                )}
            </div>
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

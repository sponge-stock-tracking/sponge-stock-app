import { useState, useEffect } from 'react'

export function useTypewriter(text: string, speed: number = 30, enabled: boolean = true) {
    const [displayedText, setDisplayedText] = useState('')
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        if (!enabled) {
            setDisplayedText(text)
            setIsComplete(true)
            return
        }

        setDisplayedText('')
        setIsComplete(false)

        let index = 0
        const intervalId = setInterval(() => {
            if (index >= text.length) {
                clearInterval(intervalId)
                setIsComplete(true)
                return
            }
            // Add a chunk of characters for smoother/faster feel
            const chunk = text.slice(index, index + 2)
            setDisplayedText((prev) => prev + chunk)
            index += 2
        }, speed)

        return () => clearInterval(intervalId)
    }, [text, speed, enabled])

    return { displayedText: enabled ? displayedText : text, isComplete }
}

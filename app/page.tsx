"use client"

import {useEffect, useRef} from "react"

export default function Home() {
    const chatARef = useRef<HTMLIFrameElement>(null)
    const chatBRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "CHAT_MESSAGE" || event.data?.type === "TYPING_INDICATOR") {
                console.log("Parent received message:", event.data)

                if (event.data.from === "chat-a" && chatBRef.current?.contentWindow) {
                    console.log("Forwarding to chat-b")
                    chatBRef.current.contentWindow.postMessage(event.data, "*")
                } else if (event.data.from === "chat-b" && chatARef.current?.contentWindow) {
                    console.log("Forwarding to chat-a")
                    chatARef.current.contentWindow.postMessage(event.data, "*")
                }
            }
        }

        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [])

    return (
        <main className="flex h-screen gap-4 bg-gray-100 p-4">
            <div className="flex flex-1 flex-col">
                <iframe
                    ref={chatARef}
                    src="/chat-a"
                    className="h-full w-full rounded-lg border-2 border-border bg-card shadow-lg"
                    title="Chat A"
                />
            </div>
            <div className="flex flex-1 flex-col">
                <iframe
                    ref={chatBRef}
                    src="/chat-b"
                    className="h-full w-full rounded-lg border-2 border-border bg-card shadow-lg"
                    title="Chat B"
                />
            </div>
        </main>
    )
}

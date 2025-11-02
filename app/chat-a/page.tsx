"use client"

import type React from "react"

import {useState, useEffect, useRef} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card} from "@/components/ui/card"
import {Send, Smile} from "lucide-react"
import Image from "next/image"

interface Message {
    id: string
    text: string
    sender: "self" | "other"
    timestamp: Date
}

const EMOJIS = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "✨", "💯", "🙌", "👏", "😍", "🤔", "😎", "🚀", "⭐"]

export default function ChatA() {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [isOtherTyping, setIsOtherTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "CHAT_MESSAGE" && event.data.from === "chat-b") {
                const newMessage: Message = {
                    id: Date.now().toString(),
                    text: event.data.text,
                    sender: "other",
                    timestamp: new Date(),
                }
                setMessages((prev) => [...prev, newMessage])
                setIsOtherTyping(false)
            } else if (event.data?.type === "TYPING_INDICATOR" && event.data.from === "chat-b") {
                setIsOtherTyping(event.data.isTyping)
            }
        }

        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages, isOtherTyping])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)

        window.parent.postMessage(
            {
                type: "TYPING_INDICATOR",
                from: "chat-a",
                to: "chat-b",
                isTyping: true,
            },
            "*",
        )

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            window.parent.postMessage(
                {
                    type: "TYPING_INDICATOR",
                    from: "chat-a",
                    to: "chat-b",
                    isTyping: false,
                },
                "*",
            )
        }, 1000)
    }

    const sendMessage = () => {
        if (!inputValue.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "self",
            timestamp: new Date(),
        }
        setMessages((prev) => [...prev, newMessage])

        window.parent.postMessage(
            {
                type: "CHAT_MESSAGE",
                from: "chat-a",
                to: "chat-b",
                text: inputValue,
            },
            "*",
        )

        setInputValue("")
        window.parent.postMessage(
            {
                type: "TYPING_INDICATOR",
                from: "chat-a",
                to: "chat-b",
                isTyping: false,
            },
            "*",
        )
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const insertEmoji = (emoji: string) => {
        setInputValue((prev) => prev + emoji)
        setShowEmojiPicker(false)

        window.parent.postMessage(
            {
                type: "TYPING_INDICATOR",
                from: "chat-a",
                to: "chat-b",
                isTyping: true,
            },
            "*",
        )

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            window.parent.postMessage(
                {
                    type: "TYPING_INDICATOR",
                    from: "chat-a",
                    to: "chat-b",
                    isTyping: false,
                },
                "*",
            )
        }, 1000)
    }

    return (
        <div className="flex h-screen flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <Card className="flex flex-1 flex-col overflow-hidden rounded-none shadow-xl">
                <div className="border-b bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-white">
                            <Image
                                src="/avatars/alex-avatar.png"
                                alt="Alex Chen"
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Alex Chen</h1>
                            <p className="text-sm text-purple-100">Online</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                    {messages.length === 0 && (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No messages yet. Start a conversation!
                        </div>
                    )}
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-2 ${message.sender === "self" ? "justify-end" : "justify-start"}`}
                        >
                            {message.sender === "other" && (
                                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white">
                                    <Image
                                        src="/avatars/jordan-avatar.png"
                                        alt="Jordan Smith"
                                        width={32}
                                        height={32}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                    message.sender === "self"
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                        : "bg-gray-100 text-gray-900"
                                }`}
                            >
                                <p className="break-words">{message.text}</p>
                                <p className={`mt-1 text-xs ${message.sender === "self" ? "text-purple-100" : "text-gray-500"}`}>
                                    {message.timestamp.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                                </p>
                            </div>
                            {message.sender === "self" && (
                                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white">
                                    <Image
                                        src="/avatars/alex-avatar.png"
                                        alt="Alex Chen"
                                        width={32}
                                        height={32}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                    {isOtherTyping && (
                        <div className="flex gap-2">
                            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white">
                                <Image
                                    src="/avatars/jordan-avatar.png"
                                    alt="Jordan Smith"
                                    width={32}
                                    height={32}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex items-center gap-1 rounded-2xl bg-gray-100 px-4 py-2">
                                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                     style={{animationDelay: "0ms"}}/>
                                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                     style={{animationDelay: "150ms"}}/>
                                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                     style={{animationDelay: "300ms"}}/>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef}/>
                </div>

                <div className="border-t bg-white p-4">
                    {showEmojiPicker && (
                        <div className="mb-2 rounded-lg border bg-white p-3 shadow-lg">
                            <div className="grid grid-cols-8 gap-2">
                                {EMOJIS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => insertEmoji(emoji)}
                                        className="rounded p-2 text-2xl transition-transform hover:scale-125 hover:bg-gray-100"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            size="icon"
                            variant="outline"
                            className="shrink-0"
                        >
                            <Smile className="h-4 w-4"/>
                        </Button>
                        <Input
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            className="flex-1"
                        />
                        <Button
                            onClick={sendMessage}
                            size="icon"
                            className="shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            <Send className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

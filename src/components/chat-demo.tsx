"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"

interface ChatMessage {
  role: "user" | "agent"
  text: string | string[]
}

interface ChatExample {
  messages: ChatMessage[]
  skill: string
}

const CHAT_EXAMPLES: ChatExample[] = [
  {
    skill: "prt-transit",
    messages: [
      { role: "user", text: "when's the next 71A?" },
      { role: "agent", text: ["4 min at Murray & Forbes.", "Next one's 12 min if you miss it."] },
    ],
  },
  {
    skill: "fishfry",
    messages: [
      { role: "user", text: "fish fry near squirrel hill?" },
      { role: "agent", text: ["St. Bede's — 1.8 mi", "Homemade pierogies ✓", "Open til 7, cash only"] },
    ],
  },
  {
    skill: "weather",
    messages: [
      { role: "user", text: "should I bike to work?" },
      { role: "agent", text: ["High of 28°, wind chill 19°.", "I wouldn't.", "Want me to check the bus?"] },
    ],
  },
  {
    skill: "gog",
    messages: [
      { role: "user", text: "what's on my calendar tomorrow?" },
      { role: "agent", text: ["9am: Standup", "11am: Lou Bortone Podcast", "Nothing after 2pm — clear for focus time."] },
    ],
  },
]

export function ChatDemo() {
  const [currentExample, setCurrentExample] = useState(0)
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const example = CHAT_EXAMPLES[currentExample]
  const totalMessages = example.messages.length

  useEffect(() => {
    // Reset when example changes
    setVisibleMessages(0)
    setIsTyping(false)

    // Animate messages appearing one by one
    const showNextMessage = (index: number) => {
      if (index >= totalMessages) {
        // Wait, then move to next example
        setTimeout(() => {
          setCurrentExample((prev) => (prev + 1) % CHAT_EXAMPLES.length)
        }, 3000)
        return
      }

      // Show typing indicator before agent messages
      if (example.messages[index].role === "agent" && index > 0) {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setVisibleMessages(index + 1)
          setTimeout(() => showNextMessage(index + 1), 1200)
        }, 800)
      } else {
        setVisibleMessages(index + 1)
        setTimeout(() => showNextMessage(index + 1), 1000)
      }
    }

    // Start the animation
    const timer = setTimeout(() => showNextMessage(0), 500)
    return () => clearTimeout(timer)
  }, [currentExample, totalMessages, example.messages])

  return (
    <div className="w-full max-w-md">
      {/* Chat window */}
      <div className="border-4 border-foreground bg-card shadow-[6px_6px_0_0_theme(colors.foreground)] overflow-hidden">
        {/* Window header */}
        <div className="bg-foreground text-card px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-pop-pink border border-card/30" />
            <div className="w-3 h-3 bg-pop-yellow border border-card/30" />
            <div className="w-3 h-3 bg-pop-lime border border-card/30" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">
              <MessageCircle className="inline h-3 w-3 mr-1" />
              Agent Chat
            </span>
          </div>
          <div className="w-12" /> {/* Spacer for symmetry */}
        </div>

        {/* Messages area */}
        <div className="p-4 space-y-3 min-h-[180px] bg-gradient-to-b from-card to-card/95">
          {example.messages.slice(0, visibleMessages).map((msg, i) => (
            <div
              key={`${currentExample}-${i}`}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[85%] px-4 py-2 border-3 border-foreground font-medium text-sm
                  ${msg.role === "user"
                    ? "bg-pop-yellow text-foreground shadow-[3px_3px_0_0_theme(colors.foreground)]"
                    : "bg-pop-cyan text-foreground shadow-[3px_3px_0_0_theme(colors.foreground)]"
                  }
                  animate-in slide-in-from-bottom-2 fade-in duration-300
                `}
              >
                {Array.isArray(msg.text) ? (
                  <div className="space-y-1">
                    {msg.text.map((line, j) => (
                      <div key={j}>{line}</div>
                    ))}
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-pop-cyan text-foreground px-4 py-2 border-3 border-foreground shadow-[3px_3px_0_0_theme(colors.foreground)]">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Skill indicator */}
        <div className="bg-foreground/10 border-t-3 border-foreground px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase">
            powered by
          </span>
          <code className="text-xs font-mono font-bold text-foreground bg-pop-pink px-2 py-0.5 border-2 border-foreground">
            {example.skill}
          </code>
        </div>
      </div>

      {/* Tagline */}
      <div className="mt-6 text-center lg:text-left">
        <p className="text-lg md:text-xl font-black uppercase text-foreground">
          <span className="text-pop-pink">Skills:</span> turn a chat window into a coworker
        </p>
      </div>
    </div>
  )
}

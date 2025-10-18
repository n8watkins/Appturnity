import { useState, useEffect, useRef } from "react"
import { MessageSquare, X, Send, Calendar, PhoneCall } from "lucide-react"
import Lottie from "lottie-react"
import { z } from "zod"
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useToast } from '@/hooks/use-toast'

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/nathancwatkins23/web-consulting';

type Msg = {
  sender: "user" | "bot"
  text: string
  name?: string
  email?: string
  suggestions?: string[]
}

const MAX_MESSAGE_LENGTH = 500
const SUGGESTIONS = ["Pricing", "Request a Demo", "Feature Request"]

const chatSchema = z.object({
  name:     z.string().min(1, "Name is required"),
  email:    z.string().email("Invalid email"),
  message:  z
    .string()
    .min(1, "Message is required")
    .max(MAX_MESSAGE_LENGTH, `Message must be at most ${MAX_MESSAGE_LENGTH} characters`),
  hp_field: z.string().optional(),
})

/** helper to load JSON from localStorage or fall back */
function loadJSON<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export default function ChatWidget() {
  // ——— load persisted state ———
  const [isOpen, setIsOpen] = useState<boolean>(() =>
    loadJSON("chat-isOpen", false)
  )
  const [messages, setMessages] = useState<Msg[]>(() =>
    loadJSON("chat-messages", [
      { sender: "bot", text: "Hey there! How can I help you?" }
    ])
  )

  // ——— other local state ———
  const [isPressed, setIsPressed]       = useState(false)
  const [isAnimating, setIsAnimating]   = useState(false)
  const [messageSent, setMessageSent]   = useState(false)
  const [showActions, setShowActions]   = useState(false)
  const [sendAnimData, setSendAnimData] = useState<any>(null)
  const [form, setForm]                 = useState({ name:"", email:"", message:"", hp_field:"" })
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  const pending = useRef<{ name:string; email:string; text:string; suggestions?:string[] } | null>(null)
  const [errors, setErrors]     = useState<Record<string,string[]>>({})

  // ——— reCAPTCHA and toast ———
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { toast } = useToast()

  // refs for click-away and scrolling
  const containerRef    = useRef<HTMLDivElement>(null)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)
  const scrollRef       = useRef<HTMLDivElement>(null)

  // ——— persist to localStorage whenever these change ———
  useEffect(() => {
    localStorage.setItem("chat-isOpen", JSON.stringify(isOpen))
  }, [isOpen])

  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages))
  }, [messages])

  // — smooth-scroll on new messages or actions —
  useEffect(() => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const start = el.scrollTop
    const end   = el.scrollHeight
    const dur = 500
    const t0 = performance.now()
    const animate = (now: number) => {
      const t = Math.min((now - t0)/dur, 1)
      el.scrollTop = start + (end - start)*t
      if (t < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [messages, showActions])

  // — lazy-load Lottie JSON —
  useEffect(() => {
    fetch("/lottie-check.json")
      .then(r => r.json())
      .then(setSendAnimData)
      .catch(console.error)
  }, [])

  // — form helpers —
  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const toggleSuggestion = (s: string) =>
    setSelectedSuggestions(sel =>
      sel.includes(s) ? sel.filter(x => x !== s) : [...sel, s]
    )

  // — submit handler —
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = chatSchema.safeParse(form)
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }
    setErrors({})
    if (form.hp_field) return  // spam honeypot

    // Check if reCAPTCHA is ready
    if (!executeRecaptcha) {
      toast({
        title: "reCAPTCHA not ready",
        description: "Please wait a moment and try again.",
        variant: "destructive",
      })
      return
    }

    const name  = form.name.trim().split(" ")[0] || "There"
    const email = form.email.trim()
    const text  = form.message.trim()
    pending.current = {
      name,
      email,
      text,
      suggestions: selectedSuggestions.length ? selectedSuggestions : undefined
    }

    setForm({ name:"", email:"", message:"", hp_field:"" })
    setSelectedSuggestions([])
    setIsAnimating(true)

    // Send to API
    try {
      // Execute reCAPTCHA to get token
      const recaptchaToken = await executeRecaptcha('chat_widget')

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          suggestions: selectedSuggestions.length ? selectedSuggestions : undefined,
          hp_field: form.hp_field,
          recaptchaToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Failed to send message:', data.message)
        toast({
          title: "Something went wrong",
          description: data.message || "Your message couldn't be sent. Please try again.",
          variant: "destructive",
        })
        // Reset animation state on error so user can retry
        setIsAnimating(false)
        return
      }

      // Only set message sent if successful
      setMessageSent(true)
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Something went wrong",
        description: "Your message couldn't be sent. Please try again.",
        variant: "destructive",
      })
      // Reset animation state on error so user can retry
      setIsAnimating(false)
    }
  }

  // — when Lottie finishes, append messages —
  const handleAnimationComplete = () => {
    setIsAnimating(false)
    if (!pending.current) return

    const { name, email, text, suggestions } = pending.current
    const botText = `Hi ${name}, thanks for reaching out! We'll get right back to you.`

    const STAGGER = 300
    const toAdd: Msg[] = [
      { sender:"user", text, name, email, suggestions },
      { sender:"bot", text:botText }
    ]
    toAdd.forEach((msg, i) =>
      setTimeout(() => setMessages(ms => [...ms, msg]), STAGGER * (i + 1))
    )
    setTimeout(() => setShowActions(true), STAGGER * (toAdd.length + 1))
    pending.current = null
  }

  // — open/close toggle (reset on fresh open) —
  const toggleOpen = () => {
    setIsOpen(prev => {
      if (!prev) {
        setMessageSent(false)
        setShowActions(false)
        setSelectedSuggestions([])
        setMessages([{ sender:"bot", text:"Hey there! How can I help you?" }])
      }
      return !prev
    })
  }

  // — click-away closes (ignores toggle button) —
  useEffect(() => {
    if (!isOpen) return
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node
      const outside = containerRef.current && !containerRef.current.contains(t)
      const isToggle = toggleButtonRef.current && toggleButtonRef.current.contains(t)
      if (outside && !isToggle) setIsOpen(false)
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [isOpen])

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      {isOpen && (
        <div
          ref={containerRef}
          className="
            relative overflow-hidden mb-2 w-[27rem] h-[38rem]
            bg-white shadow-lg rounded-xl border border-gray-200
            animate-slide-up-fade z-50 flex flex-col
          "
        >

          {/* header */}
          <div className="flex items-center justify-between bg-primary text-white px-4 py-5">
            <span className="font-medium text-lg">
              Send
              <img
                src="/a-icon-white.png"
                alt="A"
                className="inline-block w-4 h-4 align-middle mx-1"
              />
              message
            </span>
            <button
              onClick={toggleOpen}
              className="p-1.5 rounded-full hover:bg-white/20 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-95"
              aria-label="Close chat"
            >
              <X size={20}/>
            </button>
          </div>

          {/* message feed */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((m,i) => (
              <div
                key={i}
                className={`flex items-center space-x-2 ${m.sender==="user" ? "justify-end" : ""}`}
              >
                {m.sender==="bot" ? (
                  <img
                    src="/portrait.webp"
                    alt="Bot"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {m.name?.[0].toUpperCase()}
                  </div>
                )}
                <div className={`
                  text-black rounded-lg p-2 min-w-[70%] max-w-[70%]
                  ${m.sender==="user" ? "bg-primary/20" : "bg-gray-200"}
                  animate-slide-up-fade-slow
                `}>
                  {m.sender==="user" && (
                    <div className="text-sm mb-1">
                      <span className="font-semibold">{m.name}</span>{" "}
                      <span className="text-xs italic truncate">{m.email}</span>
                    </div>
                  )}
                  {m.suggestions?.map((s,idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-primary/80 text-white text-xs rounded-full px-2 py-0.5 mr-1 mb-1"
                    >
                      {s}
                    </span>
                  ))}
                  <div>{m.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* form or Lottie */}
          {(isAnimating || !messageSent) && (
            <div className="bg-white p-4">
              {isAnimating ? (
                <div className="w-full flex justify-center mb-6">
                  <Lottie
                    animationData={sendAnimData}
                    loop={false}
                    onComplete={handleAnimationComplete}
                    style={{ width:200, height:200 }}
                  />
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-3 justify-center">
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSuggestion(s)}
                        className={`px-3 py-1 rounded-full text-md font-semibold transition-all duration-0 ease-in-out ${
                          selectedSuggestions.includes(s)
                            ? "bg-primary text-white shadow-md"
                            : "bg-gray-200 hover:bg-gray-300 hover:shadow-sm"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-3" autoComplete="on">
                    <input
                      type="text" name="hp_field" value={form.hp_field}
                      onChange={handleChange}
                      autoComplete="off" tabIndex={-1}
                      className="hidden"
                    />
                    <div>
                      <input
                        id="chat-name"
                        name="name"
                        type="text"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        autoComplete="name"
                        className="w-full border-2 rounded-lg px-3 py-2 border-gray-300 focus:border-primary focus:ring-0 focus:outline-none outline-none transition-all duration-200 placeholder:text-gray-400"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
                    </div>
                    <div>
                      <input
                        id="chat-email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        className="w-full border-2 rounded-lg px-3 py-2 border-gray-300 focus:border-primary focus:ring-0 focus:outline-none outline-none transition-all duration-200 placeholder:text-gray-400"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                    </div>
                    <div className="relative">
                      <textarea
                        name="message" placeholder="Message" value={form.message}
                        onChange={handleChange}
                        className="w-full border-2 rounded-lg px-3 py-2 border-gray-300 h-20 resize-none focus:border-primary focus:ring-0 focus:outline-none outline-none transition-all duration-200 placeholder:text-gray-400"
                      />
                      <div className="absolute -bottom-3 right-2 text-xs text-gray-500">
                        {form.message.length}/{MAX_MESSAGE_LENGTH}
                      </div>
                      {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message[0]}</p>}
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center bg-primary text-white rounded-2xl py-2.5 font-semibold hover:bg-primary/90 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Send className="mr-2 h-4 w-4"/> Send Message
                    </button>
                  </form>
                </>
              )}

              {/* Custom reCAPTCHA v3 notification */}
              {!isAnimating && !messageSent && (
                <div className="absolute bottom-2 right-2 opacity-70 hover:opacity-100 transition-opacity select-none">
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <span>🛡️</span>
                    <span>Protected by reCAPTCHA v3</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* follow-up actions */}
          {messageSent && showActions && (
            <div className="p-4 bg-white space-y-3 animate-slide-up-fade">
              <div className="text-center italic text-sm text-black">
                For immediate assistance please reach out below:
              </div>
              <hr className="border-gray-300 my-2"/>
              <div className="flex gap-2 items-center">
                <a
                  href={CALENDLY_URL}
                  className="flex-1 flex items-center justify-center bg-primary text-white rounded-lg py-2.5 font-semibold hover:bg-primary/90 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  target="_blank" rel="noopener"
                >
                  <Calendar className="mr-2 h-4 w-4"/> Schedule
                </a>
                <span className="text-gray-500 font-semibold">or</span>
                <a
                  href="tel:8182888082"
                  className="flex-1 flex items-center justify-center bg-white text-primary border-2 border-primary rounded-lg py-2.5 font-semibold hover:bg-primary/5 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                >
                  <PhoneCall className="mr-2 h-4 w-4"/> Call Now
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* toggle button */}
      <button
        ref={toggleButtonRef}
        type="button"
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={e => { e.preventDefault(); setIsPressed(false); toggleOpen() }}
        onMouseLeave={() => setIsPressed(false)}
        onClick={e => e.preventDefault()}
        className={`
          relative flex items-center justify-center
          bg-primary text-white p-3 rounded-full shadow-lg
          hover:bg-primary/90 focus:outline-none
          transition-transform duration-100
          ${isPressed ? "scale-110" : "scale-100"}
        `}
      >
        <div className="relative w-6 h-6">
          <MessageSquare
            size={24}
            className={`absolute top-0 left-0 transition-opacity duration-300 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <X
            size={24}
            className={`absolute top-0 left-0 transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        {!isOpen && (
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-ping"/>
        )}
      </button>
    </div>
  )
}

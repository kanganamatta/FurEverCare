import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./RescueAIChatbot.css";

// Knowledge base for instant, intelligent, offline responses
const KNOWLEDGE_RESPONSES = [
  {
    triggers: [
      "injured dog",
      "found injured",
      "hurt dog",
      "what to do",
      "found a dog",
      "found an injured dog",
      "wounded dog",
      "hit by car",
      "accident"
    ],
    title: "🚨 Emergency Protocol: Injured Dog Rescue",
    response: `Stay calm! Here is the immediate step-by-step action plan to help the injured dog safely:

**1. 🛡️ Assess Safety First (Protect Yourself & the Dog):**
• Approach very slowly, speak in a gentle, reassuring tone, and crouch to avoid seeming intimidating.
• An injured dog in pain may bite out of fear. If the dog is aggressive or terrified, do NOT force physical contact. If safe, you can fashion a makeshift muzzle using a soft cloth, scarf, or gauze (never muzzle if vomiting or struggling to breathe).

**2. 🩹 Immediate First Aid:**
• **Bleeding:** Apply gentle, continuous pressure using a clean towel or cloth. Do NOT remove soaked cloths; layer more on top.
• **Warmth & Shock:** Wrap the dog gently in a blanket, towel, or jacket. Animals in shock lose body heat rapidly.
• **Avoid Movement:** If a fracture or spinal injury is suspected, slide a firm cardboard piece or blanket beneath them as a stretcher.
• ⚠️ **CRITICAL:** NEVER give human medications (Paracetamol, Crocin, Ibuprofen, Aspirin) — they are highly toxic and fatal to dogs!

**3. 📞 Dispatch & Medical Help:**
• Immediately contact our 24/7 FureverCare Rescue Ambulance or your nearest veterinary hospital.`,
    quickActions: [
      { label: "📍 Report Rescue on Map", action: "navigate_rescue" },
      { label: "📞 Call Emergency Helpline (1800-419-CARE)", action: "call_helpline" },
      { label: "🩹 How to handle bleeding?", action: "ask_bleeding" },
      { label: "🚗 How to transport safely?", action: "ask_transport" }
    ]
  },
  {
    triggers: ["bleeding", "blood", "cut", "wound", "deep cut"],
    title: "🩸 Controlling Animal Bleeding",
    response: `**How to manage severe bleeding in an animal:**

1. **Direct Pressure:** Press a clean gauze pad, towel, or cotton cloth firmly over the wound for at least 5 full minutes without lifting to check.
2. **Elevate (if limb):** If bleeding is on a paw or leg and not broken, gently raise the limb above heart level.
3. **Avoid Tourniquets:** Do NOT apply tight tourniquets unless you are a trained professional, as it can cause permanent tissue death.
4. **Bandage securely:** Wrap the dressing gently with self-adhesive bandage or clean cloth. Keep the dog warm and transport immediately.`,
    quickActions: [
      { label: "📍 Report Rescue Now", action: "navigate_rescue" },
      { label: "🏥 Open Medical Aid", action: "navigate_medical" }
    ]
  },
  {
    triggers: ["transport", "move", "carry", "lifting", "pick up", "shift"],
    title: "🚗 Safe Transport for Injured Animals",
    response: `**How to safely lift and transport a hurt animal:**

• **Small Dogs / Cats:** Place gently in a cardboard box or pet carrier lined with soft towels.
• **Medium / Large Dogs:** Use a thick blanket or coat as a two-person hammock stretcher, or a flat board.
• **Prevent Sudden Jerks:** Keep their spine as straight as possible. Keep the car warm, quiet, and drive smoothly with hazard lights on.
• Call the veterinary clinic ahead of time so they can prepare emergency oxygen and triage tables!`,
    quickActions: [
      { label: "📍 Report Rescue to Volunteers", action: "navigate_rescue" },
      { label: "🐾 Need Help with Shelter?", action: "navigate_adopt" }
    ]
  },
  {
    triggers: ["puppy", "kittens", "abandoned", "stray puppy", "orphan", "litter", "newborn"],
    title: "🍼 Abandoned Puppies / Kittens Protocol",
    response: `**If you found abandoned newborn puppies or kittens:**

1. **Wait and Observe (30–60 mins):** Mother dogs/cats often step away to hunt. Observe from a distance to see if the mother returns.
2. **Warmth is Priority #1:** Young animals cannot regulate body heat. Keep them inside a box with a warm water bottle wrapped in a towel (never boiling hot).
3. **DO NOT give cow's milk:** Regular dairy milk causes fatal diarrhea in young puppies/kittens. Use specialized Petlac / KMR or clean electrolyte water until veterinary formula is available.
4. Log their location on FureverCare so our foster network can step in!`,
    quickActions: [
      { label: "📍 Report Litter to Rescue", action: "navigate_rescue" },
      { label: "🐶 View Adoption Program", action: "navigate_adopt" }
    ]
  },
  {
    triggers: ["adopt", "adoption", "how to adopt", "process", "fee", "take home"],
    title: "🏡 FureverCare Adoption Process",
    response: `**Adopting a rescue pet with FureverCare is simple and ethical:**

1. **Browse Pets:** Explore our verified rescued dogs and cats waiting for forever homes.
2. **Submit Application:** Choose a pet and click 'Adopt a Friend' to fill out the quick compatibility questionnaire.
3. **Meet & Greet:** Arrange a video call or in-person shelter visit to meet your future companion.
4. **Home Check & Welcome:** A brief volunteer check ensures pet-proofing, followed by medical paperwork and zero adoption fees for rescues!`,
    quickActions: [
      { label: "🐶 Browse Available Pets", action: "navigate_adopt" },
      { label: "📝 Start Adoption Application", action: "navigate_adopt" }
    ]
  },
  {
    triggers: ["heatstroke", "overheating", "panting", "hot dog", "summer"],
    title: "☀️ Animal Heatstroke First Aid",
    response: `**Heatstroke is a life-threatening emergency! Signs include heavy panting, bright red tongue, glazed eyes, or vomiting:**

1. Move the animal to cool shade or air conditioning immediately.
2. Pour cool (NOT ice-cold) water over their body, especially paws, groin, and neck. Ice water causes blood vessels to constrict, trapping heat inside!
3. Offer small sips of cool water (do not force them to drink).
4. Direct a fan onto their wet fur and take them to a vet clinic promptly.`,
    quickActions: [
      { label: "🏥 Medical Aid Directory", action: "navigate_medical" },
      { label: "📍 Call Rescue Ambulance", action: "navigate_rescue" }
    ]
  },
  {
    triggers: ["poison", "toxic", "chocolate", "swallowed", "paracetamol", "rat poison"],
    title: "⚠️ Suspected Poisoning Emergency",
    response: `**Poisoning requires immediate professional veterinary intervention:**

• **DO NOT induce vomiting** unless directly instructed by a licensed veterinarian (caustic chemicals burn going down and coming back up).
• Identify what was ingested (plant, chocolate, medication packaging, pest poison) and bring the packaging with you.
• Give no home remedies. Rush the animal to the nearest emergency hospital!`,
    quickActions: [
      { label: "📞 Call 24/7 Vet Line (1800-419-CARE)", action: "call_helpline" },
      { label: "📍 Emergency Rescue Dispatch", action: "navigate_rescue" }
    ]
  }
];

const INITIAL_MESSAGES = [
  {
    id: "welcome-1",
    sender: "bot",
    time: "Just now",
    text: "👋 Woof! I'm **PawPal**, your 24/7 FureverCare AI Rescue & Animal Care Assistant.\n\nDid you find an injured animal, need first aid guidance, or want help adopting? Ask me anything!",
    quickActions: [
      { label: "🚨 I found an injured dog, what to do?", prompt: "I found this injured dog what to do" },
      { label: "🩸 How to stop bleeding?", prompt: "How to stop bleeding in an injured dog?" },
      { label: "🚗 Safe transport guide", prompt: "How to safely transport an injured dog?" },
      { label: "🐶 How does adoption work?", prompt: "How do I adopt a dog through FureverCare?" }
    ]
  }
];

export default function RescueAIChatbot({ externalTrigger = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(
    () => localStorage.getItem("furevercare_gemini_key") || ""
  );
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(geminiApiKey);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized, messages, isTyping]);

  // Handle external trigger (e.g. from hero button)
  useEffect(() => {
    if (externalTrigger && externalTrigger.timestamp) {
      setIsOpen(true);
      setIsMinimized(false);
      if (externalTrigger.prompt) {
        handleUserSend(externalTrigger.prompt);
      }
    }
  }, [externalTrigger]);

  // Play subtle sound if enabled
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // AudioContext not allowed or unsupported
    }
  };

  // Find offline intelligent response
  const getOfflineResponse = (query) => {
    const qLower = query.toLowerCase();

    for (const item of KNOWLEDGE_RESPONSES) {
      if (item.triggers.some((trigger) => qLower.includes(trigger))) {
        return item;
      }
    }

    // Default intelligent animal care advice
    return {
      title: "🐾 PawPal Rescue Guidance",
      response: `Thank you for reaching out! To assist you accurately:

• **If this is an active emergency:** Please keep the animal warm, calm, and away from traffic. Do not attempt hazardous maneuvers alone.
• **Report instantly:** Click **Report Rescue on Map** below to alert nearby FureverCare volunteers with GPS location and photo!
• **Helpline:** You can reach our rapid rescue line 24/7 at **1800-419-CARE**.

What specific symptoms or behavior are you noticing? (e.g. bleeding, limping, lethargic, hit by vehicle)`,
      quickActions: [
        { label: "📍 Report Rescue on Map", action: "navigate_rescue" },
        { label: "📞 Call Emergency Line", action: "call_helpline" },
        { label: "🐶 Browse Adoptable Pets", action: "navigate_adopt" }
      ]
    };
  };

  // Optional live Gemini AI response if user provided an API key
  const fetchGeminiResponse = async (userPrompt, chatHistory) => {
    if (!geminiApiKey.trim()) return null;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey.trim()}`;
      const systemInstruction = `You are PawPal, an expert, empathetic animal rescue and veterinary first aid assistant on the FureverCare platform.
Always prioritize animal and human safety. Never recommend human painkillers (paracetamol, ibuprofen) to pets.
Provide clear bulleted steps, emergency triage, warmth/shock treatment, and encourage reporting on the FureverCare rescue tracker. Keep answers concise, warm, and structured.`;

      const contents = [
        { role: "user", parts: [{ text: systemInstruction }] },
        ...chatHistory.slice(-4).map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        })),
        { role: "user", parts: [{ text: userPrompt }] }
      ];

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
      });

      if (!res.ok) throw new Error("Gemini API error");
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return reply || null;
    } catch {
      return null;
    }
  };

  const handleUserSend = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Formulate answer (via Gemini if key provided, else instant offline knowledge engine)
    setTimeout(async () => {
      let botAnswer = null;
      let quickActions = null;

      if (geminiApiKey.trim()) {
        const liveAiText = await fetchGeminiResponse(text, messages);
        if (liveAiText) {
          botAnswer = liveAiText;
          quickActions = [
            { label: "📍 Report Rescue on Map", action: "navigate_rescue" },
            { label: "📞 Call Helpline (1800-419-CARE)", action: "call_helpline" }
          ];
        }
      }

      if (!botAnswer) {
        const matched = getOfflineResponse(text);
        botAnswer = matched.response;
        quickActions = matched.quickActions;
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: botAnswer,
        quickActions
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      playChime();
    }, 600);
  };

  const handleQuickAction = (qa) => {
    if (qa.prompt) {
      handleUserSend(qa.prompt);
      return;
    }

    if (qa.action === "navigate_rescue") {
      navigate("/rescue");
      setIsOpen(false);
    } else if (qa.action === "navigate_adopt") {
      navigate("/adopt");
      setIsOpen(false);
    } else if (qa.action === "navigate_medical") {
      navigate("/medical");
      setIsOpen(false);
    } else if (qa.action === "navigate_pets") {
      navigate("/adopt");
      setIsOpen(false);
    } else if (qa.action === "call_helpline") {
      window.location.href = "tel:18004192273";
    } else if (qa.action === "ask_bleeding") {
      handleUserSend("How to stop bleeding in an injured dog?");
    } else if (qa.action === "ask_transport") {
      handleUserSend("How to safely transport an injured dog?");
    }
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  // Speech to text
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInputValue(transcript);
          handleUserSend(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem("furevercare_gemini_key", tempApiKey.trim());
    setGeminiApiKey(tempApiKey.trim());
    setShowSettings(false);
  };

  return (
    <div className="pawpal-chatbot-root">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          className="pawpal-launcher-btn"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open PawPal AI Assistant"
          title="Found an injured animal or need help? Chat with PawPal AI!"
        >
          <div className="pawpal-launcher-pulse"></div>
          <div className="pawpal-launcher-avatar">
            <span className="pawpal-avatar-icon">🐕</span>
            <span className="pawpal-badge-sparkle">✨</span>
          </div>
          <div className="pawpal-launcher-text">
            <span className="pawpal-text-title">PawPal AI</span>
            <span className="pawpal-text-sub">Injured Animal & Rescue Help</span>
          </div>
          <span className="pawpal-online-indicator" title="Online 24/7"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`pawpal-chat-window ${isMinimized ? "minimized" : ""}`}>
          {/* Header */}
          <div className="pawpal-header">
            <div className="pawpal-header-info">
              <div className="pawpal-header-avatar">
                <span>🐕</span>
                <span className="pawpal-avatar-dot"></span>
              </div>
              <div className="pawpal-header-titles">
                <div className="pawpal-header-name">
                  PawPal AI Rescue Guide
                  <span className="pawpal-tag-pill">24/7 Live</span>
                </div>
                <div className="pawpal-header-desc">
                  Ask: <em>"Found an injured dog, what to do?"</em>
                </div>
              </div>
            </div>

            <div className="pawpal-header-actions">
              <button
                className="pawpal-icon-btn"
                title="Settings (API Key)"
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Settings"
              >
                ⚙️
              </button>
              <button
                className="pawpal-icon-btn"
                title={soundEnabled ? "Mute Sound" : "Enable Sound"}
                onClick={() => setSoundEnabled(!soundEnabled)}
                aria-label="Toggle Sound"
              >
                {soundEnabled ? "🔔" : "🔕"}
              </button>
              <button
                className="pawpal-icon-btn"
                title="Clear Chat"
                onClick={clearChat}
                aria-label="Clear Chat"
              >
                🗑️
              </button>
              <button
                className="pawpal-icon-btn"
                title={isMinimized ? "Expand" : "Minimize"}
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label="Minimize"
              >
                {isMinimized ? "🗖" : "🗕"}
              </button>
              <button
                className="pawpal-icon-btn pawpal-close-btn"
                title="Close Chat"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Optional Gemini Settings Bar */}
          {showSettings && (
            <div className="pawpal-settings-panel">
              <div className="pawpal-settings-title">
                <strong>🤖 Optional Live Gemini AI Key</strong>
                <span className="pawpal-settings-note">(Works 100% offline without key)</span>
              </div>
              <div className="pawpal-settings-row">
                <input
                  type="password"
                  placeholder="Paste Gemini API key..."
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                />
                <button className="pawpal-btn-save-key" onClick={saveApiKey}>
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Chat Body */}
          {!isMinimized && (
            <>
              <div className="pawpal-messages-area">
                {/* Emergency Hot-Alert Banner */}
                <div className="pawpal-emergency-banner">
                  <span className="banner-icon">🚨</span>
                  <span>
                    <strong>Animal in urgent crisis?</strong> Call emergency rescue line{" "}
                    <a href="tel:18004192273">1800-419-CARE</a> or report on live tracker.
                  </span>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`pawpal-msg-row ${msg.sender === "user" ? "user-row" : "bot-row"}`}
                  >
                    {msg.sender === "bot" && (
                      <div className="pawpal-msg-avatar">🐕</div>
                    )}
                    <div className="pawpal-msg-bubble">
                      <div className="pawpal-msg-text">
                        {msg.text.split("\n\n").map((para, i) => (
                          <p key={i}>
                            {para.split("\n").map((line, j) => (
                              <span key={j}>
                                {line}
                                {j < para.split("\n").length - 1 && <br />}
                              </span>
                            ))}
                          </p>
                        ))}
                      </div>

                      {/* Quick Action Buttons */}
                      {msg.quickActions && msg.quickActions.length > 0 && (
                        <div className="pawpal-quick-actions">
                          {msg.quickActions.map((qa, index) => (
                            <button
                              key={index}
                              className="pawpal-action-chip"
                              onClick={() => handleQuickAction(qa)}
                            >
                              {qa.label}
                            </button>
                          ))}
                        </div>
                      )}

                      <span className="pawpal-msg-time">{msg.time}</span>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="pawpal-msg-row bot-row">
                    <div className="pawpal-msg-avatar">🐕</div>
                    <div className="pawpal-typing-bubble">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-label">PawPal is thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form
                className="pawpal-input-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserSend();
                }}
              >
                <button
                  type="button"
                  className={`pawpal-mic-btn ${isListening ? "listening" : ""}`}
                  title={isListening ? "Listening... click to stop" : "Voice input"}
                  onClick={toggleSpeechRecognition}
                  aria-label="Voice input"
                >
                  🎤
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  className="pawpal-input-field"
                  placeholder="Ask e.g. 'I found an injured dog what to do'..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                  type="submit"
                  className="pawpal-send-btn"
                  disabled={!inputValue.trim()}
                  title="Send message"
                  aria-label="Send"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

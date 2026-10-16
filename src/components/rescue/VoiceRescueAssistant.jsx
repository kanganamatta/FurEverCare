import { useState, useEffect, useRef } from "react";
import "./VoiceRescueAssistant.css";

// Voice Sample Presets in English, Hindi, and Punjabi
const MULTILINGUAL_SAMPLES = {
  en: [
    {
      label: "Accident / Bleeding Dog",
      text: "Injured street dog hit by a car near Metro Station Gate 3. Leg is broken and bleeding heavily. Please send an ambulance."
    },
    {
      label: "Trapped Kitten in Drain",
      text: "Small kitten trapped inside open storm drain near Sector 14 market. Crying for two hours and cannot get out."
    },
    {
      label: "Injured Cow on Highway",
      text: "Injured cow sitting in the middle of GT Road with a deep shoulder cut. Traffic is stopped."
    }
  ],
  hi: [
    {
      label: "घायल कुत्ता / एक्सीडेंट",
      text: "कनॉट प्लेस मेट्रो स्टेशन गेट नंबर 3 के पास एक कुत्ता कार से टकरा गया है। उसका पैर टूट गया है और बहुत खून बह रहा है।"
    },
    {
      label: "नाली में फंसा बिल्ली का बच्चा",
      text: "सेक्टर 14 मार्केट के पास नाली में बिल्ली का एक छोटा बच्चा फंसा हुआ है और रो रहा है, बाहर नहीं निकल पा रहा।"
    },
    {
      label: "जीटी रोड पर घायल गाय",
      text: "जीटी रोड पर एक घायल गाय बैठी है जिसके पैर में गहरी चोट है और बहुत दर्द में है, कृपया एम्बुलेंस भेजें।"
    }
  ],
  pa: [
    {
      label: "ਜ਼ਖ਼ਮੀ ਕੁੱਤਾ / ਹਾਦਸਾ",
      text: "ਸੈਕਟਰ 14 ਮਾਰਕੀਟ ਦੇ ਕੋਲ ਇੱਕ ਕੁੱਤਾ ਗੱਡੀ ਨਾਲ ਟਕਰਾ ਗਿਆ ਹੈ। ਉਸਦੀ ਲੱਤ ਟੁੱਟ ਗਈ ਹੈ ਤੇ ਖੂਨ ਨਿਕਲ ਰਿਹਾ ਹੈ।"
    },
    {
      label: "ਨਾਲੇ ਵਿੱਚ ਫਸੀ ਬਿੱਲੀ",
      text: "ਮਾਲ ਰੋਡ ਦੇ ਕੋਲ ਨਾਲੇ ਵਿੱਚ ਬਿੱਲੀ ਦਾ ਬੱਚਾ ਫਸਿਆ ਹੋਇਆ ਹੈ ਤੇ ਬਾਹਰ ਨਹੀਂ ਨਿਕਲ ਸਕਦਾ, ਤੁਰੰਤ ਮਦਦ ਭੇਜੋ।"
    },
    {
      label: "ਸੜਕ 'ਤੇ ਜ਼ਖ਼ਮੀ ਗਾਂ",
      text: "ਜੀ ਟੀ ਰੋਡ 'ਤੇ ਇੱਕ ਗਾਂ ਜ਼ਖ਼ਮੀ ਹਾਲਤ ਵਿੱਚ ਬੈਠੀ ਹੈ, ਉਸਦੇ ਮੋਢੇ 'ਤੇ ਸੱਟ ਲੱਗੀ ਹੈ, ਰੈਸਕਿਊ ਟੀਮ ਭੇਜੋ ਜੀ।"
    }
  ]
};

// First Aid Protocols translated into English, Hindi, and Punjabi
const FIRST_AID_INSTRUCTIONS = {
  en: {
    bleeding: "Apply gentle pressure with a clean cloth. Keep the animal calm and warm. Do not force water.",
    fracture: "Do not move the injured limb. Keep crowds back. Support animal from underneath if moving.",
    trapped: "Do not pull forcibly by tail or limb. Lower a towel or blanket for grip until ambulance arrives.",
    general: "Keep the animal warm and in a shaded spot. Speak in a gentle, reassuring tone."
  },
  hi: {
    bleeding: "साफ कपड़े से घाव पर हल्का दबाव बनाएं। जानवर को शांत रखें और जबरदस्ती पानी न पिलाएं।",
    fracture: "टूटे हुए पैर को बिल्कुल न हिलाएं। भीड़ को दूर रखें और जानवर को कंबल से सहारा दें।",
    trapped: "जानवर को पूंछ या पैर से जोर से न खींचें। बचाव दल के पहुंचने तक शांत रखें।",
    general: "जानवर को छायादार जगह पर रखें और प्यार से बात करें ताकि वह डरे नहीं।"
  },
  pa: {
    bleeding: "ਸਾਫ਼ ਕੱਪੜੇ ਨਾਲ ਜ਼ਖ਼ਮ 'ਤੇ ਹਲਕਾ ਦਬਾਅ ਪਾਓ। ਜਾਨਵਰ ਨੂੰ ਸ਼ਾਂਤ ਰੱਖੋ ਅਤੇ ਪਾਣੀ ਜ਼ਬਰਦਸਤੀ ਨਾ ਦਿਓ।",
    fracture: "ਸੱਟ ਵਾਲੀ ਲੱਤ ਨੂੰ ਬਿਲਕੁਲ ਨਾ ਹਿਲਾਓ। ਭੀੜ ਨੂੰ ਦੂਰ ਰੱਖੋ ਅਤੇ ਜਾਨਵਰ ਨੂੰ ਕੰਬਲ ਦਾ ਸਹਾਰਾ ਦਿਓ।",
    trapped: "ਜਾਨਵਰ ਨੂੰ ਪੂਛ ਜਾਂ ਲੱਤ ਤੋਂ ਨਾ ਖਿੱਚੋ। ਐਂਬੂਲੈਂਸ ਪਹੁੰਚਣ ਤੱਕ ਨਿਗਰਾਨੀ ਰੱਖੋ।",
    general: "ਜਾਨਵਰ ਨੂੰ ਛਾਂ ਵਾਲੀ ਥਾਂ 'ਤੇ ਰੱਖੋ ਅਤੇ ਸ਼ਾਂਤ ਮਾਹੌਲ ਬਣਾਈ ਰੱਖੋ।"
  }
};

export default function VoiceRescueAssistant({ onDispatch, showToast }) {
  const [currentLang, setCurrentLang] = useState("hi"); // 'en' | 'hi' | 'pa'
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Structured extraction state
  const [structuredReport, setStructuredReport] = useState(null);

  const recognitionRef = useRef(null);

  // Configure Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        let currentText = "";
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      rec.onerror = (e) => {
        console.warn("Speech recognition error:", e.error);
        setIsListening(false);
        if (showToast) {
          showToast("Microphone notice: Speech recognition stopped or not permitted.");
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [showToast]);

  // Set language code on recognition
  useEffect(() => {
    if (recognitionRef.current) {
      if (currentLang === "hi") recognitionRef.current.lang = "hi-IN";
      else if (currentLang === "pa") recognitionRef.current.lang = "pa-IN";
      else recognitionRef.current.lang = "en-IN";
    }
  }, [currentLang]);

  // Toggle Microphone
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setTranscript("");
      setStructuredReport(null);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error("Mic start err:", err);
          setIsListening(false);
        }
      } else {
        if (showToast) {
          showToast("Live mic not supported in this browser. Please try sample voice reports below!");
        }
      }
    }
  };

  // Convert raw spoken text into structured AI entity extraction
  const analyzeSpokenText = (text, lang = currentLang) => {
    const lower = text.toLowerCase();

    // 1. Animal Type Extraction
    let animalType = "Dog";
    let animalEmoji = "🐕";

    if (
      lower.includes("cat") ||
      lower.includes("kitten") ||
      lower.includes("बिल्ली") ||
      lower.includes("ਬਿੱਲੀ")
    ) {
      animalType = "Cat";
      animalEmoji = "🐈";
    } else if (
      lower.includes("cow") ||
      lower.includes("calf") ||
      lower.includes("bull") ||
      lower.includes("गाय") ||
      lower.includes("बछड़ा") ||
      lower.includes("ਗਾਂ") ||
      lower.includes("ਵੱਛਾ")
    ) {
      animalType = "Cow / Cattle";
      animalEmoji = "🐄";
    } else if (
      lower.includes("bird") ||
      lower.includes("pigeon") ||
      lower.includes("kite") ||
      lower.includes("पक्षी") ||
      lower.includes("कबूतर") ||
      lower.includes("ਪੰਛੀ")
    ) {
      animalType = "Bird";
      animalEmoji = "🦅";
    } else if (
      lower.includes("monkey") ||
      lower.includes("बंदर") ||
      lower.includes("ਬਾਂਦਰ")
    ) {
      animalType = "Monkey";
      animalEmoji = "🐒";
    }

    // 2. Emergency Condition & Tags
    const tags = [];
    let priority = "Urgent";
    let firstAidKey = "general";

    if (
      lower.includes("bleed") ||
      lower.includes("blood") ||
      lower.includes("खून") ||
      lower.includes("ਖੂਨ") ||
      lower.includes("cut")
    ) {
      tags.push("Bleeding / Trauma");
      priority = "Critical";
      firstAidKey = "bleeding";
    }

    if (
      lower.includes("broken") ||
      lower.includes("fracture") ||
      lower.includes("leg") ||
      lower.includes("limb") ||
      lower.includes("टूट") ||
      lower.includes("ਲੱਤ") ||
      lower.includes("हड्डी")
    ) {
      tags.push("Fractured limb");
      priority = "Critical";
      firstAidKey = "fracture";
    }

    if (
      lower.includes("hit") ||
      lower.includes("car") ||
      lower.includes("vehicle") ||
      lower.includes("accident") ||
      lower.includes("टकरा") ||
      lower.includes("ਗੱਡੀ") ||
      lower.includes("हादसा")
    ) {
      tags.push("Hit by vehicle");
      priority = "Critical";
    }

    if (
      lower.includes("trap") ||
      lower.includes("drain") ||
      lower.includes("stuck") ||
      lower.includes("फंस") ||
      lower.includes("ਨਾਲੇ")
    ) {
      tags.push("Trapped in drain / fence");
      firstAidKey = "trapped";
    }

    if (tags.length === 0) {
      tags.push("Emergency Triage Required");
    }

    // 3. Location Extraction
    let location = "Detected Distress Coordinates";
    if (lower.includes("कनॉट प्लेस") || lower.includes("connaught")) {
      location = "Connaught Place / Metro Gate 3";
    } else if (lower.includes("सेक्टर 14") || lower.includes("sector 14") || lower.includes("ਸੈਕਟਰ 14")) {
      location = "Sector 14 Market / Main Road";
    } else if (lower.includes("जीटी रोड") || lower.includes("gt road") || lower.includes("ਜੀ ਟੀ ਰੋਡ")) {
      location = "GT Road Highway Corridor";
    } else if (lower.includes("ਮਾਲ ਰੋਡ") || lower.includes("mall road")) {
      location = "North Ring / Mall Area";
    } else {
      location = "Live Caller GPS (Near Pin Area)";
    }

    const firstAidAdvice =
      FIRST_AID_INSTRUCTIONS[lang]?.[firstAidKey] ||
      FIRST_AID_INSTRUCTIONS.en.general;

    return {
      animalType,
      animalEmoji,
      location,
      situation: text,
      priority,
      tags,
      firstAidAdvice,
      lang
    };
  };

  // When transcript updates and user finishes speaking
  useEffect(() => {
    if (transcript.trim().length > 10) {
      const parsed = analyzeSpokenText(transcript, currentLang);
      setStructuredReport(parsed);
    }
  }, [transcript, currentLang]);

  // Handle Preset Sample Speech Selection
  const handleSelectSample = (sampleText) => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setTranscript(sampleText);
    const parsed = analyzeSpokenText(sampleText, currentLang);
    setStructuredReport(parsed);
    if (showToast) {
      showToast(`🎙️ Spoken emergency parsed into structured rescue alert!`);
    }
  };

  // Read First Aid and Instructions Aloud
  const readInstructionsAloud = () => {
    if (!("speechSynthesis" in window)) {
      if (showToast) showToast("Audio speech synthesis not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    let textToSpeak = "";
    let voiceLang = "hi-IN";

    if (currentLang === "hi") {
      voiceLang = "hi-IN";
      textToSpeak = structuredReport
        ? `आपातकालीन बचाव निर्देश: ${structuredReport.firstAidAdvice} एम्बुलेंस को सूचित कर दिया गया है।`
        : "कृपया बोलने के लिए माइक बटन दबाएं और जानवर की स्थिति बताएं।";
    } else if (currentLang === "pa") {
      voiceLang = "pa-IN";
      textToSpeak = structuredReport
        ? `ਬਚਾਅ ਨਿਰਦੇਸ਼: ${structuredReport.firstAidAdvice} ਐਂਬੂਲੈਂਸ ਰਵਾਨਾ ਹੋ ਚੁੱਕੀ ਹੈ।`
        : "ਕਿਰਪਾ ਕਰਕੇ ਮਾਈਕ ਬਟਨ ਦਬਾਓ ਅਤੇ ਜਾਨਵਰ ਦੀ ਹਾਲਤ ਬਾਰੇ ਦੱਸੋ।";
    } else {
      voiceLang = "en-IN";
      textToSpeak = structuredReport
        ? `Emergency instructions: ${structuredReport.firstAidAdvice}. Ambulance has been signaled.`
        : "Please tap the microphone button and describe the animal and location.";
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = voiceLang;
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Dispatch Confirmed Emergency Alert
  const handleConfirmDispatch = () => {
    if (!structuredReport) return;

    const rescueId = "RC-" + Math.floor(10000000 + Math.random() * 90000000);

    const newReport = {
      id: rescueId,
      animalType: structuredReport.animalType,
      location: structuredReport.location,
      situation: structuredReport.situation,
      phone: "Voice-Reported (Coordination Active)",
      priority: structuredReport.priority,
      tags: structuredReport.tags,
      photoUrl: null,
      date: "Just now",
      currentStageIndex: 1, // Alert logged & assigned
      status: "Ambulance Dispatched (Voice AI Priority)",
      mapCoords: { x: 45, y: 55, addressName: structuredReport.location }
    };

    if (onDispatch) {
      onDispatch(newReport);
    }

    // Speak Confirmation
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const confirmText =
        currentLang === "hi"
          ? `एम्बुलेंस रवाना हो गई है! आईडी नंबर ${rescueId}`
          : currentLang === "pa"
          ? `ਐਂਬੂਲੈਂਸ ਰਵਾਨਾ ਹੋ ਗਈ ਹੈ! ਆਈ ਡੀ ${rescueId}`
          : `Rescue ambulance dispatched for ID ${rescueId}!`;
      const utter = new SpeechSynthesisUtterance(confirmText);
      utter.lang = currentLang === "hi" ? "hi-IN" : currentLang === "pa" ? "pa-IN" : "en-IN";
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="voice-rescue-container">
      {/* Header */}
      <div className="voice-rescue-header">
        <div className="voice-kicker-badge">
          <span className="live-dot" />
          <span>Multilingual Voice Emergency Assistant</span>
        </div>

        <h2>
          Speak Your Emergency — No Typing Needed 🎙️
        </h2>

        <p>
          Report injured animals instantly by speaking in <b>English</b>, <b>हिन्दी (Hindi)</b>, or <b>ਪੰਜਾਬੀ (Punjabi)</b>.
          Our rescue AI extracts location, animal species, and injury severity in real-time.
        </p>
      </div>

      {/* Language Toggle Pills */}
      <div className="voice-lang-selector-row">
        <button
          type="button"
          className={`lang-btn ${currentLang === "hi" ? "active" : ""}`}
          onClick={() => {
            setCurrentLang("hi");
            setTranscript("");
            setStructuredReport(null);
          }}
        >
          <span className="lang-flag">🇮🇳</span>
          <span>हिन्दी (Hindi Voice)</span>
        </button>

        <button
          type="button"
          className={`lang-btn ${currentLang === "pa" ? "active" : ""}`}
          onClick={() => {
            setCurrentLang("pa");
            setTranscript("");
            setStructuredReport(null);
          }}
        >
          <span className="lang-flag">🌾</span>
          <span>ਪੰਜਾਬੀ (Punjabi Voice)</span>
        </button>

        <button
          type="button"
          className={`lang-btn ${currentLang === "en" ? "active" : ""}`}
          onClick={() => {
            setCurrentLang("en");
            setTranscript("");
            setStructuredReport(null);
          }}
        >
          <span className="lang-flag">🌐</span>
          <span>English Voice</span>
        </button>
      </div>

      {/* Mic Stage */}
      <div className="voice-mic-stage">
        <div className="voice-mic-button-wrap">
          {isListening && <div className="mic-rings" />}
          <button
            type="button"
            className={`voice-mic-main-btn ${isListening ? "listening" : ""}`}
            onClick={toggleListening}
            aria-label="Toggle Voice Recording"
            title={isListening ? "Stop listening" : "Start speaking"}
          >
            {isListening ? "🛑" : "🎙️"}
          </button>
        </div>

        <div className="mic-status-label">
          {isListening
            ? currentLang === "hi"
              ? "सुन रहे हैं... कृपया घटना बताएं"
              : currentLang === "pa"
              ? "ਸੁਣ ਰਹੇ ਹਾਂ... ਕਿਰਪਾ ਕਰਕੇ ਬੋਲੋ"
              : "Listening... Speak incident details"
            : currentLang === "hi"
            ? "माइक दबाकर बोलें (हिन्दी)"
            : currentLang === "pa"
            ? "ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ (ਪੰਜਾਬੀ)"
            : "Tap Microphone to Speak"}
        </div>

        <div className="mic-hint-text">
          {currentLang === "hi"
            ? "उदा. 'कनॉट प्लेस के पास एक कुत्ता घायल है, बहुत खून बह रहा है'"
            : currentLang === "pa"
            ? "ਉਦਾ. 'ਸੈਕਟਰ 14 ਕੋਲ ਕੁੱਤੇ ਦੀ ਲੱਤ ਟੁੱਟ ਗਈ ਹੈ, ਮਦਦ ਭੇਜੋ'"
            : "e.g., 'Injured dog hit by car near Metro Gate 3, bleeding'"}
        </div>

        {isListening && (
          <div className="sound-wave-bars">
            <span className="sound-bar" />
            <span className="sound-bar" />
            <span className="sound-bar" />
            <span className="sound-bar" />
            <span className="sound-bar" />
          </div>
        )}
      </div>

      {/* One-Click Multilingual Voice Presets */}
      <div className="voice-samples-box">
        <div className="voice-samples-title">
          <span>⚡</span>
          <span>
            {currentLang === "hi"
              ? "एक क्लिक में टेस्ट करें (नमूना आवाज)"
              : currentLang === "pa"
              ? "ਇੱਕ ਕਲਿੱਕ ਵਿੱਚ ਟੈਸਟ ਕਰੋ (ਨਮੂਨਾ ਅਵਾਜ਼)"
              : "Instant Test Sample Scenarios"}
          </span>
        </div>

        <div className="voice-samples-grid">
          {MULTILINGUAL_SAMPLES[currentLang].map((sample, idx) => (
            <button
              key={idx}
              type="button"
              className="btn-sample-speech"
              onClick={() => handleSelectSample(sample.text)}
            >
              <strong>🎙️ {sample.label}</strong>
              <span>"{sample.text}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spoken Transcript Area */}
      <div className="voice-transcript-card">
        <div className="transcript-header-row">
          <span className="transcript-label">
            <span>📝</span>
            <span>
              {currentLang === "hi"
                ? "रिकॉर्ड किया गया संदेश"
                : currentLang === "pa"
                ? "ਰਿਕਾਰਡ ਕੀਤਾ ਗਿਆ ਸੁਨੇਹਾ"
                : "Speech-to-Text Transcript"}
            </span>
          </span>

          <button
            type="button"
            className={`btn-read-aloud ${isSpeaking ? "speaking" : ""}`}
            onClick={readInstructionsAloud}
          >
            <span>{isSpeaking ? "🔊 बोल रहे हैं..." : "🔊 Read Instructions Aloud"}</span>
          </button>
        </div>

        <p className="voice-transcript-text">
          {transcript ? (
            `"${transcript}"`
          ) : (
            <span style={{ color: "#999" }}>
              {currentLang === "hi"
                ? "माइक पर बोलें या ऊपर दिए गए सैंपल पर क्लिक करें..."
                : currentLang === "pa"
                ? "ਮਾਈਕ 'ਤੇ ਬੋਲੋ ਜਾਂ ਉੱਪਰ ਦਿੱਤੇ ਸੈਂਪਲ 'ਤੇ ਕਲਿੱਕ ਕਰੋ..."
                : "Speak into microphone or click a sample scenario above..."}
            </span>
          )}
        </p>
      </div>

      {/* Structured AI Report Extraction */}
      {structuredReport && (
        <div className="structured-report-card">
          <div className="structured-card-title">
            <h3>
              <span>⚡ AI Structured Emergency Triage</span>
            </h3>

            <span
              className={`urgency-badge ${
                structuredReport.priority === "Critical"
                  ? "critical"
                  : structuredReport.priority === "Urgent"
                  ? "urgent"
                  : "normal"
              }`}
            >
              🚨 Severity: {structuredReport.priority}
            </span>
          </div>

          <div className="extracted-fields-grid">
            <div className="extracted-field">
              <label>Animal Species</label>
              <strong>
                {structuredReport.animalEmoji} {structuredReport.animalType}
              </strong>
            </div>

            <div className="extracted-field">
              <label>Detected Location</label>
              <strong>📍 {structuredReport.location}</strong>
            </div>

            <div className="extracted-field">
              <label>Emergency Category</label>
              <strong>
                {structuredReport.tags.join(", ") || "Distress Triage"}
              </strong>
            </div>
          </div>

          {/* First Aid Instructions */}
          <div className="first-aid-banner">
            <span className="first-aid-icon">🩺</span>
            <div className="first-aid-content">
              <h4>
                {currentLang === "hi"
                  ? "तत्काल प्राथमिक उपचार निर्देश (First-Aid)"
                  : currentLang === "pa"
                  ? "ਤੁਰੰਤ ਮੁੱਢਲੀ ਸਹਾਇਤਾ ਨਿਰਦੇਸ਼ (First-Aid)"
                  : "Immediate First-Aid Protocol"}
              </h4>
              <p>{structuredReport.firstAidAdvice}</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="voice-dispatch-actions">
            <button
              type="button"
              className="btn-voice-reset"
              onClick={() => {
                setTranscript("");
                setStructuredReport(null);
              }}
            >
              Clear & Record Again
            </button>

            <button
              type="button"
              className="btn-voice-dispatch"
              onClick={handleConfirmDispatch}
            >
              <span>🚨</span>
              <span>Confirm & Dispatch Rescue Ambulance Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Comprehensive Veterinary Diagnostic Database & Clinical Knowledge Base
// Specially calibrated for FurEverCare AI Pet Disease Scanner

export const SAMPLE_PRESETS = [
  {
    id: "preset-bruno",
    name: "Bruno",
    species: "Dog",
    breed: "Golden Retriever",
    age: "3.5 Years",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80",
    primaryComplaint: "Intense scratching & moist raw skin on flank",
    observedSymptoms: ["skin_redness", "hair_loss", "paw_licking"],
    matchedConditionId: "hot-spot-dermatitis",
    boundingTargets: [
      {
        id: "target-1",
        top: 48,
        left: 42,
        width: 26,
        height: 24,
        label: "Pyotraumatic Erythema Core",
        severity: "severe",
        confidence: 96.4
      },
      {
        id: "target-2",
        top: 38,
        left: 32,
        width: 22,
        height: 20,
        label: "Localized Alopecia (Hair Loss)",
        severity: "moderate",
        confidence: 93.1
      }
    ]
  },
  {
    id: "preset-luna",
    name: "Luna",
    species: "Cat",
    breed: "British Shorthair",
    age: "2 Years",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80",
    primaryComplaint: "Squinting left eye, swelling and mucous discharge",
    observedSymptoms: ["eye_discharge", "sneezing"],
    matchedConditionId: "feline-conjunctivitis",
    boundingTargets: [
      {
        id: "target-1",
        top: 36,
        left: 35,
        width: 20,
        height: 20,
        label: "Chemosis (Conjunctival Swelling)",
        severity: "severe",
        confidence: 95.2
      },
      {
        id: "target-2",
        top: 48,
        left: 44,
        width: 18,
        height: 16,
        label: "Mucopurulent Ocular Exudate",
        severity: "moderate",
        confidence: 91.8
      }
    ]
  },
  {
    id: "preset-max",
    name: "Max",
    species: "Dog",
    breed: "Beagle",
    age: "4 Years",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1000&q=80",
    primaryComplaint: "Violent head shaking, foul-smelling brown ear wax",
    observedSymptoms: ["ear_discharge", "skin_redness"],
    matchedConditionId: "otitis-externa",
    boundingTargets: [
      {
        id: "target-1",
        top: 26,
        left: 56,
        width: 26,
        height: 28,
        label: "Erythematous Pinna Canal Opening",
        severity: "severe",
        confidence: 96.8
      },
      {
        id: "target-2",
        top: 42,
        left: 50,
        width: 20,
        height: 20,
        label: "Ceruminous Malassezia Exudate",
        severity: "moderate",
        confidence: 94.3
      }
    ]
  },
  {
    id: "preset-bella",
    name: "Bella",
    species: "Cat",
    breed: "Calico Cat",
    age: "1.5 Years",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1000&q=80",
    primaryComplaint: "Frenzied grooming, scabs & balding over tail base",
    observedSymptoms: ["skin_redness", "hair_loss"],
    matchedConditionId: "flea-allergy-dermatitis",
    boundingTargets: [
      {
        id: "target-1",
        top: 50,
        left: 44,
        width: 28,
        height: 26,
        label: "Miliary Papular Crusts & Flea Dirt",
        severity: "moderate",
        confidence: 95.7
      },
      {
        id: "target-2",
        top: 62,
        left: 36,
        width: 22,
        height: 22,
        label: "Dorsal Excoriations (Self-trauma)",
        severity: "severe",
        confidence: 92.4
      }
    ]
  },
  {
    id: "preset-pip",
    name: "Pip",
    species: "Rabbit",
    breed: "Holland Lop",
    age: "1 Year",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1000&q=80",
    primaryComplaint: "Overgrown curved front teeth & wet chin from drooling",
    observedSymptoms: ["bad_breath", "lethargy"],
    matchedConditionId: "rabbit-malocclusion",
    boundingTargets: [
      {
        id: "target-1",
        top: 52,
        left: 45,
        width: 24,
        height: 26,
        label: "Elongated Hypsodont Incisors",
        severity: "severe",
        confidence: 97.1
      },
      {
        id: "target-2",
        top: 65,
        left: 40,
        width: 24,
        height: 20,
        label: "Ptyalism (Saliva Wetness on Dewlap)",
        severity: "severe",
        confidence: 93.6
      }
    ]
  },
  {
    id: "preset-simba",
    name: "Simba",
    species: "Cat",
    breed: "Domestic Tabby",
    age: "10 Months",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1000&q=80",
    primaryComplaint: "Circular scaly bald ring on forehead with broken hairs",
    observedSymptoms: ["hair_loss", "skin_redness"],
    matchedConditionId: "feline-ringworm",
    boundingTargets: [
      {
        id: "target-1",
        top: 38,
        left: 43,
        width: 22,
        height: 22,
        label: "Circumscribed Ringworm Alopecia Ring",
        severity: "severe",
        confidence: 94.8
      },
      {
        id: "target-2",
        top: 32,
        left: 48,
        width: 18,
        height: 16,
        label: "Marginal Desquamation (Fungal Spores)",
        severity: "moderate",
        confidence: 91.2
      }
    ]
  },
  {
    id: "preset-video-demo",
    name: "Rocky (Video Gait & Respiration Scan)",
    species: "Dog",
    breed: "Husky Mix",
    age: "3 Years",
    mediaType: "video",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    posterUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80",
    primaryComplaint: "Motion reluctance, right hind paw guarding & rapid breathing",
    observedSymptoms: ["limping", "lethargy"],
    matchedConditionId: "canine-pododermatitis",
    boundingTargets: [
      {
        id: "target-1",
        top: 56,
        left: 48,
        width: 24,
        height: 22,
        label: "Interdigital Swelling & Pododermatitis",
        severity: "moderate",
        confidence: 93.4
      },
      {
        id: "target-2",
        top: 42,
        left: 38,
        width: 22,
        height: 20,
        label: "Gait Hesitation & Muscle Guarding",
        severity: "moderate",
        confidence: 89.7
      }
    ]
  }
];

export const VETERINARY_CONDITIONS = {
  "hot-spot-dermatitis": {
    id: "hot-spot-dermatitis",
    name: "Acute Moist Dermatitis ('Hot Spot')",
    clinicalName: "Pyotraumatic Dermatitis (Acute Superficial Pyoderma)",
    species: ["Dog", "Cat"],
    category: "Dermatology",
    severity: "moderate",
    severityLabel: "Moderate Attention Required",
    urgencyText: "Veterinary evaluation strongly advised within 24 to 48 hours to halt rapid bacterial spread.",
    confidence: 95.8,
    summary:
      "A fast-progressing, highly painful surface skin infection provoked by self-induced trauma (vigorous licking, scratching, or chewing). Often triggered by underlying flea allergies, ear canal irritation, or moisture trapped in thick coats.",
    pathologyDetails: [
      "Staphylococcus pseudintermedius bacterial colonization secondary to broken epidermal barrier",
      "Serous and purulent exudate crusting over hyperemic, raw dermal tissue",
      "Accelerated perimeter hair loss with intense pruritus (itch sensation)"
    ],
    visibleSymptoms: [
      "Well-demarcated bright red erythematous dermal lesion",
      "Moist, glistening exudative center with matted fur",
      "Focal alopecia (bald patch) around the infection center",
      "Extreme sensitivity or pain when the area is lightly touched"
    ],
    differentials: [
      { name: "Flea Allergy Dermatitis (FAD)", probability: 31 },
      { name: "Superficial Bacterial Folliculitis", probability: 22 },
      { name: "Sarcoptic Mange (Mites)", probability: 8 }
    ],
    whatToDoNext: [
      {
        step: 1,
        title: "Immediate Barrier (E-Collar)",
        desc: "Equip an Elizabethan cone collar, soft donut, or clean breathable recovery suit right away. Halting licking is the single most critical intervention."
      },
      {
        step: 2,
        title: "Gentle Flush & Cleanse",
        desc: "Dab the area with cool sterile saline (0.9% NaCl) or dilute chlorhexidine solution (0.05%). Gently blot dry with a lint-free sterile gauze pad."
      },
      {
        step: 3,
        title: "Expose to Clean Dry Air",
        desc: "Do NOT wrap or apply tight waterproof bandages. Hot spots require oxygen to dry out and suppress anaerobic bacterial proliferation."
      },
      {
        step: 4,
        title: "Schedule Veterinary Clinical Visit",
        desc: "Book a consultation within 24-48 hours. Most cases require veterinary-strength anti-inflammatory relief to break the cycle of self-mutilation."
      }
    ],
    whatNotToDo: [
      "NEVER apply human hydrocortisone creams or triple-antibiotic ointments (pets lick and ingest them, inducing toxic GI ulcers).",
      "NEVER pour hydrogen peroxide or rubbing alcohol on the lesion (kills healthy fibroblasts and causes extreme burning).",
      "NEVER give human painkillers such as Paracetamol, Crocin, Ibuprofen, or Aspirin (fatal liver/kidney failure in dogs & cats).",
      "DO NOT cover with heavy occlusive grease, petroleum jelly, or coconut oil which traps bacteria."
    ],
    veterinaryCare: {
      diagnosticTests: [
        "Skin surface impression cytology (Diff-Quik stain) to quantify bacterial cocci vs. yeast",
        "Wood's lamp evaluation to rule out concurrent dermatophytosis (ringworm)",
        "Deep skin scraping if Demodex or Sarcoptes mites cannot be excluded"
      ],
      typicalPrescriptions: [
        "Medicated topical spray: Chlorhexidine (2-4%) + Ketoconazole foam/spray BID",
        "Anti-pruritic therapy: Apoquel (oclacitinib) or Cytopoint injection for immediate itch relief",
        "Oral systemic antibiotic: Cephalexin or Amoxicillin-Clavulanate if deep pyoderma is identified"
      ],
      prognosis: "Excellent with early veterinary care. Complete resolution typically within 10 to 14 days."
    }
  },

  "feline-conjunctivitis": {
    id: "feline-conjunctivitis",
    name: "Feline Conjunctivitis & Ocular Infection",
    clinicalName: "Feline Ocular Chlamydiosis / FHV-1 Blepharoconjunctivitis",
    species: ["Cat"],
    category: "Ophthalmology",
    severity: "moderate",
    severityLabel: "Veterinary Review Recommended",
    urgencyText: "Seek veterinary care within 24 hours. Prompt corneal staining is required to safeguard pet vision.",
    confidence: 94.6,
    summary:
      "Inflammation of the delicate conjunctival tissues surrounding the eye. In cats, this is predominantly caused by infectious pathogens including Feline Herpesvirus-1 (FHV-1) or Chlamydia felis, leading to discomfort and vision impairment.",
    pathologyDetails: [
      "Active viral or bacterial replication in conjunctival epithelial cells",
      "Vascular engorgement of the sclera and inner eyelid lining (hyperemia)",
      "Mucopurulent or serous exudate causing lid adherence and blepharospasm"
    ],
    visibleSymptoms: [
      "Swollen, puffy, or pink-red conjunctival membranes (chemosis)",
      "Clear, yellow, or greenish ocular discharge crusting on whiskers",
      "Frequent squinting, blinking, or pawing at the eye",
      "Partial elevation of the third eyelid (nictitating membrane)"
    ],
    differentials: [
      { name: "Corneal Ulceration (Epithelial defect)", probability: 28 },
      { name: "Foreign Body (Dust particle/grass seed)", probability: 16 },
      { name: "Feline Calicivirus (FCV) Syndrome", probability: 12 }
    ],
    whatToDoNext: [
      {
        step: 1,
        title: "Saline Eye Cleansing",
        desc: "Moisten a fresh cotton cosmetic pad with sterile eye saline. Gently wipe crusts from the inner corner outwards. Use a completely separate cotton pad for each eye."
      },
      {
        step: 2,
        title: "Dim the Lighting",
        desc: "Keep your feline companion in a cozy, dimly lit bedroom or room. Bright sunlight or glare aggravates photophobic pain."
      },
      {
        step: 3,
        title: "Quarantine & Hygiene",
        desc: "Isolate from other household cats as conjunctival pathogens transmit readily via droplets and shared grooming bowls. Wash your hands thoroughly."
      },
      {
        step: 4,
        title: "Veterinary Fluorescein Test",
        desc: "Take your cat to a vet for a fluorescent corneal dye test. This is essential before administering any prescription drops."
      }
    ],
    whatNotToDo: [
      "DO NOT administer leftover eye drops containing corticosteroids (e.g., Prednisolone/Dexamethasone) without a vet's green stain test. Steroids cause an existing corneal ulcer to perforate, causing permanent blindness!",
      "DO NOT use human Visine, contact lens solution, or tea bag compresses.",
      "NEVER attempt to physically pull or trim the protruding third eyelid."
    ],
    veterinaryCare: {
      diagnosticTests: [
        "Fluorescein dye corneal stain to detect microscopic dendritic ulcers or scratch defects",
        "Conjunctival PCR swab test for FHV-1, Chlamydia felis, and Mycoplasma felis",
        "Schirmer Tear Test (STT) to measure tear film production (Keratoconjunctivitis Sicca)"
      ],
      typicalPrescriptions: [
        "Topical antibiotic: Terramycin (oxytetracycline/polymyxin B) ophthalmic ointment TID",
        "Antiviral eyedrops: Cidofovir (0.5%) or Idoxuridine if active herpesvirus is confirmed",
        "Immune booster: Oral L-lysine amino acid powder (250-500mg daily with wet food)"
      ],
      prognosis: "Favorable with topical therapy. Recovery spans 7 to 18 days depending on viral recrudescence."
    }
  },

  "otitis-externa": {
    id: "otitis-externa",
    name: "Otitis Externa (Ear Canal Infection & Mites)",
    clinicalName: "Canine / Feline Ceruminous Otitis Externa",
    species: ["Dog", "Cat"],
    category: "Otology",
    severity: "moderate",
    severityLabel: "Prompt Care Advised",
    urgencyText: "Book an appointment within 48 hours to protect the delicate eardrum and prevent chronic canal stenosis.",
    confidence: 96.2,
    summary:
      "Acute or chronic inflammation of the external ear canal lining. Commonly driven by Malassezia yeast overgrowth, bacterial pathogens, or Otodectes cynotis ear mites, particularly in floppy-eared or water-loving breeds.",
    pathologyDetails: [
      "Excessive glandular sebum and cerumen secretion in the vertical and horizontal canals",
      "Overgrowth of Malassezia pachydermatis yeast or Pseudomonas/Staphylococcus bacteria",
      "Canal lumen narrowing due to inflammatory mucosal edema and erythema"
    ],
    visibleSymptoms: [
      "Vigorous, repetitive head shaking and ear tilting towards the affected side",
      "Red, hot, and swollen inner ear flap (pinna)",
      "Dark brown, yellowish, or black coffee-ground-like waxy discharge",
      "Pungent sweet or yeasty odor emanating from the ear aperture"
    ],
    differentials: [
      { name: "Otodectes Cynotis (Ear Mite Infestation)", probability: 34 },
      { name: "Aural Foreign Body (Plant Grass Seed / Foxtail)", probability: 21 },
      { name: "Aural Hematoma (Blood pocket in ear flap)", probability: 14 }
    ],
    whatToDoNext: [
      {
        step: 1,
        title: "External Observation Only",
        desc: "Examine the ear flap under good light. Do NOT push objects inside. Check for sudden swelling of the ear leather (aural hematoma)."
      },
      {
        step: 2,
        title: "Discourage Violent Head Shaking",
        desc: "Violent head shaking ruptures pinna blood vessels, filling the ear flap with blood. Use a soft calming snood or headband to cushion the flap."
      },
      {
        step: 3,
        title: "Wipe External Flap Gently",
        desc: "Wipe visible crusts on the outer leather flap with a soft dry tissue. Do not pour fluids into the ear yet until a vet verifies the eardrum is intact."
      },
      {
        step: 4,
        title: "Veterinary Otoscopy & Cytology",
        desc: "Schedule a vet clinic visit. A doctor must visualize the tympanic membrane with an otoscope to tailor fungal vs. bacterial drops."
      }
    ],
    whatNotToDo: [
      "NEVER insert cotton Q-tips or buds deep into the pet ear canal. Pet canals are L-shaped; cotton swabs ram debris against the eardrum, risking rupture!",
      "DO NOT pour apple cider vinegar, rubbing alcohol, or garlic oil down the canal (excruciating on inflamed raw tissue).",
      "DO NOT bathe the pet or allow water into ears until the infection is resolved."
    ],
    veterinaryCare: {
      diagnosticTests: [
        "In-clinic video otoscopy to inspect the entire canal and verify tympanic membrane integrity",
        "Ear discharge cytology to differentiate Malassezia yeast from rod/cocci bacteria",
        "Culture and antimicrobial sensitivity testing for chronic or recurrent cases"
      ],
      typicalPrescriptions: [
        "In-clinic deep ear flush with a ceruminolytic and antimicrobial drying agent",
        "Long-acting single-application otic gel (e.g., Osurnia, Claro, or Posatex)",
        "Systemic anti-inflammatory (Carprofen or Meloxicam) for canal pain and swelling"
      ],
      prognosis: "Very good with targeted topical medication. Symptom relief in 4-7 days; full cure in 14 days."
    }
  },

  "flea-allergy-dermatitis": {
    id: "flea-allergy-dermatitis",
    name: "Flea Allergy Dermatitis (FAD) & Lumbar Scabs",
    clinicalName: "Ctenocephalides Hypersensitivity Dermatitis",
    species: ["Dog", "Cat"],
    category: "Parasitic Dermatology",
    severity: "low",
    severityLabel: "Manageable Home & Vet Triage",
    urgencyText: "Start fast-acting veterinary antiparasitics today. Vacuum home textiles to eliminate dormant pupae.",
    confidence: 96.0,
    summary:
      "A severe hypersensitive immunological reaction to polypeptides present in flea saliva. Even a single flea bite can provoke days of intense itching, scratching, self-induced alopecia, and crusty scabs across the lower back and tail base.",
    pathologyDetails: [
      "Type I and Type IV hypersensitivity response to flea salivary antigens",
      "Eosinophilic infiltration into the dermis inducing intense pruritus",
      "Secondary excoriations with potential for superficial staphylococcal pyoderma"
    ],
    visibleSymptoms: [
      "Triangular patch of thinning fur or baldness over the lumbar spine and tail base",
      "Tiny red crusty bumps (miliary dermatitis) that feel like sandpaper",
      "Presence of 'flea dirt' (black pepper specks that dissolve red on wet white paper)",
      "Frantic biting at hind legs, groin, and tail base"
    ],
    differentials: [
      { name: "Environmental Atopic Allergy (Pollen/Mites)", probability: 26 },
      { name: "Food Protein Intolerance", probability: 19 },
      { name: "Psychogenic Over-grooming (Stress)", probability: 11 }
    ],
    whatToDoNext: [
      {
        step: 1,
        title: "Confirm with White Paper Test",
        desc: "Comb your pet with a fine-tooth flea comb over a wet white paper towel. If black debris dissolves with a red rust halo, flea dirt (digested blood) is confirmed."
      },
      {
        step: 2,
        title: "Administer Veterinary Flea Treatment",
        desc: "Administer an approved modern isoxazoline chewable (Bravecto, Simparica, Nexgard) for dogs or spot-on (Revolution Plus, Bravecto) for cats."
      },
      {
        step: 3,
        title: "Deep Decontaminate Living Spaces",
        desc: "Wash pet beds, blankets, and pillow covers at 60°C. Thoroughly vacuum rugs, floorboards, and sofa crevices where 95% of flea eggs/larvae reside."
      },
      {
        step: 4,
        title: "Soothing Medicated Bath",
        desc: "Give a lukewarm colloidal oatmeal or pramoxine bath to soothe the immediate skin inflammation. Avoid harsh detergents."
      }
    ],
    whatNotToDo: [
      "NEVER apply dog flea products or permethrin on a cat. Permethrin is extremely neurotoxic to felines and causes life-threatening tremors!",
      "DO NOT use unproven herbal flea collars or essential oils (pennyroyal, tea tree, clove are toxic to companion pets).",
      "DO NOT treat only one animal; every cat and dog in the household must be treated concurrently."
    ],
    veterinaryCare: {
      diagnosticTests: [
        "Flea comb examination and microscopic evaluation of skin debris",
        "Intradermal skin testing or IgE serology if flea control fails to halt pruritus"
      ],
      typicalPrescriptions: [
        "Oral Isoxazoline antiparasitic (Bravecto, Simparica Trio, or Credelio)",
        "Short-course Apoquel (oclacitinib) or Prednisolone to halt the severe itch cycle",
        "Topical antimicrobial foam for secondary excoriated scabs"
      ],
      prognosis: "Rapid improvement within 48 to 72 hours of adulticide administration. Environment clears in 3-4 weeks."
    }
  },

  "feline-ringworm": {
    id: "feline-ringworm",
    name: "Ringworm (Fungal Dermatophytosis)",
    clinicalName: "Microsporum Canis Dermatophytosis",
    species: ["Cat", "Dog"],
    category: "Fungal Dermatology",
    severity: "moderate",
    severityLabel: "Contagious Condition (Zoonotic Alert)",
    urgencyText: "Veterinary confirmation and prompt isolation needed. Ringworm readily spreads to humans and children.",
    confidence: 94.2,
    summary:
      "A superficial fungal infection of keratinized tissues (hair, skin, and nails) caused by fungal spores. It produces classic circular bald patches with scaly margins. Highly infectious across species.",
    pathologyDetails: [
      "Invasion of hair shafts (ectothrix/endothrix spores) weakening hair cuticle",
      "Hair shaft fracture close to skin surface producing circular alopecic focal zones",
      "Peripheral scaling and follicular plugging with active fungal hyphae"
    ],
    visibleSymptoms: [
      "Distinct circular or oval bald patches with well-defined margins",
      "Cigarette-ash-like silver or grey skin scaling within the patch",
      "Stubbly, broken hair shafts along the outer perimeter",
      "Commonly found on ears, face, paws, and front limbs"
    ],
    differentials: [
      { name: "Demodectic Mange (Demodex cati/canis)", probability: 23 },
      { name: "Eosinophilic Plaque / Granuloma", probability: 17 },
      { name: "Bacterial Superficial Folliculitis", probability: 13 }
    ],
    whatToDoNext: [
      {
        step: 1,
        title: "Quarantine in Washable Room",
        desc: "Place the pet in an easily sanitized room with hard floors (such as a tiled bathroom or spare room) to contain shedding spores."
      },
      {
        step: 2,
        title: "Wear Protective Gloves",
        desc: "Wear disposable nitrile gloves when handling or treating the pet. Wash hands thoroughly with antimicrobial soap."
      },
      {
        step: 3,
        title: "Daily Vacuum & Bleach Decontamination",
        desc: "Clean hard surfaces with 1:10 diluted household bleach or specialized antifungal cleaner. Dispose of vacuum bags immediately."
      },
      {
        step: 4,
        title: "Veterinary Wood's Lamp & DTM Culture",
        desc: "Take the pet to a veterinary clinic for UV lamp inspection and dermatophyte fungal culture (DTM) to verify the exact species."
      }
    ],
    whatNotToDo: [
      "DO NOT allow children, elderly, or immunocompromised individuals to cuddle or handle the pet during active infection.",
      "DO NOT dry-brush the pet's coat (launches millions of microscopic fungal spores into the home air).",
      "DO NOT stop treatment prematurely; ringworm can persist subclinically even after fur begins to regrow."
    ],
    veterinaryCare: {
      diagnosticTests: [
        "Wood's lamp ultraviolet examination (apple-green fluorescence of Microsporum canis)",
        "Trichogram (microscopic examination of plucked peripheral hairs for fungal arthrospores)",
        "Dermatophyte Test Medium (DTM) fungal culture with red color shift"
      ],
      typicalPrescriptions: [
        "Systemic oral antifungal: Itraconazole liquid (5-10 mg/kg daily or week-on/week-off protocol)",
        "Topical antifungal wash: Dilute Lime Sulfur dip (1:32) twice weekly or Miconazole-Chlorhexidine shampoo",
        "Environmental antifungals: Enilconazole or sodium hypochlorite surface sprays"
      ],
      prognosis: "Curable with dedicated protocol. Therapy typically spans 4 to 8 weeks until negative fungal culture."
    }
  },

  "rabbit-malocclusion": {
    id: "rabbit-malocclusion",
    name: "Rabbit Dental Malocclusion & Incisor Overgrowth",
    clinicalName: "Hypsodont Dental Malocclusion & Anorexia Complex",
    species: ["Rabbit"],
    category: "Dental & Exotic Medicine",
    severity: "urgent",
    severityLabel: "Urgent Medical Attention Required",
    urgencyText: "Emergency exotic vet required. Rabbits cannot tolerate fasting; inability to eat leads to fatal GI stasis within 12-24 hours.",
    confidence: 96.9,
    summary:
      "Unlike cats and dogs, rabbits have open-rooted teeth (elodont) that grow continuously throughout life. Misaligned jaws or lack of coarse hay causes teeth to overgrow, curving like walrus tusks and slicing the gums, preventing food intake.",
    pathologyDetails: [
      "Continuous eruption of incisors and premolars/molars at 2-3mm per week without attrition",
      "Molar sharp spurs lacerating buccal mucosa (cheeks) and lingual tissue (tongue)",
      "Complete cessation of feeding triggering acute Gastrointestinal (GI) Stasis and hepatic lipidosis"
    ],
    visibleSymptoms: [
      "Elongated, curled upper or lower incisors visible outside the lips",
      "Wet, matted fur on the chin, neck, and dewlap due to inability to swallow saliva (ptyalism)",
      "Dropping food pieces, inability to chew timothy hay, marked weight loss",
      "Diminished or completely absent fecal pellets (emergency alert!)"
    ],
    differentials: [
      { name: "Cheek Molar Spur Laceration", probability: 44 },
      { name: "Mandibular Osteomyelitis / Retrobulbar Abscess", probability: 21 },
      { name: "Dietary Roughage Deficiency / GI Hypomotility", probability: 14 }
    ],
    whatToDoNext: [
      {
        step: 1,
        title: "Check Fecal Output & Gut Motility",
        desc: "Inspect the litter box immediately. If the rabbit has not produced normal round fecal droppings in 8 hours, consider this a critical emergency."
      },
      {
        step: 2,
        title: "Provide Critical Care Slurry",
        desc: "Mix Oxbow Critical Care powder with lukewarm water into a smooth paste. Gently administer via syringe into the side of the mouth behind the incisors."
      },
      {
        step: 3,
        title: "Hydration Support",
        desc: "Offer water in a shallow ceramic dish rather than a sipper bottle, or syringe-feed small amounts of electrolyte water."
      },
      {
        step: 4,
        title: "Immediate Exotic Vet Scheduling",
        desc: "Transport the rabbit to an exotic pet specialist immediately for professional burr reduction under anesthesia."
      }
    ],
    whatNotToDo: [
      "NEVER cut or clip rabbit teeth with dog nail clippers or pliers! This fractures the tooth vertically into the jawbone and causes excruciating pain and fatal root abscesses.",
      "NEVER fast a rabbit before seeing the vet; rabbits must have gut food content at all times.",
      "DO NOT feed sugary snacks, muesli, or commercial seeds to compensate for hay refusal."
    ],
    veterinaryCare: {
      diagnosticTests: [
        "Sedated oral endoscopy to evaluate rear premolars and molars for cheek spurs",
        "Skull radiographs (X-rays) or CT scan to evaluate tooth root elongation and jaw cortical bone"
      ],
      typicalPrescriptions: [
        "In-clinic dental burring contouring using high-speed dental handpiece",
        "Pain management: Meloxicam (Metacam) NSAID suspension (vital for rabbit appetite)",
        "GI motility stimulants: Cisapride or Metoclopramide to prevent GI stasis",
        "High-fiber diet plan: 85% first-cut Timothy hay, fresh orchard grass"
      ],
      prognosis: "Immediate relief post-burring. Regular dental trims required every 4-8 weeks unless permanent extraction is performed."
    }
  },

  "canine-pododermatitis": {
    id: "canine-pododermatitis",
    name: "Canine Interdigital Pododermatitis & Paw Swelling",
    clinicalName: "Canine Interdigital Furunculosis & Pododermatitis",
    species: ["Dog"],
    category: "Musculoskeletal & Paw Health",
    severity: "moderate",
    severityLabel: "Moderate Attention Required",
    urgencyText: "Veterinary evaluation recommended to rule out embedded foxtails/foreign bodies and relieve pain.",
    confidence: 94.4,
    summary:
      "Painful inflammatory and infectious condition affecting the webbing and pads between a dog's toes. Commonly triggered by foreign bodies (thorns, foxtail awns), allergic friction, or deep bacterial and demodectic mite infections.",
    pathologyDetails: [
      "Rupture of deep interdigital hair follicles provoking sterile or bacterial granulomas",
      "Formation of recurrent cystic nodules with purulent and serosanguinous discharge",
      "Marked weight-bearing lameness and secondary yeast/bacterial colonizations"
    ],
    visibleSymptoms: [
      "Red, swollen, blister-like nodule between the toes on one or multiple paws",
      "Frequent, compulsive paw licking, chewing, and biting at the pads",
      "Limping, favoring the foot, or reluctance to walk on hard surfaces",
      "Blood or pinkish discharge staining the fur around the paw pads"
    ],
    differentials: [
      { name: "Embedded Foreign Body (Foxtail grass awn / thorn)", probability: 38 },
      { name: "Demodectic Mange (Pododemodicosis)", probability: 24 },
      { name: "Paw Pad Thermal Burn or Laceration", probability: 16 }
    ],
    whatToDoNext: [
      {
        step: 1,
        title: "Inspect Under Magnified Light",
        desc: "Part the toes gently and illuminate the webbing. Look for an entrance hole, protruding splinter, or embedded burr."
      },
      {
        step: 2,
        title: "Lukewarm Antiseptic Soak",
        desc: "Soak the paw for 5-10 minutes in lukewarm water infused with dilute Betadine (povidone-iodine to iced-tea color) or Epsom salts."
      },
      {
        step: 3,
        title: "Thoroughly Dry & Cover",
        desc: "Pat the paw completely dry with a clean towel. Slip a clean, breathable dog sock or soft bootie over the foot to prevent licking."
      },
      {
        step: 4,
        title: "Veterinary Exploration",
        desc: "Have a veterinarian explore the nodule. Embedded foreign bodies often migrate upward without surgical extraction."
      }
    ],
    whatNotToDo: [
      "NEVER squeeze, lance, or pop the cyst at home with household needles (drives bacteria deeper into interdigital tendons).",
      "DO NOT use rubber bands to secure socks onto the paw (cuts off arterial blood flow and causes limb necrosis!).",
      "DO NOT walk the dog on hot asphalt, rough gravel, or muddy fields while inflamed."
    ],
    veterinaryCare: {
      diagnosticTests: [
        "Deep skin scraping and hair plucking to check for Demodex canis mites",
        "Fine-needle aspirate (FNA) or impression cytology to assess inflammatory cell populations",
        "Interdigital ultrasound or surgical exploration if an embedded grass awn is suspected"
      ],
      typicalPrescriptions: [
        "Chlorhexidine 4% antimicrobial foot soaks or antiseptic wipes daily",
        "Targeted oral antibiotics (Cefpodoxime, Clindamycin) for 3-6 weeks if deep furunculosis exists",
        "Topical or oral anti-inflammatory therapy to halt paw trauma"
      ],
      prognosis: "Favorable with disciplined foot hygiene and foreign body removal. Healing within 2-3 weeks."
    }
  },

  "general-dermatitis": {
    id: "general-dermatitis",
    name: "General Pet Dermatitis & Skin Irritation",
    clinicalName: "Superficial Cutaneous Inflammatory Complex",
    species: ["Dog", "Cat", "Rabbit", "Other"],
    category: "Dermatology",
    severity: "low",
    severityLabel: "Mild to Moderate Symptom",
    urgencyText: "Routine veterinary consultation recommended if itching or redness persists past 48 hours.",
    confidence: 91.2,
    summary:
      "Generalized skin irritation, redness, and pruritus triggered by environmental allergens, grooming products, mild contact irritation, or nutritional sensitivities.",
    pathologyDetails: [
      "Mild epidermal barrier breakdown and inflammatory mast cell degranulation",
      "Increased surface histamine release driving compulsive scratching",
      "Early stage superficial scaling and follicular redness"
    ],
    visibleSymptoms: [
      "Diffuse skin redness (erythema) on belly, armpits, or muzzle",
      "Mild dandruff, skin flaking, or dry coat texture",
      "Frequent scratching or rubbing against furniture and carpets",
      "Scattered minor scabs or pinhead-sized bumps"
    ],
    differentials: [
      { name: "Contact Dermatitis (Shampoo/Carpet cleaner)", probability: 38 },
      { name: "Seasonal Environmental Pollen Allergy", probability: 31 },
      { name: "Dietary Protein Sensitivity", probability: 21 }
    ],
    whatToDoNext: [
      {
        step: 1,
        title: "Review Recent Environmental Changes",
        desc: "Check if you recently used new laundry detergents, carpet deodorizers, scented candles, or changed pet food brands."
      },
      {
        step: 2,
        title: "Lukewarm Oatmeal Bath",
        desc: "Bathe the pet in lukewarm water with hypoallergenic oatmeal shampoo. Leave on coat for 5 minutes before rinsing completely."
      },
      {
        step: 3,
        title: "Omega-3 Fatty Acids",
        desc: "Supplement with veterinary-grade EPA/DHA fish oil to reinforce the skin lipid barrier."
      },
      {
        step: 4,
        title: "Monitor for 48 Hours",
        desc: "If redness spreads, starts oozing, or the pet becomes restless, schedule a veterinary wellness visit."
      }
    ],
    whatNotToDo: [
      "DO NOT bathe the pet with human shampoos, dish soaps, or medicated human bars (pH mismatch strips essential oils).",
      "DO NOT feed scraps of seasoned human food or table treats."
    ],
    veterinaryCare: {
      diagnosticTests: ["Tape strip cytology", "Skin scrape for mites", "Dietary elimination trial"],
      typicalPrescriptions: ["Hypoallergenic veterinary shampoo", "Omega-3 fatty acid supplements", "Oral antihistamine"],
      prognosis: "Excellent with allergen identification and gentle skin barrier support."
    }
  }
};

// Common Symptoms Checklist
export const SYMPTOM_OPTIONS = [
  { id: "skin_redness", label: "Skin Redness / Hotspots", icon: "🔴", defaultCategory: "Dermatology" },
  { id: "hair_loss", label: "Hair Loss / Bald Patches", icon: "🩹", defaultCategory: "Dermatology" },
  { id: "paw_licking", label: "Excessive Paw Licking", icon: "🐾", defaultCategory: "Musculoskeletal & Paw" },
  { id: "ear_discharge", label: "Ear Shaking / Wax Discharge", icon: "👂", defaultCategory: "Otology" },
  { id: "eye_discharge", label: "Eye Discharge / Squinting", icon: "👁️", defaultCategory: "Ophthalmology" },
  { id: "sneezing", label: "Sneezing / Coughing / Wheezing", icon: "🤧", defaultCategory: "Respiratory" },
  { id: "limping", label: "Limping / Mobility Guarding", icon: "🚶", defaultCategory: "Musculoskeletal" },
  { id: "lethargy", label: "Lethargy / Loss of Appetite", icon: "😴", defaultCategory: "Systemic" },
  { id: "bad_breath", label: "Drooling / Dental Issues", icon: "🦷", defaultCategory: "Dental" }
];

// Helper to determine best matching condition from uploaded file & symptoms
export function diagnosePetSymptoms({ species, observedSymptoms = [], _customNotes = "" }) {
  // If symptoms indicate specific diseases
  const symptomsSet = new Set(observedSymptoms);

  if (symptomsSet.has("bad_breath") && (species === "Rabbit" || species === "Other")) {
    return VETERINARY_CONDITIONS["rabbit-malocclusion"];
  }

  if (symptomsSet.has("eye_discharge") && (species === "Cat" || species === "Dog")) {
    return VETERINARY_CONDITIONS["feline-conjunctivitis"];
  }

  if (symptomsSet.has("ear_discharge")) {
    return VETERINARY_CONDITIONS["otitis-externa"];
  }

  if (symptomsSet.has("limping") || symptomsSet.has("paw_licking")) {
    return VETERINARY_CONDITIONS["canine-pododermatitis"];
  }

  if (symptomsSet.has("hair_loss") && symptomsSet.has("skin_redness")) {
    if (species === "Cat") {
      return VETERINARY_CONDITIONS["feline-ringworm"];
    }
    return VETERINARY_CONDITIONS["hot-spot-dermatitis"];
  }

  if (symptomsSet.has("skin_redness")) {
    return VETERINARY_CONDITIONS["hot-spot-dermatitis"];
  }

  // Fallback to species-appropriate condition or general dermatitis
  if (species === "Rabbit") return VETERINARY_CONDITIONS["rabbit-malocclusion"];
  if (species === "Cat") return VETERINARY_CONDITIONS["feline-conjunctivitis"];
  return VETERINARY_CONDITIONS["general-dermatitis"];
}

// Nearby partner clinics database for instant referrals
export const NEARBY_VET_CLINICS = [
  {
    id: "clinic-1",
    name: "FurEverCare 24/7 Animal Trauma & Specialty Hospital",
    address: "142 Shelter Road, Sector 44, Gurugram",
    phone: "+91 12345 67890",
    emergencyHelpline: "1800-419-CARE",
    distance: "1.2 km away",
    openStatus: "Open 24 Hours (Emergency Ready)",
    rating: 4.9,
    reviewsCount: 382,
    badge: "Official Partner Center",
    services: ["24/7 Trauma ICU", "Digital X-Ray & Ultrasound", "Advanced Dental & Surgery", "Dermatology Lab"]
  },
  {
    id: "clinic-2",
    name: "Central Paws Multi-Specialty Veterinary Care",
    address: "B-18 Connaught Place, New Delhi",
    phone: "+91 98111 22334",
    emergencyHelpline: "+91 99999 11222",
    distance: "3.8 km away",
    openStatus: "Open till 10:00 PM (On-call Doctor)",
    rating: 4.8,
    reviewsCount: 245,
    badge: "Feline Friendly Gold Certified",
    services: ["Ophthalmic Slit Lamp", "In-house Cytology", "Exotic Small Animal Suite", "Vaccination Passport Sync"]
  },
  {
    id: "clinic-3",
    name: "Apollo Vets & Critical Care Clinic",
    address: "Plot 88, Golf Course Extension, Gurugram",
    phone: "+91 98765 43210",
    emergencyHelpline: "+91 98765 43211",
    distance: "5.4 km away",
    openStatus: "Open 24 Hours",
    rating: 4.7,
    reviewsCount: 198,
    badge: "Emergency Certified",
    services: ["Isolation Ward (Infectious)", "Blood Transfusion Bank", "Laser Surgery", "Pet Ambulance Dispatch"]
  }
];

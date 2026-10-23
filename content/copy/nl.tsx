import Ext from "@/components/ExternalLink";
import type { Copy } from "./types";

// Waiting for Ilyas's review (hub platforms/website.md, "Dutch copy"). Addresses the reader with "je".
export const nl: Copy = {
  lang: "nl",
  locale: "nl_NL",
  site: {
    title: "Ilyas Mallah, software engineer",
    description:
      "Ilyas Mallah, software engineer in Nederland. Ik zoek uit waarom software traag is en maak het snel, in AI-inferentie, databases, runtimes en compilers.",
    ogAlt: "Ilyas Mallah. Ik zoek uit waarom software traag is, en maak het snel.",
    ogImage: "/og-nl.png",
    skip: "Naar de inhoud",
    nav: { start: "Werkwijze", work: "Projecten", contact: "Contact" },
    theme: "Kleurthema wisselen",
    switchTo: { label: "EN", name: "English", lang: "en" },
    offer: { region: "Taal", text: "Deze pagina is er ook in het Nederlands.", go: "Lees in het Nederlands", close: "Sluiten" },
    privacy: "Privacy",
    earlier: "Eerder werk (green-real)",
    cv: "Cv (Engels)",
    writing: "Artikelen (Engels)",
    email: "E-mail",
  },
  copyButton: { text: "Kopieer", copied: "Gekopieerd", aria: "E-mailadres kopiëren" },
  reply: {
    text: "Ik reageer binnen een paar uur, tussen 9.00 en 21.00 uur Nederlandse tijd{yours}.",
    zoneFallback: "Nederlandse tijd",
    yours: " ({start} tot {end} uur bij jou)",
  },
  showcase: {
    aria: "Gemeten resultaten",
    tabsAria: "Resultaten",
    tabs: [
      {
        figureShort: "Tot 2,1x sneller",
        topic: "AI-antwoorden",
        figure: "Tot 2,1x snellere AI-antwoorden",
        meaning: "Lange chats antwoorden ongeveer twee keer zo snel, zonder nieuwe hardware.",
        measured: "Gemeten op een RTX 5090-GPU",
        source: "llama.cpp PR #30077",
      },
      {
        figureShort: "Tot 52% meer",
        topic: "AI-serving",
        figure: "Tot 52% meer AI-tokens per seconde",
        meaning: "Twee GPU's leveren nu meer dan drie GPU's vóór mijn fix.",
        measured: "Gemeten op een H100-GPU ({speedup}x versneld afgespeeld)",
        source: "vLLM PR #60464",
      },
      {
        figureShort: "50x sneller",
        topic: "Grafiekqueries",
        figure: "50x snellere grafiekqueries",
        meaning: "Grafiekqueries die van traag naar direct gingen.",
        measured: "Gemeten in productie",
        source: "Rolantir-case (Engels)",
      },
    ],
    newTab: " (opent in een nieuw tabblad)",
    slowMotion: "10x vertraagd",
    replay: "opnieuw",
    replayAria: "Opnieuw afspelen",
    before: "vóór",
    after: "na",
    doneIn: "klaar in {s} s",
    seconds: "{s} s",
    chatQuestion: "Vat de grootste risico's in dit contract van 40 pagina's samen.",
    chatAnswer:
      "Dit zijn de grootste risico's die ik vond. Ten eerste mag de leverancier de overeenkomst opzeggen met een " +
      "opzegtermijn van maar dertig dagen, terwijl jij er negentig moet aanhouden. Ten tweede is de aansprakelijkheid " +
      "beperkt tot de vergoedingen van de laatste drie maanden, ver onder de kosten van een serieuze storing. Ten derde " +
      "wordt het contract automatisch met een heel jaar verlengd, tenzij je zestig dagen voor de einddatum schriftelijk " +
      "opzegt. Ten vierde blijft het intellectueel eigendom van wat tijdens het project wordt gemaakt bij de leverancier, " +
      "dus je krijgt alleen een gebruikslicentie. Ten vijfde mogen de prijzen eens per jaar tot twaalf " +
      "procent stijgen zonder jouw toestemming. Tot slot gaan geschillen naar arbitrage bij een buitenlandse rechtbank, " +
      "wat elke claim traag en duur maakt. Ik zou over de opzegtermijn, de aansprakelijkheidslimiet en de verlenging " +
      "onderhandelen voordat je tekent.",
    chatLabel:
      "Twee chats beantwoorden dezelfde vraag over een lang contract. Vóór de fix duurt het antwoord {before} seconden. Na de fix duurt het {after} seconden.",
    servingLabel:
      "Twee rasters van {tiles} balken, één per verzoek dat tegelijk wordt verwerkt. Elke balk loopt {perTile} keer vol, één keer per verzoek op de gemeten tijd, en blijft daarna vol. Vóór de fix maakt de GPU {beforeTps} tokens per seconde en is hij na {beforeS} seconden klaar met alle {requests} verzoeken. Na de fix maakt hij er {afterTps} en is hij na {afterS} seconden klaar.",
    chartLabel:
      "Twee dashboardpanelen tonen dezelfde voorbeeldgrafiek van het aantal spelers van een game over een week. Elke grafiek verschijnt zodra zijn query op de server klaar is. Vóór het herschrijven duurt de query {before} milliseconden. Daarna duurt hij {after} milliseconden.",
    chartDays: ["ma", "di", "wo", "do", "vr", "za", "zo"],
    chartQuerying: "query loopt",
    chartExample: "voorbeelddata",
  },
  bars: {
    before: "vóór",
    after: "na",
    chartRange: ["400 tot 900 ms", "3 tot 8 ms"],
    chartCaption: "Querytijd van de uurgrafieken, gemeten in productie, juni 2026",
    chartLabel: "Querytijd van de uurgrafieken, 400 tot 900 ms vóór en 3 tot 8 ms na het herschrijven",
    decodeCaption: "Decodeersnelheid bij 32k tokens context, RTX 5090, CUDA 12.8.1",
    decodeLabel: "Decodeersnelheid bij 32k tokens context, {m} tokens per seconde vóór de fix en {f} erna",
  },
  home: {
    eyebrow: "Performance engineer voor AI- en backendsystemen",
    title: ["Ik zoek uit waarom software traag is,", "en maak het snel."],
    lede: "Snellere responstijden, minder GPU's, een lagere cloudrekening. Ik vind wat traag is, bewijs het en los het op.",
    contact: "Contact",
    howItWorks: "Werkwijze",
    available: "Beschikbaar voor opdrachten.",
    creditEngines: (
      <>
        De winst in llama.cpp en vLLM komt uit fixes in de engines zelf, dus iedereen die ze gebruikt wordt er sneller van. Jouw
        eigen stack heeft daarbovenop zijn eigen inefficiënties, en daar begin ik.
      </>
    ),
    creditLuau:
      "Ik werk ook in compilers en runtimes van programmeertalen. Het Luau-team van Roblox heeft {n} fixes van mij overgenomen, in de native codegenerator, de registerallocator en de typechecker.",
    seeThem: "Bekijk de Luau-fixes",
    creditWasmtime: (
      <>
        De maintainers van Wasmtime namen er{" "}
        <Ext href="https://github.com/bytecodealliance/wasmtime/pull/14778" note="nl">
          nog een
        </Ext>{" "}
        over, in hun x64-codegenerator, en vermeldden mij als melder van een{" "}
        <Ext href="https://github.com/bytecodealliance/wasmtime/security/advisories/GHSA-mghf-wjfp-p5xm" note="nl">
          security advisory
        </Ext>
        .
      </>
    ),
    problemsTitle: "Problemen die ik oplos",
    areas: [
      {
        title: "AI-modellen die trager draaien dan de hardware toelaat",
        line: "Ik profileer inference-engines zoals llama.cpp en vLLM tot op de GPU-kernels, en los het knelpunt op.",
        proof: "Tot 2,1x sneller decoderen bij 32k context in llama.cpp op een RTX 5090, met een q4_0-cache en CUDA 12.8 (fix in review).",
      },
      {
        title: "Backends en databases die het niet bijbenen",
        line: "Trage queries, data die blijft groeien en migraties waarbij onderweg niets verloren mag gaan.",
        proof:
          "Na mijn herschrijving duurden de queries achter de uurgrafieken van Rolantir 3 tot 8 ms in plaats van 400 tot 900 ms, gemeten in productie. Bij de verhuizing van de database bleef de volledige historie bewaard.",
      },
      {
        title: "Een cloud- of GPU-rekening die harder groeit dan je aantal gebruikers",
        line: "Ik meet waar de rekenkracht naartoe gaat, spoor het werk op dat er niet hoort en los het op. Zo heeft hetzelfde verkeer minder hardware nodig.",
        proof: "In mijn voorbeeldaudit paste hetzelfde documentverkeer na één aangepaste instelling op 3 GPU's in plaats van 5.",
      },
      {
        title: "Code in C, C++ of Rust die onbetrouwbare invoer verwerkt",
        line: "Ik doorzoek één parser, codec, runtime of VM op de fouten die gemanipuleerde invoer kan uitlokken, en lever elke fout met een reproductie en een fix.",
        proof:
          "Wasmtime vermeldde mij als melder van een security advisory, en wabt en mruby namen mijn fixes over voor geheugengroottes en stringlengtes die overliepen.",
      },
    ],
    startTitle: "Begin met een onderzoek van twee weken",
    startLead: (
      <>
        Eén vaste prijs om te weten wat traag is, waarom, en wat een oplossing waard is. <span>Daarna los ik het op.</span>
      </>
    ),
    investigation: "Onderzoek",
    weeks: "2 weken",
    introBadge: "Introductieprijs",
    priceNow: "€3.000",
    priceNowUsd: "/ $3.500",
    priceWas: "Normale prijs €4.500 / $5.500",
    priceScope: "Eén workload in één omgeving",
    steps: [
      { title: "Je stuurt wat traag is", text: "Vertel me wat traag is en waar het draait. Daarna bespreken we het in een kort gesprek." },
      { title: "Ik vind de oorzaak", text: "Ik doe een nulmeting en herleid de vertraging tot de oorzaak, in welke laag die ook zit." },
      { title: "Je krijgt het rapport", text: "Oplossingen op volgorde, elk met de verwachte winst, de kosten en hoe zeker ik ben." },
    ],
    includedAria: "Inbegrepen",
    included: ["Een nulmeting", "Oorzaken met bewijs", "Oplossingen op volgorde", "Een vaste prijs voor de oplossing", "Tot 2 uur overleg"],
    sampleReport: "Bekijk een voorbeeldrapport (Engels)",
    fix: "De oplossing",
    fixBadge: "Apart geprijsd",
    fixPrice: "Vaste prijs",
    fixPriceFrom: "uit het rapport",
    fixNote: "Je ziet de prijs voordat je beslist.",
    fixSteps: [
      { title: "Ik los het op", text: "Voor de vaste prijs uit het rapport, schriftelijk afgesproken voordat ik begin." },
      { title: "Jij beoordeelt de pull requests", text: "Elke wijziging gaat door jouw CI, en niets gaat live zonder jouw akkoord." },
      { title: "Ik meet het resultaat", text: "Tegen dezelfde nulmeting als in het rapport, zodat je ziet wat er veranderd is." },
    ],
    teamFixes: (
      <>
        <strong>Of je team lost het zelf op met het rapport.</strong> Het is zo geschreven dat je engineers ermee aan de slag kunnen.
      </>
    ),
    workTogether: "Laten we samenwerken",
    priceFine: "Gehuurde GPU-tijd reken ik door tegen kostprijs, pas na jouw akkoord. Prijzen zijn exclusief btw.",
    sweepTitle: "Of een hardening-sweep van twee weken",
    sweepText:
      "Eén onderdeel in C, C++ of Rust dat onbetrouwbare invoer verwerkt, zoals een parser, codec, runtime of VM. Je krijgt de fouten die gemanipuleerde invoer kan uitlokken, elk bevestigd voordat hij in het rapport komt.",
    sweepIncluded: ["Alleen bevestigde fouten", "Een reproductie per fout", "Een fix per fout"],
    sweepPrice: "Zelfde prijs en dezelfde twee weken als het onderzoek.",
    safeguardsTitle: "Werken in jouw systemen",
    safeguards: [
      "Ik teken je geheimhoudingsverklaring (NDA).",
      "Ik werk op een stagingkopie of met alleen leestoegang tot de metrics van productie.",
      "Niets raakt productie zonder jouw akkoord.",
      "Wijzigingen komen als gewone pull requests via jouw CI.",
      "Wat ik voor je bouw, is van jou zodra het betaald is.",
    ],
    workTitle: "Uitgelichte projecten",
    readCase: "Lees de case (Engels)",
    rolantir: {
      status: "medeoprichter",
      text: "Analytics voor het Roblox-platform. Het volgt meer dan 1 miljoen games in een live database van 24,5 GB. Ik begon het met de backend, de crawler en de gametracker, en verhuisde het live van SQLite naar PostgreSQL met TimescaleDB zonder historie te verliezen.",
      stats: [
        {
          value: (
            <>
              <span className="stat-good">50x</span> snellere grafiekqueries
            </>
          ),
          sub: "gemeten in productie",
        },
        {
          value: (
            <>
              <span className="stat-good">9,5x</span> kleinere historie
            </>
          ),
          sub: "35 GB opgeslagen in 3,7 GB",
        },
      ],
    },
    llama: {
      status: "upstream fix",
      text: "Een fix in llama.cpp zelf, voor lange AI-gesprekken op een RTX 5090. De compiler hield een kleine waarde in traag geheugen, en ik heb aangepast hoe de kernel die waarde leest.",
      stats: [
        {
          value: (
            <>
              <span className="stat-good">2,1x</span> sneller decoderen
            </>
          ),
          sub: "bij 32k context",
        },
        { value: "Ongeveer 10 regels gewijzigd", sub: "in twee functies" },
      ],
      pr: "PR #30077 (open)",
    },
    luau: {
      title: "Luau-compiler en -runtime",
      status: "{n} gemerged",
      text: "Luau is de programmeertaal achter Roblox. De maintainers namen in 2026 {n} fixes van mij over, in de native codegenerator, de registerallocator en de typechecker.",
      prs: [
        "De x64-registerallocator zette een waarde verkeerd om bij het terugladen van de stack",
        <>
          Integervergelijkingen van <span className="val-bad">3,18 ns</span> naar <span className="val-good">0,63 ns</span> bij
          voorspelbare branches
        </>,
        "Snel pad op ARM64 voor lussen over arrays, zoals x64 al had",
        "Typecontrole voor aanroepen via een __call-metamethode",
      ],
      all: "Alle gemergede pull requests",
    },
    digIt: {
      status: "mede-eigenaar, verkocht",
      text: "Een Roblox-game die ik mee oprichtte. Van oktober 2024 tot maart 2025 was ik mede-eigenaar, daarna is de game verkocht. Ik deed het ontwerp, de backendsystemen en de live operations.",
      stats: [
        { value: "73 miljoen bezoeken", sub: "op Roblox" },
        { value: "27.400 spelers tegelijk", sub: "op het hoogtepunt" },
      ],
      game: "Gamepagina op Roblox",
      history: "Spelersaantallen op RoTrends",
    },
    writingTitle: "Artikelen",
    writingLead: "Hoe ik twee van deze vertragingen vond, stap voor stap, met de cijfers en de doodlopende sporen. De artikelen zijn in het Engels.",
    writingMeta: "{n} min lezen",
    writingAll: "Alle artikelen (Engels)",
    ossTitle: "Recente bijdragen aan open source",
    contributedTo: "Bijgedragen aan",
    highlights: [
      {
        status: "PR's open",
        metric: (
          <>
            Tot <span className="val-good">52%</span> meer outputtokens per seconde
          </>
        ),
        unit: "op het CUTLASS FP8-pad, één H100 NVL",
        text: "Kiest de matrixkernel op basis van de batchgrootte. 17 tot 52% meer outputtokens per seconde op één H100 NVL (Qwen3-8B-FP8) als vLLM zijn CUTLASS FP8-pad gebruikt.",
      },
      {
        status: "gepubliceerd",
        metric: "Vermeld als melder van een security advisory van Wasmtime",
        unit: "GHSA-mghf-wjfp-p5xm, oktober 2026",
        text: "Ik meldde een beveiligingsfout vertrouwelijk aan de maintainers van Wasmtime. Zij losten hem op in Wasmtime 36.0.19, 48.0.7 en 49.0.4, en publiceerden daarna de advisory met mij als melder.",
      },
      {
        status: "gemerged",
        metric: "Floats omzetten naar kleine integers laat de compiler niet meer crashen",
        unit: "in Cranelift, de codegenerator van Wasmtime, op x64",
        text: "Een float omzetten naar een integer van 8 of 16 bits liet de x64-backend van Cranelift crashen, terwijl de backends voor ARM64, RISC-V en s390x het al konden. Mijn fix rekent via 32 bits en begrenst de uitkomst of stopt met een trap. De maintainers hebben hem overgenomen, en daarmee is een issue uit 2022 gesloten.",
      },
      {
        status: "gemerged",
        metric: "Een geheugen van 4 GiB wordt geen 0 bytes meer",
        unit: "op 32-bitsystemen, in wasm2c van WebAssembly",
        text: "wasm2c zet WebAssembly om naar C. Op 32-bitsystemen werd een geheugen van 4 GiB 0 bytes groot, waardoor geheugen werd vrijgegeven dat nog in gebruik was. Mijn fix weigert groottes die niet passen, en de maintainers hebben hem overgenomen.",
      },
    ],
    morePrsOne: "Nog één PR open.",
    morePrsMany: "Nog {n} PR's open.",
    hardening:
      "Ik maak ook code robuuster die onbetrouwbare invoer verwerkt. Voorbeelden zijn bounds checks in de C++-bibliotheek van LLVM, een fix voor een vastloper in zstd bij een gemanipuleerd bestand, en een gemergede fix in mruby voor stringlengtes die bij 2 GiB overliepen.",
    allPrs: "Pull requests aan andere projecten ({count})",
    prMix: "{merged} gemerged, {open} open, {projects} projecten",
    groupMerged: "{n} gemerged",
    groupOpen: "{n} open",
    stateMerged: "gemerged",
    stateOpen: "open",
    months: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
    aboutTitle: "Met wie je samenwerkt",
    role: "Performance engineer voor AI- en backendsystemen",
    aboutText: (
      <>
        Ik ben software engineer in Nederland, en <strong>ik ben gespecialiseerd in performance</strong>. Performanceproblemen{" "}
        <em>vallen vaak tussen wal en schip</em>. Het symptoom is een trage API of een duur AI-model, en de oorzaak zit in een
        queryplan, een runtime of een GPU-kernel. Ik werk op al die lagen, dus{" "}
        <strong>één persoon volgt het probleem van het symptoom tot de oplossing</strong>. Dat doe ik in jouw codebase, met jouw
        tools. vLLM en llama.cpp waren ooit codebases die ik nog nooit had gezien, en duizenden andere specialisten hadden ze al
        geoptimaliseerd. <em>Toch vond ik in allebei flinke snelheidswinst.</em>
      </>
    ),
    ctaTitle: "Draait er iets trager dan het zou moeten?",
    ctaText: (
      <>
        Mail me wat traag is, waar het draait en welk resultaat je wilt, zoals een doel voor latency of kosten.{" "}
        <span>Ken je de technische details niet? Beschrijf dan wat traag is of wat het kost, dan vraag ik de rest.</span>
      </>
    ),
    mailSubject: "Iets in ons systeem is traag",
    socialAria: { linkedin: "LinkedIn-profiel", github: "GitHub-profiel", x: "X-profiel", discord: "Discord-profiel" },
    buildingTitle: "Waar ik verder aan bouw",
    building: [
      {
        tag: "in ontwikkeling",
        text: "Compileert WebAssembly naar Luau. Tien echte programma's, waaronder SQLite en QuickJS, geven dezelfde uitvoer als de referentie in wasmtime.",
      },
      {
        tag: "in ontwikkeling",
        text: "Een simulator in Rust en CUDA voor een volledig vliegenbrein, alle 165.122 neuronen, met zelfgeschreven en geoptimaliseerde CPU- en GPU-kernels. Eén gesimuleerde seconde draait in 0,37 s op een videokaart voor consumenten (RTX 3070 Ti).",
      },
      {
        tag: "in ontwikkeling",
        text: "Een commandlinetool die stille vertragingen opspoort in zelf gehoste LLM-serving. Elke regel komt uit een gemeten praktijkgeval.",
      },
    ],
  },
  privacy: {
    title: "Privacy",
    description: "Wat deze site en mijn e-mails met persoonsgegevens doen, en hoe je bezwaar maakt.",
    back: "Terug naar de startpagina",
    lede: (
      <>
        Ik ben Ilyas Mallah, handelend onder de naam I. Mallah Development (KvK 98045024), Torenlaan 5 B, 1402 AT Bussum, Nederland.
        Ik ben de verwerkingsverantwoordelijke. Contact: <a href="mailto:ilyas@ilyasm.dev">ilyas@ilyasm.dev</a>.
      </>
    ),
    sections: [
      {
        title: "Deze website",
        paragraphs: [
          "De site is statisch en staat op GitHub Pages. Er zijn geen formulieren, geen accounts en geen cookies. Cloudflare Web Analytics telt paginaweergaven en verwerkt daarvoor je IP-adres, zonder cookies en zonder je over andere sites te volgen. De lettertypen komen van deze site zelf. Je browser bewaart twee instellingen in de lokale opslag op je apparaat: licht of donker thema, en de taal die je kiest. Die krijg ik nooit te zien.",
        ],
      },
      {
        title: "E-mail die je mij stuurt",
        paragraphs: [
          "Ik bewaar je bericht en mijn antwoord in mijn mailbox (Spacemail, doorgestuurd naar Gmail) zolang het gesprek nuttig is. Twee jaar na het laatste bericht verwijder ik het. Als we samenwerken, bewaar ik facturen en contracten zeven jaar, omdat de Nederlandse belastingwet dat verplicht.",
        ],
      },
      {
        title: "E-mail die ik als eerste stuur",
        paragraphs: [
          "Soms mail ik iemand bij een bedrijf over performancewerk. Ik gebruik dan je naam, zakelijke e-mailadres en functie van de website van het bedrijf zelf. Ik noteer ook wat mijn aandacht trok, zoals een blogpost, een vacature of een opensourceproject. Ik koop geen lijsten en ik gok geen adressen.",
          "Mijn grondslag is gerechtvaardigd belang (AVG art. 6 lid 1 onder f). Die afweging maakte ik zo. Ik benader je over je eigen werk, ik stuur één persoonlijk bericht, en je kunt het meteen stoppen. Hoor ik niets, dan verwijder ik je gegevens na 12 maanden.",
          <>
            Wil je geen berichten meer, antwoord dan &ldquo;nee&rdquo; of mail me. Ik bewaar alleen je adres op een uitsluitingslijst, zodat ik je
            nooit meer benader. Ik verkoop of deel je gegevens niet.
          </>,
        ],
      },
      {
        title: "Jouw rechten",
        paragraphs: [
          <>
            Je kunt me vragen om inzage in je gegevens, om ze te corrigeren of te wissen, of om ze niet meer te gebruiken. Je kunt ook op elk
            moment bezwaar maken tegen mijn e-mails. Mail me en ik antwoord binnen een maand. Je kunt een klacht indienen bij de{" "}
            <Ext href="https://autoriteitpersoonsgegevens.nl/" note="nl">
              Autoriteit Persoonsgegevens
            </Ext>
            , de Nederlandse privacytoezichthouder.
          </>,
        ],
      },
    ],
  },
};

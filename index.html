<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ruben Cej - Portfolio</title>
    
    <!-- Carichiamo un font monospazio carino (Fira Code) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Non usiamo Tailwind qui, la stilizzazione è molto specifica -->
    <style>
        :root {
            --bg-color: #1e1e2e;      /* Sfondo (Catppuccin Mocha Base) */
            --fg-color: #cdd6f4;      /* Testo (Catppuccin Mocha Text) */
            --prompt-color: #a6e3a1;  /* Verde (Prompt) */
            --link-color: #89b4fa;      /* Blu (Link) */
            --error-color: #f38ba8;     /* Rosso (Errori) */
            --welcome-color: #cba6f7; /* Viola (Benvenuto) */
            --border-color: #b4f9f8;  /* Ciano (Focus) */
        }

        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-color);
            color: var(--fg-color);
            font-family: 'Fira Code', 'Courier New', monospace;
            font-size: 16px;
            line-height: 1.5;
        }

        /* Contenitore principale del terminale */
        .terminal-window {
            width: 100%;
            height: 100%;
            overflow-y: auto;
            box-sizing: border-box; /* Per padding corretto */
            padding: 20px;
            cursor: text; /* Cursore a testo ovunque */
        }

        /* Area dove vengono stampati i risultati */
        #output {
            white-space: pre-wrap; /* Mantiene a-capo e spazi */
        }

        /* La riga di input corrente */
        .command-line {
            display: flex;
        }

        /* Il prompt (es. 'ruben@portfolio:~$') */
        .prompt {
            color: var(--prompt-color);
            white-space: nowrap; /* Non va a capo */
            margin-right: 8px;
        }

        /* L'input utente vero e proprio */
        #input {
            background: transparent;
            border: none;
            outline: none;
            color: var(--fg-color);
            font: inherit; /* Stessa font del body */
            flex-grow: 1; /* Occupa lo spazio rimanente */
            caret-color: var(--fg-color); /* Cursore lampeggiante */
            padding: 0;
        }
        
        /* Stile per i comandi già eseguiti */
        .executed-command .prompt {
            color: var(--prompt-color);
        }
        
        .executed-command .user-input {
            color: var(--fg-color);
        }

        /* Stili per output specifici */
        .output-line a {
            color: var(--link-color);
            text-decoration: underline;
        }

        .output-error {
            color: var(--error-color);
        }
        
        .output-welcome {
            color: var(--welcome-color);
        }

        /* Nasconde il cursore finto quando l'input non è focus */
        #input:not(:focus) + .fake-cursor {
            display: none;
        }
    </style>
</head>
<body>

    <div class="terminal-window" id="terminal">
        <!-- L'output dei comandi verrà inserito qui da JavaScript -->
        <div id="output"></div>
        
        <!-- La riga di input attiva -->
        <div class="command-line" id="input-line">
            <span class="prompt">ruben@portfolio:~$</span>
            <input type="text" id="input" autofocus autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
        </div>
    </div>

    <script>
        // Elementi DOM
        const terminal = document.getElementById('terminal');
        const output = document.getElementById('output');
        const inputLine = document.getElementById('input-line');
        const input = document.getElementById('input');

        // Cronologia comandi per frecce Su/Giù
        let commandHistory = [];
        let historyIndex = -1;

        // Dati del portfolio
        const portfolioData = {
            bio: `Appassionato di informatica di 19 anni con una solida competenza pratica, sviluppata da autodidatta, nella gestione di sistemi operativi Linux (inclusa configurazione e uso avanzato della riga di comando).
Conoscenza informatica di base e familiarità con il linguaggio Lua.
Attualmente sto ampliando le mie competenze attraverso lo studio di Java e C.
Determinato e motivato, cerco un'opportunità di livello entry-level (come apprendistato o stage) per applicare le mie abilità tecniche e imparare sul campo.`,
            
            competenze: `
Sistemi Operativi:
  - Ottima conoscenza di SO Linux (gestione da riga di comando, configurazione di base).
  - Buona conoscenza di Windows.

Programmazione:
  - Esperienza di base con il linguaggio Lua.
  - Studio in corso di Java e C.

Software:
  - Conoscenza di base del pacchetto Microsoft Office.

Conoscenze Generali:
  - Informatica di base (Hardware, Software, Reti).
`,
            contatti: `
Email:     <a href="mailto:kaedekita@proton.me">kaedekita@proton.me</a>
GitHub:    <a href="https://github.com/astr0fel1s" target="_blank">github.com/astr0fel1s</a>
Curriculum: Puoi richiedermi il mio CV aggiornato via email.
`,
            progetti: `
Al momento, i miei progetti principali sono legati allo studio e alla configurazione dei miei sistemi.

1. Dotfiles (Configurazioni Linux):
   - Un repository contenente le mie configurazioni personalizzate per .bashrc, Neovim, e altri tool.
   - Stato: In corso.

2. Script di Automazione (Bash):
   - Piccoli script per automatizzare task di manutenzione sul mio server.
   - Stato: Disponibili su richiesta.

(Puoi vedere i miei progetti futuri sul mio profilo GitHub)
`
        };

        // Definizione dei comandi disponibili
        const commands = {
            'help': () => {
                return `
Comandi disponibili:
  <span class="output-welcome">help</span>        Mostra questa lista di comandi.
  <span class="output-welcome">chi_sono</span>    Mostra una breve biografia.
  <span class="output-welcome">competenze</span>  Elenca le mie competenze tecniche.
  <span class="output-welcome">progetti</span>    Mostra i progetti a cui sto lavorando.
  <span class="output-welcome">contatti</span>    Mostra come contattarmi.
  <span class="output-welcome">cv</span>          Vedi 'contatti'.
  <span class="output-welcome">clear</span>       Pulisce lo schermo del terminale.
  <span class="output-welcome">benvenuto</span>   Mostra il messaggio di benvenuto.
`;
            },
            'chi_sono': () => portfolioData.bio,
            'bio': () => portfolioData.bio, // Alias
            'whoami': () => portfolioData.bio, // Alias
            'competenze': () => portfolioData.competenze,
            'skills': () => portfolioData.competenze, // Alias
            'progetti': () => portfolioData.progetti,
            'projects': () => portfolioData.progetti, // Alias
            'contatti': () => portfolioData.contatti,
            'contacts': () => portfolioData.contatti, // Alias
            'cv': () => `Vedi la sezione 'contatti' per richiedere il mio CV.`,
            'clear': () => {
                output.innerHTML = '';
                return ''; // Non stampa nulla
            },
            'benvenuto': () => {
                return `
<span class="output-welcome">
 ____  ____  ____ ____  ____  __ _  ____  ____    ____  ____  _____ 
(  _ \\(  _ \\(  _ (  _ \\(  _ \\(  ( \\(  __)(  _ \\  (  _ \\(  _ \\(  _  )
 ) __/ ) __/ )   / ) _/ ) __//    / ) _)  )   /   ) __/ ) __/ )(_)( 
(__)  (__)  (__\\_)(____/(__)  \\_)__)(____)(__\\_)  (__)  (__)  (_____)
</span>
Benvenuto nel mio portfolio interattivo.
Sono Ruben Cej, un appassionato di Linux e programmazione.

Digita <span class="output-welcome">'help'</span> per vedere la lista dei comandi disponibili.
`;
            }
        };
        
        // Elenco comandi per autocompletamento
        const commandList = Object.keys(commands);

        // --- FUNZIONI PRINCIPALI ---

        /** Funzione chiamata quando l'utente preme Invio */
        function processCommand() {
            const commandText = input.value.trim();

            // Clona la riga di input e la "stampa" nell'output
            logExecutedCommand(commandText);

            // Aggiungi alla cronologia solo se non è vuoto
            if (commandText) {
                commandHistory.unshift(commandText); // Aggiunge all'inizio
                if (commandHistory.length > 50) commandHistory.pop(); // Limita la cronologia
            }
            historyIndex = -1; // Resetta l'indice della cronologia

            // Pulisce l'input
            input.value = '';

            // Se il comando è vuoto, non fare nulla se non creare una nuova riga
            if (!commandText) {
                scrollToBottom();
                return;
            }

            // Trova ed esegui il comando
            const commandFunc = commands[commandText.toLowerCase()];
            let commandOutput = '';

            if (commandFunc) {
                commandOutput = commandFunc();
            } else {
                commandOutput = `<span class="output-error">Comando non trovato: ${escapeHTML(commandText)}</span>
Digita 'help' per la lista dei comandi.`;
            }

            // Stampa l'output del comando
            if (commandOutput) {
                printOutput(commandOutput);
            }
            
            scrollToBottom();
        }

        /** Stampa una riga nell'area output */
        function printOutput(htmlContent) {
            const newLine = document.createElement('div');
            newLine.classList.add('output-line');
            newLine.innerHTML = htmlContent;
            output.appendChild(newLine);
        }

        /** Stampa il comando che l'utente ha appena eseguito */
        function logExecutedCommand(commandText) {
            const executedLine = document.createElement('div');
            executedLine.classList.add('executed-command');
            
            executedLine.innerHTML = `<span class="prompt">ruben@portfolio:~$</span><span class="user-input">${escapeHTML(commandText)}</span>`;
            output.appendChild(executedLine);
        }
        
        /** Gestisce la pressione dei tasti (Invio, Frecce, Tab) */
        function handleKeydown(e) {
            switch (e.key) {
                case 'Enter':
                    processCommand();
                    break;
                
                case 'ArrowUp':
                    e.preventDefault(); // Ferma il cursore dal muoversi
                    if (historyIndex < commandHistory.length - 1) {
                        historyIndex++;
                        input.value = commandHistory[historyIndex];
                        // Sposta il cursore alla fine
                        input.selectionStart = input.selectionEnd = input.value.length;
                    }
                    break;
                
                case 'ArrowDown':
                    e.preventDefault();
                    if (historyIndex > 0) {
                        historyIndex--;
                        input.value = commandHistory[historyIndex];
                    } else {
                        // Siamo tornati all'inizio
                        historyIndex = -1;
                        input.value = '';
                    }
                    break;
                
                case 'Tab':
                    e.preventDefault(); // Ferma il focus dal cambiare
                    autocompleteCommand();
                    break;
            }
        }
        
        /** Gestisce l'autocompletamento con Tab */
        function autocompleteCommand() {
            const currentInput = input.value.toLowerCase();
            const suggestions = commandList.filter(cmd => cmd.startsWith(currentInput));
            
            if (suggestions.length === 1) {
                // Trovata corrispondenza unica
                input.value = suggestions[0];
            } else if (suggestions.length > 1) {
                // Trovate multiple, stampa suggerimenti
                logExecutedCommand(input.value); // Stampa cosa ha scritto
                printOutput(suggestions.join('    ')); // Stampa i suggerimenti
                scrollToBottom();
            }
        }
        
        /** Manda la view a fondo pagina */
        function scrollToBottom() {
            terminal.scrollTop = terminal.scrollHeight;
        }
        
        /** Utility per sanitizzare l'HTML */
        function escapeHTML(str) {
            return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }

        // --- EVENT LISTENERS ---

        // Focus sull'input quando si clicca ovunque
        terminal.addEventListener('click', () => {
            input.focus();
        });

        // Gestisce la pressione dei tasti
        input.addEventListener('keydown', handleKeydown);

        // --- INIZIALIZZAZIONE ---
        
        // Stampa il messaggio di benvenuto all'avvio
        printOutput(commands['benvenuto']());
        scrollToBottom();

    </script>

</body>
</html>

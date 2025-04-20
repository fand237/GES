import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const LeconGen = () => {
    const [prompt, setPrompt] = useState('');
    const [lecon, setLecon] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const textareaRef = useRef(null);

    // Configuration OpenAI
    const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    const MODEL_NAME = "ft:gpt-4o-mini-2024-07-18:personal:lecon-gen-20250416:BMwC7jaZ";

    // Formatage de la réponse (similaire à votre Python)
    const formatResponse = (text) => {
        let formatted = text
            .replace(/(?:^|\n)([IVX]+\. .+?)(?=\s*[A-Z0-9])/g, '\n\n$1')
            .replace(/(?:^|\n)(\d+\.\d+\.\s.+?)(?=\s*[A-Z0-9])/g, '\n\n$1')
            .replace(/(?:^|\n)(\d+\.\d+\s.+?)(?=\s*[A-Z0-9])/g, '\n\n$1')
            .replace(/(🎯 .+?:)/g, '\n$1\n')
            .replace(/\s*(\d+\.)/g, '\n$1');

        return formatted.trim();
    };

    // Générer une leçon
    const generateLecon = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setLecon('Génération en cours...');

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: MODEL_NAME,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.5,
                    max_tokens: 2000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const generatedText = response.data.choices[0].message.content;
            const formattedLecon = formatResponse(generatedText);

            setLecon(formattedLecon);
            setHistory(prev => [...prev, { prompt, lecon: formattedLecon }]);
        } catch (error) {
            console.error('Erreur:', error);
            setLecon('Erreur lors de la génération. Veuillez réessayer.',error);
        } finally {
            setIsLoading(false);
        }
    };

    // Ajuster la hauteur du textarea automatiquement
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [lecon]);

    // Exemples de prompts prédéfinis
    const presetPrompts = [
        "Crée une leçon sur les systèmes d'information en Terminale TI",
        "Propose une leçon sur les réseaux informatiques pour lycée",
        "Génère un cours sur les bases de données relationnelles"
    ];

    return (
        <div className="lecon-generator">
            <h1>Générateur de Leçons Pédagogiques</h1>

            <div className="input-section">
                <div className="preset-prompts">
                    <h3>Exemples :</h3>
                    {presetPrompts.map((preset, index) => (
                        <button
                            key={index}
                            onClick={() => setPrompt(preset)}
                            disabled={isLoading}
                        >
                            {preset.length > 50 ? `${preset.substring(0, 50)}...` : preset}
                        </button>
                    ))}
                </div>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Décrivez la leçon que vous souhaitez générer, par exemple : 'Crée une leçon sur les systèmes d'information pour une classe de Terminale'"
                    disabled={isLoading}
                />

                <button className="button-lg button-lg:hover button-lg:disabled"
                    onClick={generateLecon}
                    disabled={isLoading || !prompt.trim()}
                >
                    {isLoading ? 'Génération en cours...' : 'Générer la leçon'}
                </button>
            </div>

            <div className="output-section">
                <h2>Leçon Générée :</h2>
                <textarea
                    ref={textareaRef}
                    value={lecon}
                    readOnly
                    className="lecon-output"
                />

                <div className="actions">
                    <button className="button-lg button-lg:hover button-lg:disabled"
                        onClick={() => navigator.clipboard.writeText(lecon)}
                        disabled={!lecon.trim()}
                    >
                        Copier la leçon
                    </button>
                    <button className="button-lg button-lg:hover button-lg:disabled"
                        onClick={() => {
                            const blob = new Blob([lecon], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `lecon-${new Date().toISOString().slice(0,10)}.txt`;
                            a.click();
                        }}
                        disabled={!lecon.trim()}
                    >
                        Télécharger
                    </button>
                </div>
            </div>

            {history.length > 0 && (
                <div className="history-section">
                    <h3>Historique des générations</h3>
                    <div className="history-items">
                        {history.slice().reverse().map((item, index) => (
                            <div key={index} className="history-item">
                                <p><strong>Prompt :</strong> {item.prompt}</p>
                                <button className="button-lg button-lg:hover button-lg:disabled" onClick={() => setLecon(item.lecon)}>Voir</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeconGen;
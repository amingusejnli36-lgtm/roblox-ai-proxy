export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { prompt } = req.body;
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    { role: "system", content: "Ты - мастер Roblox Luau. Пиши только код." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        if (data.error) return res.status(401).json({ error: data.error.message });
        
        res.status(200).json({ code: data.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

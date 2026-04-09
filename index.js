export default async function handler(req, res) {
    // Разрешаем Roblox доступ к серверу
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Используй POST запрос' });
    }

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
                    { 
                        role: "system", 
                        content: "Ты — элитный разработчик Roblox Luau. Пиши только чистый код. Используй современные стандарты (task.wait, task.spawn, строгое типизирование). Не пиши пояснений, только код и краткие комментарии внутри него." 
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.2 // Делаем ответы более точными и техническими
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            return res.status(200).json({ code: data.choices[0].message.content });
        } else {
            throw new Error("Ошибка API Groq");
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

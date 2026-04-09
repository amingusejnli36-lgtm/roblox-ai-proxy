export default async function handler(req, res) {
  // Настройка заголовков для Roblox
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
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
            content: "Ты - эксперт по Roblox Luau. Пиши только чистый код. Используй современные методы: task.wait(), task.spawn()." 
          },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const aiCode = data.choices[0].message.content;

    return res.status(200).json({ code: aiCode });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

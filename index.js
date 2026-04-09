const { createServer } = require('http');

module.exports = async (req, res) => {
  // Настройка заголовков для работы с Roblox
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { prompt } = JSON.parse(body);

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama3-70b-8192", // Очень мощная модель для кода
            messages: [
              { 
                role: "system", 
                content: "Ты - эксперт по Roblox Luau. Пиши только чистый код. Используй современные методы: task.wait(), task.spawn(), строгую типизацию. Не пиши лишних слов, только код и краткие комментарии." 
              },
              { role: "user", content: prompt }
            ]
          })
        });

        const data = await response.json();
        const aiCode = data.choices[0].message.content;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ code: aiCode }));
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  }
};

// oracle-api-server.js
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/oracle-chat', async (req, res) => {
  const { question, userProfile } = req.body;

  const systemPrompt = `You are a metaphysical guide. Use the user's chart data to give personalized spiritual advice. Be kind, clear, and precise.`;

  const userContext = `
    Sun Sign: ${userProfile.astrology.sun_sign}
    Human Design: ${userProfile.human_design.type}, ${userProfile.human_design.authority}
    Chinese Zodiac: ${userProfile.bazi.animal_sign}, Element: ${userProfile.bazi.day_master}
    Numerology: Life Path ${userProfile.numerology.life_path}
    Chakra: Heart is ${userProfile.chakra.heart}, Crown is ${userProfile.chakra.crown}
  `;

  const prompt = `${systemPrompt}\n\nUser's chart:\n${userContext}\n\nQuestion: ${question}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
    });

    const answer = completion.choices[0].message.content;
    res.json({ response: answer });
  } catch (error) {
    console.error('Oracle error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(port, () => console.log(`🧙 Oracle API live at http://localhost:${port}`));

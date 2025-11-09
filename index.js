import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req,file,cb)=> cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const memories = {};

function recordMemory(userId, role, content){
  if(!userId) userId='anon';
  if(!memories[userId]) memories[userId]=[];
  memories[userId].push({role, content});
  if(memories[userId].length>20) memories[userId].shift();
}

// chat endpoint using OpenAI (gpt-4 default, fallback to gpt-3.5-turbo)
app.post('/api/chat', async (req,res)=>{
  try{
    const { userId='anon', message='' } = req.body;
    if(!message) return res.status(400).json({ error: 'No message' });

    const lower = message.toLowerCase();
    if(lower.includes('who created you') || lower.includes('your creator') || lower.includes('who made you')){
      const creator = `I was created by Akin Saye Sokpah. Email: sokpahakinsaye81@gmail.com. Facebook: https://www.facebook.com/profile.php?id=61583456361691. He studies at Smythe University College, Sinkor, Liberia.`;
      recordMemory(userId, 'assistant', creator);
      return res.json({ reply: creator });
    }

    const system = `You are ChatKin AI (FLEXIBLE AI). Be helpful, concise, and safe.`;
    const history = memories[userId] ? memories[userId].slice(-8) : [];
    const messages = [{ role: 'system', content: system }, ...history, { role: 'user', content: message }];

    const openaiKey = process.env.OPENAI_API_KEY;
    if(!openaiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not set' });

    // prefer model in env OPENAI_MODEL, default to gpt-4, fallback to gpt-3.5-turbo on failure
    const preferred = process.env.OPENAI_MODEL || 'gpt-4';
    const modelsToTry = [preferred, 'gpt-3.5-turbo'];

    let finalReply = null;
    let lastError = null;

    for(const model of modelsToTry){
      try{
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.6,
            max_tokens: 800
          })
        });
        if(!resp.ok){
          const txt = await resp.text();
          lastError = { model, status: resp.status, body: txt };
          continue;
        }
        const data = await resp.json();
        const reply = data.choices?.[0]?.message?.content || 'Sorry, no reply.';
        finalReply = reply;
        break;
      }catch(err){
        lastError = { model, error: err.message };
        continue;
      }
    }

    if(!finalReply){
      console.error('OpenAI errors:', lastError);
      return res.status(500).json({ error: 'OpenAI request failed', detail: lastError });
    }

    recordMemory(userId, 'user', message);
    recordMemory(userId, 'assistant', finalReply);
    return res.json({ reply: finalReply });

  }catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// upload endpoint
app.post('/api/upload', upload.single('file'), async (req,res)=>{
  try{
    if(!req.file) return res.status(400).json({ error: 'No file' });
    const mimetype = req.file.mimetype || '';
    const saved = req.file.path;
    let snippet = '';
    if(mimetype.includes('pdf')){
      const buf = fs.readFileSync(saved);
      const pdf = await pdfParse(buf);
      snippet = pdf.text?.slice(0,3000) || '';
    } else if(mimetype.includes('officedocument') || mimetype.includes('word')){
      const doc = await mammoth.extractRawText({ path: saved });
      snippet = (doc.value || '').slice(0,3000);
    } else if(mimetype.startsWith('text/')){
      snippet = fs.readFileSync(saved, 'utf8').slice(0,3000);
    } else if(mimetype.startsWith('image/')){
      snippet = 'Image uploaded. Use the file URL to reference it.';
    } else {
      snippet = 'Uploaded.';
    }
    const publicUrl = `/uploads/${path.basename(saved)}`;
    return res.json({ message: 'File uploaded', url: publicUrl, filename: req.file.originalname, snippet });
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

// serve client
const clientDist = path.join(__dirname, '../client/dist');
if(fs.existsSync(clientDist)){
  app.use(express.static(clientDist));
  app.get('*', (req,res)=> res.sendFile(path.join(clientDist, 'index.html')));
} else {
  app.get('/', (req,res)=> res.send('ChatKin AI backend running. Client build not found.'));
}

const PORT = process.env.PORT || 5173;
app.listen(PORT, ()=> console.log(`ChatKin AI server listening on ${PORT}`));

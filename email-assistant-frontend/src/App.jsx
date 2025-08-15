import { useRef, useState } from 'react';
import ai from "./animations/ai.json";
import Lottie from "lottie-react";
import {
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlineDownload } from 'react-icons/ai';
import { FaBolt, FaCheckCircle, FaGoogle, FaJava, FaReact } from 'react-icons/fa';
import axios from 'axios';
import { image, replygenielogo } from './utils/constants';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [userIntent, setUserIntent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const installSectionRef = useRef(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent,
        tone,
        userIntent,
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
      toast.success('Reply Generated.');
    } catch (error) {
      toast.error('Failed to generate email reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

const handleDownload = () => {
  const link = document.createElement("a");
  link.href = "/replygenie-ext.zip"; // directly points to public file
  link.download = "replygenie-ext.zip"; // suggested download name
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success('Extension ZIP downloaded!');
  setDownloaded(true);

  setTimeout(() => {
    installSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
};


  return (
          <div className="max-w-6xl mx-auto space-y-10 pt-10 md:pt-10">
            <Toaster position="top-right" />

          {/* header */}
          <header className="flex flex-col items-center text-center">
            <div className="inline-flex items-center space-x-2 md:space-x-3">
              <img
                src={replygenielogo}
                alt="ReplyGenie Logo"
                className="w-14 h-14 md:w-16 md:h-16 object-contain"
              />
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="text-slate-700">Reply</span>
                <span className="text-violet-600">Genie</span>
              </h1>
            </div>

            <p className="mt-1 text-sm md:text-base text-gray-500 tracking-wide italic">
            Smart AI. Instant replies. Made simple.
            </p>
          </header>




        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label="Original Email *"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="mb-5"
            />

            <FormControl fullWidth className="mb-5">
              <InputLabel>Tone</InputLabel>
              <Select
                value={tone}
                label="Tone"
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="polite">Polite</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
                <MenuItem value="angry">Angry</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="assertive">Assertive</MenuItem>
                <MenuItem value="apologetic">Apologetic</MenuItem>
                <MenuItem value="appreciative">Appreciative</MenuItem>
                <MenuItem value="empathetic">Empathetic</MenuItem>
                <MenuItem value="neutral">Neutral</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              label="Your Intent"
              value={userIntent}
              onChange={(e) => setUserIntent(e.target.value)}
              className="mb-5"
            />

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              fullWidth
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
            </Button>
          </section>

          {/* Reply Display Section */}
          <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 min-h-[300px] flex flex-col justify-between">
          {generatedReply ? (
            <>
              <div>
                <Typography variant="h6" gutterBottom>
                  Generated Reply
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  variant="outlined"
                  value={generatedReply}
                  onChange={(e) => setGeneratedReply(e.target.value)}
                  className="mb-4"
                />
              </div>
              <Button
                variant="outlined"
                onClick={() => {
                  navigator.clipboard.writeText(generatedReply);
                  toast.success('Copied to clipboard!');
                }}
              >
                Copy to Clipboard
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-gray-500 h-full space-y-4">
              <Lottie animationData={ai} loop={true} className="w-60 h-60 opacity-80" />
              <p className="text-lg font-medium">No reply yet</p>
              <p className="text-sm text-gray-400">Start by entering an email and selecting your tone. We'll craft a reply for you!</p>
            </div>
          )}
        </section>

        </main>

        {/* Extension Download Section */}
        <section className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-center text-center">
            <div className="md:pr-6">
              <h2 className="text-2xl font-semibold mb-2">Use in Gmail as Extension</h2>
              <p className="text-gray-600 mb-5">Download and integrate with Gmail for instant AI replies</p>
              <Button
                variant="contained"
                color="success"
                startIcon={<AiOutlineDownload />}
                onClick={handleDownload}
              >
                Download ReplyGenie Extension
              </Button>
            </div>

            {generatedReply && (
              <div className="flex flex-col items-center mt-6 md:mt-0">
                <Lottie animationData={ai} loop={true} className="w-40 h-40" />
                <p className="text-sm text-gray-500">Your AI assistant is ready in Gmail!</p>
              </div>
            )}
          </div>
        </section>

        {/* How to Install Section */}
        {downloaded && (
          <section ref={installSectionRef} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <img
            src={image}
            alt="Preview"
            className="rounded-lg mb-3 w-[950px] mx-auto border shadow-sm object-cover"
          />
            <h3 className="text-xl font-bold mb-2">How to Install the Chrome Extension</h3>
            <ol className="list-decimal pl-6 text-left text-gray-700 space-y-2">
              <li>Unzip the downloaded file</li>
              <li>Open Chrome and go to <b>chrome://extensions</b></li>
              <li>Enable <b>Developer Mode</b></li>
              <li>Click <b>"Load unpacked"</b></li>
              <li>Select the unzipped folder</li>
              <li>You're ready to use ReplyGenie! ✨</li>
            </ol>
            <div className="mt-4 text-green-600 flex items-center gap-2">
              <FaCheckCircle /> Ready to go!
            </div>
          </section>
        )}


      <footer className="mt-10 mb-10 border-t pt-4 flex flex-col items-center text-sm text-gray-600">
        <div className="flex items-center gap-2 mb-1">
          <FaJava className="text-xl text-[#E76F00]" title="Spring Boot" />
          <FaReact className="text-xl text-[#61DBFB]" title="React.js" />
          <FaGoogle className="text-xl text-[#4285F4]" title="Gemini AI" />
          <span className="ml-2">Built with Spring Boot, React & Gemini AI</span>
        </div>
        <div>
          <span className="mt-1 flex items-center gap-1">
          <FaBolt className="text-yellow-500" />
          <a href="mailto:udaysalvi774@gmail.com" className="text-green-600 hover:underline">
            Uday Salvi
          </a>
        </span>
        </div>
      </footer>
      </div>
  );
}

export default App;

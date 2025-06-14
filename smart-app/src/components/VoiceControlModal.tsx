import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceControlModal({ isOpen, onClose }: VoiceControlModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const speechRecognition = new (window as any).webkitSpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = 'en-US';

      speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          processVoiceCommand(finalTranscript);
        }
      };

      speechRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(speechRecognition);
    }
  }, []);

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Simple command processing (in a real app, this would be more sophisticated)
    if (lowerCommand.includes('turn off lights') || lowerCommand.includes('lights off')) {
      setTranscript("Turning off all lights...");
      // Would trigger API call to turn off lights
    } else if (lowerCommand.includes('lock door') || lowerCommand.includes('lock main door')) {
      setTranscript("Locking main door...");
      // Would trigger API call to lock door
    } else if (lowerCommand.includes('temperature') || lowerCommand.includes('what is the temperature')) {
      setTranscript("The current temperature is 24°C");
      // Would fetch and display temperature
    } else if (lowerCommand.includes('rainy day') || lowerCommand.includes('rain mode')) {
      setTranscript("Activating rainy day mode...");
      // Would trigger rainy day automation
    } else {
      setTranscript(`Command received: "${command}". Feature not implemented yet.`);
    }

    // Auto-close after a few seconds
    setTimeout(() => {
      onClose();
      setTranscript("");
    }, 3000);
  };

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      setTranscript("");
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleClose = () => {
    stopListening();
    onClose();
    setTranscript("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center">
          <div className="w-20 h-20 smart-home-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="text-white text-2xl" />
          </div>
          
          <h3 className="text-xl font-bold text-neutral-800 mb-2">Voice Control</h3>
          
          {isListening ? (
            <>
              <p className="text-neutral-600 mb-6">Listening... Say a command</p>
              <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
                <div className="smart-home-gradient h-2 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </>
          ) : (
            <p className="text-neutral-600 mb-6">
              {transcript || 'Click the microphone to start voice control'}
            </p>
          )}

          {transcript && !isListening && (
            <div className="bg-neutral-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-neutral-700">{transcript}</p>
            </div>
          )}

          <div className="space-y-2">
            {!isListening ? (
              <Button
                onClick={startListening}
                className="w-full bg-primary text-white hover:bg-primary/90"
                disabled={!recognition}
              >
                <Mic className="mr-2 h-4 w-4" />
                Start Listening
              </Button>
            ) : (
              <Button
                onClick={stopListening}
                variant="destructive"
                className="w-full"
              >
                <MicOff className="mr-2 h-4 w-4" />
                Stop Listening
              </Button>
            )}
            
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          </div>

          {!recognition && (
            <p className="text-xs text-neutral-500 mt-4">
              Voice recognition not supported in this browser
            </p>
          )}
          
          <div className="mt-6 text-xs text-neutral-500">
            <p className="font-medium mb-1">Try saying:</p>
            <p>"Turn off lights" • "Lock main door" • "What's the temperature?"</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

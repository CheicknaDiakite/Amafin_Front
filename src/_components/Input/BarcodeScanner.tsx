import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [resultText, setResultText] = useState<string>('');

  useEffect(() => {
    // Instanciation du lecteur ZXing
    const codeReader = new BrowserMultiFormatReader();
    console.log('ZXing code reader initialisé');

    if (videoRef.current) {
      // La méthode decodeFromVideoDevice prend en paramètre l'ID du périphérique
      // Si null, le navigateur sélectionnera par défaut un appareil
      codeReader.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result: Result | undefined) => {
          if (result) {
            const text = result.getText();
            console.log('Code détecté :', text);
            setResultText(text);
            onScan(text);
            codeReader.reset();
          }          
        }
      );
    }

    // Nettoyage lors du démontage du composant
    return () => {
      codeReader.reset();
    };
  }, [onScan]);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Scanner de Code-Barres (Gest Stocks)</h1>
      <video
        ref={videoRef}
        style={{ width: '100%', maxWidth: '100%' }}
        autoPlay
        muted
      />
      <p>
        Résultat : <strong>{resultText}</strong>
      </p>
      
    </div>
  );
};

export default BarcodeScanner;

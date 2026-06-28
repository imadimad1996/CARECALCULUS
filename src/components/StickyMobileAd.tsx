import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function StickyMobileAd() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] border-t border-gray-200">
      <div className="relative w-full flex justify-center items-center h-[60px]">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-0 top-0 -mt-3 mr-1 bg-white border border-gray-200 rounded-full p-0.5 shadow-sm text-gray-500 hover:text-gray-800 z-10"
          aria-label="Close Ad"
        >
          <X className="w-4 h-4" />
        </button>
        
        {/* We can re-use the Native Banner or a specific 320x50 Adsterra Tag. 
            For now, we'll embed the native banner in a small container. */}
        <div className="w-[320px] h-[50px] overflow-hidden flex items-center justify-center">
            <iframe
              title="Mobile Banner Ad"
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <style>
                      body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
                    </style>
                  </head>
                  <body>
                    <script type="text/javascript">
                        atOptions = {
                            'key' : '44cfd4429085b087e60c41dbe6b342fe',
                            'format' : 'iframe',
                            'height' : 50,
                            'width' : 320,
                            'params' : {}
                        };
                    </script>
                    <script type="text/javascript" src="//pl29869264.effectivecpmnetwork.com/44cfd4429085b087e60c41dbe6b342fe/invoke.js"></script>
                  </body>
                </html>
              `}
              width="320"
              height="50"
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
            />
        </div>
      </div>
    </div>
  );
}

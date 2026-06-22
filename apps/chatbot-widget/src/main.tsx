import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@ai-hub/ui';
import '@ai-hub/ui/src/tokens/global.css';
import { Widget } from './Widget';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <Widget />
    </ThemeProvider>
  </StrictMode>
);

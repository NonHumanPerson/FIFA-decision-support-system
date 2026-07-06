import '@testing-library/jest-dom';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = function() {};

// Mock dompurify
vi.mock('dompurify', () => {
  return {
    default: {
      sanitize: (str: string) => str
    }
  };
});

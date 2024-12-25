declare global {
    interface Window {
      windyInit: (options: object, callback: (windyAPI: any) => void) => void;
    }
  }
  
  export {};

# Crossframe Chat

**Crossframe Chat** is a basic demo application that renders two independent chat components inside iframes.    
Each chat operates in isolation within its iframe, managed by a parent container component.

The project is designed as a foundation for experimenting with iframe-based communication,    
which can later be extended into a true **cross-domain messaging** setup.
  
---  

## Tech Stack

- [Next.js 14+](https://nextjs.org/) — React framework
- [shadcn/ui](https://ui.shadcn.com/) — Component library built on Tailwind CSS
- [TypeScript](https://www.typescriptlang.org/) — Static typing
- [Lucide Icons](https://lucide.dev/) — Icon set
- [Vercel](https://vercel.com/) — Hosting and deployment
- [GitHub Actions](https://github.com/features/actions) — CI/CD automation

---  

## Project Overview

The app contains a parent component that embeds two iframes — each running a simple chat UI (Chat A and Chat B).
These iframes exchange messages in real time using the window.postMessage API, allowing cross-frame communication managed by the parent component..

```plaintext  
Parent App  
├── iframe: Chat A  
└── iframe: Chat B  
```  

## Repository Structure

```  
crossframe-chat/  
├── app/  
│   ├── chat-a/          # Chat A component  
│   ├── chat-b/          # Chat B component  
│   └── page.tsx         # Parent component embedding both iframes  
├── public/avatars/       # User avatars  
├── components/ui/        # shadcn/ui components  
└── .github/workflows/    # CI/CD configuration files  
```  
## Local Development

Clone the repository
``` 
git clone git@github.com:ronixclh/crossframe-chat.git  
``` 
Navigate into the project directory
``` 
cd crossframe-chat  
``` 
Install dependencies
``` 
npm install  
``` 
Start the development server
``` 
npm run dev
``` 
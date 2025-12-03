# 📄 DocuChat - Intelligent RAG Knowledge Base

![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-121212?style=for-the-badge&logo=chainlink&logoColor=white)
![Pinecone](https://img.shields.io/badge/Pinecone-000000?style=for-the-badge&logo=pinecone&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

> **DocuChat** è una piattaforma RAG (Retrieval-Augmented Generation) che trasforma documentazione statica in PDF in un motore di intelligenza conversazionale interattivo. Il sistema permette agli utenti di conversare con i propri documenti per ottenere risposte istantanee con citazioni delle fonti.

---

## 📖 Indice
- [Panoramica](#-panoramica)
- [Architettura e Tecnologie](#-architettura-e-tecnologie)
- [Funzionalità Principali](#-funzionalità-principali)
- [Interfaccia](#-interfaccia)
- [Installazione e Avvio](#-installazione-e-avvio)
- [Configurazione Avanzata](#-configurazione-avanzata)
- [Autore](#-autore)

---

## 🔭 Panoramica

Il progetto nasce per risolvere il problema della ricerca inefficiente in documentazione non strutturata. Le aziende annegano in dati sparsi (manuali, contratti legali, policy HR), rendendo difficile trovare risposte specifiche senza scorrere centinaia di pagine. DocuChat offre una soluzione intelligente che comprende semanticamente i documenti e permette ricerche conversazionali istantanee.

### Punti di Forza
* **Ricerca Semantica Avanzata:** Comprende l'intento dell'utente oltre il semplice matching di parole chiave, utilizzando embeddings vettoriali.
* **Citazioni Verificabili:** Ogni risposta AI include numeri di pagina specifici per garantire affidabilità e tracciabilità delle informazioni.
* **Supporto Multilingua:** Completamente capace di comprendere e rispondere in italiano, inglese e altre lingue principali.

---

## 🛠 Architettura e Tecnologie

Il sistema opera su una pipeline semplificata in due fasi: **Ingestion** (caricamento) e **Retrieval** (recupero con RAG), implementando un'architettura moderna e scalabile.

### Backend (AI Stack)
* **Framework:** Next.js 14 con **App Router** e Server Actions.
* **AI Orchestration:** **LangChain** per gestione catena RAG e operazioni AI.
* **Vector Database:** **Pinecone** per ricerca semantica ad alta velocità con Namespaces per isolamento dati.
* **LLM:** **Google Gemini** (`gemini-1.5-flash` default, compatibile con Free Tier).

### Frontend (Modern React)
* **Core:** Next.js 14 con **TypeScript** per type safety e manutenibilità.
* **UI & Styling:** Design system moderno con interfaccia drag-and-drop intuitiva.
* **Real-time Chat:** Sistema di messaggistica conversazionale con streaming delle risposte.

---

## ✨ Funzionalità Principali

### 📤 Upload e Ingestion
* **Drag & Drop Interface:** Caricamento intuitivo di documenti PDF.
* **Processing Pipeline:** Il PDF viene pulito, diviso in chunk di testo, convertito in vettori matematici (embeddings) e memorizzato in Pinecone.
* **Document Management:** Visualizzazione e gestione dei documenti caricati.

### 💬 Chat Conversazionale
* **Context-Aware Retrieval:** Quando un utente pone una domanda, il sistema cerca in Pinecone i chunk più rilevanti e li invia a Gemini AI per generare una risposta accurata.
* **Source Citations:** Ogni risposta include riferimenti specifici alle pagine del documento originale.
* **Multilingual Support:** Puoi caricare un manuale in inglese e fare domande in italiano: l'AI tradurrà e sintetizzerà automaticamente la risposta.

### 🔒 Data Isolation
* **Namespace Management:** Utilizza Pinecone Namespaces per garantire che le ricerche siano strettamente limitate al documento specifico visualizzato.
* **Secure Storage:** Embeddings memorizzati in modo sicuro con accesso controllato.

---

## 📸 Interfaccia

![Upload Screen](./public/screenshot-upload.png)

### Chat Interface
QA in tempo reale con citazioni delle pagine sorgente.

![Chat Screen](./public/screenshot-chat.png)

---

## 💻 Installazione e Avvio

Segui questi passaggi per eseguire l'applicazione in locale.

### Prerequisiti
* **Node.js 18+**
* **Account Google AI Studio** (per API Gemini - Free Tier disponibile)
* **Account Pinecone** (Free Tier disponibile)

### 1. Configurazione Servizi Esterni
Prima di iniziare, assicurati di avere:
* **Google AI API Key:** Ottieni la chiave da [Google AI Studio](https://ai.google.dev/)
* **Pinecone Setup:**
  - Crea un account su [Pinecone](https://www.pinecone.io/)
  - Crea un nuovo Index con:
    - **Name:** `docuchat-index`
    - **Dimensions:** 768
    - **Metric:** Cosine

### 2. Clone del Repository
```bash
git clone https://github.com/DawsonPeek/docuchat.git
cd docuchat

# Installa le dipendenze
npm install
```

### 3. Configurazione Environment
Crea un file `.env.local` nella directory root:

```env
# Google AI Studio (Gemini)
GOOGLE_API_KEY=your_google_api_key_here

# Pinecone Vector DB
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX=docuchat-index
```

### 4. Avvio dell'Applicazione
```bash
npm run dev
```

L'applicazione sarà accessibile su `http://localhost:3000`.

---

## 🔧 Configurazione Avanzata

### Upgrade a Gemini Pro
Il progetto utilizza `gemini-1.5-flash` di default (gratuito). Gli utenti con piani Google Cloud a pagamento possono passare a `gemini-1.5-pro` per capacità di ragionamento superiori modificando la configurazione.

---

## 📬 Autore

[GitHub Profile](https://github.com/DawsonPeek)

---

<p align="center">Made with ❤️ using Next.js 14 & Google Gemini</p>
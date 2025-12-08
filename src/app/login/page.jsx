// src/app/login/page.jsx
'use client';

import {LoginWrapper} from "@/components/LoginComponents/indexLogin"

export default function pageLogin() {
    return (
        <main className="w-full h-screen overflow-hidden flex items-center justify-center bg-[#0b1f58]">
            <style>
                {`
                .container {
                display: flex ;
                height: 100vh ;
                transition: all 0.6s ease ;
                }

                .leftPanel {
                flex: 1;
                background-color: #0b1f58;
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                padding: 2rem;
                text-align: center;
                transition: all 0.8s ease;
                }

                .leftPanel h1 {
                font-size: 1.8rem;
                margin-bottom: 0.5rem;
                }

                .leftPanel p {
                font-size: 1rem;
                max-width: 300px;
                }

                .leftPanel button {
                background-color: white;
                color: #0b1f58;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 10px;
                cursor: pointer;
                }

                .leftPanel button:hover {
                transition: 2s;
                background-color: #e5e7eb;
                }

                .backBtn {
                position: absolute;
                bottom: 1rem;
                left: 1rem;
                }

                .rightPanel {
                flex: 1;
                background-color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                transition: all 2s ease;
                color: #0b1f58;
                }

                .header {
                text-align: center;
                margin-bottom: 1rem;
                }

                form {
                display: flex;
                flex-direction: column;
                width: 100%;
                max-width: 400px;
                gap: 0.8rem;
                }

                input {
                padding: 0.7rem;
                border-radius: 10px;
                border: 1px solid #ccc;
                }

                button[type="submit"] {
                background-color: #0b1f58;
                color: white;
                padding: 0.7rem;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                transition: 0.3s;
                }

                button[type="submit"]:hover {
                background-color: #132b6d;
                }

                /* ===== Animación cuando cambia el modo ===== */
                .container.active {
                flex-direction: row-reverse ;
                }

                .container.active .leftPanel {
                background-color: white;
                color: #0b1f58;
                }

                .container.active .leftPanel button {
                background-color: #0b1f58;
                color: white;
                }

                .container.active .rightPanel {
                background-color: #0b1f58;
                color: white;
                }

                .container.active .rightPanel input {
                background-color: #f3f4f6;
                color: black;
                }
                
                /* ======== MOBILE VIEW ========= */
                @media (max-width: 768px) {
                .container {
                    flex-direction: column !important;
                    height: auto;
                }

                .leftPanel,
                .rightPanel {
                    width: 100% !important;
                    height: 100vh !important;
                }

                .leftPanel {
                    padding: 3rem 1.5rem;
                }

                .rightPanel {
                    padding: 3rem 1.5rem;
                }
                }

                `}
            </style>
            <LoginWrapper />
        </main>

    );
}
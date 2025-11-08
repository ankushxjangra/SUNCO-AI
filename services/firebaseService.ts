// --- IMPORTANT ---
// This is a MOCKED Firebase service for demonstration purposes.
// It uses localStorage to simulate a database and user sessions.
// For a production application, you should replace the contents of these functions
// with actual calls to the Firebase Authentication and Firestore SDKs.
// See Firebase Documentation: https://firebase.google.com/docs

import { User, ChatSession, Message, Role } from '../types';

const USER_KEY = 'sunco_ai_user';

// --- MOCK DATABASE ---
let mockUsers: { [email: string]: { uid: string, email: string, password_hash: string } } = JSON.parse(localStorage.getItem('sunco_ai_users') || '{}');
let mockChats: { [chatId: string]: ChatSession } = JSON.parse(localStorage.getItem('sunco_ai_chats') || '{}');
let mockMessages: { [chatId: string]: Message[] } = JSON.parse(localStorage.getItem('sunco_ai_messages') || '{}');

const persistData = () => {
    localStorage.setItem('sunco_ai_users', JSON.stringify(mockUsers));
    localStorage.setItem('sunco_ai_chats', JSON.stringify(mockChats));
    localStorage.setItem('sunco_ai_messages', JSON.stringify(mockMessages));
}

// --- AUTHENTICATION ---

export const signUpUser = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (mockUsers[email]) {
                return reject(new Error('Email already in use.'));
            }
            const uid = `mock_uid_${Date.now()}`;
            const newUser = { uid, email, password_hash: password }; // In real app, hash password
            mockUsers[email] = newUser;
            
            const user: User = { uid, email };
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            persistData();
            
            _notifyAuthStateChange(user);
            resolve(user);
        }, 500);
    });
};

export const signInUser = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const existingUser = mockUsers[email];
            if (!existingUser || existingUser.password_hash !== password) {
                return reject(new Error('Invalid credentials.'));
            }
            const user: User = { uid: existingUser.uid, email: existingUser.email };
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            _notifyAuthStateChange(user);
            resolve(user);
        }, 500);
    });
};

export const signOutUser = (): Promise<void> => {
    return new Promise((resolve) => {
        localStorage.removeItem(USER_KEY);
        _notifyAuthStateChange(null);
        resolve();
    });
};

let authStateListener: ((user: User | null) => void) | null = null;
const _notifyAuthStateChange = (user: User | null) => {
    if (authStateListener) {
        authStateListener(user);
    }
}
export const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
    authStateListener = callback;
    try {
        const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
        callback(user);
    } catch {
        callback(null);
    }
    
    // Return unsubscribe function
    return () => {
        authStateListener = null;
    };
};


// --- FIRESTORE (DATABASE) ---

export const getChatHistoryForUser = (userId: string): Promise<ChatSession[]> => {
    return new Promise((resolve) => {
        const history = Object.values(mockChats).filter(chat => chat.userId === userId);
        resolve(history);
    });
};

export const createNewChat = (userId: string, firstMessage: string): Promise<ChatSession> => {
    return new Promise((resolve) => {
        const id = `mock_chat_${Date.now()}`;
        const newChat: ChatSession = {
            id,
            userId,
            title: firstMessage.substring(0, 30) + (firstMessage.length > 30 ? '...' : ''),
            createdAt: Date.now()
        };
        mockChats[id] = newChat;
        mockMessages[id] = [];
        persistData();
        resolve(newChat);
    });
};

export const getMessagesForChat = (chatId: string): Promise<Message[]> => {
    return new Promise((resolve) => {
        resolve(mockMessages[chatId] || []);
    });
};

export const addMessageToChat = (chatId: string, message: Message): Promise<void> => {
    return new Promise((resolve) => {
        if (!mockMessages[chatId]) {
            mockMessages[chatId] = [];
        }
        
        // Avoid duplicating messages if they are updated (e.g., from loading to complete)
        const existingIndex = mockMessages[chatId].findIndex(m => m.id === message.id);
        if (existingIndex > -1) {
            mockMessages[chatId][existingIndex] = message;
        } else {
            mockMessages[chatId].push(message);
        }
        
        persistData();
        resolve();
    });
};

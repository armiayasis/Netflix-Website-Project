
const express = require('express');
const path = require('path');
const Database = require('@replit/database');

const app = express();
const db = new Database();
const PORT = 5000;

app.use(express.json());
app.use(express.static(__dirname));

// Helper Functions
function getUserKey(mobile) {
    return `user_${mobile}`;
}

function getTransactionsKey(mobile) {
    return `transactions_${mobile}`;
}

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { name, mobile, pin } = req.body;

    if (!name || !mobile || !pin) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (!/^09\d{9}$/.test(mobile)) {
        return res.status(400).json({ error: 'Invalid mobile number!' });
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        return res.status(400).json({ error: 'PIN must be 4 digits!' });
    }

    try {
        const userKey = getUserKey(mobile);
        const existingUser = await db.get(userKey);

        if (existingUser) {
            return res.status(400).json({ error: 'Mobile number already registered!' });
        }

        const user = {
            name,
            mobile,
            pin,
            balance: 0,
            createdAt: new Date().toISOString()
        };

        await db.set(userKey, user);
        await db.set(getTransactionsKey(mobile), []);

        res.json({ message: 'Registration successful!', user: { name, mobile } });
    } catch (error) {
        res.status(500).json({ error: 'Server error!' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { mobile, pin } = req.body;

    if (!mobile || !pin) {
        return res.status(400).json({ error: 'Mobile and PIN are required!' });
    }

    try {
        const userKey = getUserKey(mobile);
        const user = await db.get(userKey);

        if (!user) {
            return res.status(401).json({ error: 'User not found!' });
        }

        if (user.pin !== pin) {
            return res.status(401).json({ error: 'Invalid PIN!' });
        }

        res.json({ message: 'Login successful!', user: { name: user.name, mobile: user.mobile } });
    } catch (error) {
        res.status(500).json({ error: 'Server error!' });
    }
});

// Get balance endpoint
app.get('/api/balance/:mobile', async (req, res) => {
    const { mobile } = req.params;

    try {
        const userKey = getUserKey(mobile);
        const user = await db.get(userKey);

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        res.json({ balance: user.balance || 0 });
    } catch (error) {
        res.status(500).json({ error: 'Server error!' });
    }
});

// Get transactions endpoint
app.get('/api/transactions/:mobile', async (req, res) => {
    const { mobile } = req.params;

    try {
        const transactionsKey = getTransactionsKey(mobile);
        const transactions = await db.get(transactionsKey) || [];

        res.json({ transactions: transactions.reverse() });
    } catch (error) {
        res.status(500).json({ error: 'Server error!' });
    }
});

// Deposit endpoint
app.post('/api/deposit', async (req, res) => {
    const { mobile, amount, note } = req.body;

    if (!mobile || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid request!' });
    }

    try {
        const userKey = getUserKey(mobile);
        const user = await db.get(userKey);

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        user.balance = (user.balance || 0) + amount;
        await db.set(userKey, user);

        const transaction = {
            type: 'Deposit',
            icon: '💰',
            amount: amount,
            note: note || '',
            date: new Date().toISOString()
        };

        const transactionsKey = getTransactionsKey(mobile);
        const transactions = await db.get(transactionsKey) || [];
        transactions.push(transaction);
        await db.set(transactionsKey, transactions);

        res.json({ message: 'Deposit successful!', balance: user.balance });
    } catch (error) {
        res.status(500).json({ error: 'Server error!' });
    }
});

// Withdraw endpoint
app.post('/api/withdraw', async (req, res) => {
    const { mobile, amount, note, pin } = req.body;

    if (!mobile || !amount || amount <= 0 || !pin) {
        return res.status(400).json({ error: 'Invalid request!' });
    }

    try {
        const userKey = getUserKey(mobile);
        const user = await db.get(userKey);

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        if (user.pin !== pin) {
            return res.status(401).json({ error: 'Invalid PIN!' });
        }

        if (user.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance!' });
        }

        user.balance -= amount;
        await db.set(userKey, user);

        const transaction = {
            type: 'Withdraw',
            icon: '💸',
            amount: -amount,
            note: note || '',
            date: new Date().toISOString()
        };

        const transactionsKey = getTransactionsKey(mobile);
        const transactions = await db.get(transactionsKey) || [];
        transactions.push(transaction);
        await db.set(transactionsKey, transactions);

        res.json({ message: 'Withdrawal successful!', balance: user.balance });
    } catch (error) {
        res.status(500).json({ error: 'Server error!' });
    }
});

// GCash deposit endpoint
app.post('/api/gcash-deposit', async (req, res) => {
    const { mobile, gcashNumber, amount, refNumber } = req.body;

    if (!mobile || !gcashNumber || !amount || !refNumber) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {
        const userKey = getUserKey(mobile);
        const user = await db.get(userKey);

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        user.balance = (user.balance || 0) + amount;
        await db.set(userKey, user);

        const transaction = {
            type: 'GCash Deposit',
            icon: '📱',
            amount: amount,
            note: `From GCash ${gcashNumber} - Ref: ${refNumber}`,
            date: new Date().toISOString()
        };

        const transactionsKey = getTransactionsKey(mobile);
        const transactions = await db.get(transactionsKey) || [];
        transactions.push(transaction);
        await db.set(transactionsKey, transactions);

        res.json({ message: 'GCash deposit successful!', balance: user.balance });
    } catch (error) {
        res.status(500).json({ error: 'Server error!' });
    }
});

// GCash withdraw endpoint
app.post('/api/gcash-withdraw', async (req, res) => {
    const { mobile, gcashNumber, amount, pin } = req.body;

    if (!mobile || !gcashNumber || !amount || !pin) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {
        const userKey = getUserKey(mobile);
        const user = await db.get(userKey);

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        if (user.pin !== pin) {
            return res.status(401).json({ error: 'Invalid PIN!' });
        }

        if (user.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance!' });
        }

        user.balance -= amount;
        await db.set(userKey, user);

        const transaction = {
            type: 'GCash Withdrawal',
            icon: '📱',
            amount: -amount,
            note: `To GCash ${gcashNumber}`,
            date: new Date().toISOString()
        };

        const transactionsKey = getTransactionsKey(mobile);
        const transactions = await db.get(transactionsKey) || [];
        transactions.push(transaction);
        await db.set(transactionsKey, transactions);

        res.json({ message: 'GCash withdrawal successful!', balance: user.balance });
    } catch (error) {
        res.status(500).json({ error: 'Server error!' });
    }
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`STAR SAVINGS server running on port ${PORT}`);
    console.log(`Open your browser to start saving!`);
});

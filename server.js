const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'brigada-news-fm-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

app.post('/api/admin/login', async (req, res) => {
    const { username, password, humanVerify } = req.body;
    
    if (!humanVerify) {
        return res.status(400).json({ error: 'Human verification required' });
    }
    
    try {
        const result = await pool.query(
            'SELECT * FROM admin_users WHERE username = $1',
            [username]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const admin = result.rows[0];
        const validPassword = await bcrypt.compare(password, admin.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        req.session.adminId = admin.id;
        req.session.adminUsername = admin.username;
        
        res.json({ 
            success: true, 
            admin: { 
                id: admin.id, 
                username: admin.username 
            } 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/admin/check', (req, res) => {
    if (req.session.adminId) {
        res.json({ 
            loggedIn: true, 
            admin: { 
                id: req.session.adminId, 
                username: req.session.adminUsername 
            } 
        });
    } else {
        res.json({ loggedIn: false });
    }
});

app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

const requireAdmin = (req, res, next) => {
    if (!req.session.adminId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

app.post('/api/posts', requireAdmin, upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    try {
        const result = await pool.query(
            'INSERT INTO posts (title, content, image_url, admin_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, content, imageUrl, req.session.adminId]
        );
        
        res.json({ success: true, post: result.rows[0] });
    } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

app.get('/api/posts', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT p.*, a.username as author FROM posts p LEFT JOIN admin_users a ON p.admin_id = a.id ORDER BY p.created_at DESC'
        );
        
        res.json({ posts: result.rows });
    } catch (error) {
        console.error('Fetch posts error:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.post('/api/posts/:id/like', async (req, res) => {
    const postId = req.params.id;
    const userIdentifier = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'anonymous';
    
    try {
        await pool.query(
            'INSERT INTO post_likes (post_id, user_identifier) VALUES ($1, $2) ON CONFLICT (post_id, user_identifier) DO NOTHING',
            [postId, userIdentifier]
        );
        
        await pool.query(
            'UPDATE posts SET likes_count = (SELECT COUNT(*) FROM post_likes WHERE post_id = $1) WHERE id = $1',
            [postId]
        );
        
        const result = await pool.query(
            'SELECT likes_count FROM posts WHERE id = $1',
            [postId]
        );
        
        res.json({ success: true, likesCount: result.rows[0].likes_count });
    } catch (error) {
        console.error('Like error:', error);
        res.status(500).json({ error: 'Failed to like post' });
    }
});

app.delete('/api/posts/:id', requireAdmin, async (req, res) => {
    const postId = req.params.id;
    
    try {
        const result = await pool.query(
            'DELETE FROM posts WHERE id = $1 AND admin_id = $2 RETURNING image_url',
            [postId, req.session.adminId]
        );
        
        if (result.rows.length > 0 && result.rows[0].image_url) {
            const imagePath = path.join(__dirname, result.rows[0].image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎙️  BRIGADA NEWS FM server running on http://0.0.0.0:${PORT}`);
    console.log(`📻 Broadcasting live - Radio Stations & Music Library`);
    console.log(`🔐 Admin credentials - Username: admin, Password: admin123`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy, retrying...`);
        setTimeout(() => {
            server.close();
            server.listen(PORT, '0.0.0.0');
        }, 1000);
    }
});

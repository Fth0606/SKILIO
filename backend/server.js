import express from 'express';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Mock Data
let currentUser = null;

const ACCOUNTS = [
    {
        email: 'superadmin@skilio.com',
        role: 'super_admin',
        name: 'Global Admin',
        tenant: null
    },
    {
        email: 'starter@harvard.edu',
        role: 'tenant_admin',
        name: 'Harvard Admin (Starter)',
        tenant: { name: 'Harvard University', plan: 'Starter' }
    },
    {
        email: 'academy@oxford.edu',
        role: 'tenant_admin',
        name: 'Oxford Admin (Academy)',
        tenant: { name: 'Oxford University', plan: 'Academy' }
    },
    {
        email: 'enterprise@mit.edu',
        role: 'tenant_admin',
        name: 'MIT Admin (Enterprise)',
        tenant: { name: 'MIT', plan: 'Enterprise' }
    },
    {
        email: 'student@harvard.edu',
        role: 'student',
        name: 'John Student',
        credits: 5,
        sessions_count: 12,
        skills_taught_count: 3,
        avg_rating: 4.8,
        ratings_count: 8,
        tenant: { name: 'Harvard University' },
        availability: [
            { id: 1, day: 'Monday', start: '10:00', end: '12:00' },
            { id: 2, day: 'Wednesday', start: '14:00', end: '16:00' }
        ],
        skills: [
            { id: 1, name: 'Python', category: 'Programming', level: 'Expert' },
            { id: 2, name: 'French', category: 'Language', level: 'Intermediate' }
        ]
    }
];

const SKILLS = [
    { id: 1, name: 'Python', category: 'Programming', level: 'Expert' },
    { id: 2, name: 'French', category: 'Language', level: 'Intermediate' },
    { id: 3, name: 'Machine Learning', category: 'AI/Data', level: 'Advanced' },
    { id: 4, name: 'Guitar', category: 'Music', level: 'Beginner' },
    { id: 5, name: 'Calculus', category: 'Math', level: 'Intermediate' },
    { id: 6, name: 'Design', category: 'Creative', level: 'Expert' }
];

const CATEGORIES = ['Programming', 'Language', 'AI/Data', 'Music', 'Math', 'Creative', 'Soft Skills'];

const TEACHERS = [
    {
        id: 2,
        name: 'Jane Smith',
        avg_rating: 4.9,
        sessions_count: 42,
        skills: [
            { id: 3, name: 'Machine Learning', level: 'Expert' },
            { id: 1, name: 'Python', level: 'Advanced' }
        ],
        availability: [
            { id: 3, day: 'Tuesday', start: '09:00', end: '11:00' },
            { id: 4, day: 'Thursday', start: '15:00', end: '17:00' }
        ]
    },
    {
        id: 3,
        name: 'Bob Wilson',
        avg_rating: 4.7,
        sessions_count: 15,
        skills: [
            { id: 4, name: 'Guitar', level: 'Expert' }
        ],
        availability: [
            { id: 5, day: 'Friday', start: '10:00', end: '12:00' }
        ]
    }
];

const SESSIONS = [
    {
        id: 1,
        status: 'accepted',
        skill: { name: 'Machine Learning' },
        teacher: { name: 'Jane Smith' },
        learner: { name: 'Test Student' },
        scheduled_at: '2026-05-15 10:00'
    },
    {
        id: 2,
        status: 'pending',
        skill: { name: 'Python' },
        teacher: { name: 'Test Student' },
        learner: { name: 'Alice Brown' },
        scheduled_at: '2026-05-16 14:00'
    }
];

const TRANSACTIONS = [
    { created_at: '2026-05-10 09:00', type: 'earn', amount: 1, description: 'Taught Python session' },
    { created_at: '2026-05-11 15:00', type: 'spend', amount: -1, description: 'Learned Machine Learning' }
];

// Auth Routes
app.get('/api/auth/me', (req, res) => res.json({ data: currentUser }));
app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    const account = ACCOUNTS.find(a => a.email === email);
    if (account) {
        currentUser = { id: ACCOUNTS.indexOf(account) + 1, ...account };
        res.json({ token: 'mock-token', user: currentUser });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});
app.post('/api/auth/register', (req, res) => {
    currentUser = { id: 99, ...req.body, role: 'student', credits: 3 };
    res.json({ token: 'mock-token', user: currentUser });
});
app.post('/api/auth/logout', (req, res) => {
    currentUser = null;
    res.json({ message: 'Logged out' });
});

// Skills Routes
app.get('/api/skills', (req, res) => res.json({ data: SKILLS }));
app.get('/api/skills/categories', (req, res) => res.json({ data: CATEGORIES }));
app.post('/api/skills', (req, res) => {
    const newSkill = { id: SKILLS.length + 1, ...req.body };
    SKILLS.push(newSkill);
    currentUser.skills.push(newSkill);
    res.json({ data: newSkill });
});

// Teachers Routes
app.get('/api/teachers', (req, res) => res.json({ data: { data: TEACHERS, last_page: 1 } }));
app.get('/api/teachers/me', (req, res) => res.json({ data: currentUser }));
app.post('/api/teachers/availability', (req, res) => {
    currentUser.availability = req.body.slots;
    res.json({ message: 'Availability updated' });
});

// Sessions Routes
app.get('/api/sessions', (req, res) => res.json({ data: { data: SESSIONS, last_page: 1 } }));
app.post('/api/sessions', (req, res) => res.json({ message: 'Session requested' }));
app.post('/api/sessions/:id/accept', (req, res) => res.json({ message: 'Session accepted' }));
app.post('/api/sessions/:id/complete', (req, res) => res.json({ message: 'Session completed' }));

// Credits Routes
app.get('/api/credits/balance', (req, res) => res.json({ data: { balance: currentUser.credits } }));
app.get('/api/credits/transactions', (req, res) => res.json({ data: { data: TRANSACTIONS, meta: { total_earned: 10, total_spent: 5 } } }));

// Admin Routes
app.get('/api/admin/analytics', (req, res) => res.json({ data: {
    total_users: 284,
    active_users: 156,
    sessions_this_month: 45,
    credits_exchanged: 120,
    completion_rate: 94,
    plan: { name: 'Academy', max_users: 500 },
    sessions_chart: [{ week: 'W1', count: 10 }, { week: 'W2', count: 15 }],
    popular_skills: [{ name: 'Python', count: 20 }, { name: 'Design', count: 15 }]
}}));
app.get('/api/admin/settings', (req, res) => res.json({ data: { institution_name: 'Harvard University', primary_color: '#0F6E56' } }));
app.put('/api/admin/settings', (req, res) => res.json({ message: 'Settings updated' }));
app.get('/api/admin/users', (req, res) => {
    if (!currentUser) return res.status(401).json({ message: 'Unauthorized' });
    const tenantName = currentUser.tenant?.name;
    let filtered = ACCOUNTS.filter(a => a.role !== 'super_admin');
    if (tenantName) {
        filtered = filtered.filter(a => a.tenant?.name === tenantName);
    }
    const search = req.query.search;
    if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(a => 
            (a.name && a.name.toLowerCase().includes(query)) || 
            (a.email && a.email.toLowerCase().includes(query))
        );
    }
    const mapped = filtered.map(a => {
        const id = ACCOUNTS.indexOf(a) + 1;
        return {
            ...a,
            id,
            status: a.status || 'active',
            credits: a.credits || 0,
        };
    });
    res.json({ data: { data: mapped, last_page: 1 } });
});
app.post('/api/admin/users/invite', (req, res) => res.json({ message: 'Invitation sent' }));
app.post('/api/admin/users/import', (req, res) => res.json({ message: 'Import successful' }));
app.post('/api/admin/users/:id/suspend', (req, res) => {
    const id = parseInt(req.params.id);
    // id is 1-based index into ACCOUNTS array
    const account = ACCOUNTS[id - 1];
    if (account) {
        account.status = 'suspended';
    }
    res.json({ message: 'User suspended', data: account });
});
app.post('/api/admin/users/:id/activate', (req, res) => {
    const id = parseInt(req.params.id);
    const account = ACCOUNTS[id - 1];
    if (account) {
        account.status = 'active';
    }
    res.json({ message: 'User activated', data: account });
});

app.get('/api/admin/skills', (req, res) => res.json({ data: { data: SKILLS, last_page: 1 } }));
app.post('/api/admin/skills/:id/approve', (req, res) => res.json({ message: 'Skill approved' }));
app.post('/api/admin/skills/:id/hide', (req, res) => res.json({ message: 'Skill hidden' }));

app.get('/api/admin/billing', (req, res) => res.json({ data: { 
    current_plan: 'Academy', 
    next_invoice: '2026-06-01', 
    amount: 99,
    payment_method: '•••• 4242'
}}));

// Super Admin Routes
app.get('/api/super-admin/analytics', (req, res) => res.json({ data: {
    total_tenants: 47,
    total_users: 28431,
    total_sessions: 124567,
    mrr: 51200,
    churn_rate: 4.2
}}));
app.get('/api/super-admin/tenants', (req, res) => res.json({ data: { data: [{ id: 1, name: 'Harvard', subdomain: 'harvard', plan: { name: 'Academy' }, status: 'active' }], last_page: 1 } }));
app.get('/api/super-admin/plans', (req, res) => res.json({ data: [
    { id: 1, name: 'Starter', price: 0, max_users: 50, published: true },
    { id: 2, name: 'Academy', price: 99, max_users: 500, published: true }
]}));
app.post('/api/super-admin/plans/:id/publish', (req, res) => res.json({ message: 'Plan published' }));
app.get('/api/super-admin/revenue', (req, res) => res.json({ data: { mrr_chart: [], sessions_chart: [], forecast: [] } }));
app.get('/api/super-admin/tickets', (req, res) => res.json({ data: { data: [], last_page: 1 } }));
app.get('/api/super-admin/tenants/:id/stats', (req, res) => res.json({ data: { active_users: 150, sessions_count: 450 } }));

app.listen(port, () => {
    console.log(`Mock Backend running at http://localhost:${port}`);
});

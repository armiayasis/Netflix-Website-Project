
// Initialize database
let currentUser = null;

// Authentication Functions
function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
    document.querySelectorAll('.auth-tab')[1].classList.remove('active');
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.querySelectorAll('.auth-tab')[0].classList.remove('active');
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
}

async function register() {
    const name = document.getElementById('regName').value.trim();
    const mobile = document.getElementById('regMobile').value.trim();
    const pin = document.getElementById('regPin').value.trim();
    const confirmPin = document.getElementById('regConfirmPin').value.trim();

    if (!name || !mobile || !pin || !confirmPin) {
        alert('Please fill all fields!');
        return;
    }

    if (!/^09\d{9}$/.test(mobile)) {
        alert('Invalid mobile number! Use format: 09xxxxxxxxx');
        return;
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        alert('PIN must be 4 digits!');
        return;
    }

    if (pin !== confirmPin) {
        alert('PINs do not match!');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, mobile, pin })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            showLogin();
            document.getElementById('regName').value = '';
            document.getElementById('regMobile').value = '';
            document.getElementById('regPin').value = '';
            document.getElementById('regConfirmPin').value = '';
        } else {
            alert(data.error || 'Registration failed!');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function login() {
    const mobile = document.getElementById('loginMobile').value.trim();
    const pin = document.getElementById('loginPin').value.trim();

    if (!mobile || !pin) {
        alert('Please enter mobile number and PIN!');
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile, pin })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            showApp();
        } else {
            alert(data.error || 'Login failed!');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function logout() {
    currentUser = null;
    document.getElementById('authContainer').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
    document.getElementById('loginMobile').value = '';
    document.getElementById('loginPin').value = '';
}

async function showApp() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
    
    document.getElementById('userName').textContent = `Welcome, ${currentUser.name}!`;
    document.getElementById('userMobile').textContent = currentUser.mobile;
    
    await loadBalance();
    await loadTransactions();
}

// Balance Functions
async function loadBalance() {
    try {
        const response = await fetch(`/api/balance/${currentUser.mobile}`);
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('balanceAmount').textContent = `₱${data.balance.toFixed(2)}`;
            document.getElementById('lastUpdate').textContent = `Last updated: ${new Date().toLocaleString()}`;
        }
    } catch (error) {
        console.error('Error loading balance:', error);
    }
}

// Transaction Functions
async function loadTransactions() {
    try {
        const response = await fetch(`/api/transactions/${currentUser.mobile}`);
        const data = await response.json();
        
        const transactionList = document.getElementById('transactionList');
        
        if (response.ok && data.transactions.length > 0) {
            transactionList.innerHTML = data.transactions.map(t => `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <div class="transaction-type">
                            <span>${t.icon}</span>
                            <span>${t.type}</span>
                        </div>
                        ${t.note ? `<div class="transaction-note">${t.note}</div>` : ''}
                        <div class="transaction-date">${new Date(t.date).toLocaleString()}</div>
                    </div>
                    <div class="transaction-amount ${t.amount > 0 ? 'positive' : 'negative'}">
                        ${t.amount > 0 ? '+' : ''}₱${Math.abs(t.amount).toFixed(2)}
                    </div>
                </div>
            `).join('');
        } else {
            transactionList.innerHTML = '<p class="no-transactions">No transactions yet</p>';
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Modal Functions
function showDepositModal() {
    document.getElementById('depositModal').style.display = 'block';
}

function showWithdrawModal() {
    document.getElementById('withdrawModal').style.display = 'block';
}

function showGCashModal() {
    document.getElementById('gcashModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // Clear inputs
    document.querySelectorAll(`#${modalId} input`).forEach(input => input.value = '');
}

// Deposit Function
async function deposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const note = document.getElementById('depositNote').value.trim();

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount!');
        return;
    }

    try {
        const response = await fetch('/api/deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mobile: currentUser.mobile,
                amount,
                note
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Successfully deposited ₱${amount.toFixed(2)}!`);
            closeModal('depositModal');
            await loadBalance();
            await loadTransactions();
        } else {
            alert(data.error || 'Deposit failed!');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Withdraw Function
async function withdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const note = document.getElementById('withdrawNote').value.trim();
    const pin = document.getElementById('withdrawPin').value.trim();

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount!');
        return;
    }

    if (!pin || pin.length !== 4) {
        alert('Please enter your 4-digit PIN!');
        return;
    }

    try {
        const response = await fetch('/api/withdraw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mobile: currentUser.mobile,
                amount,
                note,
                pin
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Successfully withdrew ₱${amount.toFixed(2)}!`);
            closeModal('withdrawModal');
            await loadBalance();
            await loadTransactions();
        } else {
            alert(data.error || 'Withdrawal failed!');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// GCash Functions
function showGCashDeposit() {
    document.getElementById('gcashDepositForm').style.display = 'block';
    document.getElementById('gcashWithdrawForm').style.display = 'none';
    document.querySelectorAll('.gcash-tab')[0].classList.add('active');
    document.querySelectorAll('.gcash-tab')[1].classList.remove('active');
}

function showGCashWithdraw() {
    document.getElementById('gcashDepositForm').style.display = 'none';
    document.getElementById('gcashWithdrawForm').style.display = 'block';
    document.querySelectorAll('.gcash-tab')[0].classList.remove('active');
    document.querySelectorAll('.gcash-tab')[1].classList.add('active');
}

async function gcashDeposit() {
    const gcashNumber = document.getElementById('gcashDepositNumber').value.trim();
    const amount = parseFloat(document.getElementById('gcashDepositAmount').value);
    const refNumber = document.getElementById('gcashDepositRef').value.trim();

    if (!gcashNumber || !amount || !refNumber) {
        alert('Please fill all fields!');
        return;
    }

    if (!/^09\d{9}$/.test(gcashNumber)) {
        alert('Invalid GCash number!');
        return;
    }

    if (amount <= 0) {
        alert('Invalid amount!');
        return;
    }

    try {
        const response = await fetch('/api/gcash-deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mobile: currentUser.mobile,
                gcashNumber,
                amount,
                refNumber
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`GCash deposit of ₱${amount.toFixed(2)} submitted! Reference: ${refNumber}`);
            closeModal('gcashModal');
            await loadBalance();
            await loadTransactions();
        } else {
            alert(data.error || 'GCash deposit failed!');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function gcashWithdraw() {
    const gcashNumber = document.getElementById('gcashWithdrawNumber').value.trim();
    const amount = parseFloat(document.getElementById('gcashWithdrawAmount').value);
    const pin = document.getElementById('gcashWithdrawPin').value.trim();

    if (!gcashNumber || !amount || !pin) {
        alert('Please fill all fields!');
        return;
    }

    if (!/^09\d{9}$/.test(gcashNumber)) {
        alert('Invalid GCash number!');
        return;
    }

    if (amount <= 0) {
        alert('Invalid amount!');
        return;
    }

    if (pin.length !== 4) {
        alert('Invalid PIN!');
        return;
    }

    try {
        const response = await fetch('/api/gcash-withdraw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mobile: currentUser.mobile,
                gcashNumber,
                amount,
                pin
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`₱${amount.toFixed(2)} will be sent to GCash ${gcashNumber}!`);
            closeModal('gcashModal');
            await loadBalance();
            await loadTransactions();
        } else {
            alert(data.error || 'GCash withdrawal failed!');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

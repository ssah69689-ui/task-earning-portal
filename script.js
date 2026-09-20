let currentUser = JSON.parse(localStorage.getItem('nexus_current_user')) || null;

window.onload = function() {
    if (currentUser) {
        document.getElementById('authContainer').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        updateUserUI();
    }
}

function updateUserUI() {
    if(!currentUser) return;
    document.getElementById('headerUid').innerText = currentUser.uid;
    document.getElementById('profileUid').innerText = currentUser.uid;
    document.getElementById('profilePhone').innerText = currentUser.phone;
    document.getElementById('headerWallet').innerText = `₹${currentUser.balance.toFixed(2)}`;
    document.getElementById('mainBalance').innerText = `₹${currentUser.balance.toFixed(2)}`;
    document.getElementById('referralLinkText').innerText = `https://nexuswin.app/ref=${currentUser.uid}`;
    
    localStorage.setItem('nexus_current_user', JSON.stringify(currentUser));
}

// Auth Switcher
function switchAuthMode(mode) {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('forgotForm').classList.add('hidden');

    if(mode === 'login') {
        document.getElementById('authTitle').innerText = "Welcome Back";
        document.getElementById('authSubtitle').innerText = "Login to your NexusWin account";
        document.getElementById('loginForm').classList.remove('hidden');
    } else if(mode === 'register') {
        document.getElementById('authTitle').innerText = "Create Account";
        document.getElementById('authSubtitle').innerText = "Join NexusWin & start earning";
        document.getElementById('registerForm').classList.remove('hidden');
    } else if(mode === 'forgot') {
        document.getElementById('authTitle').innerText = "Reset Password";
        document.getElementById('authSubtitle').innerText = "Recover your account password";
        document.getElementById('forgotForm').classList.remove('hidden');
    }
}

function handleLogin() {
    const phone = document.getElementById('loginPhone').value.trim();
    if(!phone) {
        alert('⚠️ Please enter phone number or UID.');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('nexus_users_db')) || [];
    let found = users.find(u => u.phone === phone || u.uid === phone);

    if(found) {
        currentUser = found;
    } else {
        currentUser = {
            phone: phone,
            uid: Math.floor(100000 + Math.random() * 900000).toString(),
            balance: 100.00
        };
        users.push(currentUser);
        localStorage.setItem('nexus_users_db', JSON.stringify(users));
    }

    localStorage.setItem('nexus_current_user', JSON.stringify(currentUser));
    document.getElementById('authContainer').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
    updateUserUI();
}

function handleRegister() {
    const phone = document.getElementById('regPhone').value.trim();
    if(!phone) {
        alert('⚠️ Please enter a valid mobile number.');
        return;
    }

    let users = JSON.parse(localStorage.getItem('nexus_users_db')) || [];
    if(users.some(u => u.phone === phone)) {
        alert('❌ Phone number already registered! Please login.');
        switchAuthMode('login');
        return;
    }

    currentUser = {
        phone: phone,
        uid: Math.floor(100000 + Math.random() * 900000).toString(),
        balance: 500.00 // Welcome bonus
    };

    users.push(currentUser);
    localStorage.setItem('nexus_users_db', JSON.stringify(users));
    localStorage.setItem('nexus_current_user', JSON.stringify(currentUser));

    alert('🎉 Registration successful! ₹500 welcome bonus added.');
    document.getElementById('authContainer').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
    updateUserUI();
}

function handleForgot() {
    const phone = document.getElementById('forgotPhone').value;
    const newPass = document.getElementById('newPassword').value;
    if(!phone || !newPass) {
        alert('⚠️ Please fill all fields.');
        return;
    }
    alert('✅ Password reset successful! Please login now.');
    switchAuthMode('login');
}

function handleLogout() {
    localStorage.removeItem('nexus_current_user');
    location.reload();
}

// Tabs
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

// Modals: Notification, Deposit, Withdraw
function openNotificationModal() { document.getElementById('notificationModal').classList.remove('hidden'); }
function closeNotificationModal() { document.getElementById('notificationModal').classList.add('hidden'); }

function openDepositModal() { document.getElementById('depositModal').classList.remove('hidden'); }
function closeDepositModal() { document.getElementById('depositModal').classList.add('hidden'); }
function copyUpi() {
    navigator.clipboard.writeText("nexuswin@paytm");
    alert("📋 UPI ID copied!");
}

function submitDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value) || 0;
    const utr = document.getElementById('utrNumber').value.trim();
    if(amount < 100 || !utr || utr.length < 8) {
        alert('⚠️ Enter valid amount (Min ₹100) and proper UTR.');
        return;
    }
    alert(`⏳ UTR submitted successfully! ₹${amount} will be added to UID: ${currentUser.uid} after admin verification.`);
    closeDepositModal();
}

function openWithdrawModal() { document.getElementById('withdrawModal').classList.remove('hidden'); }
function closeWithdrawModal() { document.getElementById('withdrawModal').classList.add('hidden'); }

function submitWithdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value) || 0;
    const upi = document.getElementById('withdrawUpi').value.trim();
    if(amount <= 0 || amount > currentUser.balance) {
        alert('❌ Invalid amount or insufficient balance.');
        return;
    }
    if(!upi) {
        alert('⚠️ Enter payout UPI ID or Bank details.');
        return;
    }
    currentUser.balance -= amount;
    updateUserUI();
    alert(`✅ Withdrawal request of ₹${amount} submitted successfully!`);
    closeWithdrawModal();
}

// Aviator Game
let aviatorRunning = false;
let currentMultiplier = 1.00;
let aviatorInterval = null;

function placeAviatorBet(slot) {
    const betAmount = parseFloat(document.getElementById(`aviatorBet${slot}`).value) || 0;
    if(betAmount <= 0 || betAmount > currentUser.balance) {
        alert('❌ Insufficient balance or invalid bet.');
        return;
    }
    currentUser.balance -= betAmount;
    updateUserUI();
    
    if(!aviatorRunning) {
        startAviatorRound();
    }
    alert(`✈️ Bet of ₹${betAmount} placed on Aviator slot ${slot}!`);
}

function startAviatorRound() {
    aviatorRunning = true;
    currentMultiplier = 1.00;
    const display = document.getElementById('multiplierDisplay');
    const status = document.getElementById('aviatorStatus');
    status.innerText = "Flying...";
    status.className = "text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded font-mono";

    const crashAt = (Math.random() * 3 + 1.2).toFixed(2);

    aviatorInterval = setInterval(() => {
        currentMultiplier += 0.05;
        display.innerText = `${currentMultiplier.toFixed(2)}x`;

        if(currentMultiplier >= parseFloat(crashAt)) {
            clearInterval(aviatorInterval);
            aviatorRunning = false;
            status.innerText = `CRASHED @ ${crashAt}x`;
            status.className = "text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-mono";
        }
    }, 150);
}

function playLuckyNumberGame() {
    let guess = prompt("🎲 Choose a Lucky Number between 0 to 9:");
    if(guess !== null) {
        alert(`🎯 You chose ${guess}. Better luck next round!`);
    }
}

function sendSupportMessage() {
    const input = document.getElementById('chatInput');
    const box = document.getElementById('chatBox');
    if(input.value.trim() !== "") {
        box.innerHTML += `<div class="text-right text-purple-300"><b>You (UID ${currentUser.uid}):</b> ${input.value}</div>`;
        input.value = "";
        box.scrollTop = box.scrollHeight;
    }
}

function copyReferralLink() {
    navigator.clipboard.writeText(`https://nexuswin.app/ref=${currentUser.uid}`);
    alert("🔗 Referral link copied!");
}

// Admin Handlers
function openAdminLoginModal() { document.getElementById('adminLoginModal').classList.remove('hidden'); }
function closeAdminLoginModal() { document.getElementById('adminLoginModal').classList.add('hidden'); }

function verifyAdminLogin() {
    const pass = document.getElementById('adminPasswordInput').value;
    if(pass === "admin123") {
        closeAdminLoginModal();
        document.getElementById('adminDashboardModal').classList.remove('hidden');
    } else {
        alert('❌ Incorrect password!');
    }
}
function closeAdminDashboard() { document.getElementById('adminDashboardModal').classList.add('hidden'); }

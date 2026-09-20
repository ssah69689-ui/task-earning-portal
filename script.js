let currentUser = JSON.parse(localStorage.getItem('nexus_current_user')) || null;

window.onload = function() {
    if (currentUser) {
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        updateUserUI();
    }
}

function updateUserUI() {
    if(!currentUser) return;
    document.getElementById('headerUid').innerText = currentUser.uid;
    document.getElementById('accUid').innerText = currentUser.uid;
    document.getElementById('accUsername').innerText = currentUser.username;
    document.getElementById('headerWallet').innerText = `₹${currentUser.balance.toFixed(2)}`;
    document.getElementById('mainBalance').innerText = `₹${currentUser.balance.toFixed(2)}`;
    document.getElementById('accBalance').innerText = `₹${currentUser.balance.toFixed(2)}`;
    document.getElementById('agencyInviteLink').innerText = `nexuswin.app?ref=${currentUser.uid}`;
    
    localStorage.setItem('nexus_current_user', JSON.stringify(currentUser));
}

// Auth Switcher
function switchAuthMode(mode) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('forgotForm').style.display = 'none';

    if(mode === 'login') {
        document.getElementById('authTitle').innerText = "NexusWin Login";
        document.getElementById('authSubtitle').innerText = "Enter your unique username & password";
        document.getElementById('loginForm').style.display = 'block';
    } else if(mode === 'register') {
        document.getElementById('authTitle').innerText = "Create Account";
        document.getElementById('authSubtitle').innerText = "Join NexusWin with zero balance";
        document.getElementById('registerForm').style.display = 'block';
    } else if(mode === 'forgot') {
        document.getElementById('authTitle').innerText = "Reset Password";
        document.getElementById('authSubtitle').innerText = "Verify via OTP to recover password";
        document.getElementById('forgotForm').style.display = 'block';
    }
}

function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if(!username || !password) {
        alert('⚠️ Please fill in all fields.');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('nexus_users_db')) || [];
    let found = users.find(u => u.username === username && u.password === password);

    if(found) {
        currentUser = found;
        localStorage.setItem('nexus_current_user', JSON.stringify(currentUser));
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        updateUserUI();
    } else {
        alert('❌ Invalid username or password!');
    }
}

function handleRegister() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    if(!username || !password) {
        alert('⚠️ Please create a username and password.');
        return;
    }

    let users = JSON.parse(localStorage.getItem('nexus_users_db')) || [];
    if(users.some(u => u.username === username)) {
        alert('❌ Username already taken! Choose another.');
        return;
    }

    currentUser = {
        username: username,
        password: password,
        uid: Math.floor(100000 + Math.random() * 900000).toString(),
        balance: 0.00 // Strictly ₹0 balance
    };

    users.push(currentUser);
    localStorage.setItem('nexus_users_db', JSON.stringify(users));
    localStorage.setItem('nexus_current_user', JSON.stringify(currentUser));

    alert('🎉 Registration successful! Initial balance is ₹0.00');
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';
    updateUserUI();
}

function sendOtp() {
    const username = document.getElementById('forgotUsername').value.trim();
    if(!username) {
        alert('⚠️ Enter your registered username first.');
        return;
    }
    alert('📨 Simulated OTP sent successfully: 123456');
}

function handleResetPassword() {
    const username = document.getElementById('forgotUsername').value.trim();
    const otp = document.getElementById('otpInput').value.trim();
    const newPass = document.getElementById('newPassword').value.trim();

    if(!username || !otp || !newPass) {
        alert('⚠️ Please fill all fields.');
        return;
    }
    if(otp !== "123456") {
        alert('❌ Invalid OTP! Please enter 123456.');
        return;
    }

    let users = JSON.parse(localStorage.getItem('nexus_users_db')) || [];
    let user = users.find(u => u.username === username);
    if(user) {
        user.password = newPass;
        localStorage.setItem('nexus_users_db', JSON.stringify(users));
        alert('✅ Password reset successful! Please login now.');
        switchAuthMode('login');
    } else {
        alert('❌ Username not found.');
    }
}

function handleLogout() {
    localStorage.removeItem('nexus_current_user');
    location.reload();
}

// Navigation Tabs
function switchTab(tabId) {
    document.querySelectorAll('.tab-view').forEach(t => t.classList.remove('active'));
    document.getElementById(`view-${tabId}`).classList.add('active');
}

// Modals
function openNotificationModal() { document.getElementById('notificationModal').classList.add('active'); }
function closeNotificationModal() { document.getElementById('notificationModal').classList.remove('active'); }

function openDepositModal() { document.getElementById('depositModal').classList.add('active'); }
function closeDepositModal() { document.getElementById('depositModal').classList.remove('active'); }
function copyUpi() { navigator.clipboard.writeText("nexuswin@paytm"); alert("📋 UPI ID copied!"); }

function submitDepositRequest() {
    const amount = parseFloat(document.getElementById('depositAmount').value) || 0;
    const utr = document.getElementById('utrNumber').value.trim();
    if(amount < 100 || !utr || utr.length < 8) {
        alert('⚠️ Enter valid amount (Min ₹100) and proper UTR.');
        return;
    }
    alert(`⏳ UTR submitted successfully! ₹${amount} will be credited to UID: ${currentUser.uid} upon admin verification.`);
    closeDepositModal();
}

function openWithdrawModal() { document.getElementById('withdrawModal').classList.add('active'); }
function closeWithdrawModal() { document.getElementById('withdrawModal').classList.remove('active'); }

function submitWithdrawRequest() {
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
    alert(`✅ Withdrawal request of ₹${amount} submitted to admin successfully!`);
    closeWithdrawModal();
}

function openGiftModal() { document.getElementById('giftModal').classList.add('active'); }
function closeGiftModal() { document.getElementById('giftModal').classList.remove('active'); }

function redeemGiftCode() {
    const code = document.getElementById('giftCodeInput').value.trim().toUpperCase();
    if(code === "NEXUS2026") {
        currentUser.balance += 50.00;
        updateUserUI();
        alert("🎁 Gift code applied! ₹50.00 added to wallet.");
        closeGiftModal();
    } else {
        alert("❌ Invalid or expired gift code.");
    }
}

function openSupportModal() { document.getElementById('supportModal').classList.add('active'); }
function closeSupportModal() { document.getElementById('supportModal').classList.remove('active'); }

function sendSupport() {
    const input = document.getElementById('chatInput');
    const box = document.getElementById('chatBox');
    if(input.value.trim() !== "") {
        box.innerHTML += `<div style="text-align: right; color: #c084fc; margin-bottom: 4px;"><b>You (UID ${currentUser.uid}):</b> ${input.value}</div>`;
        input.value = "";
        box.scrollTop = box.scrollHeight;
    }
}

function copyUid() { navigator.clipboard.writeText(currentUser.uid); alert("📋 UID copied!"); }
function copyAgencyLink() { navigator.clipboard.writeText(`https://nexuswin.app?ref=${currentUser.uid}`); alert("🔗 Invitation link copied!"); }

// Aviator Game
let aviatorRunning = false;
let currentMultiplier = 1.00;
let aviatorInterval = null;

function placeAviatorBet() {
    const betAmount = parseFloat(document.getElementById('aviatorBet1').value) || 0;
    if(betAmount <= 0 || betAmount > currentUser.balance) {
        alert('❌ Insufficient balance or invalid bet.');
        return;
    }
    currentUser.balance -= betAmount;
    updateUserUI();
    
    if(!aviatorRunning) {
        startAviatorRound();
    }
    alert(`✈️ Aviator bet of ₹${betAmount} placed successfully!`);
}

function startAviatorRound() {
    aviatorRunning = true;
    currentMultiplier = 1.00;
    const display = document.getElementById('multiplierDisplay');
    const status = document.getElementById('aviatorStatus');
    status.innerText = "Flying...";
    status.style.background = "rgba(34, 197, 94, 0.2)";
    status.style.color = "#86efac";

    const crashAt = (Math.random() * 3 + 1.2).toFixed(2);

    aviatorInterval = setInterval(() => {
        currentMultiplier += 0.05;
        display.innerText = `${currentMultiplier.toFixed(2)}x`;

        if(currentMultiplier >= parseFloat(crashAt)) {
            clearInterval(aviatorInterval);
            aviatorRunning = false;
            status.innerText = `CRASHED @ ${crashAt}x`;
            status.style.background = "rgba(239, 68, 68, 0.2)";
            status.style.color = "#fca5a5";
        }
    }, 150);
}

function cashOutBet() {
    if(!aviatorRunning) {
        alert('⚠️ Round is not active!');
        return;
    }
    const target = parseFloat(document.getElementById('cashoutAt').value) || 2.00;
    if(currentMultiplier <= target) {
        const betAmount = parseFloat(document.getElementById('aviatorBet1').value) || 10;
        const winAmount = betAmount * currentMultiplier;
        currentUser.balance += winAmount;
        updateUserUI();
        alert(`🎉 Cashed out successfully at ${currentMultiplier.toFixed(2)}x! Won ₹${winAmount.toFixed(2)}`);
    } else {
        alert('💥 Too late! Plane already crashed.');
    }
}

function playLuckyNumberGame() {
    let guess = prompt("🎲 Choose a Lucky Number between 0 to 9:");
    if(guess !== null) {
        alert(`🎯 You chose ${guess}. Check your game history for results!`);
    }
}

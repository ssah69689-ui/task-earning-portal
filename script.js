// Firebase Configuration
const firebaseConfig = {
    dabaseURL: "https://shreewin-pro-default-rtdb.firebaseio.com/"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let currentUser = { uid: "1268461", name: "Shubham Kumar", balance: 464.49 };

window.onload = function() {
    updateUI();
    checkSupportStatus();
};

function updateUI() {
    const balanceEl = document.getElementById('userBalanceDisplay');
    const nameEl = document.getElementById('profileName');
    const uidEl = document.getElementById('profileUid');
    if(balanceEl) balanceEl.innerText = `₹${currentUser.balance.toFixed(2)}`;
    if(nameEl) nameEl.innerText = currentUser.name;
    if(uidEl) uidEl.innerText = currentUser.uid;
}

function logoutUser() {
    alert("Session logged out successfully.");
    window.location.href = "index.html";
}

// Deposit Modals
function openDepositModal() { 
    const m = document.getElementById('depositModal');
    if(m) m.classList.remove('hidden'); 
}
function closeDepositModal() { 
    const m = document.getElementById('depositModal');
    if(m) m.classList.add('hidden'); 
}

function submitDepositRequest() {
    let amount = parseFloat(document.getElementById('depositAmountInput').value);
    let utr = document.getElementById('depositUtrInput').value;
    if(!amount || !utr) { alert("Please enter valid amount and UTR"); return; }
    
    db.ref('requests/deposits').push({
        uid: currentUser.uid, amount: amount, utr: utr, status: 'Pending', time: Date.now()
    });
    alert("Deposit request submitted successfully via official UPI: shubham77sah@fam!");
    closeDepositModal();
}

// Withdraw Modals (Bank & UPI Only)
function openWithdrawModal() { 
    const m = document.getElementById('withdrawModal');
    if(m) m.classList.remove('hidden'); 
}
function closeWithdrawModal() { 
    const m = document.getElementById('withdrawModal');
    if(m) m.classList.add('hidden'); 
}

function submitWithdrawRequest() {
    let amount = parseFloat(document.getElementById('withdrawAmountInput').value);
    let method = document.getElementById('withdrawMethod').value;
    if(!amount || amount > currentUser.balance) { alert("Invalid amount or insufficient balance"); return; }

    db.ref('requests/withdrawals').push({
        uid: currentUser.uid, amount: amount, method: method, bankAcc: "5234078657", ifsc: "CBIN0281356", upi: "shubham77sah@fam", status: 'Pending', time: Date.now()
    });
    alert("Withdrawal request submitted successfully!");
    closeWithdrawModal();
}

// Lottery Game (Min 10, 2x Multiplier)
function playLottery() {
    let bet = parseFloat(document.getElementById('lotteryAmount').value);
    if(bet < 10 || bet > currentUser.balance) { alert("Minimum bet is ₹10 and check balance!"); return; }
    
    currentUser.balance -= bet;
    let win = Math.random() > 0.5;
    if(win) {
        let prize = bet * 2;
        currentUser.balance += prize;
        alert(`🎉 Congratulations! You won ₹${prize} (2x)`);
    } else {
        alert(`❌ Better luck next time! You lost ₹${bet}`);
    }
    updateUI();
}

// Aviator Game Bet
function placeAviatorBet() {
    let bet = parseFloat(document.getElementById('aviatorBetAmount').value);
    if(!bet || bet > currentUser.balance) { alert("Invalid or insufficient balance!"); return; }
    currentUser.balance -= bet;
    updateUI();
    alert(`✈️ Aviator bet of ₹${bet} placed successfully!`);
}

// Support & Progress Query
function submitSupportTicket() {
    let query = document.getElementById('supportQueryText').value;
    if(!query) { alert("Please write a query"); return; }
    db.ref('support/tickets').push({ uid: currentUser.uid, query: query, status: 'Processing', reply: 'Reviewing within 10 minutes.' });
    alert("Ticket submitted successfully! Check Progress Query.");
    document.getElementById('supportQueryText').value = '';
}

function checkSupportStatus() {
    db.ref('admin/supportStatus').on('value', snap => {
        let status = snap.val() !== false;
        let banner = document.getElementById('supportStatusBanner');
        if(banner) {
            if(status) {
                banner.className = "text-xs bg-emerald-900 text-emerald-300 p-2 rounded";
                banner.innerText = "Support is Online (24/7)";
            } else {
                banner.className = "text-xs bg-red-900 text-red-300 p-2 rounded";
                banner.innerText = "Support is Offline";
            }
        }
    });
}

// Gift Code Redemption
function claimGiftCode() {
    let code = document.getElementById('giftCodeInput').value.trim().toUpperCase();
    if(code === "SHUBHAMWIN" || code === "BONUS100") {
        currentUser.balance += 100;
        updateUI();
        alert("🎁 Gift code claimed successfully! ₹100 added.");
    } else {
        alert("Invalid or expired gift code.");
    }
}

// Admin Panel Functions
function toggleSupportStatus() {
    db.ref('admin/supportStatus').once('value', snap => {
        let current = snap.val() !== false;
        db.ref('admin/supportStatus').set(!current);
        let btn = document.getElementById('supportToggleBtn');
        if(btn) {
            btn.innerText = !current ? "ONLINE" : "OFFLINE";
            btn.className = `px-4 py-2 rounded font-bold text-xs ${!current ? 'bg-emerald-600' : 'bg-red-600'}`;
        }
    });
}

function addNewAdmin() {
    let username = document.getElementById('newAdminUser').value;
    if(!username) return;
    db.ref('admin/admins/' + username).set(true);
    alert(`Admin ${username} added successfully!`);
    document.getElementById('newAdminUser').value = '';
}

function modifyUserBalance(action) {
    let uid = document.getElementById('targetUserUid').value;
    let amount = parseFloat(document.getElementById('targetBalanceAmount').value);
    if(!uid || isNaN(amount)) { alert("Enter valid UID and amount"); return; }
    alert(`Balance successfully ${action === 'add' ? 'added' : 'deducted'} for user ${uid}`);
}

function loadAdminData() {
    db.ref('admin/dailyIncome').on('value', snap => {
        let inc = document.getElementById('adminDailyIncome');
        if(inc) inc.innerText = `₹${snap.val() || 2450.00}`;
    });
}

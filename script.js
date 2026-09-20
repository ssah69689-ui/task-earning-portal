let userBalance = 500.00;
let userUid = "1268461";

function updateBalanceDisplay() {
    document.getElementById('headerWallet').innerText = `₹${userBalance.toFixed(2)}`;
    document.getElementById('mainBalance').innerText = `₹${userBalance.toFixed(2)}`;
}

function toggleAdminModal() {
    const modal = document.getElementById('adminModal');
    modal.classList.toggle('hidden');
}

function openDepositModal() {
    document.getElementById('depositModal').classList.remove('hidden');
}

function closeDepositModal() {
    document.getElementById('depositModal').classList.add('hidden');
}

function submitDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value) || 0;
    const utr = document.getElementById('utrNumber').value;
    if (amount < 100) {
        alert('⚠️ Minimum deposit amount is ₹100.');
        return;
    }
    if (!utr) {
        alert('⚠️ Please enter a valid 12-digit UTR number.');
        return;
    }
    // 2% First deposit bonus calculation
    let bonus = amount * 0.02;
    userBalance += (amount + bonus);
    updateBalanceDisplay();
    alert(`🎉 Deposit request submitted successfully! Your funds including 2% bonus (₹${bonus.toFixed(2)}) will reflect within 1 hour.`);
    closeDepositModal();
}

// 🟢 विड्रॉल सिस्टम: यूजर UPI ID या Bank Account Number दोनों में से कोई भी दे सकता है
function openWithdrawModal() {
    let amount = prompt("💸 Enter withdrawal amount (₹):");
    if (amount) {
        let withdrawAmount = parseFloat(amount);
        if (withdrawAmount <= 0 || isNaN(withdrawAmount)) {
            alert('⚠️ Please enter a valid amount.');
            return;
        }
        if (withdrawAmount > userBalance) {
            alert('❌ Insufficient balance in your wallet!');
        } else {
            let payoutDetail = prompt("🏦 Enter your payout detail:\n1. Your UPI ID (e.g. user@fampay)\n2. OR Bank Account Number & IFSC");
            if (payoutDetail && payoutDetail.trim() !== "") {
                userBalance -= withdrawAmount;
                updateBalanceDisplay();
                alert(`✅ Withdrawal request of ₹${withdrawAmount} submitted successfully!\nDestination: ${payoutDetail}\nSent to Admin approval queue.`);
            } else {
                alert('⚠️ Withdrawal cancelled because details were not provided.');
            }
        }
    }
}

function playLuckyNumberGame() {
    let guess = prompt("🎲 Choose a Lucky Number between 0 to 9:");
    if (guess !== null) {
        alert(`🎯 You chose ${guess}. House-Always-Wins mode active! Better luck next round.`);
        // Daily loss rebate check: ₹10 fixed cashback if balance goes low
        if (userBalance < 10) {
            userBalance += 10;
            updateBalanceDisplay();
            alert("🎁 Daily Loss Rebate: You received ₹10 cashback to continue playing!");
        }
    }
}

function playSpinWheel() {
    alert("🎡 Spinning the wheel... You won 1 Free Lucky Ticket!");
}

function shareReferralLink() {
    navigator.clipboard.writeText(`https://nexuswin.replit.app/ref=${userUid}`);
    alert("🔗 Referral link copied to clipboard! Share with friends to earn 1 free ticket per referral.");
}

function sendSupportMessage() {
    const input = document.getElementById('chatInput');
    const chatBox = document.getElementById('chatBox');
    if (input.value.trim() !== "") {
        chatBox.innerHTML += `<div class="text-right text-purple-300"><b>You:</b> ${input.value}</div>`;
        input.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function markSupportSuccess(btn) {
    btn.innerText = "✅ Success";
    btn.classList.remove('bg-green-600', 'hover:bg-green-700');
    btn.classList.add('bg-gray-600');
    document.getElementById('supportStatus').innerText = "✔️ Resolved";
    document.getElementById('supportStatus').className = "text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold";
    alert("🔒 Support ticket marked as Success. Chat closed and user status updated.");
}

function searchUserUid() {
    const query = document.getElementById('adminSearchInput').value;
    const resultBox = document.getElementById('searchResultBox');
    if (query === userUid || query === "1268461") {
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `
            <p><b>👤 Username:</b> shubham_dev</p>
            <p><b>🆔 UID:</b> 1268461</p>
            <p><b>💰 Wallet Balance:</b> ₹${userBalance.toFixed(2)}</p>
            <p><b>🟢 Status:</b> Active (Verified)</p>
        `;
    } else {
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `<p class="text-red-400">❌ User not found or invalid UID.</p>`;
    }
}

function saveRigNumber() {
    const num = document.getElementById('rigNumber').value;
    alert(`⚙️ Lucky Number successfully rigged! Winning number is now locked to: ${num}`);
}

function switchTab(tabName) {
    alert(`📱 Switched to ${tabName} tab.`);
}

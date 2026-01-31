// ตัวแปรเก็บข้อมูล
let playerName = '';
let discordId = '';
let boxes = [];
let selectedBoxIndex = null;
let gameStarted = false;
let remainingChances = 4; // จำนวนโอกาสที่เหลือ

// DOM Elements
const formSection = document.getElementById('formSection');
const gameSection = document.getElementById('gameSection');
const userForm = document.getElementById('userForm');
const boxesContainer = document.getElementById('boxesContainer');
const displayName = document.getElementById('displayName');
const displayDiscord = document.getElementById('displayDiscord');
const displayChances = document.getElementById('displayChances');
const resetBtn = document.getElementById('resetBtn');
const resultModal = document.getElementById('resultModal');
const resultContent = document.getElementById('resultContent');
const closeResultBtn = document.getElementById('closeResultBtn');
const closeModal = document.querySelector('.close');

// Event Listeners
userForm.addEventListener('submit', handleFormSubmit);
resetBtn.addEventListener('click', resetGame);
closeResultBtn.addEventListener('click', closeModalFunc);
closeModal.addEventListener('click', closeModalFunc);
window.addEventListener('click', (e) => {
    if (e.target === resultModal) {
        closeModalFunc();
    }
});

// จัดการฟอร์ม
function handleFormSubmit(e) {
    e.preventDefault();
    playerName = document.getElementById('playerName').value.trim();
    discordId = document.getElementById('discordId').value.trim();

    if (!playerName || !discordId) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    displayName.textContent = playerName;
    displayDiscord.textContent = discordId;
    
    // รีเซ็ตจำนวนโอกาสเมื่อเริ่มเกมใหม่
    remainingChances = 4;
    updateChancesDisplay();

    // เปลี่ยนหน้า
    formSection.classList.remove('active');
    gameSection.classList.add('active');

    // สร้างกล่อง
    createBoxes();
}

// สร้างกล่องสุ่ม
function createBoxes() {
    // ตรวจสอบว่ายังมีโอกาสเหลืออยู่หรือไม่
    if (remainingChances <= 0) {
        showNoChancesMessage();
        return;
    }

    boxesContainer.innerHTML = '';
    boxes = [];
    selectedBoxIndex = null;
    gameStarted = false;

    // สุ่มของให้แต่ละกล่อง
    for (let i = 0; i < CONFIG.boxCount; i++) {
        const item = getRandomItem();
        boxes.push(item);
        
        const box = document.createElement('div');
        box.className = 'box';
        box.dataset.index = i;
        
        const boxContent = document.createElement('div');
        boxContent.className = 'box-content';
        
        // สร้างภาพไอเทม
        const itemImage = document.createElement('img');
        itemImage.src = item.image || '';
        itemImage.alt = item.name;
        itemImage.className = 'item-image';
        itemImage.onerror = function() {
            // ถ้าไม่มีภาพ ให้แสดงชื่อแทน
            this.style.display = 'none';
            const textSpan = document.createElement('span');
            textSpan.className = 'item-name';
            textSpan.textContent = item.name;
            boxContent.appendChild(textSpan);
        };
        
        const itemName = document.createElement('span');
        itemName.className = 'item-name';
        itemName.textContent = item.name;
        
        boxContent.appendChild(itemImage);
        boxContent.appendChild(itemName);
        box.appendChild(boxContent);

        box.addEventListener('click', () => selectBox(i));
        boxesContainer.appendChild(box);
    }
}

// สุ่มของตามความน่าจะเป็น
function getRandomItem() {
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const item of CONFIG.items) {
        cumulative += item.probability;
        if (random <= cumulative) {
            return { ...item };
        }
    }

    // ถ้าไม่เจอ (ไม่ควรเกิดขึ้น) ให้คืนของสุดท้าย
    return { ...CONFIG.items[CONFIG.items.length - 1] };
}

// เลือกกล่อง
function selectBox(index) {
    if (gameStarted || selectedBoxIndex !== null) {
        return; // ถ้าเลือกไปแล้วหรือเกมเริ่มแล้ว ห้ามเลือกอีก
    }

    // ตรวจสอบว่ายังมีโอกาสเหลืออยู่หรือไม่
    if (remainingChances <= 0) {
        showNoChancesMessage();
        return;
    }

    selectedBoxIndex = index;
    gameStarted = true;
    
    // ลดจำนวนโอกาส
    remainingChances--;
    updateChancesDisplay();

    // แสดงผลลัพธ์
    const selectedBox = document.querySelector(`.box[data-index="${index}"]`);
    selectedBox.classList.add('selected');

    // ปิดการใช้งานกล่องอื่น
    document.querySelectorAll('.box').forEach((box, i) => {
        if (i !== index) {
            box.classList.add('disabled');
        }
    });

    // เปิดกล่องที่เลือก
    setTimeout(() => {
        selectedBox.classList.add('opened');
        selectedBox.classList.remove('selected');
        
        const result = boxes[index];
        showResult(result);
    }, 500);
}

// แสดงผลลัพธ์
function showResult(item) {
    resultContent.innerHTML = '';
    
    // สร้างภาพไอเทมใน modal
    const resultImage = document.createElement('img');
    resultImage.src = item.image || '';
    resultImage.alt = item.name;
    resultImage.className = 'result-image';
    resultImage.onerror = function() {
        this.style.display = 'none';
    };
    
    const resultText = document.createElement('div');
    resultText.className = 'result-text';
    resultText.textContent = `คุณได้รับ: ${item.name}`;
    
    // แสดงจำนวนโอกาสที่เหลือ
    const chancesInfo = document.createElement('div');
    chancesInfo.className = 'chances-info';
    chancesInfo.textContent = `โอกาสที่เหลือ: ${remainingChances} ครั้ง`;
    
    resultContent.appendChild(resultImage);
    resultContent.appendChild(resultText);
    resultContent.appendChild(chancesInfo);
    resultModal.classList.add('active');
    
    // ถ้าหมดโอกาส แสดงข้อความและเตรียมกลับหน้าหลัก
    if (remainingChances <= 0) {
        const endMessage = document.createElement('div');
        endMessage.className = 'end-message';
        endMessage.textContent = 'หมดโอกาสแล้ว กำลังกลับไปหน้าหลัก...';
        resultContent.appendChild(endMessage);
    }
}

// ปิด Modal
function closeModalFunc() {
    resultModal.classList.remove('active');
    
    // ถ้ายังมีโอกาสเหลือ ให้สร้างกล่องใหม่ทันที
    if (remainingChances > 0) {
        setTimeout(() => {
            createBoxes();
        }, 300);
    } else {
        // ถ้าหมดโอกาสแล้ว ให้กลับไปหน้าหลักอัตโนมัติหลังจาก 3 วินาที
        setTimeout(() => {
            resetToMainPage();
        }, 3000);
    }
}

// อัพเดทการแสดงจำนวนโอกาส
function updateChancesDisplay() {
    if (displayChances) {
        displayChances.textContent = remainingChances;
        
        // หา p element ที่มี chances-count
        const chancesP = displayChances.closest('p');
        
        // เปลี่ยนสีตามจำนวนโอกาสที่เหลือ
        if (remainingChances === 0) {
            chancesP.classList.add('no-chances');
            chancesP.classList.remove('low-chances');
        } else if (remainingChances <= 1) {
            chancesP.classList.add('low-chances');
            chancesP.classList.remove('no-chances');
        } else {
            chancesP.classList.remove('no-chances', 'low-chances');
        }
    }
}

// กลับไปหน้าหลักอัตโนมัติ
function resetToMainPage() {
    formSection.classList.add('active');
    gameSection.classList.remove('active');
    
    // เก็บข้อมูลเดิมไว้ และแสดงในฟอร์ม
    document.getElementById('playerName').value = playerName;
    document.getElementById('discordId').value = discordId;
    
    // รีเซ็ตเกม
    boxes = [];
    selectedBoxIndex = null;
    gameStarted = false;
    remainingChances = 4;
    updateChancesDisplay();
    
    // ลบข้อความหมดโอกาสถ้ามี
    const noChancesMessage = document.querySelector('.no-chances-message');
    if (noChancesMessage) {
        noChancesMessage.remove();
    }
    
    // ปิด modal ถ้าเปิดอยู่
    resultModal.classList.remove('active');
}

// เริ่มเกมใหม่ (ปุ่มเริ่มใหม่)
function resetGame() {
    if (confirm('คุณต้องการเริ่มเกมใหม่หรือไม่?')) {
        resetToMainPage();
    }
}


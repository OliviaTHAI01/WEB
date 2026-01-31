// ไฟล์ตั้งค่าระบบสุ่มของ
// แก้ไขค่าต่างๆ ตามต้องการ

const CONFIG = {
    // จำนวนกล่องที่จะแสดง
    boxCount: 12,

    // รายการของที่จะสุ่ม (ปรับ % และชื่อได้ตามต้องการ)
    items: [
        {
            name: "เกลือ",
            probability: 90,  // 90% โอกาสได้ (ไม่ได้อะไรเลย)
            rarity: "common",
            image: "images/salt.png"  // path ไปยังภาพ (แนะนำขนาด 200x200px หรือ 256x256px)
        },
        {
            name: "เพชร",
            probability: 5,  // 10% โอกาสได้
            rarity: "epic",
            image: "images/diamond.png"  // path ไปยังภาพ (แนะนำขนาด 200x200px หรือ 256x256px)
        }
    ],

    // สีตามความหายาก (ถ้าต้องการ)
    rarityColors: {
        legendary: "#FFD700",
        epic: "#9B59B6",
        rare: "#3498DB",
        common: "#95A5A6"
    }
};

// ตรวจสอบว่า % รวมกันได้ 100 หรือไม่
function validateConfig() {
    const totalProbability = CONFIG.items.reduce((sum, item) => sum + item.probability, 0);
    if (totalProbability !== 100) {
        console.warn(`⚠️ คำเตือน: ความน่าจะเป็นรวมกันได้ ${totalProbability}% ไม่เท่ากับ 100%`);
    }
}

// เรียกตรวจสอบเมื่อโหลด config
validateConfig();


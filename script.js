// Mátrix jelölések:
// 0: Szabad út, 1: Fal, 2: Hős, 3: Kulcs, 4: Ajtó, 5: Kijárat

const map = [
    [1, 1, 1, 1, 1, 5, 1], // 0. sor: Falak és a tetején a kijárat (5)
    [1, 2, 0, 1, 0, 0, 1], // 1. sor: Itt kezd a hős (2), szabad út (0) és falak (1)
    [1, 1, 0, 1, 0, 1, 1], // 2. sor: Falak és szabad utak
    [1, 3, 0, 4, 0, 0, 1], // 3. sor: Kulcs (3) és ajtó (4)
    [1, 1, 1, 1, 1, 0, 1], // 4. sor: Falak és szabad út
    [1, 0, 0, 0, 0, 0, 1], // 5. sor: Alsó folyosó
    [1, 1, 1, 1, 1, 1, 1]  // 6. sor: Kerítés/fal a pálya alján
];

// Állapotváltozók
let heroPos = { r: 1, c: 1 }; // Hős kezdő pozíciója (1. sor, 1. oszlop)
let hasKey = false; // A hősnek van-e kulcsa
let gameOver = false; // Játék vége állapot

const container = document.getElementById('game-container');
const statusDiv = document.getElementById('status');

// A pályát megjelenítő függvény
function renderBoard() {
    container.innerHTML = ''; // Töröljük a korábbi tartalmat

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            const cellValue = map[r][c];

            if (cellValue === 1) {
                cell.classList.add('wall'); // Fal
                cell.textContent = '█';
            } else if (cellValue === 0) {
                cell.classList.add('path'); // Szabad út
                cell.textContent = ' ';
            } else if (cellValue === 2) {
                cell.classList.add('hero'); // Hős
                cell.textContent = 'H';
            } else if (cellValue === 3) {
                cell.classList.add('key'); // Kulcs
                cell.textContent = 'K';
            } else if (cellValue === 4) {
                cell.classList.add('door'); // Ajtó
                cell.textContent = 'D';
            } else if (cellValue === 5) {
                cell.classList.add('exit'); // Kijárat
                cell.textContent = 'E';
            }

            container.appendChild(cell);
        }
    }            
}

// A hős mozgatása
function moveHero(dr, dc) {
    if (gameOver) return; // Ha a játék véget ért, ne engedjük a mozgást

    const newRow = heroPos.r + dr;
    const newCol = heroPos.c + dc;
    const targetCell = map[newRow][newCol];

    // Falba nem léphetünk
    if (targetCell === 1) return;

    
    // Kulcs felvétele
    if (targetCell === 3) {
        hasKey = true;
        statusDiv.textContent = "Felvetted a kulcsot! Most már kinyithatod az ajtót.";
    }

    // Ajtó kezelése (csak kulcsal nyílik)
    if (targetCell === 4) {
        if (hasKey) {
            statusDiv.textContent = "Az ajtó nyitva van! Jó utat!";
        } else {
            statusDiv.textContent = "Az ajtó zárva van! Keresd meg a kulcsot!";
            return; // Nem tud átlépni az ajtón kulcs nélkül
        }
    }

    // Kijárat elérése, győzelem
    if (targetCell === 5) {
        statusDiv.textContent = "Gratulálok! Elérted a kijáratot!";
        gameOver = true;
        return;
    }

    // Pozíció frissítése a hős mozgatása után
    map[heroPos.r][heroPos.c] = 0; // Eredeti hely szabad út lesz
    heroPos.r = newRow;
    heroPos.c = newCol;
    map[heroPos.r][heroPos.c] = 2; // Új helyen a hős lesz

    renderBoard(); // Újrarendereljük a pályát
}

// Billentyűzet események kezelése
window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'KeyW'].includes(event.code)) moveHero(-1, 0);   // Fel
    if (['ArrowDown', 'KeyS'].includes(event.code)) moveHero(1, 0);  // Le
    if (['ArrowLeft', 'KeyA'].includes(event.code)) moveHero(0, -1); // Balra
    if (['ArrowRight', 'KeyD'].includes(event.code)) moveHero(0, 1); // Jobbra
});

// Kezdő nézet kirajzolása
renderBoard();
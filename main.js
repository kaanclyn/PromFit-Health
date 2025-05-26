const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

// Klasör yolları
const PROFILES_DIR = path.join(__dirname, 'profiles');
const PHOTOS_DIR = path.join(PROFILES_DIR, 'profiles_photos');

// CSV başlıkları
const csvHeader = [
    { id: 'firstName', title: 'firstName' },
    { id: 'lastName', title: 'lastName' },
    { id: 'gender', title: 'gender' },
    { id: 'age', title: 'age' },
    { id: 'height', title: 'height' },
    { id: 'weight', title: 'weight' },
    { id: 'targetWeight', title: 'targetWeight' },
    { id: 'phone', title: 'phone' },
    { id: 'email', title: 'email' },
    { id: 'dailyCalories', title: 'dailyCalories' },
    { id: 'timestamp', title: 'timestamp' }
];

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: false,
        transparent: true,
        backgroundColor: '#00ffffff',
        fullscreen: true
    });

    mainWindow.loadFile('intro.html');
    
    if (process.argv.includes('--debug')) {
        mainWindow.webContents.openDevTools();
    }
}

// Klasörleri oluştur
function ensureDirectories() {
    if (!fs.existsSync(PROFILES_DIR)) {
        fs.mkdirSync(PROFILES_DIR);
    }
    if (!fs.existsSync(PHOTOS_DIR)) {
        fs.mkdirSync(PHOTOS_DIR);
    }
}

// CSV dosyası oluştur
function createProfileCSV(userName, data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${userName}_${timestamp}.csv`;
    const filePath = path.join(PROFILES_DIR, fileName);
    
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: csvHeader
    });

    const records = [{
        ...data,
        timestamp: timestamp
    }];

    return csvWriter.writeRecords(records);
}

// Fotoğrafı kaydet
function saveProfilePhoto(userName, photoData) {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${userName}_${timestamp}.png`;
        const filePath = path.join(PHOTOS_DIR, fileName);
        
        // Base64'ten fotoğraf verisini ayıkla
        const base64Data = photoData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Klasörün varlığını kontrol et
        if (!fs.existsSync(PHOTOS_DIR)) {
            fs.mkdirSync(PHOTOS_DIR, { recursive: true });
        }
        
        // Fotoğrafı kaydet
        fs.writeFileSync(filePath, buffer);
        console.log('Fotoğraf kaydedildi:', filePath);
        return fileName;
    } catch (error) {
        console.error('Fotoğraf kaydetme hatası:', error);
        throw error;
    }
}

// En son profil fotoğrafını getir
function getLatestProfilePhoto(userName) {
    try {
        const photos = fs.readdirSync(PHOTOS_DIR)
            .filter(file => file.startsWith(userName) && file.endsWith('.png'))
            .sort()
            .reverse();

        if (photos.length > 0) {
            const photoPath = path.join(PHOTOS_DIR, photos[0]);
            const photoData = fs.readFileSync(photoPath);
            return `data:image/png;base64,${photoData.toString('base64')}`;
        }
        return null;
    } catch (error) {
        console.error('Fotoğraf okuma hatası:', error);
        return null;
    }
}

// En son profil verilerini getir
function getLatestProfile(userName) {
    const files = fs.readdirSync(PROFILES_DIR)
        .filter(file => file.startsWith(userName) && file.endsWith('.csv'))
        .sort()
        .reverse();

    if (files.length === 0) return null;

    const latestFile = files[0];
    const filePath = path.join(PROFILES_DIR, latestFile);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',');
    const values = lines[1].split(',');
    
    const profile = {};
    headers.forEach((header, index) => {
        profile[header] = values[index];
    });

    // En son fotoğrafı getir
    profile.photo = getLatestProfilePhoto(userName);

    return profile;
}

// Tüm profillerden en son kaydedileni bul
function getLatestProfileFromAll() {
    try {
        const files = fs.readdirSync(PROFILES_DIR)
            .filter(file => file.endsWith('.csv'))
            .sort()
            .reverse();

        if (files.length === 0) return null;

        const latestFile = files[0];
        const userName = latestFile.split('_')[0] + '_' + latestFile.split('_')[1];
        return getLatestProfile(userName);
    } catch (error) {
        console.error('Profil okuma hatası:', error);
        return null;
    }
}

app.whenReady().then(() => {
    ensureDirectories();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Pencere kontrol olayları
ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on('close-window', () => {
    app.quit();
});

// Veri yönetimi olayları
ipcMain.on('save-data', (event, data) => {
    if (data.profile) {
        const { firstName, lastName, photo } = data.profile;
        const userName = `${firstName}_${lastName}`.toLowerCase();

        // CSV'ye kaydet
        createProfileCSV(userName, data.profile)
            .then(() => {
                // Fotoğraf varsa kaydet
                if (photo) {
                    saveProfilePhoto(userName, photo);
                }
                event.reply('data-saved', true);
            })
            .catch(error => {
                console.error('Veri kaydetme hatası:', error);
                event.reply('data-saved', false);
            });
    }
});

ipcMain.on('get-data', (event, userName) => {
    if (userName) {
        const profile = getLatestProfile(userName);
        event.reply('data-loaded', { profile });
    }
});

// En son profili getir
ipcMain.on('get-latest-profile', (event) => {
    const profile = getLatestProfileFromAll();
    event.reply('data-loaded', { profile });
});

// Antrenman verilerini kaydetme
ipcMain.on('save-workout', (event, workoutData) => {
    try {
        const workoutFile = path.join(PROFILES_DIR, 'workouts.json');
        let workouts = [];
        
        // Mevcut antrenmanları oku
        if (fs.existsSync(workoutFile)) {
            const data = fs.readFileSync(workoutFile, 'utf8');
            workouts = JSON.parse(data);
        }
        
        // Yeni antrenmanı ekle
        workouts.push(workoutData);
        
        // Dosyaya kaydet
        fs.writeFileSync(workoutFile, JSON.stringify(workouts, null, 2));
        
        // Başarılı kayıt bildirimi gönder
        event.reply('workout-saved', true);
        
        // Güncel verileri frontend'e gönder
        event.reply('workouts-loaded', workouts);
    } catch (error) {
        console.error('Antrenman kaydedilirken hata:', error);
        event.reply('workout-saved', false);
    }
});

// Yeni antrenman programı kaydetme
ipcMain.on('save-new-workout', (event, workoutData) => {
    try {
        const programsFile = path.join(PROFILES_DIR, 'workout_programs.json');
        let programs = [];
        
        // Mevcut programları oku
        if (fs.existsSync(programsFile)) {
            const data = fs.readFileSync(programsFile, 'utf8');
            programs = JSON.parse(data);
        }
        
        // Yeni programı ekle
        programs.push({
            ...workoutData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        });
        
        // Dosyaya kaydet
        fs.writeFileSync(programsFile, JSON.stringify(programs, null, 2));
        
        event.reply('workout-program-saved', true);
    } catch (error) {
        console.error('Antrenman programı kaydedilirken hata:', error);
        event.reply('workout-program-saved', false);
    }
});

// Antrenman verilerini getirme
ipcMain.on('get-workouts', (event) => {
    try {
        const workoutFile = path.join(PROFILES_DIR, 'workouts.json');
        let workouts = [];
        
        if (fs.existsSync(workoutFile)) {
            const data = fs.readFileSync(workoutFile, 'utf8');
            workouts = JSON.parse(data);
        }
        
        event.reply('workouts-loaded', workouts);
    } catch (error) {
        console.error('Antrenman verileri yüklenirken hata:', error);
        event.reply('workouts-loaded', []);
    }
});

// Antrenman programlarını getirme
ipcMain.on('get-workout-programs', (event) => {
    try {
        const programsFile = path.join(PROFILES_DIR, 'workout_programs.json');
        let programs = [];
        
        if (fs.existsSync(programsFile)) {
            const data = fs.readFileSync(programsFile, 'utf8');
            programs = JSON.parse(data);
        }
        
        event.reply('workout-programs-loaded', programs);
    } catch (error) {
        console.error('Antrenman programları yüklenirken hata:', error);
        event.reply('workout-programs-loaded', []);
    }
}); 
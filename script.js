const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    // Bildirim sistemi
    const notification = document.getElementById('notification');
    const notificationTitle = notification.querySelector('.notification-title');
    const notificationMessage = notification.querySelector('.notification-message');
    const notificationIcon = notification.querySelector('i');

    function showNotification(type, title, message) {
        // Önceki bildirimi kaldır
        notification.classList.remove('active', 'success', 'error');
        
        // Yeni bildirimi ayarla
        notification.classList.add(type);
        notificationTitle.textContent = title;
        notificationMessage.textContent = message;
        notificationIcon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        
        // Bildirimi göster
        setTimeout(() => {
            notification.classList.add('active');
        }, 100);

        // Bildirimi otomatik kapat
        setTimeout(() => {
            notification.classList.remove('active');
        }, 3000);
    }

    // Tema değiştirme
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Kaydedilmiş temayı yükle
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Pencere kontrolleri
    const minimizeBtn = document.querySelector('.minimize-btn');
    const maximizeBtn = document.querySelector('.maximize-btn');
    const closeBtn = document.querySelector('.close-btn');
    const closeModal = document.getElementById('closeConfirmModal');
    const cancelClose = document.getElementById('cancelClose');
    const confirmClose = document.getElementById('confirmClose');

    minimizeBtn.addEventListener('click', () => {
        ipcRenderer.send('minimize-window');
    });

    maximizeBtn.addEventListener('click', () => {
        ipcRenderer.send('maximize-window');
    });

    closeBtn.addEventListener('click', () => {
        closeModal.classList.add('active');
    });

    cancelClose.addEventListener('click', () => {
        closeModal.classList.remove('active');
    });

    confirmClose.addEventListener('click', () => {
        ipcRenderer.send('close-window');
    });

    // Navigasyon
    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.content-area > div');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Aktif link'i güncelle
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            // Sayfa geçiş animasyonu
            pages.forEach(page => {
                if (page.id === targetId) {
                    page.style.opacity = '0';
                    page.style.transform = 'translateX(50px)';
                    setTimeout(() => {
                        pages.forEach(p => p.classList.remove('active'));
                        page.classList.add('active');
                        setTimeout(() => {
                            page.style.opacity = '1';
                            page.style.transform = 'translateX(0)';
                        }, 50);
                    }, 300);
                }
            });
        });
    });

    // Profil Fotoğrafı Değiştirme
    const changePhotoBtn = document.querySelector('.change-photo-btn');
    const photoInput = document.getElementById('photo-input');
    const profilePhoto = document.getElementById('profile-photo');
    const profilePhotoLarge = document.getElementById('profile-photo-large');
    let selectedPhotoData = null; // Seçilen fotoğrafı geçici olarak saklamak için

    changePhotoBtn.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Dosya boyutu kontrolü (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('error', 'Hata!', 'Fotoğraf boyutu 5MB\'dan küçük olmalıdır.');
                return;
            }

            // Dosya tipi kontrolü
            if (!file.type.startsWith('image/')) {
                showNotification('error', 'Hata!', 'Lütfen geçerli bir resim dosyası seçin.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                
                // Resmi yüklemeden önce boyutlandır
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_SIZE = 800;
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Sıkıştırılmış resmi al
                    const compressedImageData = canvas.toDataURL('image/png', 0.8);
                    
                    // Önizleme göster
                    profilePhoto.src = compressedImageData;
                    profilePhotoLarge.src = compressedImageData;
                    
                    // Fotoğrafı geçici olarak sakla
                    selectedPhotoData = compressedImageData;
                };
                img.src = imageData;
            };
            reader.readAsDataURL(file);
        }
    });

    // Profil Formu
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            gender: document.getElementById('gender').value,
            age: document.getElementById('age').value,
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            targetWeight: document.getElementById('targetWeight').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value
        };

        // BMR hesapla
        const bmr = calculateBMR(formData);
        formData.dailyCalories = bmr;

        // Seçilen fotoğraf varsa ekle
        if (selectedPhotoData) {
            formData.photo = selectedPhotoData;
        }

        // Profil verilerini kaydet
        saveProfileData(formData);
        
        // Form gönderildikten sonra seçili fotoğrafı sıfırla
        selectedPhotoData = null;
    });

    // BMR hesaplama fonksiyonu
    function calculateBMR(data) {
        const weight = parseFloat(data.weight);
        const height = parseFloat(data.height);
        const age = parseFloat(data.age);
        const gender = data.gender;

        let bmr;
        if (gender === 'female') {
            bmr = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
        } else {
            // Erkek veya belirtmek istemiyorum seçeneği için erkek formülü kullan
            bmr = 66 + (13.7 * weight) + (5 * height) - (6.8 * age);
        }

        // Günlük aktivite seviyesine göre kalori ihtiyacını hesapla (sedanter yaşam için)
        const dailyCalories = Math.round(bmr * 1.2);
        return dailyCalories;
    }

    // Profil verilerini kaydet
    function saveProfileData(data) {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        if (firstName && lastName) {
            const userName = `${firstName}_${lastName}`.toLowerCase();
            ipcRenderer.send('save-data', { profile: { ...data, firstName, lastName } });
        } else {
            showNotification('error', 'Hata!', 'İsim ve soyisim alanları zorunludur.');
        }
    }

    // Profil verilerini yükle
    function loadProfileData() {
        ipcRenderer.send('get-latest-profile');
    }

    // BMI hesaplama fonksiyonu
    function calculateBMI(weight, height) {
        // Boyu metreye çevir
        const heightInMeters = height / 100;
        // BMI hesapla
        const bmi = weight / (heightInMeters * heightInMeters);
        return bmi.toFixed(1);
    }

    // BMI kategorisini belirle
    function getBMICategory(bmi) {
        if (bmi < 18.5) return { category: 'Zayıf', class: 'underweight' };
        if (bmi < 25) return { category: 'Normal', class: 'normal' };
        if (bmi < 30) return { category: 'Fazla Kilolu', class: 'overweight' };
        return { category: 'Obez', class: 'obese' };
    }

    // İdeal kilo aralığını hesapla
    function calculateIdealWeight(height) {
        // Boyu metreye çevir
        const heightInMeters = height / 100;
        // İdeal kilo aralığı (BMI 18.5 - 24.9 arası)
        const minWeight = (18.5 * heightInMeters * heightInMeters).toFixed(1);
        const maxWeight = (24.9 * heightInMeters * heightInMeters).toFixed(1);
        return `${minWeight} - ${maxWeight}`;
    }

    // Ana sayfa profilini güncelle
    function updateDashboardProfile(data) {
        const userName = document.getElementById('user-name');
        const targetWeight = document.getElementById('target-weight');
        const dailyCalories = document.getElementById('daily-calories');
        const bmiValue = document.getElementById('bmi-value');
        const bmiCategory = document.getElementById('bmi-category');
        const idealWeight = document.getElementById('ideal-weight');
        
        if (data.firstName && data.lastName) {
            userName.textContent = `${data.firstName} ${data.lastName}`;
        }
        
        if (data.targetWeight) {
            targetWeight.textContent = `${data.targetWeight} kg`;
        } else {
            targetWeight.textContent = '-- kg';
        }

        if (data.dailyCalories) {
            dailyCalories.textContent = `${data.dailyCalories} kcal`;
        } else {
            dailyCalories.textContent = '-- kcal';
        }

        // BMI ve ideal kilo hesapla
        if (data.weight && data.height) {
            const bmi = calculateBMI(parseFloat(data.weight), parseFloat(data.height));
            const bmiInfo = getBMICategory(parseFloat(bmi));
            
            bmiValue.textContent = bmi;
            bmiCategory.textContent = bmiInfo.category;
            bmiCategory.className = `bmi-category ${bmiInfo.class}`;
            
            idealWeight.textContent = calculateIdealWeight(parseFloat(data.height));
        } else {
            bmiValue.textContent = '--';
            bmiCategory.textContent = '--';
            bmiCategory.className = 'bmi-category';
            idealWeight.textContent = '-- kg';
        }

        // Fotoğrafı güncelle
        if (data.photo) {
            profilePhoto.src = data.photo;
            profilePhotoLarge.src = data.photo;
        } else {
            profilePhoto.src = 'default-avatar.png';
            profilePhotoLarge.src = 'default-avatar.png';
        }
    }

    // Veri yüklendiğinde
    ipcRenderer.on('data-loaded', (event, data) => {
        if (data && data.profile) {
            // Form alanlarını doldur
            const profile = data.profile;
            document.getElementById('firstName').value = profile.firstName || '';
            document.getElementById('lastName').value = profile.lastName || '';
            document.getElementById('age').value = profile.age || '';
            document.getElementById('height').value = profile.height || '';
            document.getElementById('weight').value = profile.weight || '';
            document.getElementById('targetWeight').value = profile.targetWeight || '';
            document.getElementById('phone').value = profile.phone || '';
            document.getElementById('email').value = profile.email || '';

            // Fotoğrafı güncelle
            if (profile.photo) {
                profilePhoto.src = profile.photo;
                profilePhotoLarge.src = profile.photo;
            }

            // Ana sayfa profilini güncelle
            updateDashboardProfile(profile);
        } else {
            // Varsayılan değerleri ayarla
            updateDashboardProfile({});
        }
    });

    // Veri kaydedildiğinde
    ipcRenderer.on('data-saved', (event, success) => {
        if (success) {
            showNotification('success', 'Başarılı!', 'Bilgileriniz başarıyla kaydedildi.');
            // Verileri tekrar yükle
            loadProfileData();
        } else {
            showNotification('error', 'Hata!', 'Bilgileriniz kaydedilirken bir hata oluştu.');
        }
    });

    // Hızlı erişim butonları
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.textContent.trim();
            switch(action) {
                case 'Yeni Antrenman':
                    document.querySelector('a[href="#workout"]').click();
                    break;
                case 'Öğün Ekle':
                    document.querySelector('a[href="#nutrition"]').click();
                    break;
                case 'İlerleme Raporu':
                    document.querySelector('a[href="#stats"]').click();
                    break;
            }
        });
    });

    // İlk yükleme
    loadProfileData();

    // Sidebar Toggle
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const toggleIcon = sidebarToggle.querySelector('i');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        toggleIcon.classList.toggle('fa-chevron-left');
        toggleIcon.classList.toggle('fa-chevron-right');
    });

    // Antrenman Sayfası Fonksiyonları
    let workoutTimer;
    let workoutSeconds = 0;
    const workoutTimeDisplay = document.getElementById('workout-time');
    const startWorkoutBtn = document.getElementById('startWorkoutBtn');
    const pauseWorkoutBtn = document.getElementById('pauseWorkoutBtn');
    const endWorkoutBtn = document.getElementById('endWorkoutBtn');

    // Antrenman verilerini yükle
    function loadWorkoutData() {
        ipcRenderer.send('get-workouts');
    }

    // Antrenman verilerini güncelle
    function updateWorkoutStats(workouts) {
        const today = new Date().toISOString().split('T')[0];
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekStartStr = weekStart.toISOString().split('T')[0];

        // Haftalık istatistikler
        const weeklyWorkouts = workouts.filter(w => w.date >= weekStartStr);
        const weeklyCalories = weeklyWorkouts.reduce((sum, w) => sum + w.calories, 0);
        const weeklyTime = weeklyWorkouts.reduce((sum, w) => sum + w.duration, 0);
        const uniqueDays = new Set(weeklyWorkouts.map(w => w.date.split('T')[0])).size;

        // Günlük istatistikler
        const dailyWorkouts = workouts.filter(w => w.date.split('T')[0] === today);
        const dailyCalories = dailyWorkouts.reduce((sum, w) => sum + w.calories, 0);

        // Antrenman sayfası istatistiklerini güncelle
        document.getElementById('weekly-workouts-count').textContent = `${weeklyWorkouts.length} antrenman`;
        document.getElementById('weekly-workouts-days').textContent = `${uniqueDays} / 5 gün`;
        document.getElementById('total-calories').textContent = `${weeklyCalories} kcal`;
        document.getElementById('weekly-calories').textContent = `${weeklyCalories} kcal bu hafta`;
        document.getElementById('total-time').textContent = `${Math.round(weeklyTime / 60)} saat`;
        document.getElementById('weekly-time').textContent = `${Math.round(weeklyTime / 60)} saat bu hafta`;

        // Ana sayfa istatistiklerini güncelle
        document.getElementById('daily-workouts').textContent = `${dailyWorkouts.length} antrenman`;
        document.getElementById('daily-calories-burned').textContent = `${dailyCalories} kcal`;
        document.getElementById('weekly-workouts').textContent = `${uniqueDays} / 5 gün`;
        document.getElementById('weekly-calories').textContent = `${weeklyCalories} kcal`;

        // Son antrenmanları göster
        updateWorkoutList(workouts);
    }

    let displayedWorkouts = 2; // Başlangıçta gösterilecek antrenman sayısı

    function updateWorkoutList(workouts) {
        const workoutList = document.querySelector('#workout .workout-list');
        if (!workoutList) return;
        
        workoutList.innerHTML = '';

        // Son antrenmanları al ve tersine çevir
        const recentWorkouts = workouts.slice().reverse();
        
        if (recentWorkouts.length === 0) {
            workoutList.innerHTML = '<div class="no-workouts">Henüz antrenman kaydı bulunmuyor.</div>';
            return;
        }

        // Sadece gösterilecek kadar antrenmanı al
        const workoutsToShow = recentWorkouts.slice(0, displayedWorkouts);
        
        workoutsToShow.forEach(workout => {
            const date = new Date(workout.date);
            const formattedDate = date.toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
            });

            const workoutItem = document.createElement('div');
            workoutItem.className = 'workout-item';
            workoutItem.innerHTML = `
                <div class="workout-info">
                    <span class="workout-name">${workout.name}</span>
                    <div class="workout-details">
                        <span>${workout.duration} dakika</span>
                        <span>${formattedDate}</span>
                    </div>
                </div>
                <span class="workout-calories">${workout.calories} kcal</span>
            `;
            workoutList.appendChild(workoutItem);
        });

        // Daha fazla butonu ekle
        if (displayedWorkouts < recentWorkouts.length) {
            const loadMoreBtn = document.createElement('button');
            loadMoreBtn.className = 'load-more-btn';
            loadMoreBtn.innerHTML = `
                <i class="fas fa-chevron-down"></i>
                Daha Fazla Göster
            `;
            loadMoreBtn.addEventListener('click', () => {
                displayedWorkouts += 2;
                updateWorkoutList(workouts);
            });
            workoutList.appendChild(loadMoreBtn);
        } else if (recentWorkouts.length > 0) {
            // Tüm veriler gösterildiğinde modern uyarı göster
            const allShownMessage = document.createElement('div');
            allShownMessage.className = 'all-shown-message';
            allShownMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>Tüm antrenmanlar görüntülendi</span>
            `;
            workoutList.appendChild(allShownMessage);
        }
    }

    // Antrenman başlatma
    startWorkoutBtn.addEventListener('click', () => {
        startWorkoutBtn.disabled = true;
        pauseWorkoutBtn.disabled = false;
        endWorkoutBtn.disabled = false;
        
        workoutTimer = setInterval(() => {
            workoutSeconds++;
            updateWorkoutTimer();
        }, 1000);
    });

    // Antrenman duraklatma
    pauseWorkoutBtn.addEventListener('click', () => {
        clearInterval(workoutTimer);
        startWorkoutBtn.disabled = false;
        pauseWorkoutBtn.disabled = true;
    });

    // Antrenman bitirme
    endWorkoutBtn.addEventListener('click', () => {
        clearInterval(workoutTimer);
        workoutSeconds = 0;
        updateWorkoutTimer();
        startWorkoutBtn.disabled = false;
        pauseWorkoutBtn.disabled = true;
        endWorkoutBtn.disabled = true;
        
        // Antrenman verilerini kaydet
        saveWorkoutData();
        // Antrenman verilerini yeniden yükle
        loadWorkoutData();
    });

    // Zamanlayıcı güncelleme
    function updateWorkoutTimer() {
        const hours = Math.floor(workoutSeconds / 3600);
        const minutes = Math.floor((workoutSeconds % 3600) / 60);
        const seconds = workoutSeconds % 60;
        
        workoutTimeDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Antrenman verilerini kaydetme
    function saveWorkoutData() {
        const workoutData = {
            duration: workoutSeconds,
            date: new Date().toISOString(),
            exercises: [], // Egzersiz listesi buraya eklenecek
            calories: calculateCaloriesBurned(workoutSeconds)
        };

        // Verileri kaydet
        ipcRenderer.send('save-workout', workoutData);
    }

    // Yakılan kalori hesaplama
    function calculateCaloriesBurned(duration) {
        // Basit bir hesaplama: 1 saatte ortalama 500 kalori
        return Math.round((duration / 3600) * 500);
    }

    // Antrenman verileri yüklendiğinde
    ipcRenderer.on('workouts-loaded', (event, workouts) => {
        updateWorkoutStats(workouts);
    });

    // Sayfa yüklendiğinde antrenman verilerini yükle
    loadWorkoutData();

    // Program filtreleme
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            filterPrograms(filter);
        });
    });

    // Programları filtreleme
    function filterPrograms(filter) {
        const programs = document.querySelectorAll('.program-card');
        programs.forEach(program => {
            if (filter === 'all' || program.dataset.type === filter) {
                program.style.display = 'block';
            } else {
                program.style.display = 'none';
            }
        });
    }

    // Egzersiz kütüphanesi
    const exercises = [
        { name: 'Atletizm (sprint)', calories: 630 },
        { name: 'Atletizm (uzun mesafe)', calories: 700 },
        { name: 'Badminton', calories: 385 },
        { name: 'Basketbol', calories: 560 },
        { name: 'Beyzbol', calories: 301 },
        { name: 'Binicilik', calories: 280 },
        { name: 'Bisiklet (20 km/s)', calories: 595 },
        { name: 'Boks (antrenman)', calories: 630 },
        { name: 'Buz hokeyi', calories: 630 },
        { name: 'Çim hokeyi', calories: 560 },
        { name: 'CrossFit', calories: 700 },
        { name: 'Curling', calories: 210 },
        { name: 'Dağcılık', calories: 630 },
        { name: 'Dans (aktif)', calories: 350 },
        { name: 'Futbol', calories: 630 },
        { name: 'Golf (yürüyerek)', calories: 280 },
        { name: 'Güreş', calories: 546 },
        { name: 'Halter', calories: 420 },
        { name: 'Hiking (yürüyüş)', calories: 441 },
        { name: 'Jimnastik', calories: 350 },
        { name: 'Kanu', calories: 350 },
        { name: 'Kayak (alp disiplini)', calories: 490 },
        { name: 'Kayaking', calories: 350 },
        { name: 'Kaykay', calories: 350 },
        { name: 'Kickboks', calories: 665 },
        { name: 'Koşu (8 km/s)', calories: 686 },
        { name: 'Kriket', calories: 280 },
        { name: 'Maraton koşusu', calories: 910 },
        { name: 'Masa Tenisi', calories: 280 },
        { name: 'Okçuluk', calories: 175 },
        { name: 'Parkour', calories: 595 },
        { name: 'Pilates', calories: 245 },
        { name: 'Raketbol', calories: 560 },
        { name: 'Rollerblade', calories: 560 },
        { name: 'Scuba diving', calories: 350 },
        { name: 'Serbest dalış', calories: 420 },
        { name: 'Serbest stil yüzme', calories: 686 },
        { name: 'Snowboard', calories: 371 },
        { name: 'Softbol', calories: 315 },
        { name: 'Squash', calories: 665 },
        { name: 'Su kayağı', calories: 420 },
        { name: 'Su topu', calories: 560 },
        { name: 'Tenis (tekli)', calories: 511 },
        { name: 'Trambolin', calories: 280 },
        { name: 'Triatlon', calories: 770 },
        { name: 'Voleybol', calories: 280 },
        { name: 'Yelken', calories: 210 },
        { name: 'Yoga', calories: 210 },
        { name: 'Yüzme (orta tempo)', calories: 560 },
        { name: 'Zumba', calories: 455 }
    ];

    // Egzersiz kütüphanesini oluştur
    function initializeExerciseLibrary() {
        const exercisesGrid = document.getElementById('exercisesGrid');
        
        // Egzersizleri alfabetik sırala
        exercises.sort((a, b) => a.name.localeCompare(b.name));
        
        // Egzersiz kartlarını oluştur
        exercises.forEach(exercise => {
            const card = document.createElement('div');
            card.className = 'exercise-card';
            card.dataset.calories = exercise.calories;
            card.innerHTML = `
                <h4>${exercise.name}</h4>
                <p>1 saatte yakılan kalori:</p>
                <p class="calories">${exercise.calories} kcal</p>
            `;
            
            // Kart tıklama olayı
            card.addEventListener('click', () => {
                // Önceki seçimi kaldır
                document.querySelectorAll('.exercise-card').forEach(c => c.classList.remove('selected'));
                // Yeni seçimi işaretle
                card.classList.add('selected');
                
                // Seçilen egzersiz bilgilerini güncelle
                document.getElementById('selectedExerciseName').textContent = exercise.name;
                document.getElementById('selectedExerciseCalories').textContent = `${exercise.calories} kcal/saat`;
                
                // Süre varsa kaloriyi hesapla
                const duration = document.getElementById('exerciseDuration').value;
                if (duration) {
                    calculateCalories();
                }
                
                // Kaydet butonunu aktif et
                document.getElementById('saveExerciseBtn').disabled = false;
            });
            
            exercisesGrid.appendChild(card);
        });
    }

    // Kalori hesaplama
    const exerciseDuration = document.getElementById('exerciseDuration');
    const caloriesBurned = document.getElementById('caloriesBurned');
    const saveExerciseBtn = document.getElementById('saveExerciseBtn');

    function calculateCalories() {
        const selectedCard = document.querySelector('.exercise-card.selected');
        if (selectedCard && exerciseDuration.value) {
            const caloriesPerHour = parseInt(selectedCard.dataset.calories);
            const duration = parseInt(exerciseDuration.value);
            const calories = Math.round((caloriesPerHour / 60) * duration);
            caloriesBurned.textContent = `${calories} kcal`;
        } else {
            caloriesBurned.textContent = '0 kcal';
        }
    }

    exerciseDuration.addEventListener('input', calculateCalories);

    // Egzersiz kaydetme
    saveExerciseBtn.addEventListener('click', () => {
        const selectedCard = document.querySelector('.exercise-card.selected');
        if (!selectedCard || !exerciseDuration.value) {
            showNotification('error', 'Hata!', 'Lütfen egzersiz ve süre seçin.');
            return;
        }

        const exerciseName = selectedCard.querySelector('h4').textContent;
        const caloriesPerHour = parseInt(selectedCard.dataset.calories);
        const duration = parseInt(exerciseDuration.value);
        const calories = Math.round((caloriesPerHour / 60) * duration);

        const exerciseData = {
            name: exerciseName,
            duration: duration,
            calories: calories,
            date: new Date().toISOString()
        };

        // Egzersiz verilerini kaydet
        ipcRenderer.send('save-workout', exerciseData);
        
        // Formu sıfırla
        selectedCard.classList.remove('selected');
        document.getElementById('selectedExerciseName').textContent = 'Henüz egzersiz seçilmedi';
        document.getElementById('selectedExerciseCalories').textContent = '0 kcal/saat';
        exerciseDuration.value = '';
        caloriesBurned.textContent = '0 kcal';
        saveExerciseBtn.disabled = true;
        
        showNotification('success', 'Başarılı!', 'Egzersiz kaydedildi.');

        // Verileri anlık olarak güncelle
        loadWorkoutData();
    });

    // Sayfa yüklendiğinde
    initializeExerciseLibrary();

    // Öneriler sayfasını güncelle
    function updateRecommendations(data) {
        if (!data.weight || !data.height) {
            return;
        }

        const bmi = calculateBMI(parseFloat(data.weight), parseFloat(data.height));
        const bmiInfo = getBMICategory(parseFloat(bmi));
        
        // BMI durumunu güncelle
        document.getElementById('bmi-status-value').textContent = bmi;
        const bmiCategoryElement = document.getElementById('bmi-status-category');
        bmiCategoryElement.textContent = bmiInfo.category;
        bmiCategoryElement.className = `bmi-category ${bmiInfo.class}`;

        // BMI ilerleme çubuğunu güncelle
        updateBMIProgress(bmi);

        // BMI açıklamasını güncelle
        const bmiDescription = document.getElementById('bmi-description');
        bmiDescription.innerHTML = getBMIDescription(bmiInfo.category);

        // Önerileri güncelle
        document.getElementById('nutrition-recommendations').innerHTML = getNutritionRecommendations(bmiInfo.category, data);
        document.getElementById('exercise-recommendations').innerHTML = getExerciseRecommendations(bmiInfo.category, data);
        document.getElementById('health-recommendations').innerHTML = getHealthRecommendations(bmiInfo.category, data);

        // Hedef takibini güncelle
        updateGoalProgress(data);

        // Motivasyon alıntısını güncelle
        updateMotivationQuote(bmiInfo.category);
    }

    // BMI ilerleme çubuğunu güncelle
    function updateBMIProgress(bmi) {
        const progressFill = document.getElementById('bmi-progress-fill');
        let progress = 0;

        if (bmi < 18.5) {
            progress = (bmi / 18.5) * 25;
        } else if (bmi < 25) {
            progress = 25 + ((bmi - 18.5) / 6.5) * 25;
        } else if (bmi < 30) {
            progress = 50 + ((bmi - 25) / 5) * 25;
        } else {
            progress = 75 + Math.min(((bmi - 30) / 10) * 25, 25);
        }

        progressFill.style.width = `${progress}%`;
    }

    // Hedef takibini güncelle
    function updateGoalProgress(data) {
        // Hedef kilo ilerlemesi
        const targetWeight = parseFloat(data.targetWeight);
        const currentWeight = parseFloat(data.weight);
        const initialWeight = parseFloat(data.initialWeight) || currentWeight;
        
        const weightProgress = document.getElementById('weight-progress');
        const targetWeightValue = document.getElementById('target-weight-value');
        
        if (targetWeight && currentWeight) {
            const progress = Math.abs((currentWeight - initialWeight) / (targetWeight - initialWeight)) * 100;
            weightProgress.style.width = `${Math.min(progress, 100)}%`;
            targetWeightValue.textContent = `${targetWeight} kg`;
        }

        // Antrenman ilerlemesi
        const workoutProgress = document.getElementById('workout-progress');
        const workoutProgressFill = document.getElementById('workout-progress-fill');
        
        if (data.weeklyWorkouts) {
            const progress = (data.weeklyWorkouts / 5) * 100;
            workoutProgress.textContent = `${data.weeklyWorkouts}/5 gün`;
            workoutProgressFill.style.width = `${progress}%`;
        }
    }

    // Motivasyon alıntısını güncelle
    function updateMotivationQuote(category) {
        const quotes = {
            'Zayıf': [
                { text: 'Sağlıklı bir şekilde kilo almak, sabır ve kararlılık gerektirir.', author: 'PromFit' },
                { text: 'Her öğün, sağlıklı bir geleceğe atılan bir adımdır.', author: 'PromFit' }
            ],
            'Normal': [
                { text: 'Sağlıklı bir yaşam, günlük alışkanlıkların toplamıdır.', author: 'PromFit' },
                { text: 'Küçük değişiklikler, büyük sonuçlar doğurur.', author: 'PromFit' }
            ],
            'Fazla Kilolu': [
                { text: 'Her gün, yeni bir başlangıç için fırsattır.', author: 'PromFit' },
                { text: 'Sağlıklı bir yaşam için attığın her adım önemlidir.', author: 'PromFit' }
            ],
            'Obez': [
                { text: 'Değişim, bugün attığın ilk adımla başlar.', author: 'PromFit' },
                { text: 'Her küçük başarı, büyük bir zaferin parçasıdır.', author: 'PromFit' }
            ]
        };

        const categoryQuotes = quotes[category] || quotes['Normal'];
        const randomQuote = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];

        document.getElementById('motivation-quote').textContent = randomQuote.text;
        document.getElementById('quote-author').textContent = `- ${randomQuote.author}`;
    }

    // Detaylı beslenme planı
    function showDetailedNutrition() {
        // Bu fonksiyon daha sonra detaylı beslenme planı modalını gösterecek
        showNotification('info', 'Bilgi', 'Detaylı beslenme planı yakında eklenecek.');
    }

    // Haftalık program
    function showDetailedExercise() {
        // Bu fonksiyon daha sonra haftalık program modalını gösterecek
        showNotification('info', 'Bilgi', 'Haftalık program yakında eklenecek.');
    }

    // Sağlık ipuçları
    function showHealthTips() {
        // Bu fonksiyon daha sonra sağlık ipuçları modalını gösterecek
        showNotification('info', 'Bilgi', 'Sağlık ipuçları yakında eklenecek.');
    }

    // Detaylı ilerleme
    function showGoalDetails() {
        // Bu fonksiyon daha sonra detaylı ilerleme modalını gösterecek
        showNotification('info', 'Bilgi', 'Detaylı ilerleme raporu yakında eklenecek.');
    }

    // BMI açıklaması
    function getBMIDescription(category) {
        const descriptions = {
            'Zayıf': 'Vücut kitle indeksiniz normal aralığın altında. Sağlıklı bir şekilde kilo almanız önerilir.',
            'Normal': 'Vücut kitle indeksiniz normal aralıkta. Mevcut kilonuzu korumaya devam edin.',
            'Fazla Kilolu': 'Vücut kitle indeksiniz normal aralığın üstünde. Sağlıklı bir şekilde kilo vermeniz önerilir.',
            'Obez': 'Vücut kitle indeksiniz obezite sınırının üzerinde. Sağlıklı bir şekilde kilo vermeniz ve bir uzmana danışmanız önerilir.'
        };
        return descriptions[category] || 'BMI değeriniz hesaplanamadı.';
    }

    // Beslenme önerileri
    function getNutritionRecommendations(category, data) {
        const recommendations = {
            'Zayıf': `
                <p>Sağlıklı kilo alımı için öneriler:</p>
                <ul>
                    <li>Günlük kalori alımınızı <span class="highlight">${Math.round(data.dailyCalories * 1.2)} kcal</span> seviyesine çıkarın</li>
                    <li>Protein açısından zengin besinler tüketin (et, balık, yumurta, süt ürünleri)</li>
                    <li>Sağlıklı yağlar ekleyin (zeytinyağı, avokado, kuruyemişler)</li>
                    <li>Öğün sayınızı artırın (5-6 öğün)</li>
                    <li>Karbonhidrat alımınızı artırın (tam tahıllar, meyveler)</li>
                </ul>
            `,
            'Normal': `
                <p>Sağlıklı kilonuzu korumak için öneriler:</p>
                <ul>
                    <li>Günlük kalori alımınızı <span class="highlight">${data.dailyCalories} kcal</span> seviyesinde tutun</li>
                    <li>Dengeli beslenme planı uygulayın</li>
                    <li>Protein, karbonhidrat ve yağ dengesini koruyun</li>
                    <li>Bol su tüketin (günde en az 2-2.5 litre)</li>
                    <li>Mevsimsel meyve ve sebzeleri tüketin</li>
                </ul>
            `,
            'Fazla Kilolu': `
                <p>Sağlıklı kilo vermek için öneriler:</p>
                <ul>
                    <li>Günlük kalori alımınızı <span class="highlight">${Math.round(data.dailyCalories * 0.8)} kcal</span> seviyesine düşürün</li>
                    <li>Porsiyonlarınızı küçültün</li>
                    <li>Şeker ve işlenmiş gıdalardan kaçının</li>
                    <li>Protein ağırlıklı beslenin</li>
                    <li>Sebze ve meyve tüketimini artırın</li>
                </ul>
            `,
            'Obez': `
                <p>Sağlıklı kilo vermek için öneriler:</p>
                <ul>
                    <li>Günlük kalori alımınızı <span class="highlight">${Math.round(data.dailyCalories * 0.7)} kcal</span> seviyesine düşürün</li>
                    <li>Bir diyetisyene danışın</li>
                    <li>Şeker ve işlenmiş gıdaları tamamen bırakın</li>
                    <li>Protein ağırlıklı, düşük karbonhidratlı beslenin</li>
                    <li>Sebze tüketimini artırın</li>
                    <li>Öğün sayısını azaltın (3 ana öğün)</li>
                </ul>
            `
        };
        return recommendations[category] || '<p>Beslenme önerileri için BMI değeriniz hesaplanmalıdır.</p>';
    }

    // Egzersiz önerileri
    function getExerciseRecommendations(category, data) {
        const recommendations = {
            'Zayıf': `
                <p>Kas kütlenizi artırmak için öneriler:</p>
                <ul>
                    <li>Haftada 3-4 gün kuvvet antrenmanı yapın</li>
                    <li>Bileşik egzersizlere odaklanın (squat, deadlift, bench press)</li>
                    <li>Setler arası dinlenme süresini 2-3 dakika tutun</li>
                    <li>Kardiyo egzersizlerini sınırlayın (haftada 2-3 gün)</li>
                    <li>İlerleyici aşırı yükleme prensibini uygulayın</li>
                </ul>
            `,
            'Normal': `
                <p>Fitness seviyenizi korumak için öneriler:</p>
                <ul>
                    <li>Haftada 3-4 gün egzersiz yapın</li>
                    <li>Kuvvet ve kardiyo egzersizlerini dengeleyin</li>
                    <li>Farklı egzersiz türlerini deneyin</li>
                    <li>Esneklik çalışmalarına zaman ayırın</li>
                    <li>Hedeflerinize göre antrenman yoğunluğunu ayarlayın</li>
                </ul>
            `,
            'Fazla Kilolu': `
                <p>Yağ yakımı için öneriler:</p>
                <ul>
                    <li>Haftada 4-5 gün egzersiz yapın</li>
                    <li>Kardiyo egzersizlerine ağırlık verin (yürüyüş, koşu, bisiklet)</li>
                    <li>HIIT antrenmanlarını deneyin</li>
                    <li>Kuvvet antrenmanlarını ihmal etmeyin</li>
                    <li>Günlük adım sayınızı artırın (en az 10.000 adım)</li>
                </ul>
            `,
            'Obez': `
                <p>Güvenli egzersiz önerileri:</p>
                <ul>
                    <li>Haftada 5-6 gün düşük yoğunluklu egzersiz yapın</li>
                    <li>Yürüyüş ile başlayın (günde 30 dakika)</li>
                    <li>Yüzme gibi eklemlere az yük bindiren aktiviteleri tercih edin</li>
                    <li>Kademeli olarak egzersiz süresini artırın</li>
                    <li>Bir fitness uzmanından destek alın</li>
                </ul>
            `
        };
        return recommendations[category] || '<p>Egzersiz önerileri için BMI değeriniz hesaplanmalıdır.</p>';
    }

    // Genel sağlık önerileri
    function getHealthRecommendations(category, data) {
        const recommendations = {
            'Zayıf': `
                <p>Genel sağlık önerileri:</p>
                <ul>
                    <li>Düzenli sağlık kontrollerinizi yaptırın</li>
                    <li>Vitamin ve mineral seviyelerinizi kontrol ettirin</li>
                    <li>Uyku düzeninize dikkat edin (7-8 saat)</li>
                    <li>Stres yönetimi için meditasyon yapın</li>
                    <li>Sigara ve alkolden uzak durun</li>
                </ul>
            `,
            'Normal': `
                <p>Genel sağlık önerileri:</p>
                <ul>
                    <li>Düzenli sağlık kontrollerinizi yaptırın</li>
                    <li>Dengeli beslenme ve egzersiz rutininizi sürdürün</li>
                    <li>Yeterli su tüketin</li>
                    <li>Uyku düzeninize dikkat edin</li>
                    <li>Stres yönetimi için aktiviteler yapın</li>
                </ul>
            `,
            'Fazla Kilolu': `
                <p>Genel sağlık önerileri:</p>
                <ul>
                    <li>Düzenli sağlık kontrollerinizi yaptırın</li>
                    <li>Kan şekeri ve kolesterol seviyelerinizi kontrol ettirin</li>
                    <li>Uyku düzeninize dikkat edin</li>
                    <li>Stres yönetimi için aktiviteler yapın</li>
                    <li>Sigara ve alkolden uzak durun</li>
                </ul>
            `,
            'Obez': `
                <p>Genel sağlık önerileri:</p>
                <ul>
                    <li>Düzenli sağlık kontrollerinizi yaptırın</li>
                    <li>Bir uzman doktora danışın</li>
                    <li>Kan şekeri, kolesterol ve tansiyon değerlerinizi takip edin</li>
                    <li>Uyku apnesi riski için uyku testi yaptırın</li>
                    <li>Stres yönetimi için profesyonel destek alın</li>
                </ul>
            `
        };
        return recommendations[category] || '<p>Sağlık önerileri için BMI değeriniz hesaplanmalıdır.</p>';
    }

    // Veri yüklendiğinde önerileri güncelle
    ipcRenderer.on('data-loaded', (event, data) => {
        if (data && data.profile) {
            updateRecommendations(data.profile);
        }
    });

    // Beslenme Sayfası Fonksiyonları
    function initNutritionPage() {
        const addMealBtn = document.querySelector('.add-meal-btn');
        const mealForm = document.querySelector('.meal-form');
        const saveMealBtn = document.querySelector('.save-meal-btn');
        const mealsList = document.querySelector('.meals-list');
        const foodSearch = document.querySelector('.food-search');
        const foodsGrid = document.querySelector('.foods-grid');

        // Örnek yemek kütüphanesi
        const foodLibrary = [
            {
                id: 1,
                name: 'Tavuk Göğsü',
                calories: 165,
                protein: 31,
                carbs: 0,
                fat: 3.6,
                portion: '100g'
            },
            {
                id: 2,
                name: 'Pirinç',
                calories: 130,
                protein: 2.7,
                carbs: 28,
                fat: 0.3,
                portion: '100g'
            },
            {
                id: 3,
                name: 'Yulaf Ezmesi',
                calories: 389,
                protein: 16.9,
                carbs: 66.3,
                fat: 6.9,
                portion: '100g'
            },
            {
                id: 4,
                name: 'Muz',
                calories: 89,
                protein: 1.1,
                carbs: 22.8,
                fat: 0.3,
                portion: '100g'
            },
            {
                id: 5,
                name: 'Yumurta',
                calories: 155,
                protein: 12.6,
                carbs: 1.1,
                fat: 11.3,
                portion: '100g'
            }
        ];

        // Yemek kütüphanesini görüntüle
        function displayFoodLibrary(foods = foodLibrary) {
            foodsGrid.innerHTML = '';
            foods.forEach(food => {
                const foodCard = document.createElement('div');
                foodCard.className = 'food-card';
                foodCard.innerHTML = `
                    <h4>${food.name}</h4>
                    <p>${food.calories} kcal / ${food.portion}</p>
                    <div class="macros">
                        <span class="macro">Protein: ${food.protein}g</span>
                        <span class="macro">Karbonhidrat: ${food.carbs}g</span>
                        <span class="macro">Yağ: ${food.fat}g</span>
                    </div>
                `;
                foodCard.addEventListener('click', () => selectFood(food));
                foodsGrid.appendChild(foodCard);
            });
        }

        // Yemek arama
        foodSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredFoods = foodLibrary.filter(food => 
                food.name.toLowerCase().includes(searchTerm)
            );
            displayFoodLibrary(filteredFoods);
        });

        // Yemek seçme
        function selectFood(food) {
            const foodCards = document.querySelectorAll('.food-card');
            foodCards.forEach(card => card.classList.remove('selected'));
            event.currentTarget.classList.add('selected');

            // Form alanlarını doldur
            document.getElementById('foodName').value = food.name;
            document.getElementById('calories').value = food.calories;
            document.getElementById('protein').value = food.protein;
            document.getElementById('carbs').value = food.carbs;
            document.getElementById('fat').value = food.fat;
        }

        // Yemek ekleme formunu göster/gizle
        addMealBtn.addEventListener('click', () => {
            mealForm.style.display = mealForm.style.display === 'none' ? 'grid' : 'none';
        });

        // Yemek kaydetme
        saveMealBtn.addEventListener('click', () => {
            const mealType = document.getElementById('mealType').value;
            const foodName = document.getElementById('foodName').value;
            const portion = document.getElementById('portion').value;
            const calories = document.getElementById('calories').value;
            const protein = document.getElementById('protein').value;
            const carbs = document.getElementById('carbs').value;
            const fat = document.getElementById('fat').value;

            if (!foodName || !calories) {
                alert('Lütfen gerekli alanları doldurun!');
                return;
            }

            addMealToList({
                type: mealType,
                name: foodName,
                portion,
                calories,
                protein,
                carbs,
                fat
            });

            // Formu sıfırla
            document.getElementById('mealForm').reset();
            mealForm.style.display = 'none';
            updateDailySummary();
        });

        // Yemek listesine ekleme
        function addMealToList(meal) {
            const mealItem = document.createElement('div');
            mealItem.className = 'meal-item';
            mealItem.innerHTML = `
                <div class="meal-info">
                    <span class="meal-name">${meal.name}</span>
                    <div class="meal-details">
                        <span>${meal.type}</span>
                        <span>${meal.portion}</span>
                        <span class="meal-calories">${meal.calories} kcal</span>
                    </div>
                </div>
                <button class="delete-meal-btn">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            // Silme butonu işlevi
            mealItem.querySelector('.delete-meal-btn').addEventListener('click', () => {
                mealItem.remove();
                updateDailySummary();
            });

            mealsList.appendChild(mealItem);
        }

        // Günlük özeti güncelleme
        function updateDailySummary() {
            const meals = Array.from(mealsList.children).map(meal => ({
                calories: parseInt(meal.querySelector('.meal-calories').textContent),
                protein: parseInt(meal.querySelector('.meal-details').textContent.match(/Protein: (\d+)g/)?.[1] || 0),
                carbs: parseInt(meal.querySelector('.meal-details').textContent.match(/Karbonhidrat: (\d+)g/)?.[1] || 0),
                fat: parseInt(meal.querySelector('.meal-details').textContent.match(/Yağ: (\d+)g/)?.[1] || 0)
            }));

            const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
            const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
            const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
            const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

            // Kalori özetini güncelle
            document.querySelector('.calorie-item:nth-child(1) .value').textContent = '2000';
            document.querySelector('.calorie-item:nth-child(2) .value').textContent = totalCalories;
            document.querySelector('.calorie-item:nth-child(3) .value').textContent = 2000 - totalCalories;

            // Makro özetini güncelle
            document.querySelector('.macro-item:nth-child(1) .value').textContent = `${totalProtein}g / 150g`;
            document.querySelector('.macro-item:nth-child(2) .value').textContent = `${totalCarbs}g / 250g`;
            document.querySelector('.macro-item:nth-child(3) .value').textContent = `${totalFat}g / 65g`;

            // İlerleme çubuklarını güncelle
            updateProgressBar('protein', totalProtein / 150);
            updateProgressBar('carbs', totalCarbs / 250);
            updateProgressBar('fat', totalFat / 65);
        }

        // İlerleme çubuğu güncelleme
        function updateProgressBar(type, percentage) {
            const progressBar = document.querySelector(`.progress-fill.${type}`);
            progressBar.style.width = `${Math.min(percentage * 100, 100)}%`;
        }

        // Sayfa yüklendiğinde yemek kütüphanesini göster
        displayFoodLibrary();
    }

    // Sayfa yüklendiğinde beslenme sayfasını başlat
    initNutritionPage();
}); 
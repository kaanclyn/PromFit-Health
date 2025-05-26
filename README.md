PromFit - Fitness & Beslenme Takip Uygulaması
===========================================

- PromFit, kullanıcıların fitness ve beslenme hedeflerini takip etmelerine yardımcı olan modern bir masaüstü uygulamasıdır. 
- Uygulama, kullanıcıların kişisel gelişimlerini takip etmeleri ve hedeflerine ulaşmaları için özel olarak tasarlanmıştır.

Özellikler
----------
- Kişiselleştirilmiş profil yönetimi
- Detaylı antrenman takibi
- Beslenme programı oluşturma ve takip
- İstatistik ve ilerleme analizi
- BMI hesaplama ve takip
- Hedef belirleme ve takip
- Modern ve kullanıcı dostu arayüz
- Kişisel gelişim takibi ve raporlama

Teknolojiler
-----------
- Electron (Masaüstü Uygulaması)
- HTML5 & CSS3
- JavaScript
- Node.js
- CSV (Veri Depolama)

Kurulum
-------
1. Node.js'i yükleyin (https://nodejs.org)
2. Projeyi klonlayın
3. Proje dizininde terminal açın
4. Bağımlılıkları yükleyin:
   npm install
5. Uygulamayı başlatın:
   npm start

Geliştirme
---------
- Uygulama Electron framework'ü kullanılarak geliştirilmiştir
- Ana uygulama dosyaları:
  - index.html: Ana uygulama arayüzü
  - intro.html: Giriş sayfası
  - styles.css: Ana stil dosyası
  - intro.css: Giriş sayfası stilleri
  - script.js: JavaScript fonksiyonları
  - main.js: Electron ana süreç dosyası

Teknik Detaylar
--------------
1. Electron Ana Süreç (main.js)
   - Pencere yönetimi ve özelleştirme
   - Dosya sistemi işlemleri
   - Veri depolama ve yönetimi
   - IPC iletişimi

2. Veri Yönetimi
   - CSV formatında profil verileri
   - JSON formatında antrenman verileri
   - Yerel dosya sistemi entegrasyonu
   - Otomatik yedekleme sistemi

3. Özellikler
   - Özelleştirilmiş pencere çerçevesi
   - Şeffaf arka plan desteği
   - Tam ekran modu
   - Geliştirici araçları entegrasyonu

4. Klasör Yapısı
   - /profiles: Kullanıcı profilleri
   - /profiles_photos: Profil fotoğrafları
   - /workouts: Antrenman verileri
   - /programs: Antrenman programları

5. IPC Olayları
   - Pencere kontrol olayları
   - Veri kaydetme/yükleme
   - Profil yönetimi
   - Antrenman takibi

Klasör Yapısı
------------
/
├── index.html          # Ana uygulama sayfası
├── intro.html          # Giriş sayfası
├── styles.css          # Ana stil dosyası
├── intro.css           # Giriş sayfası stilleri
├── script.js           # JavaScript kodları
├── main.js             # Electron ana süreç
├── package.json        # Proje bağımlılıkları
└── README.txt          # Bu dosya

Özellikler Detayı
----------------
1. Kişisel Profil
   - Kullanıcı bilgileri
   - Vücut ölçüleri
   - Hedef belirleme
   - BMI takibi
   - Kişisel gelişim hedefleri

2. Antrenman Takibi
   - Özel program oluşturma
   - Egzersiz kütüphanesi
   - İlerleme takibi
   - Kalori yakım hesaplama
   - Performans gelişimi analizi

3. Beslenme Takibi
   - Öğün planlama
   - Kalori takibi
   - Makro besin hesaplama
   - Besin kütüphanesi
   - Beslenme alışkanlıkları analizi

4. İstatistikler
   - İlerleme grafikleri
   - Hedef takibi
   - Performans analizi
   - Öneriler
   - Gelişim raporları

Versiyon Bilgisi
--------------
- Sürüm: 3.3.6 / 1.0.0
- Son Güncelleme: 26/05/2025
- Geliştirici: PromSoftware

İletişim
-------
- Web: https://promsoftware.com.tr
- E-posta: destek@promsoftware.com.tr

Lisans
------
© 2021-2025 PromSoftware. Tüm hakları saklıdır.

Geliştirici Hakları ve Kullanım
------------------------------
Bu uygulama, yazılım geliştiricileri ve programcılar için açık kaynak olarak sunulmuştur. Aşağıdaki haklar ve izinler verilmiştir:

1. Geliştirme ve Özelleştirme
   - Kaynak kodunu değiştirme ve geliştirme
   - Yeni özellikler ekleme
   - Mevcut özellikleri özelleştirme
   - Farklı platformlara uyarlama

2. Ticari Kullanım
   - Ticari amaçlarla kullanma
   - Yeniden dağıtma
   - Alt lisanslama
   - Ticari projelerde entegrasyon

3. Geliştirici Gereksinimleri
   - PromSoftware'ın telif hakkı bildirimini koruma
   - Orijinal lisans şartlarını muhafaza etme
   - Değişiklikleri belgeleme

4. Sorumluluk Reddi
   - Uygulama "olduğu gibi" sunulmuştur
   - PromSoftware, uygulamanın kullanımından doğacak sonuçlardan sorumlu değildir
   - Geliştiriciler kendi riskleri altında kullanır

Notlar
------
- Uygulama Electron framework'ü kullanılarak geliştirilmiştir
- Veriler yerel olarak CSV formatında saklanır
- Modern ve kullanıcı dostu arayüz tasarımı
- Responsive tasarım desteği
- Karanlık/Aydınlık tema desteği
- Kullanıcı gelişimini destekleyen detaylı analiz araçları
- Kişisel hedeflere ulaşmada rehberlik eden özellikler
- Geliştiriciler için açık kaynak ve ticari kullanım desteği

Veri Depolama Yapısı
-------------------
Uygulama, kullanıcı verilerini yerel dosya sisteminde aşağıdaki yapıda saklar:

1. Ana Veri Klasörü: /profiles
   - Kullanıcı profilleri CSV formatında saklanır
   - Dosya adı formatı: kullanıcıadı_tarih.csv
   - Örnek: kaan_çağlayan_2025-05-26T08-29-57-889Z.csv

2. Profil Fotoğrafları: /profiles/profiles_photos
   - Kullanıcı profil fotoğrafları PNG formatında saklanır
   - Dosya adı formatı: kullanıcıadı_tarih.png
   - Örnek: kaan_çağlayan_2025-05-26T08-29-39-625Z.png

3. Veri Formatları
   - CSV Dosyaları:
     * Kullanıcı bilgileri
     * Vücut ölçüleri
     * Hedefler
     * Tarih damgası
   
   - PNG Dosyaları:
     * Profil fotoğrafları
     * Base64 formatından dönüştürülmüş
     * Otomatik boyutlandırma

4. Veri Güvenliği
   - Yerel depolama
   - Otomatik yedekleme
   - Veri bütünlüğü kontrolü
   - Güvenli dosya işlemleri 

Eklenebilir Özellikler ve Geliştirme Planları
----------------------------------------
1. Çoklu Platform Desteği
   - Windows, macOS ve Linux için native uygulamalar
   - Web tabanlı versiyon
   - Mobil uygulama (iOS/Android)
   - Cross-platform senkronizasyon

2. Çoklu Kullanıcı Sistemi
   - Kullanıcı hesapları ve yetkilendirme
   - Rol tabanlı erişim kontrolü
   - Grup yönetimi ve paylaşım
   - Sosyal özellikler ve etkileşim

3. Ödeme Sistemleri
   - Abonelik modeli
   - Premium özellikler
   - Ödeme geçmişi
   - Fatura yönetimi
   - Çoklu para birimi desteği
   - Otomatik yenileme

4. Gelişmiş Veri Takibi
   - Gerçek zamanlı izleme
   - Detaylı analitik raporlar
   - Özelleştirilebilir dashboard
   - Veri görselleştirme
   - Trend analizi
   - Tahminleme modelleri

5. Veritabanı Seçenekleri
   - SQLite (Yerel depolama)
   - PostgreSQL (İlişkisel veritabanı)
   - MongoDB (NoSQL çözümü)
   - Redis (Önbellek ve oturum yönetimi)
   - Firebase (Gerçek zamanlı veritabanı)

6. Lisanslama Sistemi
   - Kullanıcı bazlı lisanslama
   - Kurumsal lisanslar
   - Özellik bazlı lisanslama
   - Süre sınırlı lisanslar
   - Lisans doğrulama ve yenileme
   - Offline lisans aktivasyonu

7. Güvenlik Geliştirmeleri
   - İki faktörlü doğrulama
   - End-to-end şifreleme
   - Güvenli veri yedekleme
   - GDPR uyumluluğu
   - Veri gizliliği kontrolleri

8. Entegrasyonlar
   - Fitness cihazları ile senkronizasyon
   - Sağlık uygulamaları entegrasyonu
   - Takvim sistemleri
   - Bulut depolama servisleri
   - Sosyal medya platformları

9. Performans İyileştirmeleri
   - Önbellek optimizasyonu
   - Lazy loading
   - Kod splitting
   - Asset optimizasyonu
   - Yük dengeleme

10. Kullanıcı Deneyimi
    - Kişiselleştirilebilir arayüz
    - Tema desteği
    - Erişilebilirlik özellikleri
    - Çoklu dil desteği
    - Kısayol tuşları 

//----------------------------------//
//------------ Load data -----------//
//----------------------------------//

const albumImages = [
    "../assets/Anh_cuoi/anh_cuoi_1.jpg",
    "../assets/Anh_cuoi/anh_cuoi_2.jpg",
    "../assets/Anh_cuoi/anh_cuoi_3.jpg",
    "../assets/Anh_cuoi/anh_cuoi_4.jpg",
    "../assets/Anh_cuoi/anh_cuoi_5.jpg",
];

function renderWeddingCalendar(dateISO) {
    const title = document.getElementById("calendarTitle");
    const daysContainer = document.getElementById("calendarDays");

    if (!title || !daysContainer || !dateISO) return;

    // Phân tích ngày cưới
    const [year, month, day] = dateISO.split("-").map(Number);

    // Ngày đầu tiên và số ngày trong tháng
    const firstDate = new Date(year, month - 1, 1);
    const totalDays = new Date(year, month, 0).getDate();

    // Thứ của ngày đầu tháng (T2 = 0, CN = 6)
    const startDay = (firstDate.getDay() + 6) % 7;

    // Tiêu đề tháng
    title.textContent = `Tháng ${month} / ${year}`;

    // Xóa lịch cũ
    daysContainer.innerHTML = "";

    // Tạo các ô trống trước ngày đầu tháng
    for (let i = 0; i < startDay; i++) {
        const empty = document.createElement("span");
        daysContainer.appendChild(empty);
    }

    // Tạo các ngày trong tháng
    for (let i = 1; i <= totalDays; i++) {
        const cell = document.createElement("span");

        if (i === day) {
            cell.classList.add("wedding-day");
            cell.textContent = `${i} ♥`;
        } else {
            cell.textContent = i;
        }

        daysContainer.appendChild(cell);
    }
}

async function loadWeddingData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Không thể tải data.json");
    const data = await response.json();
    renderWeddingCalendar(data.wedding?.dateISO);

    const values = {
      groom:data.couple?.groom, bride:data.couple?.bride,
      groomFullName:data.couple?.groomFullName, brideFullName:data.couple?.brideFullName,
      groomParents:data.families?.groomParents, brideParents:data.families?.brideParents,
      groomAddress:data.families?.groomAddress, brideAddress:data.families?.brideAddress,
      dateDisplay:data.wedding?.dateDisplay, dateShort:data.wedding?.dateShort,
      dayOfWeek:data.wedding?.dayOfWeek, day:data.wedding?.day,
      monthLabel:data.wedding?.monthLabel, year:data.wedding?.year,
      lunarDate:data.wedding?.lunarDate, ceremonyTime:data.wedding?.ceremonyTime,
      receptionTime:data.wedding?.receptionTime, dayOfWeekRecept:data.wedding?.dayOfWeekRecept,
      dayRecept:data.wedding?.dayRecept, monthLabelRecept:data.wedding?.monthLabelRecept,
      lunarDateRecept:data.wedding?.lunarDateRecept,
      guestArrivalTime:data.wedding?.guestArrivalTime,
      partyStartTime:data.wedding?.partyStartTime, venueName:data.venue?.name,
      venueAddress:data.venue?.address, coverInvitationLine:data.texts?.coverInvitationLine,
      venueName:data.venue?.name,
      ceremonyIntro:data.texts?.ceremonyIntro, ceremonyLocationLine:data.texts?.ceremonyLocationLine,
      receptionLead:data.texts?.receptionLead, Khung_anh_cuoi:data.images?.Khung_anh_cuoi, couplePhoto:data?.couplePhoto
    };

    document.querySelectorAll("[data-config]").forEach((el) => {
      const value = values[el.dataset.config];
      if (value !== undefined && value !== null) el.textContent = String(value);
    });

    document.querySelectorAll("[data-config-src]").forEach((el) => {
      const value = data.images?.[el.dataset.configSrc];
      if (value) el.src = value;
    });

    document.querySelectorAll("[data-config-href]").forEach((el) => {
      const key = el.dataset.configHref;
      const value = data.links?.[key] ?? data.venue?.[key];
      if (value) el.href = value;
      else if (key === "rsvpUrl") {
        el.addEventListener("click", (event) => {
          event.preventDefault();
          alert("Hãy điền links.rsvpUrl trong file data.json trước.");
        });
      }
    });

    const weddingMap = document.getElementById("weddingMap");

    if (weddingMap && data.venue?.mapsEmbedUrl) {
        weddingMap.src = data.venue.mapsEmbedUrl;
    };

    document.title = `Thiệp cưới | ${data.couple?.groom ?? ""} & ${data.couple?.bride ?? ""}`; //pageTitle

  } catch (error) {
    console.error(error);
    console.warn("Không tải được data.json. Hãy mở dự án bằng VS Code Live Server.");
  }
}
loadWeddingData();

//----------------------------------//
//------------ Hiêu ứng ------------//
//----------------------------------//

// Hiệu ứng hoa rơi trên các trang thiệp.
const flowerLayer = document.getElementById("flowerLayer");

// Danh sách ảnh hoa
const flowerImages = [
  "../assets/flowers/flower-1.png",
  "../assets/flowers/flower-2.png",
  "../assets/flowers/flower-3.png",
];

function createFlowers(amount = 100) {
  if (!flowerLayer) return;

  for (let i = 0; i < amount; i++) {
    const flower = document.createElement("img");

    flower.className = "falling-flower";

    // Chọn ngẫu nhiên một ảnh hoa.
    flower.src = flowerImages[
      Math.floor(Math.random() * flowerImages.length)
    ];

    // Vị trí xuất hiện.
    flower.style.left = `${Math.random() * 100}%`;

    // Tốc độ rơi.
    flower.style.animationDuration =
      `${12 + Math.random() * 15}s`;

    // Thời điểm bắt đầu.
    flower.style.animationDelay =
      `${-Math.random() * 25}s`;

    // Kích thước ngẫu nhiên.
    flower.style.setProperty(
      "--flower-size",
      `${18 + Math.random() * 22}px`
    );

    // Độ trong suốt.
    flower.style.opacity =
      `${0.35 + Math.random() * 0.55}`;

    // Độ xoay ban đầu.
    flower.style.setProperty(
      "--rotation",
      `${Math.random() * 360}deg`
    );

    flowerLayer.appendChild(flower);
  }
}

createFlowers(18);


// Khi nhấn "Mở thiệp": chạy hoạt cảnh thiệp mở ra rồi mới chuyển trang.
const openInvitation = document.getElementById("openInvitation");

if (openInvitation) {
  openInvitation.addEventListener("click", (event) => {
    // Giữ nguyên thao tác mở tab mới bằng Ctrl/Cmd/Shift hoặc chuột giữa.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

    event.preventDefault();
    if (document.body.classList.contains("is-transitioning")) return;

    const destination = openInvitation.href;
    const overlay = document.createElement("div");
    overlay.className = "transition-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <div class="transition-caption">Một lời mời trân trọng gửi đến bạn</div>
      <div class="envelope-scene">
        <div class="letter">
          <span class="letter-heart">♥</span>
          <span class="letter-names">Bá Lãm <i>&</i> Thu Phương</span>
          <span class="letter-small">Trân trọng kính mời</span>
        </div>
        <div class="envelope">
          <div class="envelope-back"></div>
          <div class="envelope-pocket"></div>
          <div class="envelope-flap"></div>
          <div class="envelope-seal">♥</div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.classList.add("is-transitioning");

    // Điều hướng sau khi phong bì mở và tấm thiệp hé lộ.
    window.setTimeout(() => {
      window.location.href = destination;
    }, 1550);
  });
}


const albumTrack = document.getElementById("albumTrack");

albumImages.forEach((src) => {
    const card = document.createElement("div");
    card.className = "album-card";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Ảnh cưới";

    img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;

        if (ratio > 1.15) {
            card.classList.add("landscape");
        } else if (ratio < 0.85) {
            card.classList.add("portrait");
        } else {
            card.classList.add("square");
        }
    };

    card.appendChild(img);
    albumTrack.appendChild(card);
});


function initWeddingAlbum() {
    const cards = document.querySelectorAll(".album-card");
    const current = document.getElementById("albumCurrent");
    const total = document.getElementById("albumTotal");
    const prev = document.getElementById("albumPrev");
    const next = document.getElementById("albumNext");

    if (!cards.length || !current || !total) return;

    let activeIndex = 0;
    const length = cards.length;

    total.textContent = length;

    // Tự động chuyển ảnh sau mỗi 2 giây
    setInterval(() => {
        activeIndex = (activeIndex + 1) % length;
        renderAlbum();
    }, 2000);

    function renderAlbum() {
        cards.forEach((card, index) => {
            let offset = index - activeIndex;

            // Tạo vòng lặp vô hạn
            if (offset > length / 2) offset -= length;
            if (offset < -length / 2) offset += length;

            const x = offset * 150;
            const scale = offset === 0 ? 1 : 0.82;
            const rotate = offset * -5;
            const opacity = Math.abs(offset) > 2 ? 0 : 1;
            const zIndex = 10 - Math.abs(offset);

            card.style.transform =
                `translate(-50%, -50%)
                translateX(${x}px)
                scale(${scale})
                rotateY(${rotate}deg)`;

            card.style.opacity = opacity;
            card.style.zIndex = zIndex;
            card.style.filter = offset === 0
                ? "blur(0px)"
                : "blur(2px)";
            card.style.pointerEvents = offset === 0 ? "auto" : "none";
        });

        current.textContent = activeIndex + 1;
    }

    next?.addEventListener("click", () => {
        activeIndex = (activeIndex + 1) % length;
        renderAlbum();
    });

    prev?.addEventListener("click", () => {
        activeIndex = (activeIndex - 1 + length) % length;
        renderAlbum();
    });

    // Vuốt ảnh trên điện thoại
    let startX = 0;

    const carousel = document.querySelector(".album-carousel");

    carousel?.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    carousel?.addEventListener("touchend", (e) => {
        const diff = e.changedTouches[0].clientX - startX;

        if (Math.abs(diff) > 40) {
            activeIndex = diff < 0
                ? (activeIndex + 1) % length
                : (activeIndex - 1 + length) % length;

            renderAlbum();
        }
    }, { passive: true });

    renderAlbum();
}

document.addEventListener("DOMContentLoaded", initWeddingAlbum);

function initGiftModal() {
    const modal = document.getElementById("giftModal");
    const openBtn = document.getElementById("openGiftModal");
    const closeBtn = document.getElementById("closeGiftModal");

    if (!modal || !openBtn || !closeBtn) return;

    function openModal() {
        modal.style.display = "flex";

        requestAnimationFrame(() => {
            modal.classList.add("active");
        });

        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("active");
        document.body.style.overflow = "";

        setTimeout(() => {
            if (!modal.classList.contains("active")) {
                modal.style.display = "none";
            }
        }, 300);
    }

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);

    // Nhấn ra ngoài modal để đóng
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Nhấn ESC để đóng
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });
}

document.addEventListener("DOMContentLoaded", initGiftModal);

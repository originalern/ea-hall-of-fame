const imageFiles = import.meta.glob([
    "/assets/image/gallery/**/*.{webp,WEBP,jpg,JPG,jpeg,JPEG,png,PNG,avif,AVIF,gif,GIF}",
    "/assets/image/football/facundo/*.{webp,WEBP,jpg,JPG,jpeg,JPEG,png,PNG,avif,AVIF,gif,GIF}",
], {
    eager: true,
    query: "?url",
    import: "default"
});
const videoFiles = import.meta.glob("/assets/image/gallery/**/*.{mp4,MP4,webm,WEBM,mov,MOV}", {
    eager: true,
    query: "?url",
    import: "default"
});

const count = document.querySelector("#gallery-count");
const gallery = document.querySelector("#gallery-grid");
const filterButtons = [...document.querySelectorAll("[data-gallery-filter]")];
const empty = document.querySelector("#gallery-empty");
const lightbox = document.querySelector("#gallery-lightbox");
const lightboxImage = document.querySelector("#gallery-lightbox-image");
const lightboxVideo = document.querySelector("#gallery-lightbox-video");
const lightboxClose = document.querySelector("#gallery-lightbox-close");

const readableName = (path) => {
    const filename = path.split("/").pop().replace(/\.[^.]+$/, "");
    return filename
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\b(webp|png|jpg|jpeg|avif|gif|mp4|webm|mov)\b/gi, "")
        .trim();
};

const boxingPattern = /boks|boets|boy|poedin|ring|poyas|wbc|ibf|suleiman|bredford|kempbell|kuznetsov|graziano|khollifild|bintu|udar|revansh/i;
const footballPattern = /futbol|vratar|myach|gol|stadion|barselon|manchester|arsenal|dinamo|torwart|fussball|roma|dribling|fcb/i;

const boxingOverrides = [
    "chatgpt-image-22-iyulya-2026-g.-11-33-07-2",
    "chempion-v-otrazhenii-ochkov",
    "image-gen-1(20260816-164708)",
    "image-gen-1(20260817-130428)",
    "image-gen-1(20260818-074912)",
    "image-gen-1(20260818-080643)",
    "image-gen-1(8)",
    "image-gen-1",
    "atletichnhy-boksyor-v-studiynom-svete",
    "duet-v-mrachnom-studiynom-portrete",
    "intervyu-v-televizionnoy-studii",
    "krupnhy-plan-s-otrazheniem-v-ochkakh",
    "muzhskoy-portret-v-belom-khalate-s-krasnoy-otdelkoy",
    "napryazhyonnaya-duel-kozha-protiv-kremovogo-kostyuma",
    "napryazhyonnhe-peregovorh-pod-prozhektorom",
    "nochnoe-intervyu-na-fone-ogney-goroda",
    "portret-muzhchinh-v-vintazhnoy-sportivnoy-kurtke",
    "protivostoyanie-v-svete-arenh",
    "rhzheborodhy-sportsmen-bintuet-ruki",
    "seryoznhy-portret-rhzhevolosogo-muzhchinh",
    "telestudiya-na-fone-nochnogo-goroda",
    "troe-muzhchin-za-kruglhm-stolom-v-studii"
];

const footballOverrides = [
    "image-gen-1(20260817-193012)",
    "futbolist-v-moment-reshayushchego-udara",
    "chempionh-s-kubkom-mira-na-pole",
    "studiynhy-portret-muzhchinh-s-kosichkami-3",
    "zadumchivhy-sportsmen-s-serebryanhmi-kubkami-1",
    "intensivnhy-portret-sportsmena-na-sinem-fone",
    "portret-muzhchinh-v-bordovoy-sportivnoy-forme",
    "seryoznhy-portret-v-forme-usa",
    "sportsmenh-pered-kartinoy-s-kubkom",
    "strogiy-portret-v-forme-usa",
    "strogiy-portret-sportsmena-v-forme-ssha-1",
    "strogiy-portret-sportsmena-pod-flagom-ssha",
    "surovhy-portret-sportsmena-v-amerikanskom-flage",
    "triumf-s-zolothm-trofeem-1",
    "triumfalnhy-portret-sredi-trofeev"
];

const categoryFor = (path) => {
    if (path.includes("/assets/image/football/") || path.endsWith("/assets/image/category-football/luis-chato.webp")) return "football";
    if (path.includes("/assets/image/boxing/ikuznetsov/") || path.includes("/assets/image/boxing/caballero/")) return "boxing";
    const name = path.split("/").pop().replace(/\.[^.]+$/, "").normalize("NFC");
    if (footballOverrides.includes(name)) return "football";
    if (boxingOverrides.includes(name) || boxingPattern.test(name)) return "boxing";
    if (footballPattern.test(name)) return "football";
    return "other";
};

const media = [
    ...Object.entries(imageFiles).map(([path, src]) => ({ path, src, type: "image" })),
    ...Object.entries(videoFiles).map(([path, src]) => ({ path, src, type: "video" }))
].map((item) => ({ ...item, name: readableName(item.path), category: categoryFor(item.path) }))
    .sort((a, b) => a.name.localeCompare(b.name, "ru"));

function renderGallery() {
    gallery.replaceChildren();

    media.forEach((item) => {
        const card = document.createElement("a");
        card.className = "gallery-card";
        card.href = item.src;
        card.setAttribute("aria-label", `Открыть ${item.type === "video" ? "видео" : "фотографию"}: ${item.name}`);
        card.addEventListener("click", (event) => {
            event.preventDefault();
            lightboxVideo.pause();
            lightboxVideo.removeAttribute("src");
            lightboxVideo.hidden = item.type !== "video";
            lightboxImage.hidden = item.type !== "image";
            if (item.type === "video") {
                lightboxVideo.src = item.src;
                lightboxVideo.load();
                lightboxVideo.play().catch(() => {});
            } else {
                lightboxImage.src = item.src;
                lightboxImage.alt = item.name || "fotografiya-hall-of-fame";
            }
            lightbox.showModal();
            lightboxClose.focus();
        });

        const preview = document.createElement(item.type === "video" ? "video" : "img");
        preview.src = item.src;
        if (item.type === "video") {
            preview.muted = true;
            preview.playsInline = true;
            preview.preload = "metadata";
            preview.setAttribute("aria-label", item.name || "Видео из галереи");
        } else {
            preview.alt = item.name || "fotografiya-hall-of-fame";
            preview.loading = "lazy";
            preview.decoding = "async";
        }
        card.append(preview);
        card.dataset.category = item.category;
        gallery.append(card);
    });

    count.textContent = `Материалов: ${media.length}`;
    empty.hidden = media.length > 0;
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.galleryFilter;
        const isAlreadyActive = button.classList.contains("is-active");
        const selectedFilter = isAlreadyActive ? "all" : filter;

        filterButtons.forEach((filterButton) => {
            const active = filterButton.dataset.galleryFilter === selectedFilter;
            filterButton.classList.toggle("is-active", active);
            filterButton.setAttribute("aria-pressed", String(active));
        });

        gallery.querySelectorAll(".gallery-card").forEach((card) => {
            card.hidden = selectedFilter !== "all" && card.dataset.category !== selectedFilter;
        });
        const visibleCount = selectedFilter === "all"
            ? media.length
            : media.filter((item) => item.category === selectedFilter).length;
        count.textContent = `Материалов: ${visibleCount}`;
    });
});

lightboxClose.addEventListener("click", () => lightbox.close());
lightbox.addEventListener("close", () => {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
});
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
});
renderGallery();

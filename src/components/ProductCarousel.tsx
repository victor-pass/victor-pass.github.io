import { createEffect, createSignal, onCleanup, For, Show } from "solid-js";
import { Portal } from "solid-js/web";
import "./ProductCarousel.css";

export interface Slide {
    src: string;
    /** Smaller copy of a video to play inline; `src` is shown when zoomed. */
    small?: string;
    title?: string;
    caption?: string;
}

interface Props {
    slides: Slide[];
    alt: string;
    autoplayMs?: number;
}

const isVideo = (src: string) => /\.(webm|mp4)$/i.test(src);

// Videos are cropped phone recordings; their frame (`.pc-phone`) adds the
// status and nav bars back, sized from the video's aspect ratio.
const setAspect = (video: HTMLVideoElement) =>
    video.parentElement!.style.setProperty("--aspect", String(video.videoWidth / video.videoHeight));

export default function ProductCarousel(props: Props) {
    const { slides, alt } = props;
    const autoplayMs = props.autoplayMs ?? 3500;
    const count = slides.length;
    const multi = count > 1;

    const [active, setActive] = createSignal(0);
    const videos: (HTMLVideoElement | undefined)[] = [];

    let playing = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let resumeTimeout: ReturnType<typeof setTimeout> | undefined;

    const wrap = (index: number) => ((index % count) + count) % count;

    const goTo = (index: number) => setActive(wrap(index));
    const next = () => goTo(active() + 1);
    const prev = () => goTo(active() - 1);

    // Images advance on a timer; videos advance when they end.
    const schedule = () => {
        if (timer) clearTimeout(timer);
        timer = undefined;
        if (playing && multi && !isVideo(slides[active()].src)) {
            timer = setTimeout(next, autoplayMs);
        }
    };

    const startAutoplay = () => {
        playing = true;
        schedule();
    };

    const stopAutoplay = () => {
        playing = false;
        schedule();
    };

    const interact = (fn: () => void) => {
        fn();
        stopAutoplay();
        if (resumeTimeout) clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(startAutoplay, autoplayMs * 1.5);
    };

    // Play only the active video, from the start, and time the active image.
    createEffect(() => {
        const current = active();
        videos.forEach((video, i) => {
            if (!video) return;
            if (video.readyState) setAspect(video);
            if (i === current) {
                video.currentTime = 0;
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
        schedule();
    });

    // Zoom: a clicked video grows from its spot to full size in the centre
    // (full screen on phones), then shrinks back when closed.
    const [zoomed, setZoomed] = createSignal<{ slide: Slide; from: HTMLVideoElement }>();
    let zoomVideo: HTMLVideoElement | undefined;

    // Transform that puts the zoomed video's frame over the inline one.
    const flipFrom = () => {
        const from = zoomed()!.from.parentElement!.getBoundingClientRect();
        const to = zoomVideo!.parentElement!.getBoundingClientRect();
        const scale = from.width / to.width;
        const dx = from.left + from.width / 2 - (to.left + to.width / 2);
        const dy = from.top + from.height / 2 - (to.top + to.height / 2);
        return `translate(${dx}px, ${dy}px) scale(${scale})`;
    };
    const zoomAnim = { duration: 350, easing: "cubic-bezier(0.65, 0, 0.35, 1)" };

    const openZoom = (slide: Slide, video: HTMLVideoElement) => {
        video.pause();
        stopAutoplay();
        document.body.style.overflow = "hidden";
        setZoomed({ slide, from: video });
    };

    const showZoom = () => {
        const { from } = zoomed()!;
        const frame = zoomVideo!.parentElement!;
        setAspect(zoomVideo!);
        zoomVideo!.currentTime = from.currentTime;
        zoomVideo!.play().catch(() => {});
        frame.parentElement!.classList.add("pc-zoom-ready", "pc-zoom-open");
        frame.animate([{ transform: flipFrom() }, { transform: "none" }], zoomAnim);
    };

    const closeZoom = () => {
        const state = zoomed();
        if (!state || !zoomVideo) return;
        const frame = zoomVideo.parentElement!;
        frame.parentElement!.classList.remove("pc-zoom-open");
        const done = () => {
            state.from.currentTime = zoomVideo?.currentTime ?? 0;
            state.from.play().catch(() => {});
            document.body.style.overflow = "";
            setZoomed(undefined);
            startAutoplay();
        };
        if (!zoomVideo.videoWidth) return done();
        frame.animate([{ transform: "none" }, { transform: flipFrom() }], zoomAnim).onfinish = done;
    };

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeZoom();
    if (typeof window !== "undefined") window.addEventListener("keydown", onKey);

    onCleanup(() => {
        stopAutoplay();
        if (resumeTimeout) clearTimeout(resumeTimeout);
        if (typeof window !== "undefined") window.removeEventListener("keydown", onKey);
    });

    return (
        <div class="pc-wrap" classList={{ "pc-solo": !multi }}>
            <div class="pc-stage">
                <div
                    class="pc-viewport"
                    onMouseEnter={stopAutoplay}
                    onMouseLeave={startAutoplay}
                >
                    <div
                        class="pc-track"
                        style={{ transform: `translateX(-${active() * 100}%)` }}
                    >
                        <For each={slides}>
                            {(slide, i) => (
                                <figure class="pc-slide">
                                    {isVideo(slide.src) ? (
                                        <div class="pc-phone">
                                            <video
                                                ref={(el) => (videos[i()] = el)}
                                                class="pc-zoomable"
                                                src={slide.small ?? slide.src}
                                                aria-label={slide.title ?? `${alt} demo ${i() + 1}`}
                                                title="Click to enlarge"
                                                muted
                                                playsinline
                                                preload="metadata"
                                                loop={!multi}
                                                onLoadedMetadata={(e) => setAspect(e.currentTarget)}
                                                onEnded={() => multi && i() === active() && next()}
                                                onClick={(e) => openZoom(slide, e.currentTarget)}
                                            />
                                        </div>
                                    ) : (
                                        <img src={slide.src} alt={slide.title ?? `${alt} screenshot ${i() + 1}`} />
                                    )}
                                    <Show when={slide.title || slide.caption}>
                                        <figcaption class="pc-caption">
                                            <Show when={slide.title}>
                                                <strong>{slide.title}</strong>
                                            </Show>
                                            {slide.caption}
                                        </figcaption>
                                    </Show>
                                </figure>
                            )}
                        </For>
                    </div>
                </div>

                <Show when={multi}>
                    <button
                        class="pc-arrow pc-prev"
                        type="button"
                        aria-label="Previous slide"
                        onClick={() => interact(prev)}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                            <path
                                d="M15 18l-6-6 6-6"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>
                    <button
                        class="pc-arrow pc-next"
                        type="button"
                        aria-label="Next slide"
                        onClick={() => interact(next)}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                            <path
                                d="M9 6l6 6-6 6"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>
                </Show>
            </div>

            <Show when={multi}>
                <div class="pc-dots">
                    <For each={slides}>
                        {(slide, i) => (
                            <button
                                class="pc-dot"
                                classList={{ "pc-active": active() === i() }}
                                type="button"
                                aria-label={`Go to ${slide.title ?? `slide ${i() + 1}`}`}
                                onClick={() => interact(() => goTo(i()))}
                            />
                        )}
                    </For>
                </div>
            </Show>

            <Show when={zoomed()}>
                {(z) => (
                    <Portal>
                        <div class="pc-zoom" role="dialog" aria-modal="true" onClick={closeZoom}>
                            <div class="pc-phone">
                                <video
                                    ref={zoomVideo}
                                    src={z().slide.src}
                                    aria-label={z().slide.title ?? `${alt} demo`}
                                    muted
                                    playsinline
                                    loop
                                    onLoadedMetadata={showZoom}
                                />
                            </div>
                        </div>
                    </Portal>
                )}
            </Show>
        </div>
    );
}

import { createSignal, onCleanup, onMount, For, Show } from "solid-js";
import "./ProductCarousel.css";

interface Props {
    images: string[];
    alt: string;
    autoplayMs?: number;
}

export default function ProductCarousel(props: Props) {
    const { images, alt } = props;
    const autoplayMs = props.autoplayMs ?? 3500;
    const count = images.length;
    const multi = count > 1;

    const [active, setActive] = createSignal(0);

    let timer: ReturnType<typeof setInterval> | undefined;
    let resumeTimeout: ReturnType<typeof setTimeout> | undefined;

    const wrap = (index: number) => ((index % count) + count) % count;

    const goTo = (index: number) => setActive(wrap(index));
    const next = () => goTo(active() + 1);
    const prev = () => goTo(active() - 1);

    const startAutoplay = () => {
        if (!multi) return;
        stopAutoplay();
        timer = setInterval(next, autoplayMs);
    };

    const stopAutoplay = () => {
        if (timer) clearInterval(timer);
        timer = undefined;
    };

    const interact = (fn: () => void) => {
        fn();
        stopAutoplay();
        if (resumeTimeout) clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(startAutoplay, autoplayMs * 1.5);
    };

    onMount(() => {
        startAutoplay();
        onCleanup(() => {
            stopAutoplay();
            if (resumeTimeout) clearTimeout(resumeTimeout);
        });
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
                        <For each={images}>
                            {(src, i) => (
                                <div class="pc-slide">
                                    <img src={src} alt={`${alt} screenshot ${i() + 1}`} />
                                </div>
                            )}
                        </For>
                    </div>
                </div>

                <Show when={multi}>
                    <button
                        class="pc-arrow pc-prev"
                        type="button"
                        aria-label="Previous screenshot"
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
                        aria-label="Next screenshot"
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
                    <For each={images}>
                        {(_, i) => (
                            <button
                                class="pc-dot"
                                classList={{ "pc-active": active() === i() }}
                                type="button"
                                aria-label={`Go to screenshot ${i() + 1}`}
                                onClick={() => interact(() => goTo(i()))}
                            />
                        )}
                    </For>
                </div>
            </Show>
        </div>
    );
}

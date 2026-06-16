import { useCallback, useEffect, useRef } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating?: number;
}

interface Props {
  testimonials: Testimonial[];
}

const CARD_HEIGHT = 178;
const DURATION_MS = 20000;

const ReviewCard = ({ t, star, init }: { t: Testimonial; star: (n: number) => React.ReactNode; init: (name: string) => string }) => (
  <div className="review-infinite-card">
    <div>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#1a1a3e] to-[#2a1a4e] flex items-center justify-center text-[10px] font-bold text-neon-cyan shrink-0">
          {init(t.name)}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-bold text-app-text uppercase leading-tight truncate">{t.name}</div>
          <div className="text-[7px] text-app-text-muted uppercase tracking-[0.2em] truncate">{t.role}</div>
        </div>
      </div>
      <div className="text-[10px] leading-relaxed text-app-text-muted italic line-clamp-3">
        &ldquo;{t.text}&rdquo;
      </div>
    </div>
    <div className="flex gap-0.5 mt-1">
      {star(t.rating || 5)}
    </div>
  </div>
);

export const ReviewInfiniteScroll = ({ testimonials }: Props) => {
  if (testimonials.length === 0) return null;

  const star = (n: number) =>
    [...Array(5)].map((_, si) => (
      <span key={si} className={`text-xs ${si < n ? "text-neon-cyan drop-shadow-[0_0_3px_rgba(0,242,255,0.2)]" : "text-app-border"}`}>★</span>
    ));

  const init = (name: string) =>
    name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  // Static grid for 6 or fewer reviews
  if (testimonials.length <= 6) {
    const cols: Testimonial[][] = [[], [], []];
    testimonials.forEach((t, i) => cols[i % 3].push(t));
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cols.map((cards, ci) => (
          <div key={ci} className="flex flex-col gap-3">
            {cards.map(t => (
              <ReviewCard key={t.id} t={t} star={star} init={init} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Animated infinite scroll for 7+ reviews
  const cols: Testimonial[][] = [[], [], []];
  testimonials.forEach((t, i) => cols[i % 3].push(t));

  const tracksRef = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const animRef = useRef(0);
  const pausedRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);

  const totalPerCol = cols[0].length;
  const scrollDistance = totalPerCol * CARD_HEIGHT;

  useEffect(() => {
    if (totalPerCol === 0) return;

    const tracks = tracksRef.current;

    function animate(ts: number) {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;

      if (!pausedRef.current) {
        const progress = (elapsed % DURATION_MS) / DURATION_MS;
        const y = -(progress * scrollDistance);
        tracks.forEach(t => {
          if (t) t.style.transform = `translateY(${y}px)`;
        });
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [scrollDistance, totalPerCol]);

  const handleMouseEnter = useCallback(() => {
    pausedRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    pausedRef.current = false;
    startTimeRef.current = performance.now() - ((performance.now() - (startTimeRef.current || 0)) % DURATION_MS);
  }, []);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-[344px] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {cols.map((cards, ci) => (
        <div
          key={ci}
          className={`overflow-hidden relative h-full ${ci === 1 ? "review-col-middle" : ci % 2 === 0 ? "review-col-left" : "review-col-right"}`}
        >
          <div
            ref={el => { tracksRef.current[ci] = el; }}
            className="flex flex-col gap-3 will-change-transform"
            style={{ backfaceVisibility: "hidden" }}
          >
            {[...cards, ...cards].map((t, i) => (
              <ReviewCard key={`${t.id}-${i}`} t={t} star={star} init={init} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

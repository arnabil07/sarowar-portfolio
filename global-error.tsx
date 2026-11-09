"use client";

/** Last-resort fallback if the root layout itself fails. Uses inline styles (global CSS may not be loaded). */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#08090B",
          color: "#F5F5F5",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial, sans-serif",
          padding: 24,
        }}
      >
        <main style={{ maxWidth: 560 }}>
          <h1 style={{ fontWeight: 400, fontSize: 40, letterSpacing: "-0.03em", margin: 0 }}>Something went wrong.</h1>
          <p style={{ color: "#A0A0A0", fontSize: 17, lineHeight: 1.6 }}>Please try again in a moment.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              minHeight: 48,
              padding: "0 24px",
              borderRadius: 999,
              border: 0,
              background: "#F5F5F5",
              color: "#08090B",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}

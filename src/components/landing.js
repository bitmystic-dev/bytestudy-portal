export function renderLanding(container, onNavigate) {
  container.innerHTML = `
    <div class="bs-container">
      <div class="bs-card bs-hero-card" style="text-align: center; padding: 48px 24px;">
        <h1 style="font-size: 32px; font-weight: 800; margin-bottom: 12px;">
          Master Class 11 & 12 Academics
        </h1>
        <p style="font-size: 16px; color: var(--text-muted); max-width: 600px; margin: 0 auto 24px auto;">
          Structured notes, solved chapter modules, and curated practice papers for Mathematics, Physics, and Chemistry.
        </p>
        <div>
          <button class="bs-btn-primary" id="landing-hero-signup" style="height: 52px; padding: 0 28px; font-size: 16px;">
            Access Study Library
          </button>
        </div>
      </div>

      <h2 style="font-size: 20px; font-weight: 700; margin: 32px 0 16px 0;">Available Packages</h2>
      <div class="bs-grid">
        <div class="bs-card">
          <h3 style="font-size: 18px; margin-bottom: 6px;">Class 11 Complete</h3>
          <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 16px;">Full Access to Maths, Physics, Chemistry & Miscellaneous Modules.</p>
          <span class="bs-badge bs-badge-green">Available Now</span>
        </div>

        <div class="bs-card">
          <h3 style="font-size: 18px; margin-bottom: 6px;">Allen Special Modules</h3>
          <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 16px;">Curated problem sets and chapter breakdowns.</p>
          <span class="bs-badge bs-badge-green">Available Now</span>
        </div>

        <div class="bs-card" style="opacity: 0.7;">
          <h3 style="font-size: 18px; margin-bottom: 6px;">Class 12 Complete</h3>
          <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 16px;">Comprehensive board and entrance modules.</p>
          <span class="bs-badge bs-badge-gray">In Preparation</span>
        </div>
      </div>
    </div>
  `;

  document.getElementById('landing-hero-signup').addEventListener('click', () => onNavigate('signup'));
}

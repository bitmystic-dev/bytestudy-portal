import { isEntitledToPackage, hasDownloadPermission, fetchDashboardContent } from '../services/userService';

export async function renderDashboard(container, userProfile, isAdmin, onOpenMaterial) {
  // 1. Show immediate loading state
  container.innerHTML = `
    <div class="bs-container" style="display:flex; justify-content:center; align-items:center; min-height: 400px;">
      <div style="text-align: center; color: var(--text-muted);">
        <div style="font-size: 24px; margin-bottom: 12px;">📚</div>
        <div>Loading your learning environment...</div>
      </div>
    </div>
  `;

  try {
    // 2. Fetch live CMS data
    const { categories, modules } = await fetchDashboardContent();
    const purchases = userProfile?.purchases || [];
    const downloadsAllowed = hasDownloadPermission(userProfile, isAdmin);

    const statusText = isAdmin 
      ? '<span style="color:var(--primary, #6366f1); font-weight:600;">✓ Administrator Access</span>' 
      : (downloadsAllowed ? '<span style="color:var(--success, #22c55e); font-weight:600;">✓ Offline Downloads Permitted</span>' : 'Standard Web Viewer Mode');

    let html = `
      <div class="bs-container">
        <div class="dash-header-mobile" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <div>
            <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">My Learning Dashboard</h1>
            <p style="font-size: 14px; color: var(--text-muted); margin: 0;">Status: ${statusText}</p>
          </div>
        </div>
    `;

    // 3. Loop through Categories
    categories.forEach(cat => {
      // Find modules assigned to this category
      const catMods = modules.filter(m => m.categoryId === cat.id);
      
      // If a category has no published modules, skip rendering the header entirely
      if (catMods.length === 0) return;

      html += `
        <h2 style="font-size: 18px; margin-bottom: 16px; color: var(--text-main); border-bottom: 1px solid var(--border-color, #e2e8f0); padding-bottom: 8px;">
          ${cat.name}
        </h2>
        <div class="bs-grid" style="margin-bottom: 40px;">
      `;

      // 4. Render the Modules (Cards) for this category
      catMods.forEach(item => {
        const entitled = isEntitledToPackage(purchases, item.id, isAdmin);
        // Clean text fallback for Quill HTML descriptions
        const descHtml = item.descriptionHtml || '<p>Core Modules & Notes</p>';
        
        html += `
          <div class="bs-card" style="display: flex; flex-direction: column;">
            <div style="font-size: 32px; margin-bottom: 12px;">${item.icon || '📦'}</div>
            <h3 style="font-size: 18px; margin-bottom: 8px; line-height: 1.3;">${item.title || 'Untitled Module'}</h3>
            
            <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
              ${descHtml}
            </div>

            ${entitled ? `
              <button class="bs-btn-primary open-mat-btn" style="width: 100%;" data-account="${item.accountType || 'A'}" data-folder="${item.folderId}" data-title="${item.title}">
                Explore Material
              </button>
            ` : `
              <div style="text-align: center; padding: 10px; background: var(--bg-color, #f8fafc); border-radius: 6px; border: 1px solid var(--border-color, #e2e8f0); font-size: 13px; color: var(--text-muted); font-weight: 600;">
                🔒 Locked (Not Enrolled)
              </div>
            `}
          </div>
        `;
      });

      html += `</div>`; // Close grid
    });

    // 5. Handle "Uncategorized" Modules (Failsafe)
    const uncatMods = modules.filter(m => !m.categoryId);
    if (uncatMods.length > 0) {
      html += `
        <h2 style="font-size: 18px; margin-bottom: 16px; color: var(--text-main); border-bottom: 1px solid var(--border-color, #e2e8f0); padding-bottom: 8px;">
          Other Modules
        </h2>
        <div class="bs-grid" style="margin-bottom: 40px;">
      `;
      uncatMods.forEach(item => {
        const entitled = isEntitledToPackage(purchases, item.id, isAdmin);
        const descHtml = item.descriptionHtml || '<p>Core Modules & Notes</p>';
        
        html += `
          <div class="bs-card" style="display: flex; flex-direction: column;">
            <div style="font-size: 32px; margin-bottom: 12px;">${item.icon || '📦'}</div>
            <h3 style="font-size: 18px; margin-bottom: 8px; line-height: 1.3;">${item.title || 'Untitled Module'}</h3>
            <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
              ${descHtml}
            </div>
            ${entitled ? `
              <button class="bs-btn-primary open-mat-btn" style="width: 100%;" data-account="${item.accountType || 'A'}" data-folder="${item.folderId}" data-title="${item.title}">Explore Material</button>
            ` : `
              <div style="text-align: center; padding: 10px; background: var(--bg-color, #f8fafc); border-radius: 6px; border: 1px solid var(--border-color, #e2e8f0); font-size: 13px; color: var(--text-muted); font-weight: 600;">🔒 Locked</div>
            `}
          </div>
        `;
      });
      html += `</div>`;
    }

    html += `</div>`; // Close bs-container
    container.innerHTML = html;

    // 6. Attach Event Listeners
    document.querySelectorAll('.open-mat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const accountType = e.currentTarget.getAttribute('data-account');
        const folderId = e.currentTarget.getAttribute('data-folder');
        const title = e.currentTarget.getAttribute('data-title');
        onOpenMaterial({ accountType, folderId, title });
      });
    });

  } catch (error) {
    console.error("Dashboard Render Error:", error);
    container.innerHTML = `
      <div class="bs-container" style="text-align:center; padding: 40px; color: #ef4444;">
        <h3>Failed to load dashboard.</h3>
        <p>Please check your connection and try again.</p>
      </div>
    `;
  }
}

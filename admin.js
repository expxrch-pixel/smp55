/**
 * OTF — onythefamily | Admin Control Center Logic
 * Full CRUD for Members, Settings editor, JSON Export & Import.
 */

(() => {
  'use strict';

  // Auth Gate Elements
  const authGateOverlay = document.getElementById('authGateOverlay');
  const authGateForm = document.getElementById('authGateForm');
  const adminPinInput = document.getElementById('adminPinInput');
  const authErrorMsg = document.getElementById('authErrorMsg');
  const btnLogoutAdmin = document.getElementById('btnLogoutAdmin');
  const setAdminPin = document.getElementById('setAdminPin');

  // Tabs
  const tabBtns = document.querySelectorAll('.admin-tab');
  const sectionMembers = document.getElementById('sectionMembers');
  const sectionMusic = document.getElementById('sectionMusic');
  const sectionSettings = document.getElementById('sectionSettings');
  const sectionBackup = document.getElementById('sectionBackup');
  const tabCount = document.getElementById('tabCount');

  // Table
  const adminTableBody = document.getElementById('adminTableBody');

  // Form Modal
  const formModalOverlay = document.getElementById('formModalOverlay');
  const modalFormTitle = document.getElementById('modalFormTitle');
  const memberForm = document.getElementById('memberForm');
  const btnAddMember = document.getElementById('btnAddMember');
  const btnCancelForm = document.getElementById('btnCancelForm');

  // Form Inputs
  const editMemberId = document.getElementById('editMemberId');
  const formName = document.getElementById('formName');
  const formRole = document.getElementById('formRole');
  const formCustomTitle = document.getElementById('formCustomTitle');
  const formAlias = document.getElementById('formAlias');
  const formAvatar = document.getElementById('formAvatar');
  const formCover = document.getElementById('formCover');
  const formStatus = document.getElementById('formStatus');
  const formJoinDate = document.getElementById('formJoinDate');
  const formQuote = document.getElementById('formQuote');
  const formBio = document.getElementById('formBio');
  const formDiscord = document.getElementById('formDiscord');
  const formFacebook = document.getElementById('formFacebook');

  // Settings
  const setShortName = document.getElementById('setShortName');
  const setFullName = document.getElementById('setFullName');
  const setMotto = document.getElementById('setMotto');
  const setSubMotto = document.getElementById('setSubMotto');
  const setHeroDesc = document.getElementById('setHeroDesc');
  const setWeather = document.getElementById('setWeather');
  const setMusicUrl = document.getElementById('setMusicUrl');
  const btnSaveSettings = document.getElementById('btnSaveSettings');

  // Music Manager Elements
  const trackCountLabel = document.getElementById('trackCountLabel');
  const newTrackTitle = document.getElementById('newTrackTitle');
  const newTrackArtist = document.getElementById('newTrackArtist');
  const newTrackUrl = document.getElementById('newTrackUrl');
  const btnAddTrack = document.getElementById('btnAddTrack');
  const presetBeat1 = document.getElementById('presetBeat1');
  const presetBeat2 = document.getElementById('presetBeat2');
  const presetBeat3 = document.getElementById('presetBeat3');
  const trackListBody = document.getElementById('trackListBody');
  const localAudioFileInput = document.getElementById('localAudioFileInput');
  const localUploadNotice = document.getElementById('localUploadNotice');
  const localUploadFileName = document.getElementById('localUploadFileName');
  const urlWarningMsg = document.getElementById('urlWarningMsg');

  // Backup
  const btnExportJSON = document.getElementById('btnExportJSON');
  const btnImportJSON = document.getElementById('btnImportJSON');
  const importJsonText = document.getElementById('importJsonText');
  const btnResetDefault = document.getElementById('btnResetDefault');

  // Tab Switcher
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.dataset.tab;
      sectionMembers.hidden = tab !== 'members';
      if (sectionMusic) sectionMusic.hidden = tab !== 'music';
      sectionSettings.hidden = tab !== 'settings';
      sectionBackup.hidden = tab !== 'backup';
    });
  });

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderTable() {
    const list = window.OTF_DATA ? window.OTF_DATA.getMembers() : [];
    tabCount.textContent = list.length;
    adminTableBody.innerHTML = '';

    if (list.length === 0) {
      adminTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 40px; color: var(--text-muted);">ยังไม่มีข้อมูลสมาชิก</td></tr>`;
      return;
    }

    list.forEach(m => {
      const tr = document.createElement('tr');
      const roleColor = m.role === 'owner' ? '#ffffff' : (m.role === 'core' ? '#e4e4e7' : (m.role === 'bigsupport' ? '#a1a1aa' : 'var(--text-muted)'));

      tr.innerHTML = `
        <td>
          <div class="member-cell">
            <img src="${escapeHtml(m.avatar)}" alt="${escapeHtml(m.name)}">
            <div>
              <strong style="color: #fff; font-size: 14px;">${escapeHtml(m.name)}</strong>
              ${m.alias ? `<div style="font-size: 11px; color: #d4d4d8; letter-spacing: 0.05em;">${escapeHtml(m.alias)}</div>` : ''}
            </div>
          </div>
        </td>
        <td>
          <span class="card-role-pill" style="border-color: ${roleColor}; color: ${roleColor};">
            ${escapeHtml((m.role || 'member').toUpperCase())}
          </span>
        </td>
        <td>
          <span style="color: #d8d2c4; font-weight: 500;">${escapeHtml(m.customRoleTitle || '-')}</span>
        </td>
        <td>
          <div class="card-status-indicator" data-status="${escapeHtml(m.status || 'online')}" style="padding: 3px 10px;">
            <span class="status-dot"></span>
            <span>${escapeHtml((m.status || 'online').toUpperCase())}</span>
          </div>
        </td>
        <td style="color: var(--text-muted); font-size: 12px;">
          ${m.discord ? `<div>Discord: ${escapeHtml(m.discord)}</div>` : ''}
          ${m.facebook && m.facebook !== '#' ? `<a href="${escapeHtml(m.facebook)}" target="_blank" style="color: #60a5fa;">Facebook ↗</a>` : ''}
        </td>
        <td style="text-align: right;">
          <div class="action-btn-group" style="justify-content: flex-end;">
            <button class="btn-edit" type="button" data-id="${escapeHtml(m.id)}">✏️ แก้ไข</button>
            <button class="btn-del" type="button" data-id="${escapeHtml(m.id)}">🗑️ ลบ</button>
          </div>
        </td>
      `;

      // Event listeners
      tr.querySelector('.btn-edit').addEventListener('click', () => editMember(m.id));
      tr.querySelector('.btn-del').addEventListener('click', () => deleteMember(m.id, m.name));

      adminTableBody.appendChild(tr);
    });
  }

  function openModal(isEdit = false) {
    modalFormTitle.textContent = isEdit ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มสมาชิกใหม่';
    formModalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    formModalOverlay.classList.remove('show');
    memberForm.reset();
    editMemberId.value = '';
    document.body.style.overflow = '';
  }

  btnAddMember.addEventListener('click', () => {
    editMemberId.value = '';
    memberForm.reset();
    formAvatar.value = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80";
    formCover.value = "otf-banner-wave.jpg";
    formJoinDate.value = new Date().toISOString().split('T')[0];
    openModal(false);
  });

  btnCancelForm.addEventListener('click', closeModal);
  formModalOverlay.addEventListener('click', (e) => {
    if (e.target === formModalOverlay) closeModal();
  });

  function editMember(id) {
    const list = window.OTF_DATA.getMembers();
    const m = list.find(item => item.id === id);
    if (!m) return;

    editMemberId.value = m.id;
    formName.value = m.name || '';
    formRole.value = m.role || 'member';
    formCustomTitle.value = m.customRoleTitle || '';
    formAlias.value = m.alias || '';
    formAvatar.value = m.avatar || '';
    formCover.value = m.cover || '';
    formStatus.value = m.status || 'online';
    formJoinDate.value = m.joinDate || '';
    formQuote.value = m.quote || '';
    formBio.value = m.bio || '';
    formDiscord.value = m.discord || '';
    formFacebook.value = m.facebook || '';

    openModal(true);
  }

  function deleteMember(id, name) {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสมาชิก "${name}" ออกจากครอบครัว OTF?`)) {
      window.OTF_DATA.deleteMember(id);
      renderTable();
    }
  }

  // Handle Form Submit
  memberForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      name: formName.value.trim(),
      role: formRole.value,
      customRoleTitle: formCustomTitle.value.trim(),
      alias: formAlias.value.trim(),
      avatar: formAvatar.value.trim(),
      cover: formCover.value.trim(),
      status: formStatus.value,
      joinDate: formJoinDate.value,
      quote: formQuote.value.trim(),
      bio: formBio.value.trim(),
      discord: formDiscord.value.trim(),
      facebook: formFacebook.value.trim()
    };

    const id = editMemberId.value;
    if (id) {
      window.OTF_DATA.updateMember(id, data);
    } else {
      window.OTF_DATA.addMember(data);
    }

    closeModal();
    renderTable();
  });

  // Music Management Logic
  function renderTracks() {
    if (!trackListBody) return;
    const tracks = (window.OTF_DATA && typeof window.OTF_DATA.getTracks === 'function')
      ? window.OTF_DATA.getTracks()
      : [];

    if (trackCountLabel) trackCountLabel.textContent = tracks.length;
    trackListBody.innerHTML = '';

    if (tracks.length === 0) {
      trackListBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 36px; color: var(--text-muted);">ยังไม่มีเพลงในรายการ กรุณาเพิ่มเพลงด้านบน</td></tr>`;
      return;
    }

    tracks.forEach((t, idx) => {
      const tr = document.createElement('tr');
      const isPrimary = idx === 0;

      tr.innerHTML = `
        <td style="font-weight: 700; color: #fff;">#${idx + 1}</td>
        <td>
          <strong style="color: #ffffff; display: block; font-size: 14px;">${escapeHtml(t.title)}</strong>
          <span style="color: var(--text-muted); font-size: 12px;">${escapeHtml(t.artist || 'onythefamily Beats')}</span>
          <div style="color: var(--text-dim); font-size: 11px; word-break: break-all; margin-top: 2px;">${escapeHtml(t.url)}</div>
        </td>
        <td>
          <audio class="track-preview-audio" controls preload="none" src="${escapeHtml(t.url)}" style="height: 32px; max-width: 200px; filter: invert(0.9);"></audio>
        </td>
        <td>
          ${isPrimary
            ? `<span class="card-role-pill" style="border-color: #ffffff; color: #ffffff; background: rgba(255,255,255,0.1);">⭐ เพลงหลัก (เล่นแรก)</span>`
            : `<span style="color: var(--text-dim); font-size: 12px;">เพลงถัดไป</span>`
          }
        </td>
        <td style="text-align: right;">
          <div class="action-btn-group" style="justify-content: flex-end;">
            ${!isPrimary ? `<button class="btn-edit btn-set-default" type="button" data-idx="${idx}">⭐ ตั้งเป็นเพลงหลัก</button>` : ''}
            <button class="btn-del btn-del-track" type="button" data-idx="${idx}">🗑️ ลบเพลง</button>
          </div>
        </td>
      `;

      // If local indexedDB audio, resolve blob URL for preview
      if (t.isLocal && t.id && window.OTF_DATA.getLocalAudioUrl) {
        window.OTF_DATA.getLocalAudioUrl(t.id).then(blobUrl => {
          if (blobUrl) {
            const aud = tr.querySelector('.track-preview-audio');
            if (aud) aud.src = blobUrl;
          }
        });
      }

      const defBtn = tr.querySelector('.btn-set-default');
      if (defBtn) {
        defBtn.addEventListener('click', () => {
          window.OTF_DATA.setDefaultTrack(idx);
          renderTracks();
          loadSettings();
        });
      }

      tr.querySelector('.btn-del-track').addEventListener('click', () => {
        if (confirm(`คุณต้องการลบเพลง "${t.title}" ออกจากเพลย์ลิสต์ใช่หรือไม่?`)) {
          window.OTF_DATA.deleteTrack(idx);
          renderTracks();
          loadSettings();
        }
      });

      trackListBody.appendChild(tr);
    });
  }

  // Real-time URL validation
  if (newTrackUrl) {
    newTrackUrl.addEventListener('input', () => {
      const val = newTrackUrl.value.trim().toLowerCase();
      const isWebPageUrl = val.includes('pixabay.com/music/') ||
                           val.includes('youtube.com/') ||
                           val.includes('youtu.be/') ||
                           val.includes('tiktok.com/');
      if (urlWarningMsg) {
        urlWarningMsg.hidden = !isWebPageUrl;
      }
    });
  }

  // Handle Local MP3 Upload from Computer
  if (localAudioFileInput) {
    localAudioFileInput.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const defaultTitle = file.name.replace(/\.[^/.]+$/, "");
      const res = await window.OTF_DATA.saveLocalAudioFile(file, defaultTitle, "OTF Clan Beat");

      if (res && res.success) {
        if (localUploadNotice && localUploadFileName) {
          localUploadFileName.textContent = file.name;
          localUploadNotice.hidden = false;
        }
        renderTracks();
        loadSettings();
        alert(`อัปโหลดเพลง "${defaultTitle}" เข้าสู่เพลย์ลิสต์ OTF สำเร็จแล้ว และตั้งเป็นเพลงหลักทันที!`);
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกไฟล์เสียง: ' + (res?.error || 'Unknown error'));
      }
      localAudioFileInput.value = '';
    });
  }

  if (btnAddTrack) {
    btnAddTrack.addEventListener('click', () => {
      const title = newTrackTitle.value.trim();
      const artist = newTrackArtist.value.trim();
      const url = newTrackUrl.value.trim();

      if (!url) {
        alert('กรุณากรอกลิงก์ไฟล์เสียง MP3 หรือเลือกไฟล์จากเครื่อง');
        newTrackUrl.focus();
        return;
      }

      // Check if user accidentally pasted webpage URL
      if (url.includes('pixabay.com/music/') || url.includes('youtube.com/') || url.includes('youtu.be/')) {
        if (urlWarningMsg) urlWarningMsg.hidden = false;
        alert('⚠️ ลิงก์นี้เป็นลิงก์หน้าเว็บ HTML ไม่ใช่ไฟล์เสียง .mp3\n\nแนะนำให้กดปุ่ม "เลือกไฟล์ MP3 จากเครื่อง" ด้านบน หรือหากเป็นเว็บ Pixabay ให้คลิกขวาที่ปุ่ม Download สีเขียว แล้วเลือก "Copy link address" เพื่อนำลิงก์ .mp3 ตรงมาใส่ครับ');
        return;
      }

      window.OTF_DATA.addTrack({
        title: title || 'OTF Clan Anthem',
        artist: artist || 'onythefamily Beats',
        url: url
      });

      newTrackTitle.value = '';
      newTrackArtist.value = '';
      newTrackUrl.value = '';
      if (urlWarningMsg) urlWarningMsg.hidden = true;

      renderTracks();
      loadSettings();
      alert('เพิ่มเพลงลงในเพลย์ลิสต์ OTF เรียบร้อยแล้ว!');
    });
  }

  // Preset Buttons
  if (presetBeat1) {
    presetBeat1.addEventListener('click', () => {
      newTrackTitle.value = "Loyalty & Honor — Drill Beat";
      newTrackArtist.value = "Dark Street Chill";
      newTrackUrl.value = "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=hip-hop-rock-beats-118000.mp3";
    });
  }
  if (presetBeat2) {
    presetBeat2.addEventListener('click', () => {
      newTrackTitle.value = "OTF Anthem — Midnight Ambience";
      newTrackArtist.value = "onythefamily Beats";
      newTrackUrl.value = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=trap-future-bass-royalty-free-music-113540.mp3";
    });
  }
  if (presetBeat3) {
    presetBeat3.addEventListener('click', () => {
      newTrackTitle.value = "Shadow Phonk — Fast Energy";
      newTrackArtist.value = "Phonk Syndicate";
      newTrackUrl.value = "https://cdn.pixabay.com/download/audio/2023/06/13/audio_73e72ca6e8.mp3?filename=drift-phonk-154687.mp3";
    });
  }

  // Settings Logic
  function loadSettings() {
    const s = window.OTF_DATA ? window.OTF_DATA.getSettings() : {};
    setShortName.value = s.brandShort || 'OTF';
    setFullName.value = s.brandName || 'onythefamily';
    setMotto.value = s.motto || 'LOYALTY OVER ROYALTY';
    setSubMotto.value = s.submotto || 'FAMILY FIRST • RESPECT EARNED • NEVER DIVIDED';
    setHeroDesc.value = s.heroDescription || '';
    setWeather.value = s.weatherEffect || 'embers';
    setMusicUrl.value = (s.musicTracks && s.musicTracks[0]) ? s.musicTracks[0].url : '';
    if (setAdminPin) setAdminPin.value = s.adminPin || '1688';
    updateFirebaseUI();
  }

  btnSaveSettings.addEventListener('click', () => {
    const musicUrl = setMusicUrl.value.trim();
    const newPin = setAdminPin ? setAdminPin.value.trim() : '';

    const updated = {
      brandShort: setShortName.value.trim(),
      brandName: setFullName.value.trim(),
      motto: setMotto.value.trim(),
      submotto: setSubMotto.value.trim(),
      heroDescription: setHeroDesc.value.trim(),
      weatherEffect: setWeather.value,
      adminPin: newPin || '1688',
      musicTracks: musicUrl ? [
        {
          title: "OTF Custom Theme",
          artist: "onythefamily",
          url: musicUrl
        }
      ] : undefined
    };

    window.OTF_DATA.saveSettings(updated);
    alert('บันทึกการตั้งค่าเรียบร้อยแล้ว!');
  });

  // Vercel Direct Data Export (No Database needed)
  const btnDownloadVercelData = document.getElementById('btnDownloadVercelData');
  if (btnDownloadVercelData) {
    btnDownloadVercelData.addEventListener('click', () => {
      if (typeof window.OTF_DATA.generateUpdatedMembersDataFile !== 'function') {
        alert('ฟังก์ชันสร้างไฟล์ยังไม่พร้อมใช้งาน');
        return;
      }
      const code = window.OTF_DATA.generateUpdatedMembersDataFile();
      const blob = new Blob([code], { type: 'application/javascript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'members-data.js';
      a.click();
      URL.revokeObjectURL(url);
      alert('✅ ดาวน์โหลดไฟล์ members-data.js สำเร็จแล้ว!\n\nขั้นตอนต่อไป:\n1. นำไฟล์ members-data.js ที่เพิ่งดาวน์โหลดไปวางทับไฟล์เดิมในโฟลเดอร์โปรเจกต์ของคุณ\n2. อัปขึ้น Vercel / GitHub\n\nเมื่อ Vercel ทำการ Deploy เสร็จ หน้าเว็บหลัก https://onythefamily.vercel.app/ จะแสดงข้อมูลสมาชิกล่าสุดของคุณทันที 100% ครับ!');
    });
  }

  // Firebase Config Elements
  const fbApiKey = document.getElementById('fbApiKey');
  const fbProjectId = document.getElementById('fbProjectId');
  const btnSaveFirebaseConfig = document.getElementById('btnSaveFirebaseConfig');
  const firebaseStatusBadge = document.getElementById('firebaseStatusBadge');

  function updateFirebaseUI() {
    const isConn = window.OTF_DATA && window.OTF_DATA.isFirebaseConnected && window.OTF_DATA.isFirebaseConnected();
    if (firebaseStatusBadge) {
      if (isConn) {
        firebaseStatusBadge.textContent = '🟢 เชื่อมต่อ Cloud สำเร็จ (Realtime Sync)';
        firebaseStatusBadge.style.borderColor = '#4ade80';
        firebaseStatusBadge.style.color = '#4ade80';
      } else {
        firebaseStatusBadge.textContent = '🟡 โหมด LocalStorage';
        firebaseStatusBadge.style.borderColor = '#facc15';
        firebaseStatusBadge.style.color = '#facc15';
      }
    }
    if (fbApiKey && fbProjectId && window.OTF_DATA && window.OTF_DATA.getFirebaseConfig) {
      const cfg = window.OTF_DATA.getFirebaseConfig();
      if (cfg.apiKey) fbApiKey.value = cfg.apiKey;
      if (cfg.projectId) fbProjectId.value = cfg.projectId;
    }
  }

  if (btnSaveFirebaseConfig) {
    btnSaveFirebaseConfig.addEventListener('click', () => {
      const apiKey = fbApiKey.value.trim();
      const projectId = fbProjectId.value.trim();

      if (!apiKey || !projectId) {
        alert('กรุณากรอกทั้ง Firebase API Key และ Project ID');
        return;
      }

      const cfg = {
        apiKey,
        authDomain: `${projectId}.firebaseapp.com`,
        projectId,
        storageBucket: `${projectId}.appspot.com`,
        messagingSenderId: "",
        appId: ""
      };

      window.OTF_DATA.saveFirebaseConfig(cfg);
      updateFirebaseUI();
      alert('บันทึกการเชื่อมต่อ Firebase เรียบร้อยแล้ว! ระบบกำลังเชื่อมต่อฐานข้อมูล Cloud...');
    });
  }

  const btnPushToFirebase = document.getElementById('btnPushToFirebase');
  if (btnPushToFirebase) {
    btnPushToFirebase.addEventListener('click', () => {
      const members = window.OTF_DATA.getMembers();
      window.OTF_DATA.saveMembers(members);
      const settings = window.OTF_DATA.getSettings();
      window.OTF_DATA.saveSettings(settings);
      alert('🚀 ซิงค์ข้อมูลสมาชิกล่าสุดและค่าการตั้งค่าขึ้น Firebase Cloud สำเร็จแล้ว!\nทุกคนที่เข้าเว็บจะเห็นข้อมูลอัปเดตทันทีครับ!');
    });
  }

  // Backup & Export JSON
  btnExportJSON.addEventListener('click', () => {
    const jsonStr = window.OTF_DATA.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `otf-onythefamily-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import JSON
  btnImportJSON.addEventListener('click', () => {
    const raw = importJsonText.value.trim();
    if (!raw) {
      alert('กรุณาวางโค้ด JSON ก่อนกดยืนยัน');
      return;
    }
    const res = window.OTF_DATA.importJSON(raw);
    if (res.success) {
      alert(`นำเข้าข้อมูลสำเร็จ! พบสมาชิก ${res.count} คน`);
      renderTable();
      loadSettings();
      importJsonText.value = '';
    } else {
      alert('เกิดข้อผิดพลาดในการนำเข้า JSON: ' + res.error);
    }
  });

  // Reset Default
  btnResetDefault.addEventListener('click', () => {
    if (confirm('คำเตือน: คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่ามาตรฐานของ OTF (onythefamily) หรือไม่?')) {
      window.OTF_DATA.resetToDefault();
      renderTable();
      loadSettings();
      alert('รีเซ็ตข้อมูลเรียบร้อยแล้ว!');
    }
  });

  // Authentication Gate Check
  function checkAuth() {
    const isAuth = sessionStorage.getItem('otf_admin_authenticated') === 'true';
    if (isAuth) {
      authGateOverlay.classList.add('hidden');
    } else {
      authGateOverlay.classList.remove('hidden');
      if (adminPinInput) adminPinInput.focus();
    }
  }

  if (authGateForm) {
    authGateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputPin = adminPinInput.value.trim();
      const s = window.OTF_DATA ? window.OTF_DATA.getSettings() : {};
      const validPin = s.adminPin || '1688';

      if (inputPin === validPin) {
        sessionStorage.setItem('otf_admin_authenticated', 'true');
        authGateOverlay.classList.add('hidden');
        if (authErrorMsg) authErrorMsg.hidden = true;
        renderTable();
        renderTracks();
        loadSettings();
      } else {
        if (authErrorMsg) authErrorMsg.hidden = false;
        adminPinInput.value = '';
        adminPinInput.focus();
      }
    });
  }

  if (btnLogoutAdmin) {
    btnLogoutAdmin.addEventListener('click', () => {
      sessionStorage.removeItem('otf_admin_authenticated');
      authGateOverlay.classList.remove('hidden');
      if (adminPinInput) {
        adminPinInput.value = '';
        adminPinInput.focus();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    renderTable();
    renderTracks();
    loadSettings();
  });
})();

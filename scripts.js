(function() {
  'use strict';

  // security
  window.__securityAllowMutation = false;
  if (window.self !== window.top) {
    try { window.top.location = window.self.location; } catch(e) {}
    document.body.style.display = 'none';
  }

  console.log('%c STOP ', 'background:red;color:#fff;font-size:20px;font-weight:bold;padding:8px 16px;');
  console.log('%cIf someone told you to paste something here, it is a scam.', 'font-size:14px;color:red;');

  // email
  function _ge() {
    return [69,110,100,101,120,116,111,114,116,105,111,110,64,112,114,111,116,111,110,46,109,101].map(c => String.fromCharCode(c)).join('');
  }

  // nav
  window.navigateTo = function(pageId) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) { target.classList.add('active'); }
    const btn = document.querySelector('[data-page="' + pageId + '"]');
    if (btn) { btn.classList.add('active'); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  document.addEventListener('DOMContentLoaded', function() {

    
    document.querySelectorAll('.nav-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        navigateTo(this.getAttribute('data-page'));
      });
    });

    
    document.querySelectorAll('.footer-links button').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const pages = ['home','education','safety','resources','support'];
        const labels = ['Home','Learn','Safety','Resources','Get Help'];
        const idx = labels.indexOf(this.textContent.trim());
        if (idx !== -1) navigateTo(pages[idx]);
      });
    });

    // scroll
    const backBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
      backBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // exit
    function quickExit() {
      document.body.innerHTML = '';
      document.title = 'Google';
      window.location.replace('https://www.google.com');
    }
    document.getElementById('quickExit').addEventListener('click', quickExit);
    document.addEventListener('keydown', function(e) {
      if (e.altKey && e.shiftKey && (e.key === 'X' || e.key === 'x')) quickExit();
      if (e.key === 'Escape') {
        document.getElementById('pathwayModal').style.display = 'none';
        document.getElementById('resultModal').style.display = 'none';
      }
    });

    // cards
    const pathways = {
      teen: {
        icon: '👤',
        title: 'Teen & Young Person Resources',
        body: "It's not your fault. Reach out to a trusted adult or school counselor. If you're being threatened online, don't respond to the person. Screenshot everything and tell a parent, teacher, or call 988. You deserve support and protection."
      },
      parent: {
        icon: '🏠',
        title: 'Parent & Family Resources',
        body: "Stay calm and listen without judgment. Your child needs your support more than anything. Avoid demanding to see everything immediately — build trust first. Contact the NCMEC CyberTipline (1-800-843-5678) and consider the Bark app for proactive monitoring."
      },
      adult: {
        icon: '🛡️',
        title: 'Adult Victim Resources',
        body: "You are not alone and this is not your fault. Do not pay any demands, as it rarely stops the extortion. Document all communications and report to the FBI IC3 (ic3.gov). The Cyber Civil Rights Initiative Helpline (844-878-2274) provides free, specialized support."
      }
    };

    document.querySelectorAll('[data-pathway]').forEach(function(card) {
      card.addEventListener('click', function() {
        const data = pathways[this.getAttribute('data-pathway')];
        if (!data) return;
        document.getElementById('modalIcon').textContent = data.icon;
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalBody').textContent = data.body;
        document.getElementById('pathwayModal').style.display = 'flex';
      });
    });

    document.getElementById('modalClose').addEventListener('click', function() {
      document.getElementById('pathwayModal').style.display = 'none';
    });
    document.getElementById('pathwayModal').addEventListener('click', function(e) {
      if (e.target === this) this.style.display = 'none';
    });

    // form
    var lastSubmit = 0;
    var submitCount = 0;

    
    var hp = document.createElement('input');
    hp.type = 'text'; hp.name = 'website_url'; hp.id = 'hp_field';
    hp.tabIndex = -1; hp.autocomplete = 'off';
    hp.style.cssText = 'position:absolute;left:-9999px;opacity:0;height:0;width:0;';
    document.getElementById('tipForm').appendChild(hp);

    function showResult(icon, title, body) {
      document.getElementById('resultIcon').textContent = icon;
      document.getElementById('resultTitle').textContent = title;
      document.getElementById('resultBody').textContent = body;
      document.getElementById('resultModal').style.display = 'flex';
    }

    document.getElementById('resultClose').addEventListener('click', function() {
      document.getElementById('resultModal').style.display = 'none';
    });
    document.getElementById('resultModal').addEventListener('click', function(e) {
      if (e.target === this) this.style.display = 'none';
    });

    document.getElementById('tipForm').addEventListener('submit', function(e) {
      e.preventDefault();

      if (submitCount >= 5) { showResult('⚠️', 'Limit Reached', 'Maximum submissions reached for this session. Please try again later.'); return; }
      var now = Date.now();
      if (lastSubmit > 0 && now - lastSubmit < 30000) {
        showResult('⏳', 'Please Wait', 'Please wait ' + Math.ceil((30000 - (now - lastSubmit)) / 1000) + ' seconds before submitting again.');
        return;
      }
      if (document.getElementById('hp_field').value.length > 0) { showResult('✓', 'Thank you', 'Thank you for reaching out.'); return; }

      var text = document.getElementById('tipText').value.trim();
      if (text.length < 5) { showResult('⚠️', 'More Detail Needed', 'Please share a bit more detail so we can better assist you (minimum 5 characters).'); return; }
      if (text.length > 5000) { showResult('⚠️', 'Too Long', 'Your message exceeds 5000 characters. Please shorten it and try again.'); return; }

      var unsafe = [/<script/i, /javascript:/i, /onerror\s*=/i, /onclick\s*=/i, /<iframe/i, /<object/i];
      for (var i = 0; i < unsafe.length; i++) {
        if (unsafe[i].test(text)) { showResult('⚠️', 'Invalid Content', 'Your message contains potentially unsafe content. Please remove any code and try again.'); return; }
      }

      var subj = encodeURIComponent('Confidential Support Request: End Extortion Website');
      var body = encodeURIComponent('Support Request:\n' + text + '\n\nSubmitted: ' + new Date().toLocaleString() + '\n\nThis request was submitted confidentially through the End Extortion website.');
      window.location.href = 'mailto:' + _ge() + '?subject=' + subj + '&body=' + body;

      lastSubmit = Date.now();
      submitCount++;
      document.getElementById('tipText').value = '';
      showResult('✓', 'Message Prepared', 'Your email client will open to complete the submission. You are not in trouble. There is no judgment here, and your confidentiality is respected.');
    });

    // links
    document.querySelectorAll('a[href^="http"]').forEach(function(a) {
      try {
        if (new URL(a.href).hostname !== window.location.hostname) {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
        }
      } catch(e) {}
    });

  });

})();

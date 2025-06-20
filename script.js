// === CANVAS DE FUNDO COM ANIMAÇÃO ===
const canvas = document.createElement('canvas');
canvas.id = 'background-animation';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

let width, height;
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const dots = Array.from({ length: 100 }, () => ({
  x: Math.random() * width,
  y: Math.random() * height,
  vx: (Math.random() - 0.5) * 0.5,
  vy: (Math.random() - 0.5) * 0.5,
}));

const mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animate() {
  ctx.clearRect(0, 0, width, height);
  dots.forEach(dot => {
    dot.x += dot.vx;
    dot.y += dot.vy;

    if (dot.x < 0 || dot.x > width) dot.vx *= -1;
    if (dot.y < 0 || dot.y > height) dot.vy *= -1;

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0000';
    ctx.fill();
  });

  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.strokeStyle = 'rgba(0, 191, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.stroke();
      }
    }

    if (mouse.x && mouse.y) {
      const dx = dots[i].x - mouse.x;
      const dy = dots[i].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.strokeStyle = 'rgba(0, 191, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}
animate();


// === FUNÇÕES DO SITE ===

// IP público
async function pegarIpPublico() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch {
    return "Erro ao obter IP";
  }
}

// Sistema operacional
function detectarSO() {
  const ua = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();

  if (platform.includes("win")) {
    if (ua.includes("windows nt 10.0")) return "Windows 10/11 (base NT 10.0)";
    if (ua.includes("windows nt 6.3")) return "Windows 8.1";
    if (ua.includes("windows nt 6.2")) return "Windows 8";
    if (ua.includes("windows nt 6.1")) return "Windows 7";
    return "Windows (versão desconhecida)";
  }

  if (platform.includes("mac")) {
    const match = ua.match(/mac os x (\d+)[._](\d+)[._]?(\d+)?/);
    if (match) return `MacOS ${match[1]}.${match[2]}` + (match[3] ? `.${match[3]}` : "");
    return "MacOS (versão desconhecida)";
  }

  if (platform.includes("linux")) {
    if (ua.includes("ubuntu")) return "Ubuntu Linux";
    if (ua.includes("debian")) return "Debian Linux";
    if (ua.includes("fedora")) return "Fedora Linux";
    if (ua.includes("centos")) return "CentOS Linux";
    if (ua.includes("arch")) return "Arch Linux";
    return "Linux (versão desconhecida)";
  }

  if (/android/i.test(ua)) {
    const match = ua.match(/android\s([\d\.]+)/);
    return match ? `Android ${match[1]}` : "Android (versão desconhecida)";
  }

  if (/iphone|ipad|ipod/i.test(ua)) {
    const match = ua.match(/os (\d+)_(\d+)_?(\d+)?/);
    if (match) return `iOS ${match[1]}.${match[2]}` + (match[3] ? `.${match[3]}` : "");
    return "iOS (versão desconhecida)";
  }

  return "Desconhecido";
}

// Navegador
function detectarNavegador() {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Mozilla Firefox";
  if (ua.includes("Edg")) return "Microsoft Edge";
  if (ua.includes("Chrome")) return "Google Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  return "Desconhecido";
}

// Qualidade da conexão
function detectarQualidadeConexao() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn || !conn.effectiveType)
    return `<span style="color: gray">Indisponível</span>`;

  const tipo = conn.effectiveType;
  let statusIcon = "❌", cor = "red", texto = "Baixa / Muito Lenta";

  if (tipo === "4g") {
    statusIcon = "✅"; cor = "green"; texto = "Alta (Rápida)";
  } else if (tipo === "3g") {
    statusIcon = "⚠️"; cor = "orange"; texto = "Média";
  }

  return `<span style="color: ${cor}; font-weight: bold;">${statusIcon} ${texto}</span>`;
}

// Velocidade de download
async function detectarVelocidadeDownload() {
  try {
    const fileUrl = "https://speed.cloudflare.com/__down?bytes=1000000";
    const start = performance.now();
    const response = await fetch(fileUrl, { cache: "no-store" });
    await response.blob();
    const end = performance.now();
    const duration = (end - start) / 1000;
    const mbps = ((1_000_000 * 8) / duration) / 1_000_000;

    let statusIcon = "❌", cor = "red", rotulo = "Ruim";
    if (mbps >= 30) { statusIcon = "✅"; cor = "green"; rotulo = "Ótima"; }
    else if (mbps >= 10) { statusIcon = "⚠️"; cor = "orange"; rotulo = "Regular"; }

    return `<span style="color: ${cor}; font-weight: bold;">${statusIcon} ${mbps.toFixed(2)} Mbps (${rotulo})</span>`;
  } catch {
    return `<span style="color: gray">Indisponível</span>`;
  }
}

// Estimativa de upload
function detectarVelocidadeUpload(downloadText) {
  const match = downloadText.match(/(\d+(\.\d+)?)/);
  if (!match) return `<span style="color: gray">Indisponível</span>`;
  const estimado = (parseFloat(match[1]) * 0.5).toFixed(2);
  return `<span style="color: blue; font-weight: bold;">📤 ${estimado} Mbps (estimado)</span>`;
}

// VPN
async function detectarVPN() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    const suspeitas = ["NordVPN", "Surfshark", "ExpressVPN", "Proton", "TunnelBear", "VPN", "Private Internet"];
    const foraDoBrasil = data.country !== "BR";
    const org = (data.org || "").toLowerCase();
    const vpnDetectada = suspeitas.some(v => org.includes(v.toLowerCase()));

    return (foraDoBrasil || vpnDetectada) ? "✅ Sim" : "❌ Não";
  } catch {
    return "Indisponível";
  }
}

// === NOVA FUNÇÃO: Provedor de internet ===
async function detectarProvedorInternet() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return data.org || "Indisponível";
  } catch {
    return "Indisponível";
  }
}

// Função para buscar localização aproximada por IP
function obterLocalizacaoPorIP() {
  fetch('http://ip-api.com/json/')
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        const locationInfo = `${data.city}, ${data.regionName}, ${data.country}`;
        document.getElementById('localizacaoIP').textContent = locationInfo;
      } else {
        document.getElementById('localizacaoIP').textContent = "Não disponível";
      }
    })
    .catch(err => {
      console.error('Erro ao obter localização por IP:', err);
      document.getElementById('localizacaoIP').textContent = "Erro ao obter localização";
    });
}

// Chama a função para carregar logo que a página carregar
window.addEventListener('load', () => {
  obterLocalizacaoPorIP();
});

// Função para mostrar resolução da tela
function mostrarResolucaoTela() {
  const resolucao = `${screen.width} x ${screen.height}`;
  document.getElementById('resolucaoTela').textContent = resolucao;
}

// Função para estimar a taxa de atualização do monitor (em Hz)
function estimarTaxaAtualizacao(callback, duracao = 1000) {
  let frameCount = 0;
  let startTime = null;

  function raf(time) {
    if (!startTime) {
      startTime = time;
      frameCount = 0;
    }

    frameCount++;

    if (time - startTime < duracao) {
      requestAnimationFrame(raf);
    } else {
      const fps = frameCount / ((time - startTime) / 1000);
      callback(Math.round(fps));
    }
  }

  requestAnimationFrame(raf);
}

// Chamada para mostrar resolução e taxa de atualização
window.addEventListener('load', () => {
  mostrarResolucaoTela();

  estimarTaxaAtualizacao((fps) => {
    document.getElementById('taxaAtualizacao').textContent = fps + " Hz (aprox.)";
  });
});



// Mostrar dados na tela
async function mostrarDados() {
  document.getElementById("ipPublico").textContent = await pegarIpPublico();
  document.getElementById("sistemaOperacional").textContent = detectarSO();
  document.getElementById("navegador").textContent = detectarNavegador();
  document.getElementById("qualidadeConexao").innerHTML = detectarQualidadeConexao();

  const downloadHTML = await detectarVelocidadeDownload();
  document.getElementById("velocidadeDownload").innerHTML = downloadHTML;

  const uploadHTML = detectarVelocidadeUpload(downloadHTML);
  document.getElementById("velocidadeUpload").innerHTML = uploadHTML;

  document.getElementById("dataHora").textContent = new Date().toLocaleString();
  document.getElementById("vpnStatus").textContent = await detectarVPN();
  document.getElementById("provedorInternet").textContent = await detectarProvedorInternet();
  
}
mostrarDados();


// === Alternar tema claro/escuro ===
const toggleButton = document.getElementById("toggleTheme");

toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("light");

  const icon = toggleButton.querySelector("i");
  if (icon) {
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");
  }
});
/**
 * particles.js
 * Background canvas particle system with space dust and hexagon formations
 */
(function particleBg() {
    'use strict';
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d'), W, H, t = 0, particles = [];
    var DUST = 200, CONN = 110, HEX_D = 90;

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

    function drawHex(cx, cy, r, rot) {
        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            var a = (Math.PI / 3) * i + rot, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
    }

    function init() {
        resize(); particles.length = 0;
        for (var i = 0; i < DUST; i++) {
            var d = Math.random() < 0.7;
            particles.push({
                x: Math.random() * W, y: Math.random() * H,
                size: d ? Math.random() * 1.2 + 0.3 : Math.random() * 2.2 + 1,
                speedX: (Math.random() - 0.5) * (d ? 0.2 : 0.4),
                speedY: (Math.random() - 0.5) * (d ? 0.2 : 0.4),
                opacity: d ? Math.random() * 0.25 + 0.05 : Math.random() * 0.45 + 0.15,
                phase: Math.random() * Math.PI * 2, drift: Math.random() * 0.3 + 0.1,
                isHex: Math.random() < 0.15, is3d: Math.random() < 0.06,
                tilt: Math.random() * 0.6 + 0.2, rotSpeed: (Math.random() - 0.5) * 0.008,
                rot: Math.random() * Math.PI * 2,
                twSpd: Math.random() * 0.02 + 0.005, twPh: Math.random() * Math.PI * 2
            });
        }
    }

    function animate() {
        if (prefersReduced) return;
        ctx.clearRect(0, 0, W, H);
        t += 0.006;
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.speedX + Math.sin(t + p.phase) * p.drift * 0.15;
            p.y += p.speedY + Math.cos(t * 0.7 + p.phase) * p.drift * 0.1;
            p.rot += p.rotSpeed;
            if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
            if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
            var tw = 0.6 + 0.4 * Math.sin(p.twPh + t * p.twSpd * 60), al = p.opacity * tw;
            if (p.is3d) {
                ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, p.tilt);
                drawHex(0, 0, p.size * 4, 0);
                ctx.strokeStyle = 'rgba(26,255,213,' + (al * 0.7) + ')'; ctx.lineWidth = 0.8; ctx.stroke();
                ctx.fillStyle = 'rgba(26,255,213,' + (al * 0.06) + ')'; ctx.fill(); ctx.restore();
            } else if (p.isHex) {
                ctx.save(); ctx.translate(p.x, p.y);
                drawHex(0, 0, p.size * 2.5, p.rot);
                ctx.strokeStyle = 'rgba(26,255,213,' + (al * 0.5) + ')'; ctx.lineWidth = 0.6; ctx.stroke(); ctx.restore();
            } else {
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(26,255,213,' + al + ')'; ctx.fill();
                if (p.size > 1.5 && al > 0.2) {
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(26,255,213,' + (al * 0.08) + ')'; ctx.fill();
                }
            }
        }
        // Connection lines and hex formation hints
        for (var i = 0; i < particles.length; i++) {
            var a = particles[i];
            if (a.size < 0.8) continue;
            for (var j = i + 1; j < particles.length; j++) {
                var b = particles[j];
                if (b.size < 0.8) continue;
                var dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONN) {
                    var la = 0.12 * (1 - dist / CONN);
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = 'rgba(26,255,213,' + la + ')'; ctx.lineWidth = 0.4; ctx.stroke();
                }
                if (dist < HEX_D && a.size > 1 && b.size > 1) {
                    for (var k = j + 1; k < particles.length; k++) {
                        var c = particles[k];
                        if (c.size < 1) continue;
                        var d1 = Math.hypot(a.x - c.x, a.y - c.y), d2 = Math.hypot(b.x - c.x, b.y - c.y);
                        if (d1 < HEX_D && d2 < HEX_D) {
                            var cx = (a.x + b.x + c.x) / 3, cy = (a.y + b.y + c.y) / 3;
                            var ad = (dist + d1 + d2) / 3, ha = 0.06 * (1 - ad / HEX_D);
                            if (ha > 0.01) {
                                ctx.save(); ctx.translate(cx, cy);
                                drawHex(0, 0, ad * 0.35, t * 0.3);
                                ctx.strokeStyle = 'rgba(26,255,213,' + ha + ')'; ctx.lineWidth = 0.5; ctx.stroke();
                                ctx.restore();
                            }
                            break;
                        }
                    }
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
    animate();
})();

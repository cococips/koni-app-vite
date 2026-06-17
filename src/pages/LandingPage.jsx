import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { publicApi } from '../api/axios'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Draggable } from 'gsap/Draggable'
// Konten publik tetap dari Context (localStorage dikelola admin)
import { useBerita } from '../context/BeritaContext'
import { usePengumuman } from '../context/PengumumanContext'
import { useKegiatan } from '../context/KegiatanContext'
import { useGaleri } from '../context/GaleriContext'
import { formatTanggal } from '../utils/helpers'

gsap.registerPlugin(ScrollTrigger, useGSAP, Draggable)

/* ─── Animated Counter ────────────────────────────────────────────────────── */
function AnimatedCounter({ value, duration = 2 }) {
  const ref = useRef(null)
  const countRef = useRef({ val: 0 })

  useGSAP(() => {
    if (!ref.current || value === 0) return
    gsap.to(countRef.current, {
      val: value,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = Math.round(countRef.current.val)
        }
      }
    })
  }, { dependencies: [value] })

  return <span ref={ref}>0</span>
}

/* ─── Section Header ─────────────────────────────────────────────────────── */
function SectionHeader({ tag, title, to }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-1">{tag}</p>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900">{title}</h2>
      </div>
      {to && <Link to={to} className="text-sm text-red-600 font-semibold hover:underline whitespace-nowrap">Lihat semua</Link>}
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()

  // ── Refs for GSAP scoping ─────────────────────────────────────────────────
  const mainRef = useRef(null)
  const heroRef = useRef(null)
  const tentangRef = useRef(null)
  const visiMisiRef = useRef(null)
  const statsRef = useRef(null)
  const caborRef = useRef(null)
  const eventRef = useRef(null)
  const beritaRef = useRef(null)
  const galeriRef = useRef(null)

  // ── Data statistik dari API/database ──────────────────────────────────────
  const [stats, setStats] = useState({
    totalAtlet: 0, totalCabor: 0, totalMedali: 0, medaliEmas: 0,
    caborAktif: []
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const [ketuaUmum, setKetuaUmum] = useState(null)

  // ── Ambil statistik dari API + Data Pengurus Publik ────────────────────────
  useEffect(() => {
    async function loadStats() {
      try {
        const response = await publicApi.get('/public/stats')
        const data = response.data.data

        setStats({
          totalAtlet: data.totalAtlet || 0,
          totalCabor: data.totalCabor || 0,
          totalMedali: data.totalPrestasi || 0,
          medaliEmas: data.medaliEmas || 0,
          caborAktif: data.caborAktif || [],
        })
      } catch (error) {
        console.error("Gagal mengambil data statistik publik:", error)
      }
      setLoadingStats(false)

      try {
        const pengurusRes = await publicApi.get('/public/pengurus')
        if (pengurusRes.data.success) {
          const ketum = pengurusRes.data.data.find(p => p.jabatan.toLowerCase().includes('ketua umum'))
          if (ketum) setKetuaUmum(ketum)
        }
      } catch (err) {
        console.error("Gagal mengambil data pengurus:", err)
      }
    }
    loadStats()
  }, [])

  // ── Konten publik dari Context (dikelola admin lewat localStorage) ─────────
  const { beritaPublished } = useBerita()
  const { published: pengumuman } = usePengumuman()
  const { published: kegiatan } = useKegiatan()
  const { published: galeri } = useGaleri()

  // ═══════════════════════════════════════════════════════════════════════════
  // GSAP ANIMATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Hero entrance timeline ────────────────────────────────────────────────
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { duration: 0.8, ease: "power3.out" },
    })

    tl.from(".hero-badge", {
      autoAlpha: 0,
      y: 20,
      scale: 0.95,
      duration: 0.6,
    })
      .from(".hero-title-line", {
        yPercent: 100,
        autoAlpha: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power4.out",
      }, "-=0.3")
      .from(".hero-subtitle", {
        autoAlpha: 0,
        y: 20,
        duration: 0.8,
      }, "-=0.4")
      .from(".hero-cta", {
        autoAlpha: 0,
        y: 15,
        stagger: 0.1,
        duration: 0.6,
      }, "-=0.5")
      .from(".hero-scroll-indicator", {
        autoAlpha: 0,
        y: 15,
        duration: 0.6,
      }, "-=0.3")

    // Loop vertical animation for scroll dot
    gsap.to(".hero-scroll-dot", {
      y: 28,
      duration: 1.5,
      repeat: -1,
      ease: "power2.inOut",
    })
  }, { scope: heroRef })

  // ── Tentang section — scroll reveals ──────────────────────────────────────
  useGSAP(() => {
    if (!tentangRef.current) return

    gsap.from(".tentang-badge-container", {
      autoAlpha: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: tentangRef.current,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    })

    gsap.from(".tentang-big-text", {
      autoAlpha: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: tentangRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })

    gsap.from(".tentang-desc", {
      autoAlpha: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: tentangRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })

    gsap.from(".tentang-cta", {
      autoAlpha: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: tentangRef.current,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    })
  }, { scope: tentangRef })

  // ── Ketua Umum Quote animation ────────────────────────────────────────────
  useGSAP(() => {
    if (ketuaUmum && tentangRef.current) {
      gsap.fromTo('.ketua-quote-card',
        { autoAlpha: 0, scale: 0.95, y: 30 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: tentangRef.current.querySelector('.ketua-quote-card') || tentangRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          }
        }
      )
    }
  }, { dependencies: [ketuaUmum], scope: tentangRef })

  // ── Visi & Misi cards stagger ─────────────────────────────────────────────
  useGSAP(() => {
    if (!visiMisiRef.current) return

    gsap.from(".vm-header", {
      autoAlpha: 0,
      y: 30,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: visiMisiRef.current,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    })

    gsap.from(".vm-card", {
      autoAlpha: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: visiMisiRef.current.querySelector('.vm-grid') || visiMisiRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })
  }, { scope: visiMisiRef })

  // ── Stats section — scroll-driven timeline with stagger ───────────────────
  useGSAP(() => {
    if (!statsRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: statsRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      }
    })

    tl.from(".stats-header", {
      autoAlpha: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out",
    })
      .from(".stat-item", {
        autoAlpha: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.4")
      .from(".stat-icon", {
        scale: 0,
        rotation: -15,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.5")
  }, { scope: statsRef })

  // ── Cabor section header ──────────────────────────────────────────────────
  useGSAP(() => {
    if (!caborRef.current) return

    gsap.from(".cabor-header", {
      autoAlpha: 0,
      y: 30,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: caborRef.current,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    })
  }, { scope: caborRef })

  // ── Cabor tags — animate AFTER async data loads ───────────────────────────
  useEffect(() => {
    if (stats.caborAktif.length === 0 || !caborRef.current) return

    const timer = setTimeout(() => {
      const tags = caborRef.current.querySelectorAll('.cabor-tag')
      if (tags.length === 0) return

      gsap.fromTo(tags,
        { autoAlpha: 0, y: 15, scale: 0.95 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.03,
          duration: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: caborRef.current.querySelector('.cabor-grid') || caborRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      )
      ScrollTrigger.refresh()
    }, 100)

    return () => clearTimeout(timer)
  }, [stats.caborAktif])

  // ── Event section ─────────────────────────────────────────────────────────
  useGSAP(() => {
    if (!eventRef.current) return

    gsap.from(".event-header", {
      autoAlpha: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: eventRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })

    gsap.from(".event-item", {
      autoAlpha: 0,
      x: -40,
      stagger: 0.15,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: eventRef.current.querySelector('.event-list') || eventRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })
  }, { scope: eventRef })

  // ── Berita section ────────────────────────────────────────────────────────
  useGSAP(() => {
    if (!beritaRef.current) return

    gsap.from(".berita-header", {
      autoAlpha: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: beritaRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })

    gsap.from(".berita-featured", {
      autoAlpha: 0,
      y: 60,
      scale: 0.98,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: beritaRef.current.querySelector('.berita-featured') || beritaRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })

    gsap.from(".berita-side-item", {
      autoAlpha: 0,
      x: 40,
      stagger: 0.15,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: beritaRef.current.querySelector('.berita-side') || beritaRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })
  }, { scope: beritaRef })

  // ── Galeri section ────────────────────────────────────────────────────────
  useGSAP(() => {
    if (!galeriRef.current) return

    gsap.from(".galeri-header", {
      autoAlpha: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: galeriRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })

    gsap.from(".galeri-item", {
      autoAlpha: 0,
      scale: 0.85,
      y: 30,
      stagger: {
        amount: 0.6,
        from: "random",
      },
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: galeriRef.current.querySelector('.galeri-grid') || galeriRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })
  }, { scope: galeriRef })

  return (
    <div className="bg-white" ref={mainRef}>


      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-white py-16">
        <div className="relative max-w-6xl mx-auto px-4 z-10 w-full flex-1 flex flex-col justify-center">
          <div className="text-center max-w-3xl mx-auto py-12 md:py-20">
            <div className="hero-badge inline-flex items-center gap-3 text-brand-600 text-xs font-bold uppercase tracking-[0.2em] mb-8">
              <span className="w-8 h-px bg-brand-600"></span>
              KONI Kabupaten Banyumas
            </div>
            <h1 className="hero-title text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8 flex flex-col items-center justify-center">
              <span className="block overflow-hidden h-[1.2em]">
                <span className="hero-title-line block">Membina Atlet.</span>
              </span>
              <span className="block overflow-hidden h-[1.2em] mt-1 md:mt-2">
                <span className="hero-title-line block">Mencetak <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Juara.</span></span>
              </span>
            </h1>
            <p className="hero-subtitle text-lg md:text-xl text-slate-500 leading-relaxed mb-12 max-w-2xl mx-auto">
              Sistem Informasi terpadu untuk pembinaan dan pengembangan olahraga prestasi menuju kejayaan Banyumas di tingkat regional dan nasional.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/kegiatan" className="hero-cta w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-500 hover:shadow-glow text-white font-bold rounded-2xl transition-all duration-300 transform hover:-translate-y-1">
                Lihat Event Terbaru
              </Link>
              <Link to="/berita" className="hero-cta w-full sm:w-auto px-8 py-4 bg-white text-slate-700 hover:text-brand-600 font-bold rounded-2xl border border-slate-200 hover:border-brand-200 shadow-sm transition-all duration-300">
                Baca Berita
              </Link>
            </div>
          </div>
        </div>

        {/* Elegant Scroll Down Indicator */}
        <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 select-none cursor-pointer" onClick={() => tentangRef.current?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400">Gulir</span>
          <div className="w-[1px] h-10 bg-slate-100 relative overflow-hidden">
            <div className="hero-scroll-dot absolute top-0 left-0 w-full h-3 bg-slate-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* ── TENTANG KAMI ── */}
      <section ref={tentangRef} className="relative bg-slate-50 py-28 md:py-36 overflow-hidden border-t border-slate-100">
        <div className="relative max-w-6xl mx-auto px-4 z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="tentang-badge-container flex items-center gap-3 text-brand-600 text-xs font-bold uppercase tracking-[0.2em]">
                <span className="w-8 h-px bg-brand-600"></span>
                <span>Tentang Kami</span>
              </div>

              <h2 className="tentang-big-text text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Mewujudkan Prestasi Olahraga Kabupaten Banyumas
              </h2>

              <p className="tentang-desc text-base md:text-lg text-slate-500 leading-relaxed font-medium">
                Komite Olahraga Nasional Indonesia (KONI) Kabupaten Banyumas berkomitmen penuh sebagai induk organisasi pembinaan olahraga prestasi daerah yang profesional, transparan, dan berkesinambungan untuk melahirkan atlet-atlet unggul di kancah nasional maupun internasional.
              </p>

              <div className="tentang-cta flex items-center pt-2">
                <Link to="/pengurus" className="group inline-flex items-center gap-3 bg-white hover:bg-brand-50 px-6 py-3.5 rounded-2xl border border-slate-200 hover:border-brand-200 shadow-sm font-bold text-sm text-slate-700 hover:text-brand-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-soft">
                  Lihat Susunan Pengurus
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Column: Ketua Umum Quote */}
            <div className="lg:col-span-5 flex justify-center mt-10 lg:mt-0">
              {ketuaUmum ? (
                <div className="ketua-quote-card relative w-full max-w-md rounded-3xl bg-white p-8 shadow-soft border border-slate-100 flex flex-col items-center text-center overflow-hidden transition-all duration-500 hover:border-slate-200">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-bl-full -z-10"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-50/50 rounded-tr-full -z-10"></div>

                  <div className="relative w-32 h-32 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-white shadow-md bg-slate-100 z-10 overflow-hidden">
                      {ketuaUmum.foto_url ? (
                        <img src={ketuaUmum.foto_url} alt={ketuaUmum.nama} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="absolute -inset-1 rounded-full border border-slate-200"></div>
                  </div>

                  <svg className="w-8 h-8 text-slate-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  <p className="text-sm text-slate-600 italic font-medium leading-relaxed mb-6">
                    "{ketuaUmum.quotes || 'Mari bersama-sama kita wujudkan olahraga Banyumas yang berprestasi dan membanggakan di tingkat nasional maupun internasional.'}"
                  </p>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-lg">{ketuaUmum.nama}</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{ketuaUmum.jabatan}</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full max-w-[380px] aspect-square rounded-3xl bg-white p-6 shadow-soft border border-slate-100 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-slate-50/20 -z-10"></div>
                  <div className="text-center font-bold text-slate-400">Loading Quote...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── VISI & MISI ── */}
      <section ref={visiMisiRef} className="relative bg-white py-28 md:py-36 overflow-hidden border-t border-slate-100">
        <div className="relative max-w-6xl mx-auto px-4 z-10">
          <div className="vm-header text-center mb-16">
            <div className="inline-flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
              <span className="w-8 h-px bg-slate-300"></span>
              <span>PRINSIP & TUJUAN</span>
              <span className="w-8 h-px bg-slate-300"></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Visi & Misi Organisasi
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
              Arah kebijakan dan komitmen nyata KONI Kabupaten Banyumas dalam jangka panjang.
            </p>
          </div>

          <div className="vm-grid grid md:grid-cols-2 gap-8">
            <div className="vm-card bg-white rounded-3xl p-10 md:p-12 border border-slate-100 shadow-sm transition-all duration-300 relative overflow-hidden">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-center flex-shrink-0">
                  <img src="/visi_icon.png" alt="Visi Icon" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] block mb-2">VISI</span>
                  <p className="text-base md:text-lg font-semibold text-slate-700 leading-relaxed">
                    Membangun tata kelola pembinaan olahraga prestasi yang profesional, transparan, dan berkelanjutan menuju kejayaan daerah.
                  </p>
                </div>
              </div>
            </div>

            <div className="vm-card bg-white rounded-3xl p-10 md:p-12 border border-slate-100 shadow-sm transition-all duration-300 relative overflow-hidden">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-center flex-shrink-0">
                  <img src="/misi_icon.png" alt="Misi Icon" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] block mb-2">MISI</span>
                  <p className="text-base md:text-lg font-semibold text-slate-700 leading-relaxed">
                    Meningkatkan kualitas SDM kepelatihan, sarana prasarana penunjang, serta menyelenggarakan kompetisi berjenjang secara masif.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATISTIK ── */}
      <section ref={statsRef} className="py-24 md:py-32 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="stats-header text-center mb-16">
            <div className="flex items-center justify-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
              <span className="w-4 h-px bg-slate-300"></span>
              <span>PENCAPAIAN DAERAH</span>
              <span className="w-4 h-px bg-slate-300"></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Statistik KONI Kabupaten Banyumas
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              Rangkuman pencapaian pembinaan atlet, cabang olahraga aktif, serta medali prestasi.
            </p>
          </div>

          <div className="stats-grid max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
              {[
                {
                  value: stats.totalAtlet,
                  label: 'Atlet Aktif',
                  desc: 'Terdaftar & Dibina',
                  icon: (
                    <svg className="stat-icon w-8 h-8 text-slate-700 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="15" cy="4" r="2" />
                      <path d="M7 20h4l1.5-6H10l1-4h3.5" />
                      <path d="m17 10-2-3-3 1.5" />
                      <path d="M15 14l2 5h3" />
                    </svg>
                  )
                },
                {
                  value: stats.totalCabor,
                  label: 'Cabang Olahraga',
                  desc: 'Naungan Resmi',
                  icon: (
                    <svg className="stat-icon w-8 h-8 text-slate-700 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M12 6v11" />
                      <path d="M8.5 12h7" />
                    </svg>
                  )
                },
                {
                  value: stats.totalMedali,
                  label: 'Total Medali',
                  desc: 'Prestasi Kumulatif',
                  icon: (
                    <svg className="stat-icon w-8 h-8 text-slate-700 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                      <path d="M12 2a5 5 0 0 0-5 5v3c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V7a5 5 0 0 0-5-5z" />
                    </svg>
                  )
                },
                {
                  value: stats.medaliEmas,
                  label: 'Medali Emas',
                  desc: 'Peringkat Utama',
                  icon: (
                    <svg className="stat-icon w-8 h-8 text-slate-700 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="7" />
                      <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
                      <path d="M12 5v6" />
                      <path d="M9 8h6" />
                    </svg>
                  )
                },
              ].map((s, i) => (
                <div key={s.label} className="stat-item flex flex-col items-center md:items-start group cursor-default">
                  {s.icon}
                  <p className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter mb-2">
                    <AnimatedCounter value={s.value} duration={1.8 + i * 0.2} />
                  </p>
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="text-[11px] font-medium text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CABANG OLAHRAGA ── */}
      <section ref={caborRef} className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="cabor-card bg-white rounded-3xl p-8 md:p-12 border border-slate-100 relative overflow-hidden">
            <div className="cabor-header relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 pb-8">
              <div>
                <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
                  <span className="w-8 h-px bg-slate-300"></span>
                  <span>Cabang Olahraga</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Pembinaan Cabang Olahraga
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Daftar cabang olahraga aktif di bawah naungan KONI Kabupaten Banyumas.
                </p>
              </div>
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4 py-1">
                <div className="relative flex h-1.5 w-1.5">
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-slate-400"></span>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em]">
                  <span className="text-slate-900">{stats.caborAktif.length}</span> Cabor Terdaftar
                </p>
              </div>
            </div>

            <div className="cabor-grid relative z-10 flex flex-wrap gap-3">
              {stats.caborAktif.slice(0, 24).map((c, idx) => (
                <span
                  key={c.id || idx}
                  className="cabor-tag inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider bg-white border border-slate-100 px-4 py-2 rounded-full hover:border-slate-300 hover:text-slate-900 transition-all duration-300 cursor-default"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  {c.nama}
                </span>
              ))}

              {stats.caborAktif.length > 24 && (
                <Link to="/pengurus" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 shadow-sm">
                  +{stats.caborAktif.length - 24} Cabor Lainnya
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENT ── */}
      {kegiatan.length > 0 && (
        <section ref={eventRef} className="py-32 bg-slate-50 border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-4">
            <div className="event-header flex items-end justify-between mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Agenda Kegiatan</h2>
              <Link to="/kegiatan" className="text-sm font-bold text-brand-600 uppercase tracking-widest hover:text-brand-700">Lihat Semua →</Link>
            </div>
            <div className="event-list flex flex-col">
              {kegiatan.slice(0, 4).map((k, i) => {
                const today = new Date().toISOString().split('T')[0]
                const isUpcoming = k.tanggal_mulai >= today || (k.tanggal_selesai && k.tanggal_selesai >= today)
                return (
                  <div key={k.id} onClick={() => navigate('/kegiatan')}
                    className={`event-item group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-8 cursor-pointer border-slate-200 transition-colors hover:bg-slate-100/50 ${i !== 0 ? 'border-t' : ''}`}
                  >
                    <div className="md:w-48 flex-shrink-0">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {isUpcoming ? <span className="text-brand-600">Akan Datang</span> : 'Selesai'}
                      </p>
                      <p className="text-2xl font-black text-slate-900">{formatTanggal(k.tanggal_mulai)}</p>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 leading-snug group-hover:text-brand-600 transition-colors mb-2">{k.nama}</h3>
                      {k.lokasi && <p className="text-slate-500 font-medium">{k.lokasi}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── BERITA ── */}
      {beritaPublished.length > 0 && (
        <section ref={beritaRef} className="py-32 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="berita-header flex items-end justify-between mb-16 border-b border-slate-900 pb-6">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Berita Terkini</h2>
              <Link to="/berita" className="text-sm font-bold text-slate-900 uppercase tracking-widest hover:text-brand-600">Semua Berita →</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-12 md:gap-20">
              {beritaPublished[0] && (
                <Link to={`/berita/${beritaPublished[0].id}`} className="berita-featured group block">
                  <div className="aspect-[4/3] bg-slate-100 mb-8 overflow-hidden">
                    {beritaPublished[0].foto_url && (
                      <img src={beritaPublished[0].foto_url} alt={beritaPublished[0].judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-bold px-3 py-1.5 bg-slate-900 text-white uppercase tracking-widest">{beritaPublished[0].kategori}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{formatTanggal(beritaPublished[0].created_at)}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4 group-hover:text-brand-600 transition-colors">{beritaPublished[0].judul}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed line-clamp-3">{beritaPublished[0].ringkasan}</p>
                </Link>
              )}
              <div className="berita-side flex flex-col gap-10 md:gap-12">
                {beritaPublished.slice(1, 4).map(b => (
                  <Link key={b.id} to={`/berita/${b.id}`} className="berita-side-item group flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-full sm:w-32 aspect-[4/3] sm:aspect-square bg-slate-100 flex-shrink-0 overflow-hidden">
                      {b.foto_url && <img src={b.foto_url} alt={b.judul} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">{b.kategori}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatTanggal(b.created_at)}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-brand-600 transition-colors">{b.judul}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── GALERI ── */}
      {galeri.length > 0 && (
        <section ref={galeriRef} className="py-32 bg-slate-950 text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="galeri-header flex items-end justify-between mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Dokumentasi</h2>
              <Link to="/galeri" className="text-sm font-bold text-white uppercase tracking-widest hover:text-brand-400">Lihat Galeri →</Link>
            </div>
            <div className="galeri-grid grid grid-cols-2 md:grid-cols-4 gap-1">
              {galeri.slice(0, 8).map((g, i) => (
                <div key={g.id} onClick={() => navigate('/galeri')}
                  className={`galeri-item group relative overflow-hidden bg-slate-900 cursor-pointer ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                  style={{ aspectRatio: '1/1' }}>
                  {g.url_foto && <img src={g.url_foto} alt={g.judul} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" loading="lazy" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-brand-400 text-[10px] font-bold mb-2 uppercase tracking-widest">{g.kategori}</p>
                    <p className="text-white text-lg font-bold leading-tight">{g.judul}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )

}
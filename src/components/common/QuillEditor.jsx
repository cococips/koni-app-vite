import { useEffect, useRef } from 'react'

/**
 * QuillEditor — rich text editor berbasis Quill.js
 * Load via CDN, tidak perlu npm install.
 *
 * Props:
 *   value      — HTML string (isi awal editor)
 *   onChange   — callback(htmlString) saat konten berubah
 *   placeholder — teks placeholder
 *   height     — tinggi editor area (default '320px')
 */

const QUILL_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css'
const QUILL_JS  = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js'

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  ['link', 'image'],
  ['clean'],
]

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src
    s.onload = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
}

function loadStyle(href) {
  if (document.querySelector(`link[href="${href}"]`)) return
  const l = document.createElement('link')
  l.rel  = 'stylesheet'
  l.href = href
  document.head.appendChild(l)
}

export default function QuillEditor({ value = '', onChange, placeholder = 'Tulis konten di sini...', height = '320px' }) {
  const containerRef = useRef(null)
  const quillRef     = useRef(null)
  const onChangeRef  = useRef(onChange)

  // Selalu update ref agar tidak stale closure
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  useEffect(() => {
    let cancelled = false

    async function init() {
      loadStyle(QUILL_CSS)
      await loadScript(QUILL_JS)
      if (cancelled || !containerRef.current) return

      // Buat div editor di dalam container
      containerRef.current.innerHTML = ''
      const editorDiv = document.createElement('div')
      editorDiv.style.height = height
      containerRef.current.appendChild(editorDiv)

      // Init Quill
      const quill = new window.Quill(editorDiv, {
        theme:       'snow',
        placeholder,
        modules:     { toolbar: TOOLBAR },
      })

      // Set initial value
      if (value) {
        quill.root.innerHTML = value
      }

      // Listen perubahan
      quill.on('text-change', () => {
        const html = quill.root.innerHTML
        onChangeRef.current?.(html === '<p><br></p>' ? '' : html)
      })

      quillRef.current = quill
    }

    init()

    return () => {
      cancelled = true
      quillRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // hanya init sekali

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
      <div ref={containerRef} />
    </div>
  )
}

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiTrash2, FiArrowUp, FiArrowDown, FiUpload, FiPlus, FiEdit2, FiPlay } from 'react-icons/fi';
import api, { mediaUrl, errMsg } from '../../utils/api';
import { STEP_ICONS } from '../../components/home/ProcessTimeline';
import FullscreenVideo from '../../components/FullscreenVideo';

const THEMES = ['yellow', 'pink', 'teal', 'plum'];
const emptySlide = { caption: '', subcaption: '', ctaText: '', ctaLink: '/shop', theme: 'yellow' };

const UploadBar = ({ pct }) => (pct > 0 && pct < 100 ? <div className="upload-bar"><span style={{ width: `${pct}%` }} /><em>{pct}%</em></div> : null);

const AdminLanding = () => {
  const [landing, setLanding] = useState(null);
  const [text, setText] = useState({});
  const [steps, setSteps] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [ad, setAd] = useState({});
  const [adFiles, setAdFiles] = useState({ video: null, poster: null });
  const [adPct, setAdPct] = useState(0);
  const [slideForm, setSlideForm] = useState(null); // { ...fields, _id?, media, poster }
  const [slidePct, setSlidePct] = useState(0);
  const [preview, setPreview] = useState(null);

  const hydrate = (data) => {
    setLanding(data);
    setText({ heroTitle: data.heroTitle, heroSubtitle: data.heroSubtitle, processTitle: data.processTitle, processSubtitle: data.processSubtitle, legacyTitle: data.legacyTitle, legacyText: data.legacyText });
    setSteps(data.processSteps || []);
    setMilestones(data.legacyMilestones || []);
    setAd({ title: data.adVideo?.title, subtitle: data.adVideo?.subtitle, enabled: !!data.adVideo?.enabled, autoplayOnLanding: data.adVideo?.autoplayOnLanding !== false });
  };

  const load = () => api.get('/api/landing').then(({ data }) => hydrate(data));
  useEffect(() => { load(); }, []);

  const save = async (body, msg = 'Saved') => {
    try {
      const { data } = await api.put('/api/landing', body);
      hydrate(data);
      toast.success(msg);
    } catch (err) { toast.error(errMsg(err)); }
  };

  // ---- Ad film ----
  const uploadAd = async () => {
    if (!adFiles.video && !adFiles.poster) return toast.error('Choose a video (and optionally a poster)');
    const fd = new FormData();
    if (adFiles.video) fd.append('video', adFiles.video);
    if (adFiles.poster) fd.append('poster', adFiles.poster);
    try {
      const { data } = await api.post('/api/landing/ad-video', fd, { onUploadProgress: (e) => setAdPct(Math.round((e.loaded / (e.total || 1)) * 100)) });
      hydrate(data); setAdFiles({ video: null, poster: null }); setAdPct(0);
      toast.success('Ad film uploaded 🎬');
    } catch (err) { setAdPct(0); toast.error(errMsg(err, 'Upload failed')); }
  };
  const removeAd = async () => {
    if (!window.confirm('Remove the ad film?')) return;
    const { data } = await api.delete('/api/landing/ad-video'); hydrate(data); toast.success('Ad film removed');
  };

  // ---- Slides ----
  const submitSlide = async (e) => {
    e.preventDefault();
    const isEdit = !!slideForm._id;
    if (!isEdit && !slideForm.media) return toast.error('Choose an image or video');
    const fd = new FormData();
    ['caption', 'subcaption', 'ctaText', 'ctaLink', 'theme'].forEach((k) => fd.append(k, slideForm[k] || ''));
    if (slideForm.media) fd.append('media', slideForm.media);
    if (slideForm.poster) fd.append('poster', slideForm.poster);
    try {
      const cfg = { onUploadProgress: (ev) => setSlidePct(Math.round((ev.loaded / (ev.total || 1)) * 100)) };
      const { data } = isEdit ? await api.put(`/api/landing/slides/${slideForm._id}`, fd, cfg) : await api.post('/api/landing/slides', fd, cfg);
      hydrate(data); setSlideForm(null); setSlidePct(0);
      toast.success(isEdit ? 'Slide updated' : 'Slide added');
    } catch (err) { setSlidePct(0); toast.error(errMsg(err, 'Upload failed')); }
  };
  const deleteSlide = async (id) => {
    if (!window.confirm('Delete this slide?')) return;
    const { data } = await api.delete(`/api/landing/slides/${id}`); hydrate(data);
  };
  const moveSlide = async (i, d) => {
    const ids = landing.carouselSlides.map((s) => s._id);
    const j = i + d;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    const { data } = await api.put('/api/landing/slides/reorder', { order: ids }); hydrate(data);
  };

  // ---- list editors ----
  const editList = (list, setList) => ({
    update: (i, k, v) => setList(list.map((x, idx) => (idx === i ? { ...x, [k]: v } : x))),
    remove: (i) => setList(list.filter((_, idx) => idx !== i)),
    move: (i, d) => { const j = i + d; if (j < 0 || j >= list.length) return; const n = [...list]; [n[i], n[j]] = [n[j], n[i]]; setList(n); }
  });
  const stepEd = editList(steps, setSteps);
  const msEd = editList(milestones, setMilestones);

  const uploadLegacy = async (file) => {
    const fd = new FormData(); fd.append('image', file);
    try { const { data } = await api.post('/api/landing/legacy-image', fd); hydrate(data); toast.success('Image updated'); } catch (err) { toast.error(errMsg(err)); }
  };

  if (!landing) return <div className="spinner" />;
  const t = (k) => ({ value: text[k] || '', onChange: (e) => setText({ ...text, [k]: e.target.value }) });

  return (
    <div>
      <div className="admin-header"><h1>Landing &amp; Videos</h1></div>

      {/* ---------- Ad film ---------- */}
      <div className="admin-section">
        <div className="admin-section-title">🎬 Full-screen ad film</div>
        <p className="muted" style={{ marginTop: -6 }}>Plays full screen on the landing page (once per visit if autoplay is on). Visitors can also open it from the &ldquo;Watch the film&rdquo; button. MP4 (H.264) works best, up to 250 MB.</p>
        <div className="ad-grid">
          <div className="ad-preview">
            {landing.adVideo?.url ? (
              <>
                <video src={mediaUrl(landing.adVideo.url)} poster={landing.adVideo.poster ? mediaUrl(landing.adVideo.poster) : undefined} muted playsInline controls preload="metadata" />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button className="btn btn-sm btn-yellow" onClick={() => setPreview({ src: landing.adVideo.url, poster: landing.adVideo.poster, title: ad.title, subtitle: ad.subtitle, ad: true })}><FiPlay /> Preview full screen</button>
                  <button className="btn btn-sm btn-ghost" onClick={removeAd}><FiTrash2 /> Remove</button>
                </div>
              </>
            ) : <div className="ad-empty">No ad film yet</div>}
          </div>
          <div>
            <div className="form-group"><label className="form-label">{landing.adVideo?.url ? 'Replace video' : 'Video file'}</label><input type="file" accept="video/*" className="form-control" onChange={(e) => setAdFiles({ ...adFiles, video: e.target.files[0] })} /></div>
            <div className="form-group"><label className="form-label">Poster image (optional)</label><input type="file" accept="image/*" className="form-control" onChange={(e) => setAdFiles({ ...adFiles, poster: e.target.files[0] })} /></div>
            <UploadBar pct={adPct} />
            <button className="btn btn-pink btn-sm" onClick={uploadAd} disabled={adPct > 0}><FiUpload /> Upload</button>
            <div className="divider" />
            <div className="form-group"><label className="form-label">Title</label><input className="form-control" value={ad.title || ''} onChange={(e) => setAd({ ...ad, title: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Subtitle</label><input className="form-control" value={ad.subtitle || ''} onChange={(e) => setAd({ ...ad, subtitle: e.target.value })} /></div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 14 }}>
              <label className="check"><input type="checkbox" checked={ad.enabled} onChange={(e) => setAd({ ...ad, enabled: e.target.checked })} /> Enabled</label>
              <label className="check"><input type="checkbox" checked={ad.autoplayOnLanding} onChange={(e) => setAd({ ...ad, autoplayOnLanding: e.target.checked })} /> Auto-play full screen on landing</label>
            </div>
            <button className="btn btn-sm" onClick={() => save({ adVideo: ad }, 'Ad settings saved')}>Save ad settings</button>
          </div>
        </div>
      </div>

      {/* ---------- Hero carousel ---------- */}
      <div className="admin-section">
        <div className="admin-section-title">🎠 Hero carousel <button className="btn btn-yellow btn-sm" onClick={() => setSlideForm({ ...emptySlide })}><FiPlus /> Add slide</button></div>
        <p className="muted" style={{ marginTop: -6 }}>The animated brand hero is always the first slide. Add image or video slides after it. Video slides autoplay muted, and visitors can open them full screen with sound.</p>
        <div className="form-group"><label className="form-label">Brand hero headline</label><input className="form-control" {...t('heroTitle')} /></div>
        <div className="form-group"><label className="form-label">Brand hero subtitle</label><input className="form-control" {...t('heroSubtitle')} /></div>
        <button className="btn btn-sm" onClick={() => save({ heroTitle: text.heroTitle, heroSubtitle: text.heroSubtitle })}>Save hero text</button>
        <div className="slide-list">
          {landing.carouselSlides.map((s, i) => (
            <div key={s._id} className="slide-item">
              <div className="slide-thumb">
                {s.mediaType === 'video' ? <video src={mediaUrl(s.url)} poster={s.poster ? mediaUrl(s.poster) : undefined} muted playsInline preload="metadata" /> : <img src={mediaUrl(s.url)} alt="" />}
                <span className={`badge ${s.mediaType === 'video' ? 'badge-pink' : 'badge-teal'}`}>{s.mediaType}</span>
              </div>
              <div className="slide-meta"><strong>{s.caption || '(no caption)'}</strong><span className="muted">{s.subcaption}</span></div>
              <div className="slide-actions">
                <button className="icon-btn" onClick={() => moveSlide(i, -1)} aria-label="Move up"><FiArrowUp /></button>
                <button className="icon-btn" onClick={() => moveSlide(i, 1)} aria-label="Move down"><FiArrowDown /></button>
                {s.mediaType === 'video' && <button className="icon-btn" onClick={() => setPreview({ src: s.url, poster: s.poster, title: s.caption, subtitle: s.subcaption })} aria-label="Preview"><FiPlay /></button>}
                <button className="icon-btn" onClick={() => setSlideForm({ ...emptySlide, ...s, media: null, poster: null })} aria-label="Edit"><FiEdit2 /></button>
                <button className="icon-btn" onClick={() => deleteSlide(s._id)} aria-label="Delete"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Process timeline ---------- */}
      <div className="admin-section">
        <div className="admin-section-title">🔥 &ldquo;How it&rsquo;s made&rdquo; timeline <button className="btn btn-yellow btn-sm" onClick={() => setSteps([...steps, { time: '', title: '', text: '', icon: 'banana' }])}><FiPlus /> Add step</button></div>
        <div className="input-row input-row-2">
          <div className="form-group"><label className="form-label">Section title</label><input className="form-control" {...t('processTitle')} /></div>
          <div className="form-group"><label className="form-label">Subtitle</label><input className="form-control" {...t('processSubtitle')} /></div>
        </div>
        {steps.map((s, i) => (
          <div key={s._id || `n${i}`} className="list-editor-row">
            <span className="list-num">{i + 1}</span>
            <select className="form-control" value={s.icon} onChange={(e) => stepEd.update(i, 'icon', e.target.value)} style={{ width: 80 }}>
              {Object.entries(STEP_ICONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input className="form-control" placeholder="6:00 AM" value={s.time || ''} onChange={(e) => stepEd.update(i, 'time', e.target.value)} style={{ width: 110 }} />
            <div className="list-grow">
              <input className="form-control" placeholder="Title" value={s.title} onChange={(e) => stepEd.update(i, 'title', e.target.value)} />
              <textarea className="form-control" placeholder="Description" value={s.text || ''} onChange={(e) => stepEd.update(i, 'text', e.target.value)} rows={2} style={{ minHeight: 0 }} />
            </div>
            <div className="list-actions">
              <button className="icon-btn" onClick={() => stepEd.move(i, -1)} aria-label="Up"><FiArrowUp /></button>
              <button className="icon-btn" onClick={() => stepEd.move(i, 1)} aria-label="Down"><FiArrowDown /></button>
              <button className="icon-btn" onClick={() => stepEd.remove(i)} aria-label="Remove"><FiTrash2 /></button>
            </div>
          </div>
        ))}
        <button className="btn btn-pink btn-sm" onClick={() => save({ processTitle: text.processTitle, processSubtitle: text.processSubtitle, processSteps: steps.filter((s) => s.title) }, 'Timeline saved')}>Save timeline</button>
      </div>

      {/* ---------- Legacy ---------- */}
      <div className="admin-section">
        <div className="admin-section-title">🕰️ Legacy · 30 years <button className="btn btn-yellow btn-sm" onClick={() => setMilestones([...milestones, { year: '', title: '', text: '' }])}><FiPlus /> Add milestone</button></div>
        <div className="form-group"><label className="form-label">Title</label><input className="form-control" {...t('legacyTitle')} /></div>
        <div className="form-group"><label className="form-label">Story</label><textarea className="form-control" rows={4} {...t('legacyText')} /></div>
        <div className="form-group" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {landing.legacyImage && <img src={mediaUrl(landing.legacyImage)} alt="" style={{ width: 90, height: 68, objectFit: 'cover', borderRadius: 10 }} />}
          <div><label className="form-label">&ldquo;Now&rdquo; photo</label><input type="file" accept="image/*" className="form-control" onChange={(e) => e.target.files[0] && uploadLegacy(e.target.files[0])} /></div>
        </div>
        {milestones.map((m, i) => (
          <div key={m._id || `m${i}`} className="list-editor-row">
            <input className="form-control" placeholder="Year" value={m.year} onChange={(e) => msEd.update(i, 'year', e.target.value)} style={{ width: 90 }} />
            <div className="list-grow">
              <input className="form-control" placeholder="Title" value={m.title} onChange={(e) => msEd.update(i, 'title', e.target.value)} />
              <input className="form-control" placeholder="Short description" value={m.text || ''} onChange={(e) => msEd.update(i, 'text', e.target.value)} />
            </div>
            <div className="list-actions">
              <button className="icon-btn" onClick={() => msEd.move(i, -1)} aria-label="Up"><FiArrowUp /></button>
              <button className="icon-btn" onClick={() => msEd.move(i, 1)} aria-label="Down"><FiArrowDown /></button>
              <button className="icon-btn" onClick={() => msEd.remove(i)} aria-label="Remove"><FiTrash2 /></button>
            </div>
          </div>
        ))}
        <button className="btn btn-pink btn-sm" onClick={() => save({ legacyTitle: text.legacyTitle, legacyText: text.legacyText, legacyMilestones: milestones.filter((m) => m.year && m.title) }, 'Legacy saved')}>Save legacy</button>
      </div>

      {slideForm && (
        <div className="modal-backdrop" onClick={() => slidePct === 0 && setSlideForm(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submitSlide}>
            <h2>{slideForm._id ? 'Edit slide' : 'New slide'}</h2>
            <div className="form-group"><label className="form-label">{slideForm._id ? 'Replace media (optional)' : 'Image or video'}</label><input type="file" accept="image/*,video/*" className="form-control" onChange={(e) => setSlideForm({ ...slideForm, media: e.target.files[0] })} /></div>
            {(slideForm.media?.type?.startsWith('video') || slideForm.mediaType === 'video') && (
              <div className="form-group"><label className="form-label">Poster image for video (optional)</label><input type="file" accept="image/*" className="form-control" onChange={(e) => setSlideForm({ ...slideForm, poster: e.target.files[0] })} /></div>
            )}
            <div className="form-group"><label className="form-label">Caption</label><input className="form-control" value={slideForm.caption} onChange={(e) => setSlideForm({ ...slideForm, caption: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Sub-caption</label><input className="form-control" value={slideForm.subcaption} onChange={(e) => setSlideForm({ ...slideForm, subcaption: e.target.value })} /></div>
            <div className="input-row input-row-3">
              <div className="form-group"><label className="form-label">Button text</label><input className="form-control" value={slideForm.ctaText} onChange={(e) => setSlideForm({ ...slideForm, ctaText: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Button link</label><input className="form-control" value={slideForm.ctaLink} onChange={(e) => setSlideForm({ ...slideForm, ctaLink: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Overlay tint</label>
                <select className="form-control" value={slideForm.theme} onChange={(e) => setSlideForm({ ...slideForm, theme: e.target.value })}>{THEMES.map((x) => <option key={x}>{x}</option>)}</select>
              </div>
            </div>
            <UploadBar pct={slidePct} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSlideForm(null)} disabled={slidePct > 0}>Cancel</button>
              <button className="btn btn-pink btn-sm" disabled={slidePct > 0}>{slidePct > 0 ? 'Uploading…' : 'Save slide'}</button>
            </div>
          </form>
        </div>
      )}

      {preview && <FullscreenVideo {...preview} onClose={() => setPreview(null)} />}
    </div>
  );
};

export default AdminLanding;

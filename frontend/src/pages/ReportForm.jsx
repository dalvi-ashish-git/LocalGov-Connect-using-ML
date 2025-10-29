import './ReportForm.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabaseClient';
import LocationMap from "../components/LocationMap";
import categories from '../utils/selectCategories.js';


// Backend base URL — prefer Vite env variable VITE_BACKEND_URL, fallback to localhost:8000
const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function ReportForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(false);
  const [message, setMessage] = useState('Fill all the details');
  const [fileNames, setFileNames] = useState("No files selected");
  const [processingStep, setProcessingStep] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFiles(files);

    if (files.length === 0) {
      setFileNames("No files selected");
    }
    else if (files.length === 1) {
      const fullName = files[0].name;
      const dotIndex = fullName.lastIndexOf('.');
      const extension = dotIndex !== -1 ? fullName.slice(dotIndex) : '';
      const baseName = dotIndex !== -1 ? fullName.slice(0, dotIndex) : fullName;
      const displayName = baseName.length > 10 ? baseName.slice(0, 10) + "…" + extension : fullName;
      setFileNames(displayName);
    }
    else {
      setFileNames(`${files.length} files selected`);
    }
  };

  const triggerFileSelect = () => {
    document.getElementById('fileInput').click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Processing your report...');
    setProcessingStep('validating');

    try {
      if (!title || !description || !category || files.length === 0) {
        throw new Error('Please fill in all required fields.');
      }
      // First, send the first image + title/description to the backend for
      // processing (EXIF, matching, tamper, severity). The backend returns
      // metadata which we will include when saving to Supabase.
      setProcessingStep('processing');
      setMessage('Processing image on server...');

      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      // backend expects a single file field named 'image' (we send the first)
      fd.append('image', files[0]);

      const resp = await fetch(`${BACKEND_BASE}/api/process-report`, {
        method: 'POST',
        body: fd,
      });

      const respJson = await resp.json().catch(() => null);

      if (!resp.ok) {
        // Show backend-provided message if present
        const errMsg = respJson?.error || (respJson?.message) || `Server rejected report (status ${resp.status})`;
        throw new Error(errMsg || 'Server rejected report');
      }

      const backendData = respJson?.data;

      setLocation({
        lat: backendData.latitude ?? null,
        lng: backendData.longitude ?? null,
      });

      if (!backendData) {
        throw new Error('Processing failed: no data returned from server');
      }

      // Now upload all images to Supabase storage (we do this after server
      // processing so the server can validate/match the primary image).
      setProcessingStep('uploading');
      setMessage('Uploading images to storage...');
      const fileUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setMessage(`Uploading image ${i + 1} of ${files.length}...`);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('civic_issues_images')
          .upload(`public/${Date.now()}-${file.name}`, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('civic_issues_images')
          .getPublicUrl(uploadData.path);

        fileUrls.push(publicUrlData.publicUrl);
      }

      setProcessingStep('submitting');
      setMessage('Saving report to database...');

      const insertPayload = {
        title,
        description,
        category,
        status: 'pending',
        image_urls: fileUrls,
        latitude: backendData.latitude ?? 0.0,
        longitude: backendData.longitude ?? 0.0,
        address: backendData.address ?? '',
        // Add ML-derived fields from backend
        matching_score: backendData.matching_score ?? null,
        tamper_score: backendData.tamper_score ?? null,
        tampered: backendData.tampered ?? null,
        severity: backendData.severity ?? null,
        severity_score: backendData.severity_score ?? null,
        // explicit nulls for gov fields
        gov_official_id: null,
        resolved_by: null,
        last_status_changed_by: null,
        last_status_changed_at: null,
        resolution_images: null,
      };

      const { error: insertError } = await supabase
        .from('civic_issues')
        .insert([insertPayload]);

      if (insertError) throw insertError;

      setProcessingStep('success');
      setTitle('');
      setDescription('');
      setCategory('');
      setFiles([]);
      setFileNames("No files selected");
      setMessage('Issue reported successfully!');
    } catch (err) {
      console.error('Failed to report issue:', err);
      setProcessingStep('error');
      setMessage(err.message || 'Failed to report issue. Please try again.');
    }

    setLoading(false);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setFiles([]);
    setFileNames("No files selected");
    setMessage('');
    setLocation(false);
  };

  return (
    <div className="form-container">
      <md-text-button
        onClick={() => navigate('/citizen/report')}
        aria-label="Back to list"
      >
        <md-icon slot="icon">arrow_back</md-icon>
        Back
      </md-text-button>
      <h1>Report an Issue</h1>
      <form onSubmit={handleSubmit}>
        <md-outlined-text-field label="Issue Title" maxlength="100" supporting-text="*required" placeholder="eg: Water leakage near Main Street" value={title} onChange={(e) => setTitle(e.target.value)} required></md-outlined-text-field>
        <md-outlined-text-field rows="4" label="Issue Description" maxlength="1000" type="textarea" supporting-text="*required" placeholder="Provide a detailed description of the issue (eg: location, timing, extent of the issue)..." value={description} onChange={(e) => setDescription(e.target.value)} required></md-outlined-text-field>
        <md-outlined-select label="Issue Category" supporting-text="*required" value={category} onChange={(e) => setCategory(e.target.value)} required>
          {categories.map((cat) => (
            <md-select-option key={cat} value={cat}>
              <div slot="headline">{cat}</div>
            </md-select-option>
          ))}
        </md-outlined-select>
        <div className="file-upload">
          <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} multiple required />
          <md-filled-button type="button" onClick={triggerFileSelect}>
            <md-icon slot="icon">upload</md-icon>
            Upload Images
          </md-filled-button>
          <span id="fileNames">{fileNames}</span>
        </div>

        {/* 🗺️ Show map only when location coordinates are available */}
        {location && location.lat && location.lng && (
          <LocationMap lat={location.lat} lng={location.lng} label="Detected issue location" />
        )}

        {message && (
          <div className={`message-box ${
            processingStep === 'success' ? 'success' : 
            processingStep === 'error' ? 'error' : 
            'processing'
          }`}>
            {loading ? (
              <md-circular-progress indeterminate style={{ width: '20px', height: '20px' }}></md-circular-progress>
            ) : (
              <md-icon>
                {processingStep === 'success' ? 'check_circle' : 
                 processingStep === 'error' ? 'error' : 
                 'info'}
              </md-icon>
            )}
            {message}
          </div>
        )}
        <div className="row">
          <md-filled-button type="submit" disabled={loading}>{loading ? 'Reporting...' : 'Submit'}</md-filled-button>
          <md-outlined-button type="reset" onClick={handleReset}>Reset</md-outlined-button>
        </div>
      </form>
    </div>
  );
}

export default ReportForm;

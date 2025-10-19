import './ReportForm.css';
import { useState } from 'react';
import supabase from '../utils/supabaseClient';
import categories from '../utils/selectCategories.js';

function ReportForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Fill all the details');
  const [fileNames, setFileNames] = useState("No files selected");

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
    setMessage('');

    try {
      if (!title || !description || !category || files.length === 0) {
        throw new Error('Please fill in all required fields.');
      }

      const fileUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('civic_issues_images')
          .upload(`public/${Date.now()}-${file.name}`, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('civic_issues_images')
          .getPublicUrl(uploadData.path);

        fileUrls.push(publicUrlData.publicUrl);
      }

      const { error: insertError } = await supabase
        .from('civic_issues')
        .insert([
          {
            title,
            description,
            category,
            status: 'pending',
            image_urls: fileUrls,
          },
        ]);

      if (insertError) throw insertError;

      setTitle('');
      setDescription('');
      setCategory('');
      setFiles([]);
      setFileNames("No files selected");
      setMessage('Issue reported successfully!');
    } catch (err) {
      console.error('Failed to report issue:', err);
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
  };

  return (
    <div className="form-container">
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
        {message || <p className="message">{message}</p>}
        <div className="row">
          <md-filled-button type="submit" disabled={loading}>{loading ? 'Reporting...' : 'Submit'}</md-filled-button>
          <md-outlined-button type="reset" onClick={handleReset}>Reset</md-outlined-button>
        </div>
      </form>
    </div>
  );
}

export default ReportForm;

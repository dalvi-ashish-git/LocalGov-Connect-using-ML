import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import "./Report.css";

function Report() {
  // ---------------- State ----------------
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState("No files selected");
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ---------------- Fetch Issues ----------------
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("civic_issues")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching issues:", error);
      } else {
        setIssues(data || []);
      }
      setLoading(false);
    };

    fetchIssues();
  }, []);

  // ---------------- File Upload ----------------
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFiles(files);

    if (files.length === 0) {
      setFileNames("No files selected");
    } else if (files.length === 1) {
      const fullName = files[0].name;
      const dotIndex = fullName.lastIndexOf('.');
      const extension = dotIndex !== -1 ? fullName.slice(dotIndex) : '';
      const baseName = dotIndex !== -1 ? fullName.slice(0, dotIndex) : fullName;
      const displayName = baseName.length > 10 ? baseName.slice(0, 10) + "…" + extension : fullName;
      setFileNames(displayName);
    } else {
      setFileNames(`${files.length} files selected`);
    }
  };

  const triggerFileSelect = () => {
    document.getElementById('fileInput').click();
  };

  // ---------------- Submit Issue ----------------
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');

  try {
    if (!title || !description || !category || files.length === 0) {
      throw new Error('Please fill in all required fields.');
    }

    // Upload images and get public URLs
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

    // Get logged-in user to attach citizen_id
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('User not authenticated.');

    // Insert into civic_issues table
    const { error: insertError } = await supabase
      .from('civic_issues')
      .insert([
        {
          title,
          description,
          category,
          status: 'pending',
          image_urls: fileUrls,
          citizen_id: user.id,   // logged in citizen
          gov_official_id: null, // initially null (gov will update later)
        },
      ]);

    if (insertError) throw insertError;

    // Reset form
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

  // ---------------- UI ----------------
  return (
    <div className="report-page">
      {!showForm ? (
        <>
          {loading ? (
            <p>Loading your reports...</p>
          ) : issues.length === 0 ? (
            <div className="empty-state">
              <p>No issues submitted yet.</p>
              <p>You can use the + button to create your first report.</p>
            </div>
          ) : (
            <>
              <p className="report-heading">Here are the issues you’ve reported:</p>
              <md-list>
                {issues.map((issue) => (
                  <md-list-item key={issue.id} headline={issue.title}>
                    <div slot="supporting-text">{issue.description}</div>
                    <md-icon slot="end">chevron_right</md-icon>
                  </md-list-item>
                ))}
              </md-list>
            </>
          )}
        </>
      ) : (
        <div className="form-container">
          <h1>Report an Issue</h1>
          <form onSubmit={handleSubmit}>
            <md-outlined-text-field
              label="Issue Title"
              maxlength="100"
              supporting-text="*required"
              placeholder="eg: Water leakage near Main Street"
              value={title}
              onInput={(e) => setTitle(e.target.value)}
              required
            ></md-outlined-text-field>

            <md-outlined-text-field
              rows="4"
              label="Issue Description"
              maxlength="1000"
              type="textarea"
              supporting-text="*required"
              placeholder="Provide a detailed description..."
              value={description}
              onInput={(e) => setDescription(e.target.value)}
              required
            ></md-outlined-text-field>

            <md-outlined-select
              label="Issue Category"
              supporting-text="*required"
              value={category}
              onInput={(e) => setCategory(e.target.value)}
              required
            >
              <md-select-option value="Roads & Lights"><div slot="headline">Roads & Lights</div></md-select-option>
              <md-select-option value="Water Issues"><div slot="headline">Water Issues</div></md-select-option>
              <md-select-option value="Garbage"><div slot="headline">Garbage</div></md-select-option>
              <md-select-option value="Safety"><div slot="headline">Safety</div></md-select-option>
              <md-select-option value="Parks"><div slot="headline">Parks</div></md-select-option>
              <md-select-option value="Transport"><div slot="headline">Transport</div></md-select-option>
              <md-select-option value="Other"><div slot="headline">Other</div></md-select-option>
            </md-outlined-select>

            <div className="file-upload">
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                multiple
                required
              />
              <md-filled-button type="button" onClick={triggerFileSelect}>
                <md-icon slot="icon">upload</md-icon>
                Upload Images
              </md-filled-button>
              <span id="fileNames">{fileNames}</span>
            </div>

            <div className="row">
              <md-filled-button type="submit" disabled={formLoading}>
                {formLoading ? 'Reporting...' : 'Submit'}
              </md-filled-button>
              <md-outlined-button type="reset" onClick={handleReset}>
                Reset
              </md-outlined-button>
            </div>
            {message && <p className="message">{message}</p>}
          </form>
        </div>
      )}

      {/* FAB */}
      <md-fab
        className="fab"
        variant="primary"
        aria-label={showForm ? "Back to Reports" : "Report Issue"}
        onClick={() => setShowForm((prev) => !prev)}
      >
        <md-icon slot="icon">{showForm ? "arrow_back" : "add"}</md-icon>
      </md-fab>
    </div>
  );
}

export default Report;

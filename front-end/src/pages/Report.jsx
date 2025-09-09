import './Report.css';
import { useState } from 'react';

function Report() {
  const [fileNames, setFileNames] = useState("No files selected");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

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

  return (
    <div className="form-container">
      <h1>Report an Issue</h1>
      <form>
        <md-outlined-text-field label="Issue Title" maxlength="100" supporting-text="*required" placeholder="eg: Water leakage near Main Street" required></md-outlined-text-field>
        <md-outlined-text-field rows="4" label="Issue Description" maxlength="1000" type="textarea" supporting-text="*required" placeholder="Provide a detailed description of the issue (eg: location, timing, extent of the issue)..." required></md-outlined-text-field>
        <md-outlined-select label="Issue Category" supporting-text="*required" required>
          <md-select-option value="Roads & Lights">
            <div slot="headline">Roads & Lights</div>
          </md-select-option>
          <md-select-option value="Water Issues">
            <div slot="headline">Water Issues</div>
          </md-select-option>
          <md-select-option value="Garbage">
            <div slot="headline">Garbage</div>
          </md-select-option>
          <md-select-option value="Safety">
            <div slot="headline">Safety</div>
          </md-select-option>
          <md-select-option value="Parks">
            <div slot="headline">Parks</div>
          </md-select-option>
          <md-select-option value="Transport">
            <div slot="headline">Transport</div>
          </md-select-option>
          <md-select-option value="Other">
            <div slot="headline">Other</div>
          </md-select-option>
        </md-outlined-select>
        <div className="file-upload">
          <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} multiple required />
          <md-filled-button type="button" onClick={triggerFileSelect}>
            <md-icon slot="icon">upload</md-icon>
            Upload Images
          </md-filled-button>
          <span id="fileNames">{fileNames}</span>
        </div>
        <div className="row">
          <md-filled-button type="submit">Submit</md-filled-button>
          <md-outlined-button type="reset" onClick={() => setFileNames("No files selected")}>Reset</md-outlined-button>
        </div>
      </form>
    </div>
  );
}

export default Report;

const form = document.querySelector("form"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");

// form click event
form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = ({ target }) => {
  let file = target.files[0]; // get the first file selected
  if (file) {
    let fileName = file.name; // retrieve file name
    if (fileName.length >= 12) { // if file name is long, truncate it
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(fileName); // call uploadFile with file name
  }
}

// file upload function
function uploadFile(name) {
  let xhr = new XMLHttpRequest(); // create new XMLHttpRequest (AJAX)
  xhr.open("POST", "php/upload.php"); // POST request to upload file
  xhr.upload.addEventListener("progress", ({ loaded, total }) => {
    let fileLoaded = Math.floor((loaded / total) * 100); // calculate progress
    let fileTotal = Math.floor(total / 1000); // file size in KB
    let fileSize = (fileTotal < 1024) ? fileTotal + " KB" : (loaded / (1024 * 1024)).toFixed(2) + " MB";
    
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;

    if (loaded === total) { // once upload is complete
      progressArea.innerHTML = "";
      let uploadedHTML = `<li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                            <a href="php/download.php?file=${name}" class="download-link" target="_blank">Download</a>
                            <i class="fas fa-check"></i>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML); // add to uploaded list
    }
  });

  let data = new FormData(form); // form data to send
  xhr.send(data); // send form data
}

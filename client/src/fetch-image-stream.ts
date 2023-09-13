const img = document.getElementById("img")! as HTMLImageElement;
const progress = document.getElementById("progress")! as HTMLHeadingElement;

window.addEventListener("load", fetchImage);

async function fetchImage() {
  try {
    const res = await fetch("http://localhost:5000/image");

    const reader = res.body?.getReader();
    const contentLength = res.headers.get("content-length");
    const xFileSize = res.headers.get("x-file-size");
    const totalLength = Number.parseInt(contentLength || xFileSize);

    let content = new Uint8Array(0);
    let currentLength = 0;

    (async function process() {
      const { value, done } = await reader.read();

      if (done) {
        updateImage(content);
        return;
      }

      const newContent = new Uint8Array(content.length + value.length);
      newContent.set(content);
      newContent.set(value, content.length);
      content = newContent;
      currentLength += value.length;

      updateProgress(totalLength, currentLength);

      process();
    })();
  } catch (err) {
    console.log("Error", err);
  }
}

function updateImage(content: Uint8Array) {
  const blob = new Blob([content], { type: "image/jpg" });
  const url = URL.createObjectURL(blob);
  img.style.display = "block";
  progress.style.display = "none";
  img.src = url;
}

function updateProgress(totalLength: number, currentLength: number) {
  progress.textContent = Math.round((currentLength / totalLength) * 100) + "%";
}

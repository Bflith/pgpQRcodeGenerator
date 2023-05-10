// Load a QR code generation library, such as QRCode.js or 'qrcode-generator', before this script.

function findPGP() {
  const pgpKeyPattern = /-----BEGIN PGP (PUBLIC KEY BLOCK|PRIVATE KEY BLOCK|MESSAGE)-----[\s\S]+?-----END PGP (PUBLIC KEY BLOCK|PRIVATE KEY BLOCK|MESSAGE)-----/g;
  const pgpMatches = document.body.innerText.match(pgpKeyPattern);

  if (pgpMatches) {
    pgpMatches.forEach((pgpText) => {
      const pgpElement = document.createElement('pre');
      pgpElement.textContent = pgpText;
      pgpElement.style.border = '2px solid red';
      pgpElement.style.cursor = 'pointer';

      pgpElement.addEventListener('click', () => {
        generateAndDisplayQRCode(pgpText, pgpElement);
      });

      document.body.appendChild(pgpElement);
    });
  }
}

function generateQRCode(pgpText) {
  // Compress the PGP block using the DEFLATE algorithm
  const compressedData = pako.deflate(pgpText, { to: 'string' });

  const qr = qrcode(0, 'L');
  qr.addData(compressedData);
  qr.make();

  // This returns an img DOM element with the QR code as a data URL.
  const imgElement = qr.createImgTag();
  return imgElement;
}

function generateAndDisplayQRCode(pgpText, element) {
  const imgElement = generateQRCode(pgpText);

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';

  overlay.appendChild(imgElement);
  document.body.appendChild(overlay);

  // Close the overlay when clicked.
  overlay.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
}

// Execute the findPGP function after the page has fully loaded.
window.addEventListener('load', findPGP);

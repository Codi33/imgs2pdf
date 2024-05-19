let images = [];

document.addEventListener("DOMContentLoaded", () => {
    resetUploads();
})

function resetUploads() {
    $("#uploadInput").val("");
    $(".uploadedImage").remove();
    images = [];
}

function clearUploads() {
    $(".uploadedImage").remove();
    images = [];
}

function onNewUpload(e) {
    clearUploads();
    const files = e.files;
    for (i = 0; i < files.length; i++) {
        let img = new Image();
        let objUrl = window.URL.createObjectURL(files[i]);
        img.src = objUrl;
        img.className = "uploadedImage";
        images.push(img);
        $('body').append(img);
    }
}

function convertToPDF() {
    if (!images.length) {
        alert("Upload some images first");
        return;
    }

    const compression = $("#compression").find(":selected").text();

    const firstImage = images[0];
    let orientation = firstImage.width > firstImage.height ? "l" : "p";

    const doc = new jspdf.jsPDF({
        orientation: orientation,
        unit: "px",
        format: [firstImage.width, firstImage.height]
    })
    doc.addImage(firstImage, 'JPG', 0, 0, firstImage.width, firstImage.height, null, compression);

    images.slice(1).forEach(img => { // skip first image
        const orientation = img.width > img.height ? "l" : "p";
        doc.addPage([img.width, img.height], orientation);
        doc.addImage(img, 'JPG', 0, 0, img.width, img.height, null, compression);
    })

    const filename = Date.now().toString() + '.pdf';
    doc.save(filename);
}
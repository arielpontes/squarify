var images = [];
function processImages() {
  var files = $("#image-upload").prop("files");
  $.each(files, function (index, file) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var image = new Image();
      image.onload = function () {
        var canvas = $("<canvas>")[0];
        var maxWidth = 1080;
        var maxHeight = 1080;
        var width = image.width;
        var height = image.height;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        var context = canvas.getContext("2d");
        context.fillStyle = "black";
        context.fillRect(0, 0, maxWidth, maxHeight);
        var x = (maxWidth - width) / 2;
        var y = (maxHeight - height) / 2;
        context.drawImage(image, x, y, width, height);
        var dataURL = canvas.toDataURL(file.type);
        var imageData = {
          name: file.name,
          dataURL: dataURL,
        };
        images.push(imageData);
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
  $("#download-all").css("display", "inline-block");
  $("#download-all").on("click", function (event) {
    event.preventDefault();
    saveAllImages();
  });
}

function saveAllImages() {
  var zip = new JSZip();
  $.each(images, function (index, imageData) {
    var dataURL = imageData.dataURL;
    var name = imageData.name;
    var data = dataURL.split(",")[1];
    zip.file(name, data, { base64: true });
  });
  zip.generateAsync({ type: "blob" }).then(function (content) {
    var url = window.URL.createObjectURL(content);
    var link = document.createElement("a");
    link.download = "images.zip";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  });
}

$(document).ready(function () {
  $("#process-images").click(function () {
    processImages();
  });
});

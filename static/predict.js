const URL = "./model/";
let imageLoaded = false;
let model, webcam, labelContainer, maxPredictions;
$("#image-selector").change(function () {
	imageLoaded = false;
	let reader = new FileReader();
	reader.onload = function () {
		let dataURL = reader.result;
		$("#selected-image").attr("src", dataURL);
		$("#prediction-list").empty();
		imageLoaded = true;
	}
	
	let file = $("#image-selector").prop('files')[0];
	reader.readAsDataURL(file);
});


let modelLoaded = false;
$( document ).ready(async function () {
	modelLoaded = false;
	$('.progress-bar').show();
    console.log( "Loading model..." );
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
	model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    console.log( "Model loaded." );
	$('.progress-bar').hide();
	modelLoaded = true;
});

$("#predict-button").click(async function () {
	if (!modelLoaded) { alert("El modelo debe cargarse primero"); return; }
	if (!imageLoaded) { alert("Primero seleccione una imagen"); return; }
	
	let image = $('#selected-image').get(0);
	
	// Pre-process the image
	console.log( "Cargando image..." );
	
	let predictions = await model.predict(image);
	console.log(predictions);
	let top5 = Array.from(predictions)
		.sort(function (a, b) {
			return b.probability - a.probability;
		}).slice(0, -2);

	$("#prediction-list").empty();
	top5.forEach(function (p) {
		$("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
		});
});

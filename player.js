function info(text) {
	document.getElementById("iconInfo").className = "glyphicon glyphicon-bell";
	document.getElementById("txtInfo").innerHTML = text;
	setTimeout(clear_info, 5000);
}
function clear_info() {
	document.getElementById("iconInfo").className = "";
	document.getElementById("txtInfo").innerHTML = "";
}

$(document).ready(function () {
	$("#btnLoad").click(function () {
		var url = $("#txtURL").val();
		if (url != "") {
			var ext = url.split('.').pop();
			switch (ext) {
				case "m3u8":
					if (Hls.isSupported()) {
						var video = document.getElementById('video');
						var hls = new Hls();
						hls.attachMedia(video);
						hls.on(Hls.Events.MEDIA_ATTACHED, function () {
							hls.loadSource(url);
							hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
								video.play();
							});
						})
							hls.on(Hls.Events.ERROR, function (event, data) {
								if (data.fatal) {
									switch (data.type) {
										case Hls.ErrorTypes.NETWORK_ERROR:
											// try to recover network error
											info("fatal network error encountered, try to recover");
											hls.startLoad();
											break;
										case Hls.ErrorTypes.MEDIA_ERROR:
											info("fatal media error encountered, try to recover");
											hls.recoverMediaError();
											break;
										default:
											hls.destroy();
											break;
									}
								}
								switch (data.details) {
									case Hls.ErrorDetails.FRAG_LOAD_ERROR:
										info("HLS download error");
										break;
									case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
										info("HLS download error");
										break;
									case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
										info("HLS download error");
										break;
									default:
										break;
								}
							});
						}else {
							info("HLS not support");
						}
					break;
				case "mpd":
						if (typeof (window.MediaSource || window.WebKitMediaSource) === "function") {
							var player = dashjs.MediaPlayer().create();
							player.initialize(document.querySelector("#video"), url, true);
							player.on('error', function(e) {
								if (e.error === 'download') {
									info("MPEG-DASH download error");
								}
							});
						} else {
							info("MPEG-DASH not support");
							}
						break;
				default:
					info("url format error!!!");
					break;
			}
		} else {

			info("enter the link, please");
		}
	});
});


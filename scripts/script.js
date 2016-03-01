
var albumGenres = [];      
var currYear = 2016;
var albumInfo = [];
var albumIDs = [];
var albumData = [];
var artistGenres = [];
var albumColorArray = [];
var albumArray = [];
var albumCounter = 0;
var $grid;

const TOTAL_ALBUMS = 50;

audiojs.events.ready(function() {
	audiojs.createAll();
});



function getAlbumsByYear(year){

	albumCounter = 0;

	$.ajax({
		url: 'https://api.spotify.com/v1/search?q=year:' + year + '&type=album&limit=' + TOTAL_ALBUMS + '&market=us'
	})
	.success(function(data){
		getAlbumInfo(data.albums.items);
	})
	.fail(function(){
		console.log('whoops');
	});

}

function getMoreAlbumsByYear(year){
	$.ajax({
		url: 'https://api.spotify.com/v1/search?q=year:' + year + '&type=album&limit=' + TOTAL_ALBUMS + '&market=us&offset=50'
	})
	.success(function(data){
		getAlbumInfo(data.albums.items);
	})
	.fail(function(){
		console.log('whoops');
	});
}
//pulls 50 albums released every year and gives array to addAlbumCovers

function addAlbumCovers (albums) {
	// var numAlbums = albums.length;
	var albumArtist;

	for (i = 0; i < TOTAL_ALBLUMS; i++){
		// if (albums[i].album_type === 'single') { continue; }
		var albumID = albums[i].id;
		albumIDs.push(albumID);
	}
}
// pulls albumID from array of 50 albums. passes ID to getAlbumInfo
// 		// var album = {};
// 		// album.albumArtist = data.artists[0].name,
// 		// album.artistId = data.artists[0].id,
// 		// album.albumName = data.name,
// 		// album.albumCover = data.images[1].url,
// 		// album.colorSample = data.images[2].url,
// 		// album.albumSample = data.tracks.items[0].preview_url;
function getAlbumInfo( albumsArray ){

	console.log("getAlbumInfo called");

	for (var i = 0; i < albumsArray.length; i++) {

		$.ajax({
			url: 'https://api.spotify.com/v1/albums/' + albumsArray[i].id
		})
		.success(function(data){

			var albumObj = {};

			albumObj.data = data;

			albumObj.albumName = data.name;
			albumObj.albumArtist = data.artists[0].name;
			albumObj.albumCover = data.images[1].url;
			albumObj.colorSample = data.images[2].url;

			var artistId = data.artists[0].id;

			albumObj.ID = artistId;

			$.ajax({
				url: 'http://developer.echonest.com/api/v4/artist/profile?id=spotify:artist:' + artistId,
				data: {
					api_key: 'EIFFMMDVJUME3MPUL',
					bucket: 'genre'
				},
			})
			.success(function(artistData){

				console.log("adding genres");

				artistGenres.push(artistData.response.artist.genres);
				albumObj.genres = artistData.response.artist.genres;

				RGBaster.colors(data.images[2].url,{
					paletteSize: 3,
					success: function(payload){

						albumObj.color = tinycolor(payload.dominant);

						console.log("albumObj.albumName: " + albumObj.albumName);

						albumArray.push(albumObj);

						albumCounter++;

						if (albumCounter >= TOTAL_ALBUMS*2) {
							console.log("WE ARE DONE!!!");
							addAlbumCovers();
						}
					}
				});


			})
			.fail(function(){
				console.log('whoops');
			});


		})
		.fail(function(){
			console.log('oops');
		});
	}

}

function getArtistGenres(){
	for (i = 0; i < albumData.length; i++) {

	}
}

function getColor(coverSample){

	console.log("getColor called");

	RGBaster.colors(coverSample,{
		paletteSize: 3,
		success: function(payload){
			var albumColor = tinycolor(payload.dominant);
			//var hsl = albumColor.toHsl();

			return albumColor;
		}
	})
}

function addAlbumCovers(){
	console.log("addAlbumCovers called");

	var max = albumArray.length;

	for (var i = 0; i < max; i++){

		var album = albumArray[i];

	  	var hsl = albumArray[i].color.toHsl();
	  	var hex = String(albumArray[i].color.toHexString()).substring(1, 7);
	  	var dec = parseInt(hex, 16);
	  	// var colorName = albumArray[i].color.toName();

	  	if (hsl.l < 0.5) {var c = '#ffffff'; var d = "play_b white"; var e = "play_b_white";}
	  	else {var c ='#272727'; var d = "play_b dark"; var e = "play_b_dark";}

  		var html = '<div class="card_container" data-color="' + dec + '"';
  		html +=  'data-artist="' + album.albumArtist+ '"';
  		html += 'data-album="' + album.albumName + '">';
  		html += '<div class="card">';
	    html += '<figure class="side"><img src="' + album.albumCover + '" alt="cover"></figure>';
	    html += '<figcaption class="side back" style="background-color:' + albumArray[i].color + '">';
	    html += '<h3 class="artist" style="color:' + c + '">' + album.albumArtist + '</h3>';
	    html += '<h4 class="album" style="color:' + c + '">' + album.albumName + '</h4>';
	    html += '<a href="' + album.albumSample + '""><img class="' + d + '" src="img/' + e + '.svg" alt="playb"></a>'
	    html += '</figcaption></div></div>';

		$('.covers').append(html);

	}	

	$grid = $('.covers').isotope({
		itemSelector: '.card_container',
		layoutMode: 'fitRows',
		getSortData: {
			color: '[data-color] parseInt',
			artist: '[data-artist]',
			album: '[data-album]'
		}
	});
	$grid.isotope({ sortBy: "color" });

	$('.button').on( 'click', function(e) {
		e.preventDefault();
		console.log("Sort Fool");
	  	var sortByValue = $(this).attr('data-sort-by');

	  	console.log("sortByValue: " + sortByValue);
		 $grid.isotope({ sortBy: sortByValue });
	});
}

function sortGenres(){
	albumGenres.sort();
	for (i = 1; i < albumGenres.length; i++) {
		var genre = albumGenres[i];
		var numGenre = albumGenres.lastIndexOf(genre) - albumGenres.indexOf(genre) + 1;
		console.log(genre + ' = ' + numGenre);

		var genreHtml = '<article>';
		genreHtml += '<h2>' + genre.toUpperCase() + '</h2>';
		genreHtml += '<div class="genre_underline"></div>';
		genreHtml += '<p>' + numGenre + ' Albums</p>';
		if (albumGenres[i] != albumGenres[i-1]) {
			$('.genres').append(genreHtml);
		}	
	}
}

$(".right_arrow").click(function(){
	var goalX = $(".years").scrollLeft() + 205;
	//console.log("goalX: " + goalX);
    $(".years").animate({scrollLeft: goalX}, 800);
});

$(".left_arrow").click(function(){
	var goalX = $(".years").scrollLeft() - 205;
	//console.log("goalX: " + goalX);
   $(".years").animate({scrollLeft: goalX}, 800);
});


//add.remove active class

$(".years li").click(function(){
    $(".years li.active").removeClass("active");
    $(this).addClass("active");
    var year = $('.active').text();
    
    $('.covers').html('');
    getAlbumsByYear(year);
    getMoreAlbumsByYear(year);
});

//toggle genre active class

$(".genres article").click(function(){
    $(this).toggleClass("active_genre");
});

$(document).ready(function(){
	var a = document.querySelector('.years');
	$('.years').scrollLeft(a.scrollWidth);

	getAlbumsByYear(currYear);

	$('.years').scroll(function(e){
		$('.left_arrow, .right_arrow').css("visibility", "visible");
		if(e.target.scrollLeft == 0){
			$('.left_arrow').css("visibility", "hidden");
		}
		else if(e.target.scrollLeft == e.target.scrollWidth - $('.years').width()){
			$('.right_a rrow').css("visibility", "hidden");
		}
	});

});

//spinner
$(window).ready(function() {
    $(".spinner").fadeOut("slow");
});






















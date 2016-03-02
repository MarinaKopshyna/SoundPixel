var currYear = 2016;
var albumInfo = [];
var albumIDs = [];
var albumData = [];
var artistGenres = [];
var albumColorArray = [];
var albumArray = [];
var albumCounter = 0;
var noDupeArray = [];
var albumGenresArray = [];
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
		console.log(year);

		getAlbumInfo(data.albums.items);
		
		$.ajax({
			url: 'https://api.spotify.com/v1/search?q=year:' + year + '&type=album&limit=' + TOTAL_ALBUMS + '&market=us&offset=50'
		})
		.success(function(data){
			getAlbumInfo(data.albums.items);
		})
		.fail(function(){
			console.log('whoops');
		});

		// getAlbumInfo(data.albums.items);

	})
	.fail(function(){
		console.log('whoops');
	});

}

// function getMoreAlbumsByYear(year){
// 	$.ajax({
// 		url: 'https://api.spotify.com/v1/search?q=year:' + year + '&type=album&limit=' + TOTAL_ALBUMS + '&market=us&offset=50'
// 	})
// 	.success(function(data){
// 		getAlbumInfo(data.albums.items);
// 	})
// 	.fail(function(){
// 		console.log('whoops');
// 	});
// }
//pulls 50 albums released every year and gives array to addAlbumCovers

// function addAlbumCovers (albums) {
// 	// var numAlbums = albums.length;
// 	var albumArtist;

// 	for (i = 0; i < TOTAL_ALBUMS; i++){
// 		// if (albums[i].album_type === 'single') { continue; }
// 		var albumID = albums[i].id;
// 		albumIDs.push(albumID);
// 	}
// }
// pulls albumID from array of 50 albums. passes ID to getAlbumInfo

		// var album = {};
		// album.albumArtist = data.artists[0].name,
		// album.artistId = data.artists[0].id,
		// album.albumName = data.name,
		// album.albumCover = data.images[1].url,
		// album.colorSample = data.images[2].url,
		// album.albumSample = data.tracks.items[0].preview_url;

function getAlbumInfo( albumsArray ){

	// console.log("getAlbumInfo called");

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
			albumObj.albumSample = data.tracks.items[0].preview_url;

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

				// console.log("adding genres");

				artistGenres.push(artistData.response.artist.genres);
				albumObj.genres = artistData.response.artist.genres;

				RGBaster.colors(data.images[2].url,{
					paletteSize: 3,
					success: function(payload){

						albumObj.color = tinycolor(payload.dominant);

						// console.log("albumObj.albumName: " + albumObj.albumName);

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

// function getColor(coverSample){

// 	console.log("getColor called");

// 	RGBaster.colors(coverSample,{
// 		paletteSize: 3,
// 		success: function(payload){
// 			var albumColor = tinycolor(payload.dominant);
// 			//var hsl = albumColor.toHsl();

// 			return albumColor;
// 		}
// 	})
// }

function addAlbumCovers(){
	// console.log("addAlbumCovers called");

	albumArray.forEach(function(item){
		if (!albumArray[item.ID]) {
			noDupeArray.push(item);
			albumArray[item.ID] = item;
		}
	});

	var max = noDupeArray.length;


	for (var i = 0; i < max; i++){
		// console.log(noDupeArray[i].ID);
		
		// var sortAlbumArray = albumArray.sort(function(a,b) {
		// 	return a.ID - b.ID
		// });
		// console.log(sortAlbumArray[i].ID);
		// if (sortAlbumArray[i+1].ID !== sortAlbumArray[i].ID) {	
		// 	noDupeArray.push(sortAlbumArray[i]);
		// }

		var album = noDupeArray[i];

	  	var hsl = noDupeArray[i].color.toHsl();
	  	var hex = String(noDupeArray[i].color.toHexString()).substring(1, 7);
	  	var dec = parseInt(hex, 16);
	  	// var colorName = albumArray[i].color.toName();

	  	if (hsl.l < 0.5) {var c = '#ffffff'; var d = "play_b white"; var e = "play_b_white";}
	  	else {var c ='#272727'; var d = "play_b dark"; var e = "play_b_dark";}

	  	var albumGenres = noDupeArray[i].genres;
		// console.log(albumGenres);
		var albumGenresStr = '';
		// var htmlAlbumGenresStr = '';
	  	albumGenres.forEach(function(genre, j, arr){
	  		genre.name = genre.name.replace(' ', '-');
	  		albumGenresArray.push(genre.name)
	  		albumGenresStr += genre.name + ' ';
	  	});
	  	

  		var html = '<div class="card_container" data-color="' + dec + '"';
  		html += 'data-genres="' + albumGenresStr + '"';
  		html += 'data-artist="' + album.albumArtist + '"';
  		html += 'data-album="' + album.albumName + '">';
  		html += '<div class="card">';
	    html += '<figure class="side"><img src="' + album.albumCover + '" alt="cover"></figure>';
	    html += '<figcaption class="side back" style="background-color:' + noDupeArray[i].color + '">';
	    html += '<h3 class="artist" style="color:' + c + '">' + album.albumArtist + '</h3>';
	    html += '<h4 class="album" style="color:' + c + '">' + album.albumName + '</h4>';
	    html += '<a href="' + album.albumSample + '""><img class="' + d + '" src="img/' + e + '.svg" alt="playb"></a>'
	    html += '</figcaption></div></div>';

		// var numGenres = noDupeArray[i].genres.length;
		// for (var j = 0; j < numGenres; j++){
		// 	var genre = numGenres.genres[j].name
		// 	return ;
		// }
	
		$('.covers').append(html);

		// $('.card_container').attr('data-genres', noDupeArray[i].genres);

	if($grid){$grid.isotope('destroy');}	
	$grid = $('.covers').isotope({
		itemSelector: '.card_container',
		layoutMode: 'fitRows',
		getSortData: {
			color: '[data-color] parseInt',
			artist: '[data-artist]',
			album: '[data-album]'
		}
		// filter: 'data-genres'
	});
	$grid.isotope({ sortBy: "color" });

	// $grid.isotope({
	// 	filter: function(){
	// 		var genre = $(this).find('.card_container').
	// 	}
	// })

	$('.button').on( 'click', function(e) {
		e.preventDefault();
		console.log("Sort Fool");
	  	var sortByValue = $(this).attr('data-sort-by');

	  	console.log("sortByValue: " + sortByValue);
		$grid.isotope({ sortBy: sortByValue });
	});
	}
}

$(".sortby a").click(function(){
    $(".sortby a.active").removeClass("active");
   $(this).addClass("active");
});

function sortGenres(){
	albumGenresArray.sort();
	for (i = 1; i < albumGenresArray.length; i++) {
		var genre = albumGenresArray[i];
		var numGenre = albumGenresArray.lastIndexOf(genre) - albumGenresArray.indexOf(genre) + 1;
		console.log(genre + ' = ' + numGenre);

		var genreHtml = '<li class="active">' + genre.toUpperCase() + '"';
		genreHtml += '<span class="number"> (' + numGenre + ')</span></li>';
		if (albumGenresArray[i] != albumGenresArray[i-1]) {
			$('.genres ul').append(genreHtml);
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
	if($(this).text() !== $('.years li.active').text()){
	    $(".years li.active").removeClass("active");
	    $(this).addClass("active");
	    var year = $('.years li.active').text();
	    
	    $('.covers').html('');

	    albumArray = [];
	    noDupeArray = [];
	    // $grid = [];
	    getAlbumsByYear(year);
	}
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
			$('.right_arrow').css("visibility", "hidden");
		}
	});

});

//spinner
$(window).ready(function() {
    $(".spinner").fadeOut("slow");
});

$(".fa-caret-down").click(function() {
	$(this).css("display", "none");
	$(".fa-caret-up").css("display", "inline");
	$(".genres ul").slideDown( "slow", function() {
    	$(".genres ul").css("display", "block");
 	});
});

$(".fa-caret-up").click(function() {
	$(this).css("display", "none");
	$(".fa-caret-down").css("display", "inline");
	$(".genres ul").slideUp( "slow", function() {
		$(".genres ul").css("display", "none");
	});
});


$(".sortby div a").click(function(){
    var i = $(this).data('index');
    $('.underl').css('left', (i * 33 + "%"));
});



















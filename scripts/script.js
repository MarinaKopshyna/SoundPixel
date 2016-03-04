var currYear = 2016;
var genreChosen = 'hip hop';
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
	.success(function(yearData){
		console.log(year);

		getAlbumInfo(yearData.albums.items);
		
		$.ajax({
			url: 'https://api.spotify.com/v1/search?q=year:' + year + '&type=album&limit=' + TOTAL_ALBUMS + '&market=us&offset=50'
		})
		.success(function(yearData){
			getAlbumInfo(yearData.albums.items);
		})
		.fail(function(){
			console.log('whoops');
		});

	})
	.fail(function(){
		console.log('whoops');
	});

}

function getAlbumsByGenre(genre) {
	albumCounter = 0

	$.ajax({
		url: 'https://api.spotify.com/v1/search?q=genre:"hip hop"&type=artist&limit=' + TOTAL_ALBUMS
	})
	.success(function(genreData){

		getArtistsAlbumFromGenre(genreData.artists.items)

		$.ajax({
			url: 'https://api.spotify.com/v1/search?q=genre:"hip hop"&type=artist&limit=' + TOTAL_ALBUMS + '&offset=50'
		})
		.success(function(genreData){
			getArtistsAlbumFromGenre(genreData.artists.items);
		})
		.fail(function(){
			console.log('whoops');
		});

	})
	.fail(function(){
		console.log('whoops');
	});

}

function getArtistsAlbumFromGenre( artistsArray ) {
	// console.log("getArtistsAlbumFromGenre called");

	var artistsLength = artistsArray.length;

	for (var i = 0; i < artistsLength; i++) {

		// var artistsNameId = [];
		// artistsNameId.push(artistsArray[i].id);
		// artistsNameId.push(artistsArray[i].name);

		$.ajax({
			url: 'https://api.spotify.com/v1/artists/' + artistsArray[i].id + '/albums?&limit=1&album_type=album',
			artist: artistsArray[i]
		})
		.success(function(genreAlbum){
			var albumObj = {};
			albumObj.ID = this.artist.id;
			albumObj.albumArtist = this.artist.name;
			albumObj.albumName = genreAlbum.items[0].name;
			albumObj.albumCover = genreAlbum.items[0].images[1].url;
			albumObj.colorSample = genreAlbum.items[0].images[1].url;
			albumObj.spotifyLink = genreAlbum.items[0].external_urls.spotify;

			RGBaster.colors(albumObj.colorSample,{
				paletteSize: 3,
				success: function(payload){
					// console.log(albumObj.colorSample);
					albumObj.color = tinycolor(payload.dominant);

					albumArray.push(albumObj);

					albumCounter++;

					if (albumCounter >= artistsLength) {
						console.log('we are done');
						addAlbumCovers();
					}
				}
			});

			console.log(albumObj);
		})
		.fail(function(data){
			console.log('oops');
		});
	}
}

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
			albumObj.spotifyLink = data.artists[0].external_urls.spotify;

			var artistId = data.artists[0].id;

			albumObj.ID = artistId;

			// $.ajax({
			// 	// url: 'http://developer.echonest.com/api/v4/artist/profile?id=spotify:artist:' + artistId,
			// 	// data: {
			// 	// 	api_key: 'EIFFMMDVJUME3MPUL',
			// 	// 	bucket: 'genre'
			// 	// },
			// })
			// .success(function(artistData){

				// console.log("adding genres");

				// artistGenres.push(artistData.response.artist.genres);
				// albumObj.genres = artistData.response.artist.genres;

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


			// })
			// .fail(function(){
			// 	console.log('whoops');
			// });


		})
		.fail(function(){
			console.log('oops');
		});
	}
}

function addAlbumCovers(){
	// console.log("addAlbumCovers called");

	albumArray.forEach(function(item){
		console.log(item);
		if (!albumArray[item.ID]) {
			noDupeArray.push(item);
			albumArray[item.ID] = item;
		}
	});

	var max = noDupeArray.length;

	for (var i = 0; i < max; i++){

		var album = noDupeArray[i];

	  	var hsl = noDupeArray[i].color.toHsl();
	  	var hex = String(noDupeArray[i].color.toHexString()).substring(1, 7);
	  	var dec = parseInt(hex, 16);
	  	// var colorName = albumArray[i].color.toName();

	  	if (hsl.l < 0.5) {var c = '#ffffff'; var d = "play_b white"; var e = "play_b_white";}
	  	else {var c ='#272727'; var d = "play_b dark"; var e = "play_b_dark";}

	 //  	var albumGenres = noDupeArray[i].genres;
		// // console.log(albumGenres);
		// var albumGenresStr = '';
		// // var htmlAlbumGenresStr = '';
	 //  	albumGenres.forEach(function(genre, j, arr){
	 //  		// genre.name = genre.name.split(' ').join('-');
	 //  		albumGenresArray.push(genre.name)
	 //  		albumGenresStr += genre.name + ' ';
	 //  	});
	  	

  		var html = '<div class="card_container" data-color="' + dec + '"';
  		// html += 'data-genres="' + albumGenresStr + '"';
  		html += 'data-artist="' + album.albumArtist + '"';
  		html += 'data-album="' + album.albumName + '">';
  		html += '<div class="card">';
	    html += '<figure class="side"><img src="' + album.albumCover + '" alt="cover"></figure>';
	    html += '<figcaption class="side back" style="background-color:' + noDupeArray[i].color + '">';
	    html += '<h3 class="artist" style="color:' + c + '">' + album.albumArtist + '</h3>';
	    html += '<h4 class="album" style="color:' + c + '">' + album.albumName + '</h4>';
	    html += '<a href="' + album.spotifyLink + '""><img class="' + d + '" src="img/' + e + '.svg" alt="playb"></a>'
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

	$('.button').on( 'click', function(e) {
		e.preventDefault();
		console.log("Sort Fool");
	  	var sortByValue = $(this).attr('data-sort-by');

	  	console.log("sortByValue: " + sortByValue);
		$grid.isotope({ sortBy: sortByValue });
	});
	}
}

// $(".sortby a").click(function(){
//    $(this).toggleClass("active");
// });

// function filterGenres(){
// 	albumGenresArray.sort();
// 	for (i = 1; i < albumGenresArray.length; i++) {
// 		var genre = albumGenresArray[i];
// 		var numGenre = albumGenresArray.lastIndexOf(genre) - albumGenresArray.indexOf(genre) + 1;
// 		console.log(genre + ' = ' + numGenre);

// 		var genreHtml = '<li class="active">' + genre + '';
// 		genreHtml += '<span class="number"> (' + numGenre + ')</span> ';
// 		genreHtml += '<img src="img/close.svg" alt="close"></li>';
// 		if (albumGenresArray[i] != albumGenresArray[i-1]) {
// 			$('.genres ul').append(genreHtml);
// 		}
// 	}
// 	var filters = [];
// 	$(".genres ul li").click(function(){
// 		// $(this).toggleClass('active');
		
// 		var filtersLength = filters.length
// 		var $target = $(event.currentTarget);
// 		$target.toggleClass('active');

// 		var isActive = $target.hasClass('active');
// 		var thisGenre = ($target.text()).split(' ')[0].toLowerCase();
// 		var thisGenreString = '';

// 		// if (isActive) {
// 		// 	// remove this genre

// 		// 	filters.push(thisGenre);
// 		// } else {
// 		// 	index = filters.indexOf(thisGenre);
// 		// 	lengthGenreString = thisGenre.toString.length;
// 		// 	filters.splice(index, 1);
// 		// }

// 		// filters.push($('.genres ul li[hasClass="active"').text().toLowerCase());

// 		// filtersStr = filters.toString();
// 		// filtersStr.replace(',', '"]):not([data-genres*="');

// 		$grid.isotope({ filter: '*:not([data-genres*="' + thisGenre + '"]):not([data-genres*="deep-ccm"])'});
		
// 		// function removeGenre(thisGenre) {
// 		// 	if (filters.indexOf(thisGenre) == -1) {
// 		// 		filters.push(thisGenre);
// 		// 	}
// 		// }

// 		// function addGenre(thisGenre) {
// 		// 	var index = filters.indexOf(thisGenre);
// 		// 	if (index != -1) {
// 		// 		filters.splice(index,1);
// 		// 	}
// 		// }
// 	});
// }

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

// $('.genres li').click(function(){
// 	if $(this).text() !== $('.genres li.active').text()){
// 		$('.genres li.active').removeClass('active');
// 		$(this).addClass('active');
// 		var genreChosen = $('.genres li.active').text();

// 		$('.covers').html('');

// 		albumArray = [];
// 		noDupeArray = [];

// 		getAlbumsByGenre(genreChosen);
// 	}
// })

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


$(document).ready(function(){
	var a = document.querySelector('.years');
	$('.years').scrollLeft(a.scrollWidth);

	getAlbumsByYear(currYear);
	// getAlbumsByGenre(genreChosen);

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
    $(".genres .container").slideDown( "slow", function() {
       $(".genres .container").css("display", "block");
    });
});

$(".fa-caret-up").click(function() {
    $(this).css("display", "none");
    $(".fa-caret-down").css("display", "inline");
    $(".genres .container").slideUp( "slow", function() {
        $(".genres .container").css("display", "none");
    });
});

$(".sortby div a").click(function(){
   var i = $(this).data('index');
   $('.underl').css('left', (i * 33 + "%"));
});

$(".main_nav li").click(function(){
    $(".main_nav li.active").removeClass("active");
    $(this).addClass("active");

    $(".genre_tab").click(function(){
       $(".fa-caret-up").css("display", "none");
       $(".fa-caret-down").css("display", "inline");
      $(".genres .container").css("display", "none");
    });

    if($(".year_tab").hasClass("active")){
   $(".genres").css("display", "none");
   $(".year_bar").css("display", "block");
   }else if($(".genre_tab").hasClass("active")){
   $(".year_bar").css("display", "none");
   $(".genres").css("display", "block");
   }
});

$(".genres article").click(function(){
   $(this).toggleClass("active");
   $(this).children(".checked").toggle();
   $(this).children(".box").toggle();
 });









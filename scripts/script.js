
var colorsArray = [];      
var currYear = 2016;

      audiojs.events.ready(function() {
        audiojs.createAll();
      });

function getAlbumInfo(albumId){
	$.ajax({
		url: 'https://api.spotify.com/v1/albums/' + albumId
	})
	.success(function(data){
		var album = {};
		album.albumArtist = data.artists[0].name,
		album.albumName = data.name,
		album.albumCover = data.images[1].url,
		album.colorSample = data.images[2].url,
		album.albumSample = data.tracks.items[0].preview_url;
		
		addCard(album);

		// var albumColor = $('figcaption').css('background-color');
		// console.log(albumColor);
		// $('figure.side img').attr('src', albumCover);

	})
	.fail(function(){
		console.log("whoops");
	});
}
//AlbumInfo has album cover, artist, release date
//AlbumID 7fZH0aUAjY3ay25obOUf2a

function getArtistInfo(artistId){
	$.ajax({
		url: 'http://developer.echonest.com/api/v4/artist/profile?id=spotify:artist:' + artistId,
		data: {
			api_key: 'EIFFMMDVJUME3MPUL',
			bucket: 'genre',
		}
	})
	.success(function(data){
		console.log(data.response.artist);
	})
	.fail(function(){
		console.log('whoops');
	});
};
//ArtistInfo has genre needed
//ArtistID AR4ZYGI1187B995AA2

function getAlbumsByYear(year){
	$.ajax({
		url: 'https://api.spotify.com/v1/search?q=year:' + year + '&type=album&limit=50&market=us'
	})
	.success(function(data){
		addAlbumCovers(data.albums.items);
		//console.log(data.albums.items[0].images[1].url);
		// data.albums.items.forEach(function (photo) {
		// 	$('figure').append('<a href="' + images[1].url + '"><img id="photo" src="' + images[1].url + '">');
		// })
	})
	.fail(function(){
		console.log('whoops');
	});
};
//pulls 50 albums released every year

function addAlbumCovers (albums) {
	var numAlbums = albums.length;
	var albumArtist;

	for (i = 0; i < numAlbums; i++){
		if (albums[i].album_type === 'single') { continue; }
		var albumID = albums[i].id;
		getAlbumInfo(albumID);
	}
}

function addCard(album){
	RGBaster.colors(album.colorSample, {
	  paletteSize: 3,

	  success: function(payload) {
	  	var albumColor = tinycolor(payload.dominant);

  		var html = '<article class="card_container" data-color="' + albumColor.toHsl().h + '">';
  		html += '<div class="card">';
	    html += '<figure class="side"><img src="' + album.albumCover + '" alt="cover"></figure>';
	    html += '<figcaption class="side back" style="background-color:' + payload.dominant + '">';
	    html += '<h3 class="artist">' + album.albumArtist + '</h3>';
	    html += '<h4 class="album">' + album.albumName + '</h4>';
	    // html += '<h3 class="hexcolor">#' + tinycolor(payload.dominant).toHex() + '</h3>';
	    html += '<a href="' + album.albumSample + '""><img class="play_button" src="img/play_button.svg" alt="playb"></a>'
	    //html += '<audio controls><source src="horse.ogg" type="audio/ogg"><source src="horse.mp3" type="audio/mpeg"></audio>';
	    html += '</figcaption></div></article>';
		
		$('.covers').append(html);

		var $grid = $('.card_container').isotope({
			layoutMode: 'fitRows',
		  getSortData: {
		    color: '[data-color]'
		  },
		  // sort by color then number
		  sortBy: [ 'color']
		});

		// colorsArray.push(albumColor.toHsl());
	  }
	});
    //sort colors
}

      

//getAlbumsByYear(2015)


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
});

//toggle genre active class

$(".genres article").click(function(){
    $(this).toggleClass("active_genre");
});

$(document).ready(function(){
	var a = document.querySelector('.years');
	$('.years').scrollLeft(a.scrollWidth);

	getAlbumsByYear(currYear);

});

$('.years').scroll(function(e){
	$('.left_arrow, .right_arrow').css("visibility", "visible");
	if(e.target.scrollLeft == 0){
		$('.left_arrow').css("visibility", "hidden");
	}
	else if(e.target.scrollLeft == e.target.scrollWidth - $('.years').width()){
		$('.right_arrow').css("visibility", "hidden");
	}
});


//spinner





















